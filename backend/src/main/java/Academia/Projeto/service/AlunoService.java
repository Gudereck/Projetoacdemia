package Academia.Projeto.service;

import Academia.Projeto.entity.Aluno;
import Academia.Projeto.exception.CpfDuplicadoException;
import Academia.Projeto.exception.RecursoNaoEncontradoException;
import Academia.Projeto.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AlunoService {

    private final AlunoRepository alunoRepository;

    @Transactional(readOnly = true)
    public List<Aluno> listarAtivos() {
        return alunoRepository.findByAtivoTrue();
    }

    @Transactional(readOnly = true)
    public Aluno buscarPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado: id " + id));
    }

    public Aluno criar(Aluno aluno) {
        validarCpfDisponivel(aluno.getCpf(), null);
        aluno.setAtivo(true);
        return alunoRepository.save(aluno);
    }

    public Aluno atualizar(Long id, Aluno dadosAtualizados) {
        Aluno aluno = buscarPorId(id);
        validarCpfDisponivel(dadosAtualizados.getCpf(), id);

        aluno.setNome(dadosAtualizados.getNome());
        aluno.setCpf(dadosAtualizados.getCpf());
        aluno.setDataNascimento(dadosAtualizados.getDataNascimento());
        aluno.setTelefone(dadosAtualizados.getTelefone());
        aluno.setEmail(dadosAtualizados.getEmail());
        aluno.setEndereco(dadosAtualizados.getEndereco());

        return alunoRepository.save(aluno);
    }

    public void inativar(Long id) {
        Aluno aluno = buscarPorId(id);
        aluno.setAtivo(false);
        alunoRepository.save(aluno);
    }

    public void reativar(Long id) {
        Aluno aluno = buscarPorId(id);
        aluno.setAtivo(true);
        alunoRepository.save(aluno);
    }

    private void validarCpfDisponivel(String cpf, Long idAtual) {
        alunoRepository.findByCpf(cpf).ifPresent(existente -> {
            if (!existente.getId().equals(idAtual)) {
                throw new CpfDuplicadoException("CPF já cadastrado: " + cpf);
            }
        });
    }
}
