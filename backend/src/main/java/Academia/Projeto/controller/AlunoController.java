package Academia.Projeto.controller;

import Academia.Projeto.dto.AlunoRequest;
import Academia.Projeto.dto.AlunoResponse;
import Academia.Projeto.entity.Aluno;
import Academia.Projeto.service.AlunoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'ATENDENTE')")
    public List<AlunoResponse> listar() {
        return alunoService.listarAtivos().stream()
                .map(AlunoResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'ATENDENTE')")
    public AlunoResponse buscar(@PathVariable Long id) {
        return AlunoResponse.from(alunoService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ATENDENTE')")
    @ResponseStatus(HttpStatus.CREATED)
    public AlunoResponse criar(@Valid @RequestBody AlunoRequest request) {
        return AlunoResponse.from(alunoService.criar(toEntity(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ATENDENTE')")
    public AlunoResponse atualizar(@PathVariable Long id, @Valid @RequestBody AlunoRequest request) {
        return AlunoResponse.from(alunoService.atualizar(id, toEntity(request)));
    }

    @PatchMapping("/{id}/inativar")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void inativar(@PathVariable Long id) {
        alunoService.inativar(id);
    }

    @PatchMapping("/{id}/reativar")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reativar(@PathVariable Long id) {
        alunoService.reativar(id);
    }

    private Aluno toEntity(AlunoRequest request) {
        Aluno aluno = new Aluno();
        aluno.setNome(request.nome());
        aluno.setCpf(request.cpf());
        aluno.setDataNascimento(request.dataNascimento());
        aluno.setTelefone(request.telefone());
        aluno.setEmail(request.email());
        aluno.setEndereco(request.endereco());
        return aluno;
    }
}
