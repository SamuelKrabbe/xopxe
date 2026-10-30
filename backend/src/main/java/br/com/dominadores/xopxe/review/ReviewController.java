package br.com.dominadores.xopxe.review;

import br.com.dominadores.xopxe.config.OpenApiConfig;
import br.com.dominadores.xopxe.review.ReviewDtos.ReviewResponse;
import br.com.dominadores.xopxe.review.ReviewDtos.ReviewSummary;
import br.com.dominadores.xopxe.review.ReviewDtos.SaveReviewRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Ver as avaliações é liberado para todos. Para avaliar precisa estar logado,
 * e apagar a avaliação de outra pessoa (DELETE /api/reviews/{id}) só o admin pode.
 */
@Tag(name = "Avaliações")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewService reviewService;

	@Operation(summary = "Média e avaliações de um livro, das mais recentes para as mais antigas")
	@GetMapping("/books/{bookId}/reviews")
	public ReviewSummary list(@PathVariable Long bookId) {
		return reviewService.summary(bookId);
	}

	@Operation(summary = "Cria ou atualiza a avaliação de quem está logado")
	@SecurityRequirement(name = OpenApiConfig.SESSION_SCHEME)
	@PutMapping("/books/{bookId}/reviews/mine")
	public ReviewResponse save(@PathVariable Long bookId, @Valid @RequestBody SaveReviewRequest request,
			Principal principal) {
		return reviewService.save(bookId, principal.getName(), request);
	}

	@Operation(summary = "Apaga a avaliação de quem está logado")
	@SecurityRequirement(name = OpenApiConfig.SESSION_SCHEME)
	@DeleteMapping("/books/{bookId}/reviews/mine")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long bookId, Principal principal) {
		reviewService.delete(bookId, principal.getName());
	}

	@Operation(summary = "Moderação: o admin apaga a avaliação de qualquer leitor")
	@SecurityRequirement(name = OpenApiConfig.SESSION_SCHEME)
	@DeleteMapping("/reviews/{reviewId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void moderate(@PathVariable Long reviewId) {
		reviewService.deleteAsModerator(reviewId);
	}
}
