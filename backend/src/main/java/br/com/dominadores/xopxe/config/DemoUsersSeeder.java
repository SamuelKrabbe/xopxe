package br.com.dominadores.xopxe.config;

import br.com.dominadores.xopxe.user.Role;
import br.com.dominadores.xopxe.user.User;
import br.com.dominadores.xopxe.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria dois usuários de teste na primeira execução. Some quando tivermos
 * cadastro de verdade.
 */
@Component
@RequiredArgsConstructor
public class DemoUsersSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
        user.setPassword(passwordEncoder.encode("password"));
        user.setRole(role);

        return user;
    }
}
