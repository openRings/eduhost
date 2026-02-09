#!/bin/sh
set -e

echo "[sealed] loading secrets..."
export POSTGRES_DB="$(echo $DATABASE_NAME)"
export POSTGRES_USER="$(echo $DATABASE_USER)"
export POSTGRES_PASSWORD="$(sealed get -r DATABASE_PASS)"

echo "[postgres] starting..."
exec docker-entrypoint.sh postgres
