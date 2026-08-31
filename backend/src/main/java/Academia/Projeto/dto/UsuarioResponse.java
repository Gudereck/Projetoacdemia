package Academia.Projeto.dto;

import Academia.Projeto.entity.Usuario;
import Academia.Projeto.entity.enums.PerfilUsuario;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        PerfilUsuario perfil,
        Long alunoId,
        Long professorId,
        boolean ativo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.getAluno() != null ? usuario.getAluno().getId() : null,
                usuario.getProfessor() != null ? usuario.getProfessor().getId() : null,
                usuario.isAtivo(),
                usuario.getCreatedAt(),
                usuario.getUpdatedAt()
        );
    }
}
