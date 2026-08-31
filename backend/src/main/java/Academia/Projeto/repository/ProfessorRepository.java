package Academia.Projeto.repository;

import Academia.Projeto.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    Optional<Professor> findByCpf(String cpf);

    List<Professor> findByAtivoTrue();
}
