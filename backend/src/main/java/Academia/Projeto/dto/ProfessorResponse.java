package Academia.Projeto.dto;

import Academia.Projeto.entity.Professor;

import java.time.LocalDateTime;

public record ProfessorResponse(
        Long id,
        String nome,
        String cpf,
        String cref,
        String especialidade,
        String telefone,
        String email,
        boolean ativo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProfessorResponse from(Professor professor) {
        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getCpf(),
                professor.getCref(),
                professor.getEspecialidade(),
                professor.getTelefone(),
                professor.getEmail(),
                professor.isAtivo(),
                professor.getCreatedAt(),
                professor.getUpdatedAt()
        );
    }
}
