# MIEC AI Proxy (Cloudflare Workers)

Este proxy permite usar Gemini, Claude o OpenAI sin exponer la clave API en el navegador. El sitio estático de GitHub Pages nunca recibe el secreto.

## 1. Crear el Worker
1. Crea una cuenta en Cloudflare y abre **Workers & Pages**.
2. Crea un Worker nuevo.
3. Copia el contenido de `ai-proxy.js` en el editor y despliega.
4. Conserva la URL pública del Worker.

## 2. Configurar variables
En Worker → Settings → Variables and Secrets, añade:

- `AI_PROVIDER` (texto): `gemini`, `anthropic` o `openai`.
- `AI_MODEL` (texto): identificador vigente de un modelo habilitado en tu cuenta.
- `ALLOWED_ORIGIN` (texto): origen exacto de GitHub Pages, por ejemplo `https://axelsan8.github.io`.
- `AI_API_KEY` (secret): clave API del proveedor elegido.

Guarda `AI_API_KEY` como **Secret**, nunca como variable pública ni dentro de GitHub Pages. No compartas ni publiques la clave.

## 3. Conectar MIEC
En la pestaña **IA Coach**, pega la URL del Worker terminada en `/coach`, por ejemplo:
`https://nombre-worker.usuario.workers.dev/coach`

La app envía solo la pregunta y los valores de energía, ánimo, tensión y objetivo, y únicamente después de marcar la autorización.

## 4. Proveedores
- Gemini: Google AI Studio / Gemini API.
- Claude: Anthropic Console / Messages API.
- OpenAI: OpenAI Platform / Responses API.

El modelo se define en `AI_MODEL` porque los identificadores y disponibilidad cambian. La cuenta del proveedor puede requerir facturación; no se garantiza uso gratuito.

## Seguridad
- El proxy exige coincidencia exacta de `Origin` con `ALLOWED_ORIGIN`.
- Limita el tamaño del mensaje, no almacena las preguntas y no devuelve la clave.
- Configura también límites de uso y alertas de gasto en Cloudflare y en el proveedor.
- El endpoint público puede recibir intentos de abuso. Para producción añade rate limiting de Cloudflare, protección contra bots y monitorización de cuota.
- No envíes nombres, datos médicos, credenciales ni información identificable.
- Las respuestas de IA son orientación general, no consejo médico ni evidencia de eficacia.
