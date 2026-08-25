package br.com.dominadores.xopxe.config;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/**
 * Devolve um corpo simples ({"message": "..."}) nos erros da API, em vez da
 * resposta padrão do Spring — que em modo de desenvolvimento vem com a pilha
 * de exceção inteira.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> handleResponseStatus(ResponseStatusException exception) {
		String message = exception.getReason() != null ? exception.getReason() : "Erro inesperado.";

		return ResponseEntity.status(exception.getStatusCode()).body(Map.of("message", message));
	}
}
