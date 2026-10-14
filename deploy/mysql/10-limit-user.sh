#!/bin/bash
# La imagen oficial carga este archivo con source, solo al inicializar un volumen vacío.
# No crear/cambiar tablas ni importar contenido durante la inicialización.
if [[ ! "${MYSQL_DATABASE:-}" =~ ^[a-zA-Z0-9_]+$ ]] || \
   [[ ! "${MYSQL_USER:-}" =~ ^[a-zA-Z0-9_]+$ ]] || [[ "$MYSQL_USER" == root ]]; then
  echo "MYSQL_DATABASE y MYSQL_USER deben ser identificadores simples; root no es válido." >&2
  exit 1
fi

docker_process_sql <<SQL
REVOKE ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* FROM '${MYSQL_USER}'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
SQL
