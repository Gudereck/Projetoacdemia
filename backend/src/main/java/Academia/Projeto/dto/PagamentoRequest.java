package Academia.Projeto.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PagamentoRequest(
        @NotNull(message = "Matrícula é obrigatória") Long matriculaId,
        @NotNull(message = "Data de vencimento é obrigatória") LocalDate dataVencimento
) {
}
