package br.com.dominadores.xopxe.book;

import br.com.dominadores.xopxe.book.BookDtos.CreateBookRequest;
import java.net.URI;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

	private final BookRepository bookRepository;

	public List<Book> list(String query, String genre) {
		String term = isBlank(query) ? null : "%" + query.trim().toLowerCase(Locale.ROOT) + "%";
		String normalizedGenre = isBlank(genre) ? null : genre.trim().toLowerCase(Locale.ROOT);
		return bookRepository.search(term, normalizedGenre);
	}

	public Book findById(Long id) {
		return bookRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado."));
	}

	@Transactional
	public Book create(CreateBookRequest request) {
		String coverUrl = trimToNull(request.coverUrl());
		if (coverUrl != null && !isHttpUrl(coverUrl)) {
			throw badRequest("O endereço da capa deve ser uma URL HTTP ou HTTPS válida.");
		}

		Book book = new Book();
		book.setTitle(request.title().trim());
		book.setAuthor(request.author().trim());
		book.setPublisher(request.publisher().trim());
		book.setGenre(request.genre().trim());
		book.setPublicationDate(request.publicationDate());
		book.setSynopsis(request.synopsis().trim());
		book.setCoverUrl(coverUrl);
		book.setAccessType(request.accessType());

		// Guarda só o link que vale para o tipo de acesso; o outro é descartado.
		switch (request.accessType()) {
			case FREE -> {
				String pdfUrl = trimToNull(request.pdfUrl());
				if (pdfUrl == null || !isHttpUrl(pdfUrl)) {
					throw badRequest("Um endereço de PDF válido é obrigatório para livros gratuitos.");
				}
				book.setPdfUrl(pdfUrl);
			}
			case PURCHASE -> {
				String purchaseUrl = trimToNull(request.purchaseUrl());
				if (purchaseUrl == null || !isHttpUrl(purchaseUrl)) {
					throw badRequest("Um endereço de compra válido é obrigatório para livros comerciais.");
				}
				book.setPurchaseUrl(purchaseUrl);
			}
		}

		return bookRepository.save(book);
	}

	private static ResponseStatusException badRequest(String message) {
		return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
	}

	private static String trimToNull(String value) {
		return isBlank(value) ? null : value.trim();
	}

	private static boolean isBlank(String value) {
		return value == null || value.isBlank();
	}

	private static boolean isHttpUrl(String value) {
		try {
			URI uri = URI.create(value);
			String scheme = uri.getScheme();
			return uri.getHost() != null
					&& ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme));
		} catch (IllegalArgumentException exception) {
			return false;
		}
	}
}
