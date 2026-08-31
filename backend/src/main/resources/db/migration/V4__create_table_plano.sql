CREATE TABLE plano (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    duracao_meses INTEGER NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
