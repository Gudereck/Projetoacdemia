# Infraestrutura do banco de dados — replicação

## Visão geral

O `docker-compose.yml` sobe dois containers Postgres:

- **`db`** (porta `5432`) — primário, leitura e escrita. É o que a aplicação usa (`application.properties`).
- **`db-replica`** (porta `5433`) — réplica somente-leitura, sincronizada em tempo real via streaming replication (WAL). Existe para redundância: se o disco/volume do primário for perdido ou corromper, os dados também existem na réplica.

A réplica é populada automaticamente na primeira subida via `pg_basebackup` (script `db/replica/replica-entrypoint.sh`) e depois só recebe o WAL continuamente — não precisa clonar de novo a cada restart, só na primeira vez (volume `academia_db_replica_data` vazio).

## Credenciais (dev only)

Usuário de replicação: `replicator` / senha `replica_senha_123` (definidos em `docker-compose.yml`, junto com a senha do banco principal). Mesma observação de sempre: mover para variável de ambiente antes de qualquer deploy real.

## Setup automático vs. manual

O script `db/primary/init-replication.sh` (que cria o role `replicator` e libera `pg_hba.conf` para conexões de replicação) só roda automaticamente quando o Postgres **inicializa um volume vazio pela primeira vez** (comportamento padrão do `docker-entrypoint-initdb.d`). Se você já tinha um volume `academia_db_data` de antes de a réplica existir, esse script não vai rodar sozinho — é preciso aplicar manualmente uma vez:

```bash
docker exec academia-db psql -U Gustavo -d ProjetoAcademia -c \
  "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replica_senha_123';"
docker exec academia-db bash -c 'echo "host replication replicator 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"'
docker exec academia-db psql -U Gustavo -d ProjetoAcademia -c "SELECT pg_reload_conf();"
docker compose restart db-replica
```

Em um volume novo (`docker compose down -v` ou clone limpo do projeto), isso acontece sozinho.

## Verificar o status da replicação

No primário:

```sql
SELECT client_addr, state, sync_state, replay_lag FROM pg_stat_replication;
```

`state = streaming` e `replay_lag` baixo (milissegundos) indicam que está tudo em dia.

## Se o primário cair (failover manual)

A réplica não vira primário sozinha (isso seria failover automático, que exige uma ferramenta extra tipo Patroni/repmgr — fora do escopo deste projeto). Pra promover manualmente a réplica a primário:

```bash
docker exec academia-db-replica psql -U Gustavo -c "SELECT pg_promote();"
```

Depois disso, a réplica passa a aceitar escrita — mas é preciso trocar a `spring.datasource.url` da aplicação pra apontar pra porta `5433` (ou promover e depois recolocar no ar como novo primário na porta 5432).

## O que isso NÃO é

Isso não substitui backup. Se alguém rodar `DELETE`/`DROP` sem `WHERE` no primário, a réplica replica esse erro também (ela só protege contra perda física do disco/volume, não contra erro de operação). Backup lógico (`pg_dump` agendado) continua sendo uma lacuna deste projeto — ainda não implementado.
