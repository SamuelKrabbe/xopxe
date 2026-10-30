package br.com.dominadores.xopxe.review;

import br.com.dominadores.xopxe.book.Book;
import br.com.dominadores.xopxe.book.BookService;
import br.com.dominadores.xopxe.review.ReviewDtos.ReviewResponse;
import br.com.dominadores.xopxe.review.ReviewDtos.ReviewSummary;
import br.com.dominadores.xopxe.review.ReviewDtos.SaveReviewRequest;
import br.com.dominadores.xopxe.user.User;
import br.com.dominadores.xopxe.user.UserRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

	private final ReviewRepository reviewRepository;
	private final BookService bookService;
	private final UserRepository userRepository;

	public ReviewSummary summary(Long bookId) {
		bookService.findById(bookId);

		List<Review> reviews = reviewRepository.findByBookIdOrderByUpdatedAtDesc(bookId);
		Double average = reviews.isEmpty()
				? null
				: reviews.stream().mapToInt(Review::getRating).average().orElseThrow();

		return new ReviewSummary(average, reviews.size(), reviews.stream().map(ReviewResponse::from).toList());
	}

	/** Cria a avaliação, ou atualiza se o usuário já tinha avaliado esse livro. */
	@Transactional
	public ReviewResponse save(Long bookId, String email, SaveReviewRequest request) {
		Book book = bookService.findById(bookId);
		User user = currentUser(email);
		Instant now = Instant.now();

		Review review = reviewRepository.findByBookIdAndUserId(bookId, user.getId()).orElseGet(() -> {
			Review created = new Review();
			created.setBook(book);
			created.setUser(user);
			created.setCreatedAt(now);
			return created;
		});
		review.setRating(request.rating());
		review.setComment(request.comment() == null || request.comment().isBlank() ? null : request.comment().trim());
		review.setUpdatedAt(now);

		return ReviewResponse.from(reviewRepository.save(review));
	}

	@Transactional
	public void delete(Long bookId, String email) {
		User user = currentUser(email);
		Review review = reviewRepository.findByBookIdAndUserId(bookId, user.getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Você ainda não avaliou este livro."));

		reviewRepository.delete(review);
	}

	/** Usado pelo admin para apagar a avaliação de qualquer pessoa. */
	@Transactional
	public void deleteAsModerator(Long reviewId) {
		Review review = reviewRepository.findById(reviewId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada."));

		reviewRepository.delete(review);
	}

	// A sessão guarda o e-mail. A conta pode ter sido apagada depois do login.
	private User currentUser(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Entre na sua conta para avaliar."));
	}
}
