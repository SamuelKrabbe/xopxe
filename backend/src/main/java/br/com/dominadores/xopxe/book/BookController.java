package br.com.dominadores.xopxe.book;

import br.com.dominadores.xopxe.book.BookDtos.BookResponse;
import br.com.dominadores.xopxe.book.BookDtos.CreateBookRequest;
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

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

	private final BookService bookService;

	/** GET /api/books?q=...&genre=... — aberto a todos (ver SecurityConfig). */
	@GetMapping
	public List<BookResponse> list(
			@RequestParam(required = false) String q,
			@RequestParam(required = false) String genre) {
		return bookService.list(q, genre).stream().map(BookResponse::from).toList();
	}

	@GetMapping("/{id}")
	public BookResponse getById(@PathVariable Long id) {
		return BookResponse.from(bookService.findById(id));
	}

	/** POST /api/books — só administrador. */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public BookResponse create(@Valid @RequestBody CreateBookRequest request) {
		return BookResponse.from(bookService.create(request));
	}
}
