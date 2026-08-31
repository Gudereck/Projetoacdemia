package Academia.Projeto.service;

import Academia.Projeto.entity.Aluno;
import Academia.Projeto.entity.Matricula;
import Academia.Projeto.entity.Plano;
import Academia.Projeto.entity.enums.StatusMatricula;
import Academia.Projeto.exception.RecursoNaoEncontradoException;
import Academia.Projeto.repository.AlunoRepository;
import Academia.Projeto.repository.MatriculaRepository;
import Academia.Projeto.repository.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final AlunoRepository alunoRepository;
    private final PlanoRepository planoRepository;

    @Transactional(readOnly = true)
    public List<Matricula> listarPorAluno(Long alunoId) {
        return matriculaRepository.findByAlunoId(alunoId);
    }

    @Transactional(readOnly = true)
    public Matricula buscarPorId(Long id) {
        return matriculaRepository.findByIdComDetalhes(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Matrícula não encontrada: id " + id));
    }

    public Matricula matricular(Long alunoId, Long planoId, LocalDate dataInicio) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado: id " + alunoId));
        Plano plano = planoRepository.findById(planoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Plano não encontrado: id " + planoId));

        Matricula matricula = new Matricula();
        matricula.setAluno(aluno);
        matricula.setPlano(plano);
        matricula.setDataInicio(dataInicio);
        matricula.setDataVencimento(dataInicio.plusMonths(plano.getDuracaoMeses()));
        matricula.setStatus(StatusMatricula.ATIVA);

        return matriculaRepository.save(matricula);
    }

    public Matricula renovar(Long matriculaId) {
        Matricula atual = buscarPorId(matriculaId);
        atual.setStatus(StatusMatricula.VENCIDA);
        matriculaRepository.save(atual);

        LocalDate novaDataInicio = atual.getDataVencimento().isAfter(LocalDate.now())
                ? atual.getDataVencimento()
                : LocalDate.now();

        return matricular(atual.getAluno().getId(), atual.getPlano().getId(), novaDataInicio);
    }

    public void cancelar(Long id) {
        Matricula matricula = buscarPorId(id);
        matricula.setStatus(StatusMatricula.CANCELADA);
        matriculaRepository.save(matricula);
    }
}
