# #!/bin/sh
# set -e

# if [ -z "$DATABASE_URL" ]; then
#   : "${DB_NAME:?DB_NAME is required}"
#   : "${DB_USER:?DB_USER is required}"
#   : "${DB_PASSWORD:?DB_PASSWORD is required}"
#   : "${DB_HOST:?DB_HOST is required}"
#   : "${DB_PORT:?DB_PORT is required}"
#   export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?serverVersion=16&charset=utf8"
# fi

# exec "$@"
