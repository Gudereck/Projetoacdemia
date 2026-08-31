package Academia.Projeto.controller;

import Academia.Projeto.dto.MatriculaRequest;
import Academia.Projeto.dto.MatriculaResponse;
import Academia.Projeto.service.MatriculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'ATENDENTE')")
public class MatriculaController {

    private final MatriculaService matriculaService;

    @GetMapping
    public List<MatriculaResponse> listarPorAluno(@RequestParam Long alunoId) {
        return matriculaService.listarPorAluno(alunoId).stream().map(MatriculaResponse::from).toList();
    }

    @GetMapping("/{id}")
    public MatriculaResponse buscar(@PathVariable Long id) {
        return MatriculaResponse.from(matriculaService.buscarPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MatriculaResponse matricular(@Valid @RequestBody MatriculaRequest request) {
        return MatriculaResponse.from(
                matriculaService.matricular(request.alunoId(), request.planoId(), request.dataInicio()));
    }

    @PostMapping("/{id}/renovar")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public MatriculaResponse renovar(@PathVariable Long id) {
        return MatriculaResponse.from(matriculaService.renovar(id));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelar(@PathVariable Long id) {
        matriculaService.cancelar(id);
    }
}
