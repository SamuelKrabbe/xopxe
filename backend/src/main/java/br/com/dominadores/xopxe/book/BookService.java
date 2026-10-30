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
		return bookRepository.findById(id).orElseThrow(BookService::notFound);
	}

	@Transactional
	public Book create(CreateBookRequest request) {
		Book book = new Book();
		apply(book, request);
		return bookRepository.save(book);
	}

	@Transactional
	public Book update(Long id, CreateBookRequest request) {
		Book book = findById(id); // 404 se não existir
		apply(book, request);
		return bookRepository.save(book);
	}

	@Transactional
	public void delete(Long id) {
		if (!bookRepository.existsById(id)) {
			throw notFound();
		}
		bookRepository.deleteById(id);
	}

	/**
	 * Valida os dados e copia para o livro. Usado pelo create e pelo update, para
	 * as duas operações seguirem exatamente as mesmas regras.
	 */
	private void apply(Book book, CreateBookRequest request) {
		// Valida tudo antes de mexer na entidade (no update ela já está gerenciada).
		String coverUrl = trimToNull(request.coverUrl());
		if (coverUrl != null && !isHttpUrl(coverUrl)) {
			throw badRequest("O endereço da capa deve ser uma URL HTTP ou HTTPS válida.");
		}

		// Guarda só o link que vale para o tipo de acesso; o outro fica null.
		// No update isso também limpa o link antigo ao trocar FREE <-> PURCHASE.
		String pdfUrl = null;
		String purchaseUrl = null;

		switch (request.accessType()) {
			case FREE -> {
				pdfUrl = trimToNull(request.pdfUrl());
				if (pdfUrl == null || !isHttpUrl(pdfUrl)) {
					throw badRequest("Um endereço de PDF válido é obrigatório para livros gratuitos.");
				}
			}
			case PURCHASE -> {
				purchaseUrl = trimToNull(request.purchaseUrl());
				if (purchaseUrl == null || !isHttpUrl(purchaseUrl)) {
					throw badRequest("Um endereço de compra válido é obrigatório para livros comerciais.");
				}
			}
		}

		book.setTitle(request.title().trim());
		book.setAuthor(request.author().trim());
		book.setPublisher(request.publisher().trim());
		book.setGenre(request.genre().trim());
		book.setPublicationDate(request.publicationDate());
		book.setSynopsis(request.synopsis().trim());
		book.setCoverUrl(coverUrl);
		book.setAccessType(request.accessType());
		book.setPdfUrl(pdfUrl);
		book.setPurchaseUrl(purchaseUrl);
	}

	private static ResponseStatusException notFound() {
		return new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado.");
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