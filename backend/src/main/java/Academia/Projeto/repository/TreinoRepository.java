package Academia.Projeto.repository;

import Academia.Projeto.entity.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TreinoRepository extends JpaRepository<Treino, Long> {

    @Query("""
            SELECT DISTINCT t FROM Treino t
            JOIN FETCH t.aluno
            JOIN FETCH t.professor
            LEFT JOIN FETCH t.exercicios ex
            LEFT JOIN FETCH ex.equipamento
            WHERE t.aluno.id = :alunoId AND t.ativo = true
            """)
    List<Treino> findAtivosComDetalhesPorAluno(@Param("alunoId") Long alunoId);

    @Query("""
            SELECT t FROM Treino t
            JOIN FETCH t.aluno
            JOIN FETCH t.professor
            LEFT JOIN FETCH t.exercicios ex
            LEFT JOIN FETCH ex.equipamento
            WHERE t.id = :id
            """)
    Optional<Treino> findByIdComDetalhes(@Param("id") Long id);
}
