package Academia.Projeto.service;

import Academia.Projeto.entity.Professor;
import Academia.Projeto.exception.CpfDuplicadoException;
import Academia.Projeto.exception.RecursoNaoEncontradoException;
import Academia.Projeto.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfessorService {

    private final ProfessorRepository professorRepository;

    @Transactional(readOnly = true)
    public List<Professor> listarAtivos() {
        return professorRepository.findByAtivoTrue();
    }

    @Transactional(readOnly = true)
    public Professor buscarPorId(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado: id " + id));
    }

    public Professor criar(Professor professor) {
        validarCpfDisponivel(professor.getCpf(), null);
        professor.setAtivo(true);
        return professorRepository.save(professor);
    }

    public Professor atualizar(Long id, Professor dadosAtualizados) {
        Professor professor = buscarPorId(id);
        validarCpfDisponivel(dadosAtualizados.getCpf(), id);

        professor.setNome(dadosAtualizados.getNome());
        professor.setCpf(dadosAtualizados.getCpf());
        professor.setCref(dadosAtualizados.getCref());
        professor.setEspecialidade(dadosAtualizados.getEspecialidade());
        professor.setTelefone(dadosAtualizados.getTelefone());
        professor.setEmail(dadosAtualizados.getEmail());

        return professorRepository.save(professor);
    }

    public void inativar(Long id) {
        Professor professor = buscarPorId(id);
        professor.setAtivo(false);
        professorRepository.save(professor);
    }

    public void reativar(Long id) {
        Professor professor = buscarPorId(id);
        professor.setAtivo(true);
        professorRepository.save(professor);
    }

    private void validarCpfDisponivel(String cpf, Long idAtual) {
        professorRepository.findByCpf(cpf).ifPresent(existente -> {
            if (!existente.getId().equals(idAtual)) {
                throw new CpfDuplicadoException("CPF já cadastrado: " + cpf);
            }
        });
    }
}
