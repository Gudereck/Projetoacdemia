CREATE TABLE treino_exercicio (
    id BIGSERIAL PRIMARY KEY,
    treino_id BIGINT NOT NULL REFERENCES treino(id) ON DELETE CASCADE,
    equipamento_id BIGINT REFERENCES equipamento(id),
    nome_exercicio VARCHAR(150) NOT NULL,
    series INTEGER NOT NULL,
    repeticoes INTEGER NOT NULL,
    carga_kg NUMERIC(5,2),
    descanso_segundos INTEGER,
    ordem INTEGER NOT NULL
);
