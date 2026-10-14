#!/bin/sh
set -eu

# Solo actualiza web/api; la inicialización/importación de datos es un paso manual previo.
release_dir=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd -P)
project_root=/opt/dazgreen
registry_image=${1:?Falta el prefijo de imagen del Registry}
revision=${2:?Falta el SHA del commit}

case "$registry_image" in ''|*[!a-zA-Z0-9_./:-]*) echo "Registry inválido" >&2; exit 1 ;; esac
case "$revision" in ''|*[!a-f0-9]*) echo "SHA inválido" >&2; exit 1 ;; esac
test "${#revision}" -eq 40
test "$release_dir" = "$project_root/releases/$revision"
test -f "$project_root/.env.production"
test -f "$project_root/.deployment-ready" || {
  echo "Falta completar bootstrap, respaldo/restauración y validación manual de datos." >&2
  exit 1
}

cd "$release_dir"
export WEB_IMAGE="$registry_image/web:$revision"
export API_IMAGE="$registry_image/api:$revision"
compose() { docker compose --env-file "$project_root/.env.production" -f "$release_dir/compose.yaml" "$@"; }
compose config --quiet
# Comprobar que db ya existe y está saludable; no inicializar una BD desde CI.
db_id=$(compose ps -q db)
test -n "$db_id"
test "$(docker inspect --format '{{.State.Health.Status}}' "$db_id")" = healthy
compose pull web api
compose up -d --no-build --no-deps --wait --wait-timeout 180 web api

if test -f "$project_root/current-images.env"; then
  cp "$project_root/current-images.env" "$project_root/previous-images.env"
fi
umask 077
printf 'WEB_IMAGE=%s\nAPI_IMAGE=%s\n' "$WEB_IMAGE" "$API_IMAGE" > "$project_root/current-images.env"
ln -sfn "$release_dir" "$project_root/current"
printf 'Aplicación actualizada al commit %s\n' "$revision"
