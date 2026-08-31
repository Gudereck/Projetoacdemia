package Academia.Projeto.controller;

import Academia.Projeto.dto.TreinoExercicioRequest;
import Academia.Projeto.dto.TreinoExercicioResponse;
import Academia.Projeto.dto.TreinoRequest;
import Academia.Projeto.dto.TreinoResponse;
import Academia.Projeto.entity.Treino;
import Academia.Projeto.entity.TreinoExercicio;
import Academia.Projeto.entity.enums.PerfilUsuario;
import Academia.Projeto.security.UsuarioPrincipal;
import Academia.Projeto.service.TreinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treinos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'ALUNO')")
public class TreinoController {

    private final TreinoService treinoService;

    @GetMapping
    public List<TreinoResponse> listarAtivosPorAluno(@RequestParam Long alunoId,
                                                       @AuthenticationPrincipal UsuarioPrincipal principal) {
        exigirAcessoAoAluno(principal, alunoId);
        return treinoService.listarAtivosPorAluno(alunoId).stream().map(TreinoResponse::from).toList();
    }

    @GetMapping("/{id}")
    public TreinoResponse buscar(@PathVariable Long id, @AuthenticationPrincipal UsuarioPrincipal principal) {
        Treino treino = treinoService.buscarPorId(id);
        exigirAcessoAoAluno(principal, treino.getAluno().getId());
        return TreinoResponse.from(treino);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TreinoResponse criar(@Valid @RequestBody TreinoRequest request) {
        return TreinoResponse.from(treinoService.criar(
                request.alunoId(), request.professorId(), request.nome(), request.diaSemana(), request.dataInicio()));
    }

    @PatchMapping("/{id}/encerrar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void encerrar(@PathVariable Long id) {
        treinoService.encerrar(id);
    }

    @PostMapping("/{treinoId}/exercicios")
    @ResponseStatus(HttpStatus.CREATED)
    public TreinoExercicioResponse adicionarExercicio(@PathVariable Long treinoId,
                                                        @Valid @RequestBody TreinoExercicioRequest request) {
        TreinoExercicio exercicio = treinoService.adicionarExercicio(
                treinoId, request.equipamentoId(), request.nomeExercicio(), request.series(),
                request.repeticoes(), request.cargaKg(), request.descansoSegundos(), request.ordem());
        return TreinoExercicioResponse.from(exercicio);
    }

    @DeleteMapping("/{treinoId}/exercicios/{exercicioId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerExercicio(@PathVariable Long treinoId, @PathVariable Long exercicioId) {
        treinoService.removerExercicio(treinoId, exercicioId);
    }

    private void exigirAcessoAoAluno(UsuarioPrincipal principal, Long alunoId) {
        if (principal.getUsuario().getPerfil() != PerfilUsuario.ALUNO) {
            return;
        }
        var alunoVinculado = principal.getUsuario().getAluno();
        if (alunoVinculado == null || !alunoVinculado.getId().equals(alunoId)) {
            throw new AccessDeniedException("Aluno só pode ver os próprios treinos");
        }
    }
}
