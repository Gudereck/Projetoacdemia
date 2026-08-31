package Academia.Projeto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ProfessorRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotBlank(message = "CPF é obrigatório")
        @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos numéricos") String cpf,
        @NotBlank(message = "CREF é obrigatório") String cref,
        String especialidade,
        String telefone,
        @Email(message = "E-mail inválido") String email
) {
}
