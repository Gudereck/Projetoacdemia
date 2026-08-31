package Academia.Projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RegistrarPagamentoRequest(
        @NotNull(message = "Data de pagamento é obrigatória") LocalDate dataPagamento,
        @NotBlank(message = "Forma de pagamento é obrigatória") String formaPagamento
) {
}
