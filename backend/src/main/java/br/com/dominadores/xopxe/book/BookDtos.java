package br.com.dominadores.xopxe.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public final class BookDtos {

	private BookDtos() {
	}

	public record CreateBookRequest(
			@NotBlank @Size(max = 200) String title,
			@NotBlank @Size(max = 160) String author,
			@NotBlank @Size(max = 160) String publisher,
			@NotBlank @Size(max = 60) String genre,
			@NotNull @PastOrPresent LocalDate publicationDate,
			@NotBlank String synopsis,
			@Size(max = 500) String coverUrl) {
	}

	public record BookResponse(
			Long id,
			String title,
			String author,
			String publisher,
			String genre,
			LocalDate publicationDate,
			String synopsis,
			String coverUrl) {

		public static BookResponse from(Book book) {
			return new BookResponse(
					book.getId(),
					book.getTitle(),
					book.getAuthor(),
					book.getPublisher(),
					book.getGenre(),
					book.getPublicationDate(),
					book.getSynopsis(),
					book.getCoverUrl());
		}
	}
}
