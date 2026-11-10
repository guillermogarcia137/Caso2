# SkillTech Academy · Caso 2

Prototipo interactivo para la presentación de 1º DAM, Entornos de Desarrollo. Representa una academia online de programación, ciberseguridad, cloud y datos con una interfaz responsive, oscura por defecto, acentos violeta y turquesa y un espacio de trabajo con navegación lateral.

## Instalar y ejecutar

Requiere Node.js 22.12 o superior (o 24 LTS) y npm.

```bash
npm install
npm run dev
```

Abre la dirección que indica Vite, normalmente `http://localhost:5173/Caso2/`.

```bash
npm run build     # Comprueba TypeScript y genera dist/
npm run preview   # Previsualiza la compilación
```

La aplicación no necesita backend, claves API ni cuentas reales. Elige un rol, introduce cualquier contraseña de al menos cuatro caracteres y verifica con cualquier código de seis dígitos. El acceso con Google también es una simulación.

## Pantallas

| Pantalla           | Ruta hash        | Qué puedes enseñar                                          |
| ------------------ | ---------------- | ----------------------------------------------------------- |
| Login y registro   | `#/login`        | Roles, Google simulado, verificación en dos pasos           |
| Mi aprendizaje     | `#/`             | Cursos, progreso, agenda y notas de ejemplo                 |
| Catálogo           | `#/catalogo`     | 8 cursos, buscador, filtros y matrícula simulada en 3 pasos |
| Aula               | `#/aula/java`    | Lecciones, vídeo, velocidad, subtítulos y progreso          |
| Examen             | `#/examen/java`  | 10 preguntas de un banco de 20, temporizador y corrección   |
| Código             | `#/codigo/java`  | Monaco, pruebas en Worker, cola simulada y nota             |
| Certificados       | `#/certificados` | Emisión al aprobar, QR y descarga PDF                       |
| Validación pública | `#/validar`      | ID local o contenido JSON de un QR                          |
| Comunidad          | `#/foro`         | Hilos por curso, respuestas y estado resuelto               |
| Chat               | `#/chat`         | Mensajes, bloques de código y respuesta simulada            |
| Coordinación       | `#/coordinacion` | Métricas, dos gráficos y convocatoria de 30 segundos        |

El tutor ve comunidad, chat y laboratorio. El coordinador dispone del panel de coordinación. La selección de rol es solo navegación de demo, no un sistema de autorización real.

## Qué funciona y qué se simula

- **Funciona en el navegador:** búsqueda, filtros, matrícula local, progreso, reproducción de vídeo, velocidad, subtítulos, recuerdo del minuto, selección aleatoria de preguntas, cuenta atrás, autoguardado cada 10 segundos, corrección, ejecución de cinco casos de código, límite de 2 segundos, certificados con huella SHA-256 y QR, descarga PDF, hilos y mensajes persistentes, modo claro/oscuro y traducción del menú ES/EN.
- **Simulado:** cuentas, registro, Google, doble factor, pagos, notas previas, agenda, racha, horas estudiadas, disponibilidad y respuestas de tutores, calidad 360p/720p/1080p, cola de corrección y métricas de servidor. La convocatoria cambia contadores durante 30 segundos; no es una prueba real de carga.
- Los datos están en `src/data/`. El estado se conserva mediante `src/utils/storage.ts`, con `try/catch`. Para reiniciar, borra las claves `skilltech:` del almacenamiento local del sitio. No se almacenan contraseñas.
- El examen se aprueba con al menos 5/10. Tras aprobar, pulsa **Generar certificado**. Puede emitirse un certificado por intento, y luego realizarse un nuevo intento.
- El QR contiene el certificado completo como JSON. La validación por ID consulta el mismo navegador. Para comprobarlo en otro dispositivo, lee el QR con un lector externo y pega su texto JSON: no se incluye cámara integrada.
- La etiqueta **Firma digital · Demo SHA-256** representa una huella de integridad, **no una firma criptográfica con clave privada**. Detecta cambios si no se recalcula la huella. No autentica al emisor ni impide falsificaciones deliberadas. Una credencial real requeriría firma asimétrica y registro de emisión en servidor.
- El código se ejecuta en un Web Worker cancelable para no bloquear la interfaz. No es un sandbox seguro contra código hostil; úsalo únicamente con ejemplos de clase. En producción se necesitaría un servicio de ejecución aislado.
- Las lecciones usan un clip local de muestra de NASA, de dominio público, con subtítulos de demostración. No es una clase técnica. Se incluyen enlaces a los canales de MoureDev y Nate Gentile como recursos; sus vídeos no se redistribuyen.

## Guion de presentación · 3 minutos

1. **0:00–0:20 · Acceso:** selecciona Alumno, Google simulado y código `123456`. Explica que no hay backend.
2. **0:20–0:45 · Panel y catálogo:** muestra progreso, filtra Cloud y realiza una matrícula de prueba.
3. **0:45–1:10 · Aula:** reproduce el vídeo, cambia velocidad, activa subtítulos y marca una lección completada.
4. **1:10–1:35 · Evaluación y código:** muestra temporizador y autoguardado. En el laboratorio pega la solución inferior y ejecuta las cinco pruebas.
5. **1:35–2:00 · Certificado:** usa un examen aprobado antes de presentar, genera el certificado, descarga el PDF y valida su ID. Aclara la diferencia entre huella y firma real.
6. **2:00–2:15 · Comunidad:** responde a un hilo y envía código al chat.
7. **2:15–3:00 · Coordinación:** cierra sesión, entra como Coordinador y pulsa **Simular convocatoria**. Explica el pico de 15.000 alumnos y la necesidad de CDN, colas de trabajos y escalado. Termina con el enlace al repositorio.

Solución para la demostración del laboratorio:

```javascript
function esPrimo(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
```

## GitHub Pages

La configuración usa `base: '/Caso2/'` y `HashRouter`: las rutas funcionan al recargar sin configurar el servidor.

URL prevista: `https://guillermogarcia137.github.io/Caso2/`.
Repositorio previsto: `https://github.com/guillermogarcia137/Caso2`.

1. Crea un repositorio público llamado exactamente **Caso2** en la cuenta indicada y sube este proyecto a la rama **main**.
2. En **Settings → Pages → Build and deployment → Source**, elige **GitHub Actions**.
3. El flujo `.github/workflows/deploy.yml` instala con `npm ci`, comprueba TypeScript, construye y publica `dist/`. También permite ejecución manual desde Actions.

## Pruebas de navegador

```bash
npx playwright install chromium
npx playwright test
```

La configuración detecta Chromium del sistema cuando existe; si no, usa el instalado por Playwright. Las pruebas cubren acceso, matrícula, progreso, corrección de código y bucles infinitos, examen y autoguardado, certificado/PDF, detección de cambios, comunidad, móvil y convocatoria completa.

## Stack y estructura

React + Vite + TypeScript, Tailwind CSS con estilos de componentes, lucide-react, React Router, Monaco Editor servido localmente, Recharts, qrcode.react, jsPDF y Web Crypto API.

```text
src/
  components/  # Navegación, tarjetas, vídeo, editor, certificados, mensajes
  pages/       # Pantallas de la demo
  data/        # Cursos, personas, preguntas y conversaciones de ejemplo
  utils/       # Estado compartido, almacenamiento, huellas y worker
```

## Recursos y licencias

Vídeo: NASA, **Solar Cruiser Demo**, disponible en `https://images.nasa.gov/` y `https://images-assets.nasa.gov/video/Solar%20Cruiser%20Demo/collection.json`. Clip reducido a 40 segundos para esta demo. Las portadas e ilustraciones del sitio están hechas con CSS. No existe afiliación con NASA, Google, MoureDev o Nate Gentile.
