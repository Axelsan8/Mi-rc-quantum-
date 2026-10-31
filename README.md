# MIEC QUANTUM

Prototipo web móvil instalable (PWA) para explorar autorregulación mediante sonido, respiración, movimiento y autoobservación.

## Estado
Versión inicial funcional **0.3**. El repositorio está preparado para GitHub Pages.

## Publicar con GitHub Pages
1. Abre **Settings → Pages** en este repositorio.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/(root)`; guarda.
4. Espera a que GitHub Pages publique el sitio. La URL aparecerá en esa misma sección.
5. Abre la URL desde Safari o Chrome. En iPhone usa Compartir → Añadir a pantalla de inicio; en Android usa el menú del navegador → Instalar aplicación (si está disponible).

## Funciones
- Registro subjetivo de energía, ánimo y tensión.
- Motor de sonido local: tono mono, tono binaural y ruido filtrado.
- Respiración guiada cómoda sin retenciones.
- Secuencia de movilidad Flow de tres cuerpos.
- Asignación aleatoria de tres condiciones exploratorias: audio, respiración y combinación.
- Registro local, historial y exportación JSON.
- Caché offline básica mediante service worker.

## Importante: evidencia y seguridad
- La aplicación no mide actividad cerebral, HRV ni biomarcadores.
- Las frecuencias seleccionadas son parámetros acústicos, no tratamientos ni frecuencias curativas demostradas.
- Los tonos binaurales requieren auriculares estéreo. La evidencia sobre efectos específicos es heterogénea; no se promete sincronización cerebral ni eficacia clínica.
- La asignación aleatoria es una herramienta exploratoria, no un ensayo clínico controlado.
- Los datos se guardan en el almacenamiento local del navegador; borrar datos del navegador puede eliminarlos.
- Mantén el volumen bajo. Detén ante dolor, mareo, ansiedad o molestia auditiva. No uses mientras conduces. No fuerces la respiración ni el movimiento.
- “Quantum” es una identidad conceptual. No implica computación cuántica ni procesos cuánticos cerebrales.

## Próximas mejoras recomendadas
1. Añadir pruebas automatizadas de que cada condición experimental activa únicamente sus componentes previstos.
2. Separar con precisión duración de sesión, exposición de audio y guía respiratoria.
3. Añadir consentimiento, registro de eventos y exportación anonimizada.
4. Diseñar protocolo N-of-1 con hipótesis previas, periodos comparables y análisis descriptivo.
5. Auditoría de accesibilidad, privacidad y compatibilidad móvil.

## Desarrollo
No requiere dependencias ni proceso de compilación. Es HTML, CSS y JavaScript nativo con Web Audio API.
