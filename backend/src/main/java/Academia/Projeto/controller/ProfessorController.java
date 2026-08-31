package Academia.Projeto.controller;

import Academia.Projeto.dto.ProfessorRequest;
import Academia.Projeto.dto.ProfessorResponse;
import Academia.Projeto.entity.Professor;
import Academia.Projeto.service.ProfessorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping
    public List<ProfessorResponse> listar() {
        return professorService.listarAtivos().stream()
                .map(ProfessorResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ProfessorResponse buscar(@PathVariable Long id) {
        return ProfessorResponse.from(professorService.buscarPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProfessorResponse criar(@Valid @RequestBody ProfessorRequest request) {
        return ProfessorResponse.from(professorService.criar(toEntity(request)));
    }

    @PutMapping("/{id}")
    public ProfessorResponse atualizar(@PathVariable Long id, @Valid @RequestBody ProfessorRequest request) {
        return ProfessorResponse.from(professorService.atualizar(id, toEntity(request)));
    }

    @PatchMapping("/{id}/inativar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void inativar(@PathVariable Long id) {
        professorService.inativar(id);
    }

    @PatchMapping("/{id}/reativar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reativar(@PathVariable Long id) {
        professorService.reativar(id);
    }

    private Professor toEntity(ProfessorRequest request) {
        Professor professor = new Professor();
        professor.setNome(request.nome());
        professor.setCpf(request.cpf());
        professor.setCref(request.cref());
        professor.setEspecialidade(request.especialidade());
        professor.setTelefone(request.telefone());
        professor.setEmail(request.email());
        return professor;
    }
}
