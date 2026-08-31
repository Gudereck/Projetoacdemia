package Academia.Projeto.service;

import Academia.Projeto.entity.Matricula;
import Academia.Projeto.entity.Pagamento;
import Academia.Projeto.entity.enums.StatusPagamento;
import Academia.Projeto.exception.RecursoNaoEncontradoException;
import Academia.Projeto.repository.MatriculaRepository;
import Academia.Projeto.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;
    private final MatriculaRepository matriculaRepository;

    @Transactional(readOnly = true)
    public List<Pagamento> listarPorMatricula(Long matriculaId) {
        return pagamentoRepository.findByMatriculaId(matriculaId);
    }

    @Transactional(readOnly = true)
    public Pagamento buscarPorId(Long id) {
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pagamento não encontrado: id " + id));
    }

    public Pagamento gerarCobranca(Long matriculaId, LocalDate dataVencimento) {
        Matricula matricula = matriculaRepository.findById(matriculaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Matrícula não encontrada: id " + matriculaId));

        Pagamento pagamento = new Pagamento();
        pagamento.setMatricula(matricula);
        pagamento.setValor(matricula.getPlano().getValor());
        pagamento.setDataVencimento(dataVencimento);
        pagamento.setStatus(StatusPagamento.PENDENTE);

        return pagamentoRepository.save(pagamento);
    }

    public Pagamento registrarPagamento(Long id, LocalDate dataPagamento, String formaPagamento) {
        Pagamento pagamento = buscarPorId(id);
        pagamento.setDataPagamento(dataPagamento);
        pagamento.setFormaPagamento(formaPagamento);
        pagamento.setStatus(StatusPagamento.PAGO);
        return pagamentoRepository.save(pagamento);
    }
}
