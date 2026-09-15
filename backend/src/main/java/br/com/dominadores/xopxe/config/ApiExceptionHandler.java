package br.com.dominadores.xopxe.config;

import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/**
 * Devolve um corpo simples ({"message": "..."}) nos erros da API, em vez da
 * resposta padrão do Spring.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatus(ResponseStatusException exception) {
        String message = exception.getReason() != null ? exception.getReason() : "Erro inesperado.";

        return ResponseEntity.status(exception.getStatusCode()).body(Map.of("message", message));
    }

    /**
     * Sem isto o @Valid devolve a resposta padrão do Spring, cuja mensagem é
     * "Validation failed for object='...'. Error count: 1" — o front mostra esse
     * texto ao usuário, que fica sem saber o que corrigir.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(" "));

        if (message.isBlank()) {
            message = "Confira os dados enviados.";
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }
}
