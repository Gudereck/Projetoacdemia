package Academia.Projeto.dto;

import Academia.Projeto.entity.Treino;
import Academia.Projeto.entity.enums.DiaSemana;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TreinoResponse(
        Long id,
        Long alunoId,
        String alunoNome,
        Long professorId,
        String professorNome,
        String nome,
        DiaSemana diaSemana,
        LocalDate dataInicio,
        LocalDate dataFim,
        boolean ativo,
        List<TreinoExercicioResponse> exercicios,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TreinoResponse from(Treino treino) {
        return new TreinoResponse(
                treino.getId(),
                treino.getAluno().getId(),
                treino.getAluno().getNome(),
                treino.getProfessor().getId(),
                treino.getProfessor().getNome(),
                treino.getNome(),
                treino.getDiaSemana(),
                treino.getDataInicio(),
                treino.getDataFim(),
                treino.isAtivo(),
                treino.getExercicios().stream().map(TreinoExercicioResponse::from).toList(),
                treino.getCreatedAt(),
                treino.getUpdatedAt()
        );
    }
}
