# DAS Green

Sitio en React/Vite con API Node.js/Express, MySQL y almacenamiento local privado de medios.

## Requisitos

- Node.js 20.19+ o 22.12+.
- MySQL 8+ o MariaDB compatible con columnas JSON.
- Un administrador MySQL y una base de datos para la aplicación.

## Desarrollo local

1. Instala dependencias con `npm install`.
2. Desde una terminal interactiva, ejecuta `npm run db:setup-local`. El script solicita la contraseña de `root` de forma oculta, crea la base/tablas y un usuario limitado para la app, genera el acceso inicial del panel y guarda la configuración local en `.env`.
3. Arranca backend y frontend con `npm run dev:full` (API en `localhost:3001`, Vite en `localhost:5173`).

También se puede usar `server/sql/schema.sql` para crear manualmente las tablas. En ese caso, hay que copiar `.env.example` a `.env`, completar MySQL/JWT y crear el administrador con `npm run admin:create`.

No subas `.env`, credenciales, dumps de base de datos ni `private-media/` al repositorio.
Cada compañera debe ejecutar el setup en su propia computadora; esto crea una base local independiente, no una base compartida.

## Modelo de persistencia

- `content`: documento JSON por sección, compatible con los ids actuales de editores. Los registros contienen texto, listas y referencias URL de medios.
- `media`: metadata del archivo y nombre aleatorio, nunca los bytes.
- `admins`: correo y hash bcrypt de contraseña.
- Los bytes se guardan debajo de `MEDIA_ROOT`, fuera del directorio público. La API requiere una sesión de administrador para subir o borrar. Las rutas de lectura de medios sirven contenido publicado a la landing con `Content-Type` correcto.
- Las imágenes se convierten/optimizan a WebP en el servidor. Los videos permitidos son MP4 y WebM. El límite inicial de video es 150 MiB y se configura con `MAX_VIDEO_BYTES`.
- Al guardar contenido que deja de referenciar un medio, el backend elimina el archivo si ningún otro documento lo utiliza.
- Para subir el video del hero, inicia sesión en el dashboard, abre **Inicio · Hero** y selecciona un archivo MP4 o WebM en **Video de fondo**. Guarda los cambios para publicarlo. El archivo se guarda automáticamente bajo `MEDIA_ROOT` (por defecto `private-media/`); no hay que copiarlo manualmente. El límite inicial es 150 MiB y se cambia con `MAX_VIDEO_BYTES`.

## Producción en Hostinger VPS

Desplegar frontend y API bajo el mismo origen detrás de Nginx/Caddy; no exponer `MEDIA_ROOT` como directorio estático. Configurar MySQL en localhost con usuario de privilegio mínimo. Mantener `MEDIA_ROOT` en disco persistente fuera del web root, restringir acceso SSH, configurar TLS, firewall y respaldos de MySQL y medios. Establecer `NODE_ENV=production`, un secreto JWT distinto y fuerte, credenciales privadas de MySQL y `APP_ORIGIN` con el dominio HTTPS real.

El despliegue `gh-pages` del proyecto original ya no es el destino de producción: requiere una API Node persistente y MySQL, por lo que se debe servir el build de Vite desde el VPS junto al backend.

## Migración de Firestore

El API nuevo usa MySQL y no conecta con Firebase. Los documentos que estén únicamente en Firestore no se copian automáticamente; exportarlos e importarlos a `content` antes de retirar el proyecto Firebase. Los datos base de `src/data` siguen disponibles como fallback local mientras MySQL aún no tenga documentos.
