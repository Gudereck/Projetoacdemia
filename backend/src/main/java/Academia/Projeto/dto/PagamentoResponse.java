package Academia.Projeto.dto;

import Academia.Projeto.entity.Pagamento;
import Academia.Projeto.entity.enums.StatusPagamento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PagamentoResponse(
        Long id,
        Long matriculaId,
        BigDecimal valor,
        LocalDate dataVencimento,
        LocalDate dataPagamento,
        String formaPagamento,
        StatusPagamento status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PagamentoResponse from(Pagamento pagamento) {
        return new PagamentoResponse(
                pagamento.getId(),
                pagamento.getMatricula().getId(),
                pagamento.getValor(),
                pagamento.getDataVencimento(),
                pagamento.getDataPagamento(),
                pagamento.getFormaPagamento(),
                pagamento.getStatus(),
                pagamento.getCreatedAt(),
                pagamento.getUpdatedAt()
        );
    }
}
