# MIEC QUANTUM

Prototipo web móvil instalable (PWA) para explorar autorregulación mediante sonido, respiración, movimiento y autoobservación.

## Estado
Versión **0.6**. Laboratorio sonoro ampliado con síntesis local y controles de escucha. Incluye aprendizaje local exploratorio y un conector opcional a modelos externos. El repositorio está preparado para GitHub Pages.

## Publicar con GitHub Pages
1. Abre **Settings → Pages** en este repositorio.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/(root)`; guarda.
4. Espera a que GitHub Pages publique el sitio. La URL aparecerá en esa misma sección.
5. Abre la URL desde Safari o Chrome. En iPhone usa Compartir → Añadir a pantalla de inicio; en Android usa el menú del navegador → Instalar aplicación (si está disponible).

## Funciones
- Registro subjetivo de energía, ánimo y tensión.
- Motor sonoro local sin servicios externos: binaural estéreo, tono continuo con cuatro formas de onda, ruido filtrado, drone armónico de tres capas y pulso modulado.
- Controles de frecuencia, diferencia binaural, forma de onda, ritmo de modulación y volumen máximo limitado; temporizador de escucha y registro de sesiones sonoras.
- Síntesis de audio en tiempo real con Web Audio API: no requiere pistas descargadas, bibliotecas de pago, suscripciones ni claves API.
- Respiración guiada cómoda sin retenciones.
- Secuencia de movilidad Flow de tres cuerpos.
- Asignación aleatoria de tres condiciones exploratorias: audio, respiración y combinación. La condición inicia solo los componentes asignados y bloquea el control del componente excluido.
- Registro local, historial y exportación JSON.
- Caché offline básica mediante service worker, con versión de caché actualizada e icono SVG de la aplicación.
- Motor adaptativo local: compara cambios autoinformados en ánimo y tensión por condición, y requiere al menos dos sesiones comparables antes de destacar una.
- AI Coach opcional mediante proxy privado: compatible con Gemini, Claude y OpenAI; las claves API se guardan solo en el servidor.

## Importante: evidencia y seguridad
- La aplicación no mide actividad cerebral, HRV ni biomarcadores.
- Las frecuencias seleccionadas son parámetros acústicos, no tratamientos ni frecuencias curativas demostradas.
- Los tonos binaurales requieren auriculares estéreo. La evidencia sobre efectos específicos es heterogénea; no se promete sincronización cerebral ni eficacia clínica.
- La asignación aleatoria es una herramienta exploratoria, no un ensayo clínico controlado.
- El aprendizaje local resume asociaciones en registros personales; no es un modelo clínicamente validado ni demuestra causalidad.
- El AI Coach externo solo envía el resumen de energía, ánimo, tensión y objetivo más la pregunta, tras autorización explícita. Consulta `worker/README.md` para desplegar el proxy y configurar secretos. El uso de APIs puede generar costes.
- Los datos se guardan en el almacenamiento local del navegador; borrar datos del navegador puede eliminarlos.
- Mantén el volumen bajo. Detén ante dolor, mareo, ansiedad o molestia auditiva. No uses mientras conduces. No fuerces la respiración ni el movimiento.
- “Quantum” es una identidad conceptual. No implica computación cuántica ni procesos cuánticos cerebrales.

## Conectar modelos de IA
1. Despliega `worker/ai-proxy.js` como Cloudflare Worker siguiendo `worker/README.md`.
2. Configura `AI_PROVIDER`, `AI_MODEL`, `AI_API_KEY` (como Secret) y `ALLOWED_ORIGIN` en el Worker.
3. En la pestaña **IA Coach**, pega la URL HTTPS del Worker terminada en `/coach`.
4. Autoriza el envío de los datos mínimos antes de cada consulta.

El modelo y proveedor son configurables. No se incrustan claves API en el sitio estático.

## Límites del audio
- La síntesis se ejecuta dentro del navegador y depende de que el dispositivo admita Web Audio API. El navegador puede pausar el audio al bloquear la pantalla o cambiar de aplicación.
- El temporizador detiene el audio al finalizar; no garantiza reproducción en segundo plano.
- El volumen se limita en la interfaz, pero el nivel real depende del dispositivo y de los auriculares. Empieza bajo.
- El motor de sonido no necesita conexión a internet después de cargar la aplicación, pero la primera carga sí requiere abrir el sitio.

## Próximas mejoras recomendadas
1. Añadir pruebas automatizadas de que cada condición experimental activa únicamente sus componentes previstos y registra fallos de inicio.
2. Separar con precisión duración de sesión, exposición de audio y guía respiratoria.
3. Añadir consentimiento, registro de eventos y exportación anonimizada.
4. Diseñar protocolo N-of-1 con hipótesis previas, periodos comparables y análisis descriptivo.
5. Auditoría de accesibilidad, privacidad y compatibilidad móvil.

## Desarrollo
No requiere dependencias ni proceso de compilación. Es HTML, CSS y JavaScript nativo con Web Audio API.
