package br.com.dominadores.xopxe.book;

import br.com.dominadores.xopxe.config.OpenApiConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Upload das capas. POST só ADMIN e GET liberado (regras de /api/books/** no SecurityConfig).
 */
@Tag(name = "Livros")
@RestController
@RequestMapping("/api/books/covers")
@RequiredArgsConstructor
public class CoverController {

	public static final String URL_PREFIX = "/api/books/covers/";
	public static final String URL_PATTERN = "/api/books/covers/\\d+";

	// Sem SVG, que pode ter JavaScript.
	private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

	private final CoverRepository coverRepository;

	@Operation(summary = "Envia uma imagem de capa e devolve o endereço dela (só ADMIN)")
	@SecurityRequirement(name = OpenApiConfig.SESSION_SCHEME)
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseStatus(HttpStatus.CREATED)
	public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
		if (file.isEmpty() || file.getContentType() == null || !ALLOWED_TYPES.contains(file.getContentType())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A capa deve ser uma imagem JPG, PNG, WEBP ou GIF.");
		}

		Cover cover = new Cover();
		cover.setContentType(file.getContentType());
		cover.setData(file.getBytes());
		cover = coverRepository.save(cover);

		return Map.of("url", URL_PREFIX + cover.getId());
	}

	@Operation(summary = "Devolve a imagem de uma capa enviada")
	@GetMapping("/{id}")
	public ResponseEntity<byte[]> get(@PathVariable Long id) {
		Cover cover = coverRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Capa não encontrada."));

		// A imagem de um id nunca muda. O navegador guarda por 30 dias.
		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(cover.getContentType()))
				.cacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic())
				.body(cover.getData());
	}
}
