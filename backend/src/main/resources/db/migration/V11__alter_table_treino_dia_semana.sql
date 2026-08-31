ALTER TABLE treino
    ADD COLUMN dia_semana VARCHAR(10) NOT NULL
        CHECK (dia_semana IN ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'));
