package Academia.Projeto.controller;

import Academia.Projeto.dto.PlanoRequest;
import Academia.Projeto.dto.PlanoResponse;
import Academia.Projeto.entity.Plano;
import Academia.Projeto.service.PlanoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planos")
@RequiredArgsConstructor
public class PlanoController {

    private final PlanoService planoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ATENDENTE')")
    public List<PlanoResponse> listar() {
        return planoService.listarAtivos().stream().map(PlanoResponse::from).toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ATENDENTE')")
    public PlanoResponse buscar(@PathVariable Long id) {
        return PlanoResponse.from(planoService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public PlanoResponse criar(@Valid @RequestBody PlanoRequest request) {
        return PlanoResponse.from(planoService.criar(toEntity(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PlanoResponse atualizar(@PathVariable Long id, @Valid @RequestBody PlanoRequest request) {
        return PlanoResponse.from(planoService.atualizar(id, toEntity(request)));
    }

    @PatchMapping("/{id}/inativar")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void inativar(@PathVariable Long id) {
        planoService.inativar(id);
    }

    @PatchMapping("/{id}/reativar")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reativar(@PathVariable Long id) {
        planoService.reativar(id);
    }

    private Plano toEntity(PlanoRequest request) {
        Plano plano = new Plano();
        plano.setNome(request.nome());
        plano.setDuracaoMeses(request.duracaoMeses());
        plano.setValor(request.valor());
        plano.setDescricao(request.descricao());
        return plano;
    }
}
