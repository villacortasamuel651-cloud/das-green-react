# DAS Green

Sitio en React/Vite con API Node.js/Express, MySQL y almacenamiento local privado de medios.

## Requisitos

- Node.js 22.12+ o 24 (Docker y CI usan Node 24; `file-type` y `concurrently` requieren Node 22+).
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

La preparación Docker y el procedimiento de conservación de datos están en [DAZGREEN_AUDITORIA_DESPLIEGUE.md](./DAZGREEN_AUDITORIA_DESPLIEGUE.md). El Compose separa `web` (Nginx), `api` (Express) y `db` (MySQL 8.4), con Caddy central para HTTPS. MySQL pertenece únicamente a una red Docker privada y no publica puertos; la API usa `MYSQL_HOST=db`. La base y los medios usan volúmenes externos persistentes, creados explícitamente después de revisar los datos existentes.

Usar `deploy/.env.example` como plantilla para el archivo privado de producción, separado del `.env` local. No exponer `MEDIA_ROOT` como directorio estático. Antes del primer despliegue, respaldar/restaurar la base y los archivos, probar la aplicación con MySQL real y completar la migración histórica que corresponda. No se ha realizado un despliegue de producción.

El despliegue `gh-pages` del proyecto original ya no es el destino de producción: requiere una API Node persistente y MySQL, por lo que se debe servir el build de Vite desde el VPS junto al backend.

## Si no puedes entrar al administrador

Abre `https://dazgreen.com/#/login`. Un `401` en `POST /api/auth/login` indica que el correo o la contraseña no coinciden con una cuenta de la **base que utiliza la API**. Configurar `ADMIN_EMAIL`/`ADMIN_PASSWORD` en un archivo de entorno no crea ni actualiza cuentas por sí solo. El comando `admin:create` debe ejecutarse con la conexión a esa misma base.

Tras varios rechazos puede aparecer `429`: el límite de acceso es de 10 intentos fallidos por IP en una ventana de 15 minutos. Espera al plazo indicado antes de intentar de nuevo; no elimines la protección. El formulario actualizado muestra el tiempo de espera y evita enviar el mismo intento varias veces mientras carga.

El comando nuevo `npm run admin:check` comprueba las cuentas **sin escribir en la base**. Si recibe `ADMIN_EMAIL`, comprueba que exista; si también recibe `ADMIN_PASSWORD`, compara el hash sin mostrar la contraseña. Dentro del servicio API de Docker se garantiza que consulta la conexión que usa el login. Después de actualizar la imagen, desde la release que contiene `compose.yaml`:

```bash
read -r -p 'Correo con el que intentas entrar: ' ADMIN_EMAIL
read -r -s -p 'Contraseña con la que intentas entrar: ' ADMIN_PASSWORD
printf '\n'
export ADMIN_EMAIL ADMIN_PASSWORD
docker compose --env-file /opt/dazgreen/.env.production exec -T \
  -e ADMIN_EMAIL -e ADMIN_PASSWORD api npm run admin:check
unset ADMIN_EMAIL ADMIN_PASSWORD
```

Si el comando indica que el correo no existe, revisa dónde ejecutaste `admin:create`. Si el hash no coincide, comprueba la contraseña y, solo cuando corresponda, restablécela con `admin:create` dentro de ese mismo servicio/conexión usando entrada privada. El script de creación actual cambia la contraseña si el correo ya existe: no ejecutarlo por rutina ni pegar contraseñas en el chat. No hay un restablecimiento automático en el frontend.

Pruebas de regresión del acceso: `npm test`. Cubren sesión y cookie segura, credenciales rechazadas, cuenta ausente, bloqueo 429, origen ajeno y validación de respuestas del cliente; no usan una base de producción.

## Migración de Firestore

El API nuevo usa MySQL y no conecta con Firebase. Los documentos que estén únicamente en Firestore no se copian automáticamente; exportarlos e importarlos a `content` antes de retirar el proyecto Firebase. Los datos base de `src/data` siguen disponibles como fallback local mientras MySQL aún no tenga documentos.

## Contenido inicial y actualización de contenedores

`npm run content:seed -- --preview` muestra los 18 documentos locales sin acceder a MySQL. Con Node 24 y el entorno del servidor, `--dry-run` consulta qué falta sin escribir; sin esas opciones, el seeder inserta únicamente documentos ausentes y migra las imágenes incluidas a WebP privado. No sobrescribe contenido ni administra cuentas.

`bash deploy/update.sh /srv/apps/dazgreen/.env.production` construye y actualiza web/API con respaldo y recuperación de imágenes, manteniendo MySQL y el proxy central. El despliegue no aplica el seeder. Consultar las instrucciones y sus límites en [docs/DEPLOY_UPDATE.md](./docs/DEPLOY_UPDATE.md); inspeccionar primero la infraestructura real del VPS.
