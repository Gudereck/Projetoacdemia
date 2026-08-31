package Academia.Projeto.service;

import Academia.Projeto.entity.Aluno;
import Academia.Projeto.entity.Equipamento;
import Academia.Projeto.entity.Professor;
import Academia.Projeto.entity.Treino;
import Academia.Projeto.entity.TreinoExercicio;
import Academia.Projeto.entity.enums.DiaSemana;
import Academia.Projeto.exception.RecursoNaoEncontradoException;
import Academia.Projeto.repository.AlunoRepository;
import Academia.Projeto.repository.EquipamentoRepository;
import Academia.Projeto.repository.ProfessorRepository;
import Academia.Projeto.repository.TreinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EquipamentoRepository equipamentoRepository;

    @Transactional(readOnly = true)
    public List<Treino> listarAtivosPorAluno(Long alunoId) {
        return treinoRepository.findAtivosComDetalhesPorAluno(alunoId);
    }

    @Transactional(readOnly = true)
    public Treino buscarPorId(Long id) {
        return treinoRepository.findByIdComDetalhes(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Treino não encontrado: id " + id));
    }

    public Treino criar(Long alunoId, Long professorId, String nome, DiaSemana diaSemana, LocalDate dataInicio) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado: id " + alunoId));
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado: id " + professorId));

        Treino treino = new Treino();
        treino.setAluno(aluno);
        treino.setProfessor(professor);
        treino.setNome(nome);
        treino.setDiaSemana(diaSemana);
        treino.setDataInicio(dataInicio);
        treino.setAtivo(true);

        return treinoRepository.save(treino);
    }

    public void encerrar(Long id) {
        Treino treino = buscarPorId(id);
        treino.setDataFim(LocalDate.now());
        treino.setAtivo(false);
    }

    public TreinoExercicio adicionarExercicio(Long treinoId, Long equipamentoId, String nomeExercicio,
                                               Integer series, Integer repeticoes, BigDecimal cargaKg,
                                               Integer descansoSegundos, Integer ordem) {
        Treino treino = buscarPorId(treinoId);

        TreinoExercicio exercicio = new TreinoExercicio();
        exercicio.setTreino(treino);
        if (equipamentoId != null) {
            Equipamento equipamento = equipamentoRepository.findById(equipamentoId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Equipamento não encontrado: id " + equipamentoId));
            exercicio.setEquipamento(equipamento);
        }
        exercicio.setNomeExercicio(nomeExercicio);
        exercicio.setSeries(series);
        exercicio.setRepeticoes(repeticoes);
        exercicio.setCargaKg(cargaKg);
        exercicio.setDescansoSegundos(descansoSegundos);
        exercicio.setOrdem(ordem);

        treino.getExercicios().add(exercicio);
        treinoRepository.flush();

        return exercicio;
    }

    public void removerExercicio(Long treinoId, Long exercicioId) {
        Treino treino = buscarPorId(treinoId);
        boolean removido = treino.getExercicios().removeIf(exercicio -> exercicio.getId().equals(exercicioId));
        if (!removido) {
            throw new RecursoNaoEncontradoException("Exercício não encontrado no treino: id " + exercicioId);
        }
    }
}
