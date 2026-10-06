package br.com.dominadores.xopxe.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Documentação da API: /swagger-ui.html (JSON em /v3/api-docs). */
@Configuration
public class OpenApiConfig {

    public static final String SESSION_SCHEME = "sessao";

    @Bean
    public OpenAPI xopxeOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Xopxe API")
                        .version("v1")
                        .description("Faça login em POST /api/auth/login (admin@xopxe.com / password) "
                                + "e as rotas protegidas passam a funcionar nesta página."))
                .components(new Components().addSecuritySchemes(SESSION_SCHEME, new SecurityScheme()
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.COOKIE)
                        .name("JSESSIONID")));
    }
}
