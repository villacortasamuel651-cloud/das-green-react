# Guía del proyecto DAS Green

## Contexto y objetivo actual

- Este repositorio contiene la web pública de Diego Alberto Sorrilla Green y un panel de administración.
- El usuario pidió que las próximas mejoras se hagan después de auditar y entender la arquitectura existente, con criterio experto de frontend/backend y clean code.
- Dirección visual solicitada para el trabajo posterior: sustituir el carrusel del hero por un único hero con video de fondo y tipografía formal, bien compuesta. El video no está disponible todavía, así que debe quedar un espacio/estado vacío preparado para agregarlo más adelante.
- Evolución solicitada para el panel: dashboard más claro y profesional con sidebar y navbar; permitir agregar y eliminar el video del hero y editar/agregar/eliminar contenido en las secciones que ya soporte la lógica actual.
- No sustituir ni duplicar los flujos de contenido existentes sin revisar antes este mapa y los contratos descritos en `docs/PROJECT_CONTEXT.md`.

## Instrucciones de trabajo

- Mantener los textos e interfaces en español, salvo que el usuario indique otra cosa.
- Antes de cambiar una sección, revisar su editor, archivo de datos local, componente de presentación y contrato de la API/MySQL.
- Mantener datos locales funcionales como fallback cuando MySQL no tenga contenido; no hacer depender la landing de que la API responda.
- Reutilizar `ObjectEditor`, `ListEditor`, `FieldInput` y sus convenciones cuando encajen. Extraer lógica común si una nueva función introduce duplicación.
- Tratar imágenes y videos como medios distintos. No guardar bytes ni data URLs en MySQL. Imágenes: WebP. Videos: MP4/WebM en almacenamiento privado del servidor, expuestos solo mediante la ruta de medios de la API. Requerir autenticación para cargar/borrar y validar tamaño/contenido del archivo.
- Mantener accesibilidad: etiquetas asociadas, foco visible, controles con nombres accesibles, navegación usable con teclado y adaptación móvil.
- No exponer valores de `.env` ni incluirlos en documentación o salidas.
- La ruta React protegida es solo presentación; toda escritura/carga/borrado debe verificar la sesión en el backend. Mantener secretos solo en el entorno del servidor.

## Alcance de esta auditoría

La auditoría inicial está documentada en `docs/PROJECT_CONTEXT.md`. No se implementaron cambios de interfaz o funcionalidad como parte de ella.
