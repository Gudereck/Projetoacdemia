package Academia.Projeto.controller;

import Academia.Projeto.dto.EquipamentoRequest;
import Academia.Projeto.dto.EquipamentoResponse;
import Academia.Projeto.entity.Equipamento;
import Academia.Projeto.service.EquipamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EquipamentoController {

    private final EquipamentoService equipamentoService;

    @GetMapping
    public List<EquipamentoResponse> listar() {
        return equipamentoService.listarAtivos().stream().map(EquipamentoResponse::from).toList();
    }

    @GetMapping("/{id}")
    public EquipamentoResponse buscar(@PathVariable Long id) {
        return EquipamentoResponse.from(equipamentoService.buscarPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipamentoResponse criar(@Valid @RequestBody EquipamentoRequest request) {
        return EquipamentoResponse.from(equipamentoService.criar(toEntity(request)));
    }

    @PutMapping("/{id}")
    public EquipamentoResponse atualizar(@PathVariable Long id, @Valid @RequestBody EquipamentoRequest request) {
        return EquipamentoResponse.from(equipamentoService.atualizar(id, toEntity(request)));
    }

    @PatchMapping("/{id}/inativar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void inativar(@PathVariable Long id) {
        equipamentoService.inativar(id);
    }

    @PatchMapping("/{id}/reativar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reativar(@PathVariable Long id) {
        equipamentoService.reativar(id);
    }

    private Equipamento toEntity(EquipamentoRequest request) {
        Equipamento equipamento = new Equipamento();
        equipamento.setNome(request.nome());
        equipamento.setCategoria(request.categoria());
        equipamento.setStatus(request.status());
        equipamento.setDataAquisicao(request.dataAquisicao());
        return equipamento;
    }
}
