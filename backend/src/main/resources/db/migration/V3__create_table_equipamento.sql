CREATE TABLE equipamento (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('DISPONIVEL', 'MANUTENCAO', 'INATIVO')),
    data_aquisicao DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
