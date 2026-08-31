ALTER TABLE usuario DROP CONSTRAINT usuario_perfil_check;

ALTER TABLE usuario
    ADD CONSTRAINT usuario_perfil_check
        CHECK (perfil IN ('ADMIN', 'PROFESSOR', 'ALUNO', 'ATENDENTE'));
