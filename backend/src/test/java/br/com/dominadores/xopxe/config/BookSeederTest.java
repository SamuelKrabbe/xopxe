package br.com.dominadores.xopxe.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.dominadores.xopxe.book.Book;
import br.com.dominadores.xopxe.book.BookDtos.CreateBookRequest;
import br.com.dominadores.xopxe.book.BookRepository;
import br.com.dominadores.xopxe.book.BookService;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.json.JsonMapper;

@ExtendWith(MockitoExtension.class)
class BookSeederTest {

	@Mock
	private BookRepository bookRepository;

	private BookSeeder bookSeeder;

	@BeforeEach
	void setUp() {
		bookSeeder = new BookSeeder(bookRepository, new BookService(bookRepository), JsonMapper.builder().build());
	}

	@Test
	void seedsEveryBookWhenTableIsEmpty() throws Exception {
		when(bookRepository.count()).thenReturn(0L);
		when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

		bookSeeder.run();

		verify(bookRepository, times(bookSeeder.readSeedFile().length)).save(any(Book.class));
	}

	@Test
	void skipsWhenTableAlreadyHasBooks() throws Exception {
		when(bookRepository.count()).thenReturn(3L);

		bookSeeder.run();

		verify(bookRepository, never()).save(any());
	}

	// Confere o arquivo contra as anotações do DTO (o @Valid só roda no controller).
	@Test
	void seedFileFollowsTheRequestConstraints() throws Exception {
		CreateBookRequest[] books = bookSeeder.readSeedFile();

		try (var factory = Validation.buildDefaultValidatorFactory()) {
			Validator validator = factory.getValidator();
			assertThat(books).isNotEmpty();
			assertThat(books).allSatisfy(book -> assertThat(validator.validate(book)).isEmpty());
		}
	}
}
