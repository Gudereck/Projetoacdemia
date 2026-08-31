package Academia.Projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "E-mail é obrigatório") String email,
        @NotBlank(message = "Senha é obrigatória")
        @Size(max = 72, message = "Senha inválida") String senha
) {
}
