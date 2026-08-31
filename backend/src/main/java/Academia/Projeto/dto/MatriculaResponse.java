package Academia.Projeto.dto;

import Academia.Projeto.entity.Matricula;
import Academia.Projeto.entity.enums.StatusMatricula;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MatriculaResponse(
        Long id,
        Long alunoId,
        String alunoNome,
        Long planoId,
        String planoNome,
        LocalDate dataInicio,
        LocalDate dataVencimento,
        StatusMatricula status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static MatriculaResponse from(Matricula matricula) {
        return new MatriculaResponse(
                matricula.getId(),
                matricula.getAluno().getId(),
                matricula.getAluno().getNome(),
                matricula.getPlano().getId(),
                matricula.getPlano().getNome(),
                matricula.getDataInicio(),
                matricula.getDataVencimento(),
                matricula.getStatus(),
                matricula.getCreatedAt(),
                matricula.getUpdatedAt()
        );
    }
}
