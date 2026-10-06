package br.com.dominadores.xopxe.auth;

import br.com.dominadores.xopxe.user.Role;
import br.com.dominadores.xopxe.user.User;
import br.com.dominadores.xopxe.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * Chamado quando o Google confirma o login. Busca (ou cria) o usuário pelo
 * e-mail e abre a sessão igual ao login com senha.
 */
@Component
@RequiredArgsConstructor
public class GoogleLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final SessionLogin sessionLogin;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();
        String email = googleUser.getAttribute("email");
        Boolean emailVerified = googleUser.getAttribute("email_verified");

        // Sem e-mail confirmado pelo Google, alguém poderia entrar na conta de outra pessoa.
        if (email == null || !Boolean.TRUE.equals(emailVerified)) {
            sessionLogin.signOut(request);
            response.sendRedirect("/");
            return;
        }

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseGet(() -> createUser(email.toLowerCase(), googleUser.getAttribute("name")));

        sessionLogin.signIn(user, request, response);
        response.sendRedirect("/");
    }

    // Conta nova vinda do Google: papel USER e sem senha.
    private User createUser(String email, String name) {
        User user = new User();
        user.setName(name != null ? name : email);
        user.setEmail(email);
        user.setRole(Role.USER);

        return userRepository.save(user);
    }
}
