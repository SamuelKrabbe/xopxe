package br.com.dominadores.xopxe.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public final class BookDtos {

	private BookDtos() {
	}

	/** FREE exige pdfUrl e PURCHASE exige purchaseUrl (checado no BookService). */
	public record CreateBookRequest(
			@NotBlank @Size(max = 200) String title,
			@NotBlank @Size(max = 160) String author,
			@NotBlank @Size(max = 160) String publisher,
			@NotBlank @Size(max = 60) String genre,
			@NotNull @PastOrPresent LocalDate publicationDate,
			@NotBlank String synopsis,
			@Size(max = 500) String coverUrl,
			@NotNull BookAccessType accessType,
			@Size(max = 1000) String pdfUrl,
			@Size(max = 1000) String purchaseUrl) {
	}

	public record BookResponse(
			Long id,
			String title,
			String author,
			String publisher,
			String genre,
			LocalDate publicationDate,
			String synopsis,
			String coverUrl,
			BookAccessType accessType,
			String pdfUrl,
			String purchaseUrl) {

		public static BookResponse from(Book book) {
			return new BookResponse(
					book.getId(),
					book.getTitle(),
					book.getAuthor(),
					book.getPublisher(),
					book.getGenre(),
					book.getPublicationDate(),
					book.getSynopsis(),
					book.getCoverUrl(),
					book.getAccessType(),
					book.getPdfUrl(),
					book.getPurchaseUrl());
		}
	}
}
