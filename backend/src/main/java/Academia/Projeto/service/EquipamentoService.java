package Academia.Projeto.service;

import Academia.Projeto.entity.Equipamento;
import Academia.Projeto.exception.RecursoNaoEncontradoException;
import Academia.Projeto.repository.EquipamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipamentoService {

    private final EquipamentoRepository equipamentoRepository;

    @Transactional(readOnly = true)
    public List<Equipamento> listarAtivos() {
        return equipamentoRepository.findByAtivoTrue();
    }

    @Transactional(readOnly = true)
    public Equipamento buscarPorId(Long id) {
        return equipamentoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Equipamento não encontrado: id " + id));
    }

    public Equipamento criar(Equipamento equipamento) {
        equipamento.setAtivo(true);
        return equipamentoRepository.save(equipamento);
    }

    public Equipamento atualizar(Long id, Equipamento dadosAtualizados) {
        Equipamento equipamento = buscarPorId(id);
        equipamento.setNome(dadosAtualizados.getNome());
        equipamento.setCategoria(dadosAtualizados.getCategoria());
        equipamento.setStatus(dadosAtualizados.getStatus());
        equipamento.setDataAquisicao(dadosAtualizados.getDataAquisicao());
        return equipamentoRepository.save(equipamento);
    }

    public void inativar(Long id) {
        Equipamento equipamento = buscarPorId(id);
        equipamento.setAtivo(false);
        equipamentoRepository.save(equipamento);
    }

    public void reativar(Long id) {
        Equipamento equipamento = buscarPorId(id);
        equipamento.setAtivo(true);
        equipamentoRepository.save(equipamento);
    }
}
