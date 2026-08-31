#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE ROLE ${REPLICATION_USER} WITH REPLICATION LOGIN PASSWORD '${REPLICATION_PASSWORD}';
EOSQL

echo "host replication ${REPLICATION_USER} 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"
