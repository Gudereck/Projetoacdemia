package Academia.Projeto.repository;

import Academia.Projeto.entity.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {

    List<Equipamento> findByAtivoTrue();
}
