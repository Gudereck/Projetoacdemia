package Academia.Projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record TreinoExercicioRequest(
        Long equipamentoId,
        @NotBlank(message = "Nome do exercício é obrigatório") String nomeExercicio,
        @NotNull(message = "Séries é obrigatório")
        @Positive(message = "Séries deve ser maior que zero") Integer series,
        @NotNull(message = "Repetições é obrigatório")
        @Positive(message = "Repetições deve ser maior que zero") Integer repeticoes,
        BigDecimal cargaKg,
        Integer descansoSegundos,
        @NotNull(message = "Ordem é obrigatória") Integer ordem
) {
}
