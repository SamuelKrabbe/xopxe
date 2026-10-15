package br.com.dominadores.xopxe.auth;

import br.com.dominadores.xopxe.auth.AuthDtos.LoginRequest;
import br.com.dominadores.xopxe.auth.AuthDtos.ProvidersResponse;
import br.com.dominadores.xopxe.auth.AuthDtos.RegisterRequest;
import br.com.dominadores.xopxe.auth.AuthDtos.UserResponse;
import br.com.dominadores.xopxe.config.OpenApiConfig;
import br.com.dominadores.xopxe.user.Role;
import br.com.dominadores.xopxe.user.User;
import br.com.dominadores.xopxe.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

@Tag(name = "Autenticação")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SessionLogin sessionLogin;
    private final GoogleLoginSettings googleLoginSettings;

    @Operation(summary = "Cria uma conta e já entra nela")
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado.");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        userRepository.save(user);

        sessionLogin.signIn(user, httpRequest, httpResponse);

        return UserResponse.from(user);
    }

    @Operation(summary = "Entra com e-mail e senha")
    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String email = request.email().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (AuthenticationException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos."));

        sessionLogin.signIn(user, httpRequest, httpResponse);

        return UserResponse.from(user);
    }

    @Operation(summary = "Sai da conta")
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest httpRequest) {
        sessionLogin.signOut(httpRequest);
    }

    // O botão do Google em si é um link para /oauth2/authorization/google.
    @Operation(summary = "Diz se o login com Google está ligado")
    @GetMapping("/providers")
    public ProvidersResponse providers() {
        return new ProvidersResponse(googleLoginSettings.isEnabled());
    }

    @Operation(summary = "Usuário logado")
    @SecurityRequirement(name = OpenApiConfig.SESSION_SCHEME)
    @GetMapping("/me")
    public UserResponse me(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .map(UserResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}
