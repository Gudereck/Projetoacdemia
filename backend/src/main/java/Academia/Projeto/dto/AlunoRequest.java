package Academia.Projeto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record AlunoRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotBlank(message = "CPF é obrigatório")
        @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos numéricos") String cpf,
        @NotNull(message = "Data de nascimento é obrigatória")
        @Past(message = "Data de nascimento deve estar no passado") LocalDate dataNascimento,
        String telefone,
        @Email(message = "E-mail inválido") String email,
        String endereco
) {
}
