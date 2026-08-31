package Academia.Projeto.repository;

import Academia.Projeto.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("""
            SELECT u FROM Usuario u
            LEFT JOIN FETCH u.aluno
            LEFT JOIN FETCH u.professor
            WHERE u.email = :email
            """)
    Optional<Usuario> findByEmail(@Param("email") String email);

    List<Usuario> findByAtivoTrue();
}
