package br.com.dominadores.xopxe.auth;

import br.com.dominadores.xopxe.user.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

	private AuthDtos() {
	}

	public record LoginRequest(
			@NotBlank @Email String email,
			@NotBlank String password) {
	}

	public record RegisterRequest(
			@NotBlank @Size(max = 120) String name,
			@NotBlank @Email @Size(max = 180) String email,
			@NotBlank @Size(min = 6, max = 72) String password) {
	}

	/** Resposta enviada ao front. Nunca inclui a senha. */
	public record UserResponse(Long id, String name, String email, String role) {

		public static UserResponse from(User user) {
			return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
		}
	}
}
