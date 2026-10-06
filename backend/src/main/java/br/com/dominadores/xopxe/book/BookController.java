package br.com.dominadores.xopxe.book;

import br.com.dominadores.xopxe.book.BookDtos.BookResponse;
import br.com.dominadores.xopxe.book.BookDtos.CreateBookRequest;
import br.com.dominadores.xopxe.config.OpenApiConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Livros")
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

	private final BookService bookService;

	/** GET /api/books?q=...&genre=... — aberto a todos (ver SecurityConfig). */
	@Operation(summary = "Lista os livros, com busca e filtro por gênero opcionais")
	@GetMapping
	public List<BookResponse> list(
			@RequestParam(required = false) String q,
			@RequestParam(required = false) String genre) {
		return bookService.list(q, genre).stream().map(BookResponse::from).toList();
	}

	@Operation(summary = "Busca um livro pelo id")
	@GetMapping("/{id}")
	public BookResponse getById(@PathVariable Long id) {
		return BookResponse.from(bookService.findById(id));
	}

	/** POST /api/books — só administrador. */
	@Operation(summary = "Cadastra um livro (só ADMIN)")
	@SecurityRequirement(name = OpenApiConfig.SESSION_SCHEME)
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public BookResponse create(@Valid @RequestBody CreateBookRequest request) {
		return BookResponse.from(bookService.create(request));
	}
}
