const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

function json(data, status, cors = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...cors } });
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function safeProfile(input = {}) {
  const number = value => Number.isFinite(Number(value)) ? Math.max(0, Math.min(10, Number(value))) : null;
  const goals = ["calma", "enfoque", "energia", "movilidad", "curiosidad"];
  return {
    energy: number(input.energy),
    mood: number(input.mood),
    tension: number(input.tension),
    goal: goals.includes(input.goal) ? input.goal : "curiosidad"
  };
}

async function callGemini(env, system, question, profile) {
  const model = env.AI_MODEL;
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.AI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: JSON.stringify({ question, profile }) }] }],
      generationConfig: { temperature: 0.35, maxOutputTokens: 700 }
    }),
    signal: AbortSignal.timeout(25000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("Gemini API request failed (" + response.status + ")");
  return (data.candidates?.[0]?.content?.parts || []).map(part => part.text || "").join("\n").trim();
}

async function callAnthropic(env, system, question, profile) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.AI_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: env.AI_MODEL,
      max_tokens: 700,
      temperature: 0.35,
      system,
      messages: [{ role: "user", content: JSON.stringify({ question, profile }) }]
    }),
    signal: AbortSignal.timeout(25000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("Anthropic API request failed (" + response.status + ")");
  return (data.content || []).filter(block => block.type === "text").map(block => block.text).join("\n").trim();
}

async function callOpenAI(env, system, question, profile) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + env.AI_API_KEY },
    body: JSON.stringify({
      model: env.AI_MODEL,
      instructions: system,
      input: JSON.stringify({ question, profile }),
      max_output_tokens: 700
    }),
    signal: AbortSignal.timeout(25000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("OpenAI API request failed (" + response.status + ")");
  if (typeof data.output_text === "string") return data.output_text.trim();
  return (data.output || []).flatMap(item => item.content || [])
    .filter(block => block.type === "output_text" || block.type === "text")
    .map(block => block.text || "").join("\n").trim();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "";
    if (!allowed || origin !== allowed) return json({ error: "Origin not allowed. Configure ALLOWED_ORIGIN to the exact app origin." }, 403);
    const cors = corsHeaders(allowed);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET" && url.pathname.endsWith("/health")) {
      return json({ ok: true, service: "MIEC AI proxy", provider: env.AI_PROVIDER || "not-configured" }, 200, cors);
    }
    if (request.method !== "POST" || !url.pathname.endsWith("/coach")) {
      return json({ error: "Not found" }, 404, cors);
    }
    if (!env.AI_API_KEY || !env.AI_PROVIDER || !env.AI_MODEL) {
      return json({ error: "AI provider, model or server-side API key is not configured." }, 503, cors);
    }

    let rawBody;
    try { rawBody = await request.text(); } catch { return json({ error: "Could not read request body." }, 400, cors); }
    if (rawBody.length > 10000) return json({ error: "Request too large." }, 413, cors);
    let body;
    try { body = JSON.parse(rawBody); } catch { return json({ error: "Invalid JSON." }, 400, cors); }
    if (body.consent !== true) return json({ error: "Explicit consent is required." }, 400, cors);
    const question = typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
    if (!question) return json({ error: "A question is required." }, 400, cors);
    const profile = safeProfile(body.profile);
    const system = [
      "Eres MIEC Coach, un asistente educativo de bienestar y autoobservación.",
      "Responde en español claro, breve y prudente. Ofrece opciones de baja intensidad y anima a observar sensaciones sin juzgarlas.",
      "No diagnostiques, no prescribas, no afirmes curaciones, no infieras trastornos ni atribuyas efectos cerebrales a frecuencias.",
      "No recomiendes retenciones respiratorias, hiperventilación, dolor ni prácticas extremas. Si la persona menciona síntomas graves o riesgo inmediato, indícale que busque ayuda profesional o servicios de emergencia locales.",
      "Aclara la incertidumbre. Los datos son autoinformes y no mediciones clínicas.",
      "El perfil recibido contiene solo energía, ánimo, tensión y objetivo declarados por el usuario. No solicites datos identificables."
    ].join(" ");

    try {
      let answer;
      const provider = env.AI_PROVIDER.toLowerCase();
      if (provider === "gemini") answer = await callGemini(env, system, question, profile);
      else if (provider === "anthropic") answer = await callAnthropic(env, system, question, profile);
      else if (provider === "openai") answer = await callOpenAI(env, system, question, profile);
      else return json({ error: "Unsupported AI_PROVIDER. Use gemini, anthropic or openai." }, 400, cors);
      if (!answer) return json({ error: "The AI provider returned an empty answer." }, 502, cors);
      return json({ answer, provider }, 200, cors);
    } catch (error) {
      return json({ error: error.message || "AI provider request failed." }, 502, cors);
    }
  }
};
