CREATE TABLE pagamento (
    id BIGSERIAL PRIMARY KEY,
    matricula_id BIGINT NOT NULL REFERENCES matricula(id),
    valor NUMERIC(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    forma_pagamento VARCHAR(30),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'PAGO', 'ATRASADO')),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
