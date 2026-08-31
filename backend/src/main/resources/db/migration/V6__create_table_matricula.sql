CREATE TABLE matricula (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL REFERENCES aluno(id),
    plano_id BIGINT NOT NULL REFERENCES plano(id),
    data_inicio DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ATIVA', 'VENCIDA', 'CANCELADA')),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
