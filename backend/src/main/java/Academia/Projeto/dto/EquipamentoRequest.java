package Academia.Projeto.dto;

import Academia.Projeto.entity.enums.StatusEquipamento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;

public record EquipamentoRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotBlank(message = "Categoria é obrigatória") String categoria,
        @NotNull(message = "Status é obrigatório") StatusEquipamento status,
        @NotNull(message = "Data de aquisição é obrigatória")
        @PastOrPresent(message = "Data de aquisição não pode ser futura") LocalDate dataAquisicao
) {
}
