package br.com.dominadores.xopxe.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class ReviewDtos {

	private ReviewDtos() {
	}

	public record SaveReviewRequest(
			@NotNull(message = "Escolha de 1 a 5 estrelas.") @Min(value = 1, message = "Escolha de 1 a 5 estrelas.") @Max(value = 5, message = "Escolha de 1 a 5 estrelas.") Integer rating,
			@Size(max = 1000, message = "O comentário deve ter no máximo 1000 caracteres.") String comment) {
	}

	/** O front usa o userId para achar a avaliação do usuário logado. */
	public record ReviewResponse(
			Long id,
			Long userId,
			String authorName,
			int rating,
			String comment,
			Instant updatedAt) {

		public static ReviewResponse from(Review review) {
			return new ReviewResponse(
					review.getId(),
					review.getUser().getId(),
					review.getUser().getName(),
					review.getRating(),
					review.getComment(),
					review.getUpdatedAt());
		}
	}

	/** average fica null se o livro ainda não tem avaliações. */
	public record ReviewSummary(Double average, int count, List<ReviewResponse> reviews) {
	}
}
