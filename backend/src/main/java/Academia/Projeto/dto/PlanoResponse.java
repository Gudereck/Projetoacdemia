package Academia.Projeto.dto;

import Academia.Projeto.entity.Plano;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PlanoResponse(
        Long id,
        String nome,
        Integer duracaoMeses,
        BigDecimal valor,
        String descricao,
        boolean ativo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PlanoResponse from(Plano plano) {
        return new PlanoResponse(
                plano.getId(),
                plano.getNome(),
                plano.getDuracaoMeses(),
                plano.getValor(),
                plano.getDescricao(),
                plano.isAtivo(),
                plano.getCreatedAt(),
                plano.getUpdatedAt()
        );
    }
}
