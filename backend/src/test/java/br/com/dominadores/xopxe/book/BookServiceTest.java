package br.com.dominadores.xopxe.book;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.dominadores.xopxe.book.BookDtos.CreateBookRequest;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

	@Mock
	private BookRepository bookRepository;

	@InjectMocks
	private BookService bookService;

	@Test
	void listNormalizesFilters() {
		bookService.list("  Tolkien ", " Fantasia ");

		verify(bookRepository).search("%tolkien%", "fantasia");
	}

	@Test
	void listWithBlankFiltersReturnsEverything() {
		bookService.list(" ", null);

		verify(bookRepository).search(null, null);
	}

	@Test
	void findByIdReturns404WhenMissing() {
		when(bookRepository.findById(42L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> bookService.findById(42L))
				.isInstanceOf(ResponseStatusException.class)
				.extracting(e -> ((ResponseStatusException) e).getStatusCode())
				.isEqualTo(HttpStatus.NOT_FOUND);
	}

	@Test
	void createFreeBookKeepsOnlyPdfUrl() {
		when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

		Book saved = bookService.create(request(" https://exemplo.com/capa.png ", BookAccessType.FREE,
				" https://exemplo.com/hobbit.pdf ", "https://loja.com/hobbit"));

		assertThat(saved.getId()).isNull();
		assertThat(saved.getTitle()).isEqualTo("O Hobbit");
		assertThat(saved.getCoverUrl()).isEqualTo("https://exemplo.com/capa.png");
		assertThat(saved.getAccessType()).isEqualTo(BookAccessType.FREE);
		assertThat(saved.getPdfUrl()).isEqualTo("https://exemplo.com/hobbit.pdf");
		assertThat(saved.getPurchaseUrl()).isNull();
	}

	@Test
	void createPurchaseBookKeepsOnlyPurchaseUrl() {
		when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

		Book saved = bookService.create(request("  ", BookAccessType.PURCHASE,
				"https://exemplo.com/hobbit.pdf", "https://loja.com/hobbit"));

		assertThat(saved.getCoverUrl()).isNull();
		assertThat(saved.getPdfUrl()).isNull();
		assertThat(saved.getPurchaseUrl()).isEqualTo("https://loja.com/hobbit");
	}

	@Test
	void createFreeBookWithoutPdfIsRejected() {
		assertBadRequest(request(null, BookAccessType.FREE, " ", "https://loja.com/hobbit"));
	}

	@Test
	void createPurchaseBookWithInvalidLinkIsRejected() {
		assertBadRequest(request(null, BookAccessType.PURCHASE, null, "loja.com/hobbit"));
	}

	@Test
	void createRejectsNonHttpCover() {
		assertBadRequest(request("javascript:alert(1)", BookAccessType.FREE, "https://exemplo.com/hobbit.pdf", null));
	}

	@Test
	void createAcceptsUploadedCover() {
		when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

		Book saved = bookService.create(request("/api/books/covers/7", BookAccessType.PURCHASE, null, "https://loja.com/hobbit"));

		assertThat(saved.getCoverUrl()).isEqualTo("/api/books/covers/7");
	}

	@Test
	void createRejectsOtherLocalPaths() {
		assertBadRequest(request("/api/books/covers/../../auth/logout", BookAccessType.PURCHASE, null, "https://loja.com/hobbit"));
	}

	private void assertBadRequest(CreateBookRequest request) {
		assertThatThrownBy(() -> bookService.create(request))
				.isInstanceOf(ResponseStatusException.class)
				.extracting(e -> ((ResponseStatusException) e).getStatusCode())
				.isEqualTo(HttpStatus.BAD_REQUEST);

		verify(bookRepository, never()).save(any());
	}

	private static CreateBookRequest request(String coverUrl, BookAccessType accessType, String pdfUrl,
			String purchaseUrl) {
		return new CreateBookRequest(
				" O Hobbit ",
				"J. R. R. Tolkien",
				"HarperCollins",
				"Fantasia",
				LocalDate.of(1937, 9, 21),
				"Bilbo sai de casa.",
				coverUrl,
				accessType,
				pdfUrl,
				purchaseUrl);
	}
}
