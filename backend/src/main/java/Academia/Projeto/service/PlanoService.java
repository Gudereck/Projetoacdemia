package Academia.Projeto.service;

import Academia.Projeto.entity.Plano;
import Academia.Projeto.exception.RecursoNaoEncontradoException;
import Academia.Projeto.repository.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PlanoService {

    private final PlanoRepository planoRepository;

    @Transactional(readOnly = true)
    public List<Plano> listarAtivos() {
        return planoRepository.findByAtivoTrue();
    }

    @Transactional(readOnly = true)
    public Plano buscarPorId(Long id) {
        return planoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Plano não encontrado: id " + id));
    }

    public Plano criar(Plano plano) {
        plano.setAtivo(true);
        return planoRepository.save(plano);
    }

    public Plano atualizar(Long id, Plano dadosAtualizados) {
        Plano plano = buscarPorId(id);
        plano.setNome(dadosAtualizados.getNome());
        plano.setDuracaoMeses(dadosAtualizados.getDuracaoMeses());
        plano.setValor(dadosAtualizados.getValor());
        plano.setDescricao(dadosAtualizados.getDescricao());
        return planoRepository.save(plano);
    }

    public void inativar(Long id) {
        Plano plano = buscarPorId(id);
        plano.setAtivo(false);
        planoRepository.save(plano);
    }

    public void reativar(Long id) {
        Plano plano = buscarPorId(id);
        plano.setAtivo(true);
        planoRepository.save(plano);
    }
}
