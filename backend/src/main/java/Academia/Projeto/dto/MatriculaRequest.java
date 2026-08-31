package Academia.Projeto.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record MatriculaRequest(
        @NotNull(message = "Aluno é obrigatório") Long alunoId,
        @NotNull(message = "Plano é obrigatório") Long planoId,
        @NotNull(message = "Data de início é obrigatória") LocalDate dataInicio
) {
}
