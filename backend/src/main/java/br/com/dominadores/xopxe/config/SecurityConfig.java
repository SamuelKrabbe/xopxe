package br.com.dominadores.xopxe.config;

import br.com.dominadores.xopxe.auth.GoogleLoginSettings;
import br.com.dominadores.xopxe.auth.GoogleLoginSuccessHandler;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Value("${xopxe.cors.allowed-origin}")
    private String allowedOrigin;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // O usuário logado fica guardado na sessão HTTP (cookie JSESSIONID).
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, GoogleLoginSettings google,
            GoogleLoginSuccessHandler googleSuccessHandler) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Projeto de faculdade: o front ainda não manda token CSRF.
                .csrf(csrf -> csrf.disable())
                .securityContext(context -> context.securityContextRepository(securityContextRepository()))
                .authorizeHttpRequests(auth -> auth
                        // Sem o /error liberado, um 409 vira 401 na volta: o Spring reenvia a
                        // resposta de erro por /error, que cairia no authenticated() lá embaixo.
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/auth/providers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/books/**").hasRole("ADMIN")
                        // Com um * só pega /api/books/5. As avaliações (/api/books/5/reviews/mine)
                        // continuam liberadas para qualquer usuário logado.
                        .requestMatchers(HttpMethod.PUT, "/api/books/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                // Sem login, a API responde 401 em vez de redirecionar para a tela do Google.
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));

        // Só liga o login com Google se as credenciais estiverem no .env.
        if (google.isEnabled()) {
            var clients = new InMemoryClientRegistrationRepository(google.clientRegistration());
            http.oauth2Login(oauth -> oauth
                    .clientRegistrationRepository(clients)
                    .authorizationEndpoint(endpoint -> endpoint
                            .authorizationRequestResolver(googleAccountChooser(clients)))
                    .successHandler(googleSuccessHandler));
        }

        return http.build();
    }

    // Faz o Google sempre mostrar a tela de escolher conta.
    private OAuth2AuthorizationRequestResolver googleAccountChooser(ClientRegistrationRepository clients) {
        var resolver = new DefaultOAuth2AuthorizationRequestResolver(clients,
                OAuth2AuthorizationRequestRedirectFilter.DEFAULT_AUTHORIZATION_REQUEST_BASE_URI);
        resolver.setAuthorizationRequestCustomizer(request -> request
                .additionalParameters(parameters -> parameters.put("prompt", "select_account")));
        return resolver;
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
