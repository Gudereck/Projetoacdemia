package Academia.Projeto.dto;

import Academia.Projeto.entity.enums.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "E-mail inválido") String email,
        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 8, max = 72, message = "Senha deve ter entre 8 e 72 caracteres") String senha,
        @NotNull(message = "Perfil é obrigatório") PerfilUsuario perfil,
        Long alunoId,
        Long professorId
) {
}
