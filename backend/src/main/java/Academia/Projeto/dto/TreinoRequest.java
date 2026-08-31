package Academia.Projeto.dto;

import Academia.Projeto.entity.enums.DiaSemana;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record TreinoRequest(
        @NotNull(message = "Aluno é obrigatório") Long alunoId,
        @NotNull(message = "Professor é obrigatório") Long professorId,
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotNull(message = "Dia da semana é obrigatório") DiaSemana diaSemana,
        @NotNull(message = "Data de início é obrigatória") LocalDate dataInicio
) {
}
