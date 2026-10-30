package br.com.dominadores.xopxe.config;

import br.com.dominadores.xopxe.user.Role;
import br.com.dominadores.xopxe.user.User;
import br.com.dominadores.xopxe.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria dois usuários de teste quando o banco está vazio. A senha é "password",
 * a não ser que a variável DEMO_PASSWORD esteja definida (usamos isso no Render).
 */
@Component
@RequiredArgsConstructor
public class DemoUsersSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${DEMO_PASSWORD:password}")
    private String demoPassword;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        userRepository.save(newUser("Admin", "admin@xopxe.com", Role.ADMIN));
        userRepository.save(newUser("User", "user@xopxe.com", Role.USER));
    }

    private User newUser(String name, String email, Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(demoPassword));
        user.setRole(role);

        return user;
    }
}
