package Academia.Projeto.repository;

import Academia.Projeto.entity.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    List<Pagamento> findByMatriculaId(Long matriculaId);
}
