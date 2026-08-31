package Academia.Projeto.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record PlanoRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotNull(message = "Duração em meses é obrigatória")
        @Positive(message = "Duração deve ser maior que zero") Integer duracaoMeses,
        @NotNull(message = "Valor é obrigatório")
        @DecimalMin(value = "0.0", inclusive = false, message = "Valor deve ser maior que zero") BigDecimal valor,
        String descricao
) {
}
