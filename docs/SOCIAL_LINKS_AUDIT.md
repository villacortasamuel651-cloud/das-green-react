# Auditoría de enlaces sociales

Fecha: 14 de octubre de 2026. Alcance: búsqueda de perfiles públicos de Diego Alberto Zorrilla Green / Daz Green y actualización de los enlaces sociales de la web.

## Identificación

- LinkedIn: https://www.linkedin.com/in/diegozorrillagreen/
- Fuente pública consultada: https://pe.linkedin.com/in/diegozorrillagreen. El perfil se presenta como «Diego Zorrilla Green / Daz Green», en Lima, y contiene referencias a ESAN, Montpellier Business School y Hult Prize. Coincide con el perfil y las publicaciones que ya usa `src/data/news.js`.
- Las búsquedas por nombre completo, alias y usuario no permitieron identificar con suficiente certeza cuentas personales de Instagram, Facebook, X, TikTok o YouTube. Esto no demuestra que no existan. Agregar sus enlaces cuando Diego proporcione los usuarios o se encuentre evidencia pública que los vincule con él.

## Arquitectura revisada

- `src/config/site.js` centraliza el usuario y la URL de LinkedIn y la URL de X. Antes de esta actualización, ambas URL eran `#` y el usuario de LinkedIn era `/diegoalbertogreen`.
- `Contact.jsx` utiliza directamente la configuración para sus datos de contacto. `Footer.jsx` usa la misma configuración para sus accesos sociales.
- `src/data/contact.js` contiene los textos locales. `ContactEditor.jsx` reutiliza `ObjectEditor` para editar esos textos; actualmente no administra las redes sociales.
- `useContent("contact")` lee `GET /api/content/contact` y la presentación conserva los textos locales si la API falla o no tiene documento.
- `PUT /api/content/:id` exige sesión administrativa y comprobación de origen. MySQL almacena el documento en `content.payload` (JSON). Las URL sociales actuales no se leen de ese documento, por lo que esta actualización no requiere una migración ni escrituras en MySQL.

## Actualización

- Se corrigió el usuario y la URL de LinkedIn compartidos por Contacto y el pie de página.
- X queda vacío y su acceso no aparece mientras no haya un perfil identificado. También se omite LinkedIn si se deja su URL vacía.
- Los enlaces sociales abren una pestaña nueva con `noopener noreferrer`, nombres accesibles que avisan de ese comportamiento y foco visible para navegación con teclado.
- Se corrigió «Sorrilla» por «Zorrilla» en `site.name`, conforme al nombre indicado por el usuario y a las fuentes públicas.
- El correo de ejemplo y la marca DAS siguen pendientes de una revisión específica; esta búsqueda no aportó un correo verificado ni autorización para rediseñar la marca.

Estos cambios corresponden al código local; no implican un despliegue del sitio público.

## Validación

- `npm run build`: completado correctamente. Vite advierte que `VITE_SITE_URL` no está definido para las referencias existentes en `index.html`.
- `npm run lint`: completado sin errores, con los dos avisos ya documentados sobre `Date` en Footer y el helper exportado en `FieldInput`.
- `git diff --check`: sin errores de espacios en los cambios actuales.
- No se verificó visualmente en un navegador ni se comprobó una instancia MySQL; los enlaces sociales siguen dependiendo de la configuración local revisada.
