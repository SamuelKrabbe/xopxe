package br.com.dominadores.xopxe.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.stereotype.Component;

/**
 * Credenciais do Google (GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env).
 * Sem elas o sistema funciona normalmente, só sem o login com Google.
 */
@Component
public class GoogleLoginSettings {

    private final String clientId;
    private final String clientSecret;

    public GoogleLoginSettings(
            @Value("${xopxe.google.client-id}") String clientId,
            @Value("${xopxe.google.client-secret}") String clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public boolean isEnabled() {
        return !clientId.isBlank() && !clientSecret.isBlank();
    }

    // O Spring já conhece os endereços do Google; só falta o id e o segredo.
    public ClientRegistration clientRegistration() {
        return CommonOAuth2Provider.GOOGLE.getBuilder("google")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }
}
