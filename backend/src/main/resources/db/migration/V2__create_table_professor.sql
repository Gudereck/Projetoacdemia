CREATE TABLE professor (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    cref VARCHAR(30) NOT NULL,
    especialidade VARCHAR(150),
    telefone VARCHAR(20),
    email VARCHAR(150),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
