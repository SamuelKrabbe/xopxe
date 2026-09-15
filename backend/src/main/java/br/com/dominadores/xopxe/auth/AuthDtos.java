package br.com.dominadores.xopxe.auth;

import br.com.dominadores.xopxe.user.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

	private AuthDtos() {
	}

	public record LoginRequest(
			@NotBlank(message = "Informe o e-mail.") @Email(message = "Informe um e-mail válido.") String email,
			@NotBlank(message = "Informe a senha.") String password) {
	}

	public record RegisterRequest(
			@NotBlank(message = "Informe o nome.") @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.") String name,
			@NotBlank(message = "Informe o e-mail.") @Email(message = "Informe um e-mail válido.") @Size(max = 180, message = "O e-mail deve ter no máximo 180 caracteres.") String email,
			@NotBlank(message = "Informe a senha.") @Size(min = 6, max = 72, message = "A senha deve ter entre 6 e 72 caracteres.") String password) {
	}

	/** Resposta enviada ao front. Nunca inclui a senha. */
	public record UserResponse(Long id, String name, String email, String role) {

		public static UserResponse from(User user) {
			return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
		}
	}
}
