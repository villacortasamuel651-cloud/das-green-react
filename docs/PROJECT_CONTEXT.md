# Contexto maestro del proyecto DAZ Green

Mapa actualizado tras la auditoría y la primera etapa de migración a MySQL/almacenamiento privado. Fecha: 7 de octubre de 2026.

## Producto

Sitio personal/profesional de Diego Alberto Sorrilla Green, construido como SPA en React. Incluye una landing pública de una página y un área de administración autenticada. La interfaz y el contenido están principalmente en español.

## Stack y arquitectura actual

- React 19, Vite 8, React Router 7, Node.js/Express 5, MySQL/MariaDB, Oxlint y Sharp.
- La API del proyecto está en `server/`; el frontend usa `/api` y Vite proxya ese prefijo a `localhost:3001` durante desarrollo.
- MySQL contiene `content` (payload JSON), `media` (metadata de archivos) y `admins` (hash de contraseña). El backend crea las tablas al iniciar.
- Las sesiones administrativas usan JWT en cookie `httpOnly`, `sameSite=strict`, `secure` en producción, bcrypt para contraseñas y limitador de intentos de inicio de sesión.
- Medios binarios se escriben en `MEDIA_ROOT`, fuera del web root en producción. La API publica URL controlada de lectura; escritura/borrado exige sesión de administrador.
- Imágenes se convierten y comprimen a WebP. Videos MP4/WebM se conservan como archivo. Límites configurables: imagen fuente 15 MB, video 150 MiB por defecto.
- Vite usa `VITE_BASE_PATH` (por defecto `/`) para facilitar servir el frontend desde el dominio del VPS.
- La configuración local/de producción está documentada en `.env.example` y `README.md`; nunca registrar secretos reales.

## Flujo de rutas

- `src/main.jsx` monta `HashRouter` y define `/login`, `/admin` y un fallback a `App`.
- `ProtectedRoute` consulta `/api/auth/me`. `Login` llama `/api/auth/login`; el dashboard llama `/api/auth/logout`.
- La implementación de autenticación está en `server/auth-routes.js`, montada por `server/index.js`. El limitador cuenta fallos, conserva 10 por IP/15 minutos y devuelve JSON español; las respuestas de sesión no se cachean. `src/utils/auth.js` comparte la validación de respuestas y confirma la cookie antes de navegar al panel. El login deshabilita envíos mientras carga.
- `npm run admin:check` es un diagnóstico de solo lectura en la conexión de la API: cuenta administradores y, si recibe `ADMIN_EMAIL`/`ADMIN_PASSWORD`, verifica cuenta/hash sin imprimir secretos. Las variables administrativas no crean cuentas por sí solas. `npm test` contiene regresiones de acceso sin conexión a producción.
- El backend aplica la autorización; los controles visuales del frontend no sustituyen las comprobaciones de `/api`.

## Landing y contenido

`src/App.jsx` compone preloader, navbar, hero y secciones en este orden: Sobre mí, Trayectoria, Exposiciones, Experiencia, Noticias, Galería, Testimonios, Cursos, Reunión, Cita y Contacto; además renderiza footer, WhatsApp y política de privacidad.

Los valores base viven en `src/data/*.js`. `useContent(id)` intenta leer `/api/content/{id}` desde MySQL y conserva los datos locales cuando no hay documento o falla la lectura. `useListContent` mezcla las listas remotas con metadatos locales por id.

El 14 de octubre de 2026, el usuario proporcionó el código de una página de reservas de Google Calendar. Su URL se configuró en `src/config/site.js`: «Agendar reunión» abre esa página en una pestaña nueva mediante un enlace nativo accesible. Si se deja la URL vacía, enlaza a Contacto. No requiere API keys, tokens ni cambios en MySQL; el editor de Reunión conserva su contrato de textos y detalles. Se conserva el botón y diseño propios de la web; el script de botón emergente de Google no se carga.

### Estado actual del hero

- `src/data/hero.js` define el contenido base de un hero único y deja `videoUrl` vacío.
- `Hero.jsx` muestra video de fondo cuando hay `videoUrl`, y placeholder formal cuando no lo hay. Lee el primer slide anterior como fallback de compatibilidad.
- `HeroEditor.jsx` administra textos, carga MP4/WebM y permite quitar el video; guarda el contrato nuevo en `content/hero`.
- Al guardar el contenido, el backend detecta medios que ya no están referenciados y los elimina cuando no los usa otro documento.

## Dashboard y editores disponibles

`src/admin/Dashboard.jsx` registra editores en una constante `EDITORS` y presenta navegación responsive en sidebar, más barra superior. El contenedor/estilos están en `src/admin/admin.css`; controles reutilizables en `editor-kit.css`.

Actualización de UX/UI: el panel abre un resumen con accesos y búsqueda de las 12 secciones; mantiene sus editores y contratos actuales. La sidebar usa un menú desplegable en móvil y la página pública se abre en una pestaña nueva. Login tiene presentación propia, control para mostrar/ocultar contraseña y estados de envío/error. El logo DAZ GREEN del navbar público enlaza a `/login` mediante React Router. Los detalles están en `docs/ADMIN_UI_UPDATE.md`.

Secciones registradas:

| Clave | Editor | Contrato principal | Operaciones actuales |
| --- | --- | --- | --- |
| `hero` | `HeroEditor` | objeto `content/hero` con textos, `videoUrl` y `videoMimeType`; compatibilidad con primer `slides[]` antiguo | editar textos, cargar MP4/WebM, quitar video y guardar |
| `about` | `AboutEditor` | objeto `content/about` | editar campos e imagen |
| `timeline` | `TimelineEditor` | objeto `timelineSection` y lista `timeline` | editar encabezado; agregar, borrar, reordenar etapas |
| `experience` | `ExperienceEditor` | objeto `experienceSection` y lista `experience` | editar encabezado; agregar, borrar, reordenar áreas |
| `exhibitions` | `ExhibitionsEditor` | objeto `exhibitionsSection` y lista `exhibitions` | encabezado; CRUD local del editor, reordenamiento e imágenes |
| `gallery` | `GalleryEditor` | objeto `gallerySection` y lista `gallery` | encabezado; agregar, borrar, reordenar fotos |
| `news` | `NewsEditor` | objeto `newsSection` y lista `news` | encabezado; agregar, borrar, reordenar noticias |
| `courses` | `CoursesEditor` | objeto `coursesSection` y lista `courses` | encabezado; agregar, borrar, reordenar cursos |
| `testimonials` | `TestimonialsEditor` | lista `testimonials` | agregar, borrar, reordenar testimonios |
| `quote` | `QuoteEditor` | objeto `quote` | editar texto y autor |
| `booking` | `BookingEditor` | objeto `booking` | editar texto y detalles |
| `contact` | `ContactEditor` | objeto `contact` | editar textos |

Los encabezados para Trayectoria, Experiencia, Exposiciones, Galería, Noticias y Cursos se guardan en documentos separados con sufijo `Section`; por tanto, el menú del dashboard no equivale exactamente a la lista de documentos.

### Trayectoria y áreas de experiencia

- La trayectoria se presenta como hitos cronológicos con iconografía Lucide, línea de progreso y tarjetas responsivas. Los valores de icono se guardan como claves semánticas (`presentation`, `graduation`, `analytics`, `award`); emojis heredados se normalizan al editar.
- Las áreas de experiencia usan iconos Lucide consistentes y tarjetas con animación ligera al aparecer y al pasar el puntero. Ambas secciones respetan `prefers-reduced-motion`.
- Las opciones y equivalencias de iconos se mantienen en `src/data/iconOptions.js`; presentación en `src/components/sections/Timeline` y `Experience`.

## Persistencia y API

- `ObjectEditor` y `ListEditor` inicializan desde datos locales, leen contenido al montar y guardan mediante `PUT /api/content/:id`.
- `ListEditor` persiste arrays completos `items`; la eliminación se confirma y se aplica en memoria hasta guardar; mover sube/baja el orden.
- `HeroEditor` implementa por separado su propia carga/guardado y no maneja estado de carga/error de lectura de forma visible.
- `useContent` usa una lectura HTTP puntual, no una suscripción en tiempo real.
- Los errores de lectura en hooks/editores compartidos se silencian; el usuario puede ver el fallback sin distinguir que la API falló.
- Los IDs de registros locales se sintetizan como `local-{índice}`. Los nuevos reciben IDs temporales aleatorios `new-*`; preservar esos IDs es clave para reconciliar cambios locales con listas base.

## Medios y seguridad

`src/utils/Uploadimage.js` produce WebP en el navegador y lo envía a `/api/media`; el servidor vuelve a procesar con Sharp, valida firmas de archivo, limita tamaño y crea nombre UUID. Videos MP4/WebM van al mismo storage privado sin guardarse dentro de MySQL. MySQL almacena solo metadata y las URL `/api/media/{uuid}`.

La carga y el borrado requieren autenticación del administrador. La entrega de medios referenciados es pública para que los visitantes puedan ver imágenes/video, pero se sirve desde una ruta API controlada y el directorio físico no debe exponerse como estático. `PUT /api/content/:id` rechaza data URLs. Si se reemplaza o quita un medio y queda sin referencias, backend elimina el archivo y su metadata.

## Migración de datos pendiente

Actualización del 14 de octubre de 2026: `npm run content:seed` permite cargar los 18 documentos locales de los editores sin sobrescribir documentos existentes; convierte imágenes a WebP privado y conserva IDs `local-N`. Tiene `--preview` sin conexión y `--dry-run` de solo lectura. Requiere Node 24 en su entorno preparado. No importa Firestore ni crea/cambia administradores. `deploy/update.sh` prepara respaldo y actualización de web/API, conservando MySQL y Caddy; por instrucción del usuario, no aplica el seeder durante el despliegue. Procedimiento: `docs/DEPLOY_UPDATE.md`.

El frontend ya no consulta Firebase. No se exportaron/importaron documentos que pudieran existir únicamente en Firestore y no se comprobó una instancia MySQL local en esta sesión. Los datos `src/data` son fallbacks en el frontend, pero no se crean automáticamente como filas MySQL. Antes de retirar Firestore o de desplegar, exportar los documentos remotos y migrarlos a la tabla `content`; si esos documentos contienen data URLs, migrar primero cada archivo al storage nuevo y reemplazar por la URL nueva.

## Hallazgos de auditoría

1. Se reemplazó la integración de Firebase en frontend por API Node/Express y base MySQL configurable.
2. Se añadió base de datos SQL, creación de administrador, almacenamiento privado de medios, WebP y carga autenticada de video.
3. Se cambió hero de carrusel a un único hero y dashboard a sidebar/navbar responsive.
4. `npm run lint` termina con dos warnings preexistentes: `Date` durante render en Footer y helper exportado junto con componente en `FieldInput`.
5. `npm run build` termina correctamente. Bundle principal aprox. 336 kB (104 kB gzip).
6. `npm audit` queda sin vulnerabilidades según el registry consultado.
7. Queda pendiente verificar conexión real a MySQL y migrar datos históricos; no se encontraron credenciales MySQL configuradas (no se leen ni registran secretos del `.env`).

## Plan técnico recomendado para la siguiente etapa

Actualización del 10 de octubre de 2026: la auditoría de despliegue y los archivos Docker/Compose/Caddy/GitLab están en `DAZGREEN_AUDITORIA_DESPLIEGUE.md`. No se verificó una conexión MySQL real ni se desplegó; el motor Docker local no estaba activo. Node 24 es el runtime preparado. El informe nuevo contiene los resultados actuales y el procedimiento de preservación de datos; los resultados de la auditoría anterior arriba son históricos.

1. Configurar MySQL real en entorno local/VPS y probar migraciones de esquema/conexión.
2. Exportar contenido Firestore, convertir cualquier data URL antiguo a archivos WebP y migrar los payloads a MySQL antes de dar por cerrada la retirada de Firebase.
3. Definir despliegue VPS (Nginx/Caddy, TLS, usuario MySQL restringido, `MEDIA_ROOT` persistente, respaldo de base y archivos).
4. Verificar carga, reemplazo y borrado de medios con los datos reales, incluyendo navegación móvil/accesibilidad.
