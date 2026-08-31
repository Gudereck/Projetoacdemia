package Academia.Projeto.dto;

import Academia.Projeto.entity.Equipamento;
import Academia.Projeto.entity.enums.StatusEquipamento;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record EquipamentoResponse(
        Long id,
        String nome,
        String categoria,
        StatusEquipamento status,
        LocalDate dataAquisicao,
        boolean ativo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static EquipamentoResponse from(Equipamento equipamento) {
        return new EquipamentoResponse(
                equipamento.getId(),
                equipamento.getNome(),
                equipamento.getCategoria(),
                equipamento.getStatus(),
                equipamento.getDataAquisicao(),
                equipamento.isAtivo(),
                equipamento.getCreatedAt(),
                equipamento.getUpdatedAt()
        );
    }
}
