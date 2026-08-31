package Academia.Projeto.repository;

import Academia.Projeto.entity.Plano;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanoRepository extends JpaRepository<Plano, Long> {

    List<Plano> findByAtivoTrue();
}
