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
			@NotBlank(message = "Informe o título.") @Size(max = 200, message = "O título deve ter no máximo 200 caracteres.") String title,
			@NotBlank(message = "Informe o autor.") @Size(max = 160, message = "O autor deve ter no máximo 160 caracteres.") String author,
			@NotBlank(message = "Informe a editora.") @Size(max = 160, message = "A editora deve ter no máximo 160 caracteres.") String publisher,
			@NotBlank(message = "Escolha o gênero.") @Size(max = 60, message = "O gênero deve ter no máximo 60 caracteres.") String genre,
			@NotNull(message = "Informe a data de publicação.") @PastOrPresent(message = "A data de publicação não pode ser no futuro.") LocalDate publicationDate,
			@NotBlank(message = "Informe a sinopse.") String synopsis,
			@Size(max = 500, message = "O link da capa deve ter no máximo 500 caracteres.") String coverUrl,
			@NotNull(message = "Escolha o tipo de acesso.") BookAccessType accessType,
			@Size(max = 1000, message = "O link do PDF deve ter no máximo 1000 caracteres.") String pdfUrl,
			@Size(max = 1000, message = "O link de compra deve ter no máximo 1000 caracteres.") String purchaseUrl) {
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
