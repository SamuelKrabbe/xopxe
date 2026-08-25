package br.com.dominadores.xopxe.auth;

import br.com.dominadores.xopxe.auth.AuthDtos.LoginRequest;
import br.com.dominadores.xopxe.auth.AuthDtos.RegisterRequest;
import br.com.dominadores.xopxe.auth.AuthDtos.UserResponse;
import br.com.dominadores.xopxe.user.Role;
import br.com.dominadores.xopxe.user.User;
import br.com.dominadores.xopxe.user.UserRepository;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;

	/** Cria a conta e já devolve os dados do usuário. */
	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public UserResponse register(@Valid @RequestBody RegisterRequest request) {
		String email = request.email().trim().toLowerCase();

		if (userRepository.existsByEmail(email)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado.");
		}

		User user = new User();
		user.setName(request.name().trim());
		user.setEmail(email);
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setRole(Role.USER);

		return UserResponse.from(userRepository.save(user));
	}

	/**
	 * Confere e-mail e senha. Depois disso o front usa HTTP Basic nas outras
	 * chamadas — não guardamos sessão aqui para manter simples.
	 */
	@PostMapping("/login")
	public UserResponse login(@Valid @RequestBody LoginRequest request) {
		String email = request.email().trim().toLowerCase();

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(email, request.password()));
		} catch (AuthenticationException exception) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.");
		}

		return userRepository.findByEmail(email)
				.map(UserResponse::from)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos."));
	}

	/** Quem está autenticado na requisição atual. */
	@GetMapping("/me")
	public UserResponse me(Principal principal) {
		return userRepository.findByEmail(principal.getName())
				.map(UserResponse::from)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
	}
}
