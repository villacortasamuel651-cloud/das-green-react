#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

# Ejecutar en el checkout del VPS o un release de git archive con DEPLOY_REVISION.
# Se preservan MySQL, sus volúmenes, las cuentas y el proxy central.
project_dir=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd -P)
env_file=${1:-/srv/apps/dazgreen/.env.production}
test -f "$env_file" || { echo "No existe el archivo privado de producción." >&2; exit 1; }
cd "$project_dir"
if test -e "$project_dir/.git"; then
  git diff --quiet && git diff --cached --quiet || { echo "Hay cambios locales sin guardar. No se inicia el despliegue." >&2; exit 1; }
fi
revision=${DEPLOY_REVISION:-$(git rev-parse HEAD)}
case "$revision" in ''|*[!a-f0-9]*) exit 1 ;; esac
test "${#revision}" -eq 40
compose() { docker compose --env-file "$env_file" -f "$project_dir/compose.yaml" "$@"; }
compose config --quiet

db_id=$(compose ps -q db)
api_id=$(compose ps -q api)
web_id=$(compose ps -q web)
test -n "$db_id" && test -n "$api_id" && test -n "$web_id" || { echo "Falta alguno de los tres servicios existentes. No se inicializa una instalación nueva." >&2; exit 1; }
test "$(docker inspect --format '{{.State.Health.Status}}' "$db_id")" = healthy
old_api_id=$(docker inspect --format '{{.Image}}' "$api_id")
old_web_id=$(docker inspect --format '{{.Image}}' "$web_id")
stamp="$(date -u +%Y%m%dT%H%M%SZ)-$$"
old_api="dazgreen-api:rollback-$stamp"
old_web="dazgreen-web:rollback-$stamp"
docker image tag "$old_api_id" "$old_api"
docker image tag "$old_web_id" "$old_web"

export API_IMAGE="dazgreen-api:$revision"
export WEB_IMAGE="dazgreen-web:$revision"
echo "Construyendo web/API antes de detener el servicio..."
compose build web api
docker pull alpine:3.22 >/dev/null

# El JSON con entorno se procesa por stdin sin imprimirse: solo salen nombres de volúmenes.
expected_volumes=$(compose config --format json | docker run --rm -i --network none --entrypoint node "$API_IMAGE" -e '
let input=""; process.stdin.on("data", c => input += c); process.stdin.on("end", () => {
  const c=JSON.parse(input); console.log(c.volumes.mysql_data.name); console.log(c.volumes.media_data.name);
});')
expected_db=$(printf '%s\n' "$expected_volumes" | sed -n '1p')
expected_media=$(printf '%s\n' "$expected_volumes" | sed -n '2p')
actual_db=$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/mysql"}}{{.Name}}{{end}}{{end}}' "$db_id")
actual_media=$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/dazgreen/media"}}{{.Name}}{{end}}{{end}}' "$api_id")
test -n "$actual_db" && test -n "$actual_media" && test "$actual_db" = "$expected_db" && test "$actual_media" = "$expected_media" || {
  echo "Los volúmenes del Compose no coinciden con los contenedores existentes. No se cambia la base ni el almacenamiento." >&2; exit 1;
}
compose run --rm --no-deps -T api node server/scripts/seed-content.js --dry-run

state_dir=$(CDPATH='' cd -- "$(dirname -- "$env_file")" && pwd -P)
mkdir -p "$state_dir/backups"
backup_dir=$(mktemp -d "$state_dir/backups/$revision-XXXXXXXX")
printf 'API_IMAGE=%s\nWEB_IMAGE=%s\n' "$old_api" "$old_web" > "$backup_dir/previous-images.env"
cp "$project_dir/compose.yaml" "$backup_dir/compose.yaml"
api_stopped=false
switch_started=false
recover() {
  code=$?
  trap - ERR INT TERM
  echo "La actualización falló. Recuperando los servicios con sus imágenes anteriores..." >&2
  if "$switch_started"; then
    export API_IMAGE="$old_api" WEB_IMAGE="$old_web"
    compose up -d --no-build --no-deps --pull never --wait --wait-timeout 180 web api || echo "Revisa los servicios manualmente; las copias están en $backup_dir." >&2
  elif "$api_stopped"; then
    compose start api || echo "Revisa el servicio API manualmente." >&2
  fi
  exit "$code"
}
trap recover ERR
trap 'false' INT TERM

echo "Respaldando base y medios con la API detenida..."
api_stopped=true
compose stop api
compose exec -T db sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysqldump --user=root --single-transaction --set-gtid-purged=OFF --routines --triggers --events --no-tablespaces "$MYSQL_DATABASE"' > "$backup_dir/database.sql"
test -s "$backup_dir/database.sql"
docker run --rm --network none --read-only \
  --mount "type=volume,source=$actual_media,target=/source,readonly" \
  --mount "type=bind,source=$backup_dir,target=/backup" \
  alpine:3.22 sh -c 'umask 077; tar -czf /backup/media.tar.gz -C /source .; tar -tzf /backup/media.tar.gz >/dev/null'

# El despliegue no aplica el seeder ni modifica filas de MySQL.
# La carga de contenido es un paso separado, con respaldo y autorización propios.
switch_started=true
compose up -d --no-build --no-deps --pull never --wait --wait-timeout 180 web api
compose exec -T web nginx -t
compose exec -T api node deploy/api-healthcheck.mjs
test "$(docker inspect --format '{{.State.Health.Status}}' "$db_id")" = healthy
printf 'API_IMAGE=%s\nWEB_IMAGE=%s\n' "$API_IMAGE" "$WEB_IMAGE" > "$state_dir/current-images.env"
trap - ERR INT TERM
echo "Actualización completada: $revision"
echo "Respaldo: $backup_dir"
echo "Web/API actualizados. MySQL y Caddy conservados; no se eliminaron volúmenes ni se modificaron contraseñas."
compose ps
