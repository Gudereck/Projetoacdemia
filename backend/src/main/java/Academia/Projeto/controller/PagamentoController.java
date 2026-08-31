package Academia.Projeto.controller;

import Academia.Projeto.dto.PagamentoRequest;
import Academia.Projeto.dto.PagamentoResponse;
import Academia.Projeto.dto.RegistrarPagamentoRequest;
import Academia.Projeto.service.PagamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagamentos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'ATENDENTE')")
public class PagamentoController {

    private final PagamentoService pagamentoService;

    @GetMapping
    public List<PagamentoResponse> listarPorMatricula(@RequestParam Long matriculaId) {
        return pagamentoService.listarPorMatricula(matriculaId).stream().map(PagamentoResponse::from).toList();
    }

    @GetMapping("/{id}")
    public PagamentoResponse buscar(@PathVariable Long id) {
        return PagamentoResponse.from(pagamentoService.buscarPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PagamentoResponse gerarCobranca(@Valid @RequestBody PagamentoRequest request) {
        return PagamentoResponse.from(
                pagamentoService.gerarCobranca(request.matriculaId(), request.dataVencimento()));
    }

    @PatchMapping("/{id}/registrar-pagamento")
    public PagamentoResponse registrarPagamento(@PathVariable Long id,
                                                 @Valid @RequestBody RegistrarPagamentoRequest request) {
        return PagamentoResponse.from(
                pagamentoService.registrarPagamento(id, request.dataPagamento(), request.formaPagamento()));
    }
}
