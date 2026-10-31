package br.com.dominadores.xopxe.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.stereotype.Component;

/**
 * Credenciais do Google (GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env).
 * Sem elas o login com Google fica desligado.
 */
@Component
public class GoogleLoginSettings {

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;

    public GoogleLoginSettings(
            @Value("${xopxe.google.client-id}") String clientId,
            @Value("${xopxe.google.client-secret}") String clientSecret,
            @Value("${xopxe.google.redirect-uri}") String redirectUri) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }

    public boolean isEnabled() {
        return !clientId.isBlank() && !clientSecret.isBlank();
    }

    // Os endereços do Google já vêm prontos no Spring.
    public ClientRegistration clientRegistration() {
        var builder = CommonOAuth2Provider.GOOGLE.getBuilder("google")
                .clientId(clientId)
                .clientSecret(clientSecret);
        if (!redirectUri.isBlank()) {
            builder.redirectUri(redirectUri);
        }
        return builder.build();
    }
}
