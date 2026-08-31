package Academia.Projeto.dto;

import Academia.Projeto.entity.Usuario;
import Academia.Projeto.entity.enums.PerfilUsuario;

public record MeResponse(
        Long id,
        String nome,
        String email,
        PerfilUsuario perfil,
        Long alunoId,
        Long professorId
) {
    public static MeResponse from(Usuario usuario) {
        return new MeResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.getAluno() != null ? usuario.getAluno().getId() : null,
                usuario.getProfessor() != null ? usuario.getProfessor().getId() : null
        );
    }
}
