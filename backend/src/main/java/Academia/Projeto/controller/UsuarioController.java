package Academia.Projeto.controller;

import Academia.Projeto.dto.UsuarioRequest;
import Academia.Projeto.dto.UsuarioResponse;
import Academia.Projeto.entity.enums.PerfilUsuario;
import Academia.Projeto.security.UsuarioPrincipal;
import Academia.Projeto.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioResponse> listar() {
        return usuarioService.listarAtivos().stream().map(UsuarioResponse::from).toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponse buscar(@PathVariable Long id) {
        return UsuarioResponse.from(usuarioService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ATENDENTE')")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse criar(@Valid @RequestBody UsuarioRequest request,
                                  @AuthenticationPrincipal UsuarioPrincipal principal) {
        if (principal.getUsuario().getPerfil() == PerfilUsuario.ATENDENTE && request.perfil() != PerfilUsuario.ALUNO) {
            throw new AccessDeniedException("Atendente só pode criar login de aluno");
        }
        return UsuarioResponse.from(usuarioService.criar(
                request.nome(), request.email(), request.senha(), request.perfil(),
                request.alunoId(), request.professorId()));
    }

    @PatchMapping("/{id}/inativar")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void inativar(@PathVariable Long id) {
        usuarioService.inativar(id);
    }

    @PatchMapping("/{id}/reativar")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reativar(@PathVariable Long id) {
        usuarioService.reativar(id);
    }
}
