# Actualización de Dazgreen y seeder de contenidos

## Datos de operación proporcionados por el usuario

- SSH: usuario `deploy`; la dirección del VPS se proporciona fuera de este documento.
- Instalación actual: `/srv/apps/dazgreen/releases/initial`.
- Entorno privado: `/srv/apps/dazgreen/.env.production`.
- Proxy compartido: `/srv/infra/proxy`.
- Dominio: `https://dazgreen.com`.

El VPS aloja otros proyectos. Inspeccionar primero la instalación existente. No cambiar el proxy central, otros contenedores, credenciales, tablas o volúmenes. No ejecutar `down -v`, eliminación de volúmenes ni una actualización del motor MySQL.

## Despliegue de la aplicación

`deploy/update.sh` actualiza web y API; conserva el contenedor MySQL existente y comprueba que siga saludable. No aplica el seeder. Esta separación respeta la indicación del usuario de no modificar MySQL durante el despliegue.

El script exige los tres servicios existentes y el entorno privado. Construye las imágenes antes de detener la API, etiqueta las imágenes anteriores para recuperación, compara los volúmenes existentes con la configuración y hace una simulación de lectura del seeder. Después detiene solo la API para tomar un dump y un respaldo coherente de medios, reemplaza web/API y comprueba sus healthchecks. Si algo falla, intenta recuperar las imágenes anteriores o reactivar la API. Hay una interrupción breve de la API; no se garantiza cero downtime.

Los respaldos se crean con nombres únicos bajo `/srv/apps/dazgreen/backups`, fuera de los releases. El entorno no se imprime ni se incluye en el repositorio. El dump es de lectura; no se restaura ni se modifica la base automáticamente. La validación del archivo de medios no sustituye un ensayo de restauración. Conservar también copias fuera del VPS.

Si la instalación es un checkout Git limpio, después de inspeccionarla:

```bash
cd /srv/apps/dazgreen/releases/initial
git pull --ff-only origin main
bash deploy/update.sh /srv/apps/dazgreen/.env.production
```

Si la instalación se distribuye por archivos, preparar un directorio nuevo `/srv/apps/dazgreen/releases/COMMIT` con `git archive` del commit aprobado y ejecutar allí:

```bash
DEPLOY_REVISION=SHA_COMPLETO_DEL_COMMIT bash deploy/update.sh /srv/apps/dazgreen/.env.production
```

`DEPLOY_REVISION` debe tener 40 caracteres hexadecimales. No copiar un `.env` local al VPS. No sustituir la carpeta actual ni su Compose antes de inspeccionar el origen de los contenedores, las redes y los montajes. El script está diseñado para el `compose.yaml` de este repositorio; cualquier diferencia con producción debe revisarse primero.

## Seeder, como operación independiente

El seeder carga los datos locales que ya usa la web, en los 18 documentos de los editores. También migra las imágenes incluidas al almacenamiento privado como WebP y publica sus URL `/api/media/UUID`. No migra cuentas ni contraseñas; no crea administradores. Algunos textos locales son ejemplos: la carga reproduce ese contenido existente, no certifica que todos los datos biográficos sean reales.

- Los documentos existentes se conservan completos, incluidos listas vacías, videos y campos personalizados.
- Los IDs `local-N` coinciden con la reconciliación actual de los editores y la landing.
- Se usa transacción MySQL y bloqueo de exclusión entre ejecuciones del seeder. Un error anterior al commit revierte las escrituras y limpia archivos recién creados.
- Si el resultado de `COMMIT` queda desconocido por un fallo de conexión, se conservan los archivos para evitar romper referencias que sí se hayan confirmado.
- Las imágenes tienen nombres estables derivados del contenido WebP y no se duplican al repetir la carga. Los videos permanecen vacíos si no hay un archivo proporcionado.
- No existe opción para sobrescribir documentos. No se importan automáticamente datos históricos que solo existan en Firestore.

Inspeccionar el contenido local sin acceder a la base:

```bash
npm run content:seed -- --preview
```

Después del despliegue, usando su Compose y las imágenes indicadas en `current-images.env`, simular contra la base de producción sin escribir:

```bash
docker compose --env-file /srv/apps/dazgreen/.env.production \
  --env-file /srv/apps/dazgreen/current-images.env \
  run --rm --no-deps -T api node server/scripts/seed-content.js --dry-run
```

**Aplicar la carga es una escritura separada y queda pendiente de autorización**, por la instrucción posterior del usuario de no modificar MySQL durante este despliegue. Tras revisar la simulación y disponer de un respaldo coherente reciente, el comando es el anterior sin `--dry-run`. No ejecutar `db:setup-local` en producción ni `admin:create` para importar contenidos.

## Verificación de esta preparación

- 19 pruebas aprobadas: autenticación y seeder, incluyendo conservación de documentos, idempotencia, simulación sin escrituras, rollback y WebP.
- Build React aprobado y lint sin errores; conserva los avisos históricos de Footer/FieldInput y `VITE_SITE_URL` en el build local. La imagen web define esa variable para producción.
- Sintaxis Bash y configuración Compose comprobadas sin imprimir secretos.
- Los builds Docker locales no se completaron: el almacenamiento interno de Docker Desktop devolvió `read-only file system` al escribir metadata de BuildKit. No se reinició Docker ni se eliminaron recursos compartidos para sortearlo. El workflow GitHub añadido verifica las dos imágenes en un runner separado antes de un despliegue manual.
- La conexión al VPS respondió, pero rechazó la autenticación del usuario `deploy` con las claves de Hostinger existentes. No se pudo inspeccionar ni actualizar la infraestructura remota desde esta sesión.
