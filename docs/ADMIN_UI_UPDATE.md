# Actualización de dashboard y login

Fecha: 14 de octubre de 2026.

## Revisión previa

Se revisaron `AGENTS.md`, `PROJECT_CONTEXT.md`, rutas React, Dashboard, Login, ProtectedRoute, Navbar, estilos globales, editores reutilizables, HeroEditor y las rutas de autenticación del servidor. Se comprobó que los estilos oscuros de `admin.css` convivían con controles y barras blancas en `editor-kit.css`, y que en móvil la navegación usaba una lista horizontal de todas las secciones.

## Resultado

- El dashboard abre un resumen con accesos a las 12 secciones existentes y búsqueda por nombre o descripción, sin exigir tildes. Presenta un estado vacío cuando no hay coincidencias. El número de secciones corresponde al registro de editores; no se añadieron métricas de visitantes ni estados ficticios de publicación.
- Sidebar verde oscuro, área de trabajo clara, breadcrumb, jerarquía de títulos e iconos SVG reutilizables en `AdminIcon.jsx`. Los formularios usan la misma paleta y conservan su guardado, carga de medios y datos locales.
- La sidebar está fija al viewport y reserva su propio ancho en escritorio. Su navegación tiene scroll interno cuando la altura no alcanza; la marca y el acceso al sitio público permanecen disponibles.
- En móvil, la cabecera de navegación permanece fija y el menú se despliega sin desplazar el contenido. El desplegable se limita a la altura de la pantalla y permite scroll interno. Un botón comunica su estado; Escape lo cierra y devuelve el foco al botón; elegir una sección lo cierra y dirige el foco al título. Hay un acceso para saltar al contenido.
- La vista pública se abre en una pestaña nueva para revisar el sitio sin abandonar el editor. El cierre de sesión muestra progreso y, si falla la petición, informa del error sin redirigir como si se hubiera cerrado correctamente.
- Login con identidad visual del sitio, campos etiquetados, autocompletado, control para mostrar/ocultar contraseña, estado de envío, errores y enlace de regreso al sitio. Conserva `loginAdmin` y la confirmación de cookie antes de navegar al panel. Los errores de conexión se muestran en español.
- Según la elección del usuario, «Administración» aparece junto al logo del navbar público y enlaza a `/login`. Se ajustó el breakpoint del menú para que los enlaces no se superpongan.

## Alcance y contratos

Los editores conservan sus rutas `GET/PUT /api/content/:id`, payloads MySQL y fallbacks locales. No se modificaron las comprobaciones de sesión del backend ni se añadieron credenciales al navegador. La selección de sección sigue siendo local al dashboard. Los cambios deben guardarse antes de pasar a otro editor; no se añadió autoguardado.

## Verificación

- `npm run lint`: sin errores; conserva los avisos existentes sobre `Date` en Footer y el helper exportado por `FieldInput`.
- `npm run build`: completado; conserva el aviso existente sobre `VITE_SITE_URL` no definido en `index.html`.
- `npm test`: las 13 pruebas de autenticación pasaron.
- Navegador Chrome con API simulada: enlace público al login; mostrar/ocultar contraseña; acceso rechazado y correcto; apertura de los 12 editores; búsqueda con/sin resultados; guardado de Contacto y contenido del payload; cierre de sesión con error/éxito; redirección de una ruta protegida sin sesión; menú móvil y Escape; ausencia de errores JavaScript.
- Revisión visual de capturas de login y dashboard en escritorio/móvil y del editor de portada en móvil. Se corrigió un conflicto de especificidad en el estado hover de las tarjetas.
- Sidebar fija comprobada con scroll a 320, 390, 768, 900, 901, 1024 y 1440 px de ancho y 480 px de altura: límite vertical de pantalla, último editor alcanzable, ancho reservado en escritorio y desplegable móvil sin desplazar el contenido. Su ancho y la altura de la cabecera móvil usan variables CSS compartidas para mantener coordinadas la sidebar y el área de trabajo.
- No se verificó contra una instancia MySQL real ni se desplegó. Las pruebas del navegador interceptaron la API y no escribieron en la base de datos.
