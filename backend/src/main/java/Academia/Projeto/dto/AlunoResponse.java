package Academia.Projeto.dto;

import Academia.Projeto.entity.Aluno;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AlunoResponse(
        Long id,
        String nome,
        String cpf,
        LocalDate dataNascimento,
        String telefone,
        String email,
        String endereco,
        boolean ativo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AlunoResponse from(Aluno aluno) {
        return new AlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getCpf(),
                aluno.getDataNascimento(),
                aluno.getTelefone(),
                aluno.getEmail(),
                aluno.getEndereco(),
                aluno.isAtivo(),
                aluno.getCreatedAt(),
                aluno.getUpdatedAt()
        );
    }
}
