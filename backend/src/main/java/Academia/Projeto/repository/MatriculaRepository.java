package Academia.Projeto.repository;

import Academia.Projeto.entity.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

    @Query("""
            SELECT m FROM Matricula m
            JOIN FETCH m.aluno
            JOIN FETCH m.plano
            WHERE m.aluno.id = :alunoId
            """)
    List<Matricula> findByAlunoId(@Param("alunoId") Long alunoId);

    @Query("""
            SELECT m FROM Matricula m
            JOIN FETCH m.aluno
            JOIN FETCH m.plano
            WHERE m.id = :id
            """)
    Optional<Matricula> findByIdComDetalhes(@Param("id") Long id);
}
