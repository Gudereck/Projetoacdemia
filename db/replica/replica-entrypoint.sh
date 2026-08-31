#!/bin/bash
set -e

if [ -z "$(ls -A "$PGDATA" 2>/dev/null)" ]; then
    echo "PGDATA vazio - clonando dados do primario via pg_basebackup..."
    until PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
        -h "$PRIMARY_HOST" -U "$REPLICATION_USER" \
        -D "$PGDATA" -Fp -Xs -P -R; do
        echo "Aguardando o banco primario ficar disponivel..."
        sleep 2
    done
    chmod 0700 "$PGDATA"
fi

exec docker-entrypoint.sh "$@"
