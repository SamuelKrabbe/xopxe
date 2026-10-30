package br.com.dominadores.xopxe.review;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.dominadores.xopxe.book.Book;
import br.com.dominadores.xopxe.book.BookService;
import br.com.dominadores.xopxe.review.ReviewDtos.ReviewSummary;
import br.com.dominadores.xopxe.review.ReviewDtos.SaveReviewRequest;
import br.com.dominadores.xopxe.user.Role;
import br.com.dominadores.xopxe.user.User;
import br.com.dominadores.xopxe.user.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

	@Mock
	private ReviewRepository reviewRepository;

	@Mock
	private BookService bookService;

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private ReviewService reviewService;

	private final Book book = new Book();
	private final User reader = new User(7L, "Leitor", "leitor@xopxe.com", null, Role.USER);

	@BeforeEach
	void setUp() {
		book.setId(1L);
	}

	@Test
	void saveCreatesReviewWhenReaderHasNone() {
		when(bookService.findById(1L)).thenReturn(book);
		when(userRepository.findByEmail("leitor@xopxe.com")).thenReturn(Optional.of(reader));
		when(reviewRepository.findByBookIdAndUserId(1L, 7L)).thenReturn(Optional.empty());
		when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var saved = reviewService.save(1L, "leitor@xopxe.com", new SaveReviewRequest(4, "  Gostei muito.  "));

		assertThat(saved.rating()).isEqualTo(4);
		assertThat(saved.comment()).isEqualTo("Gostei muito.");
		assertThat(saved.userId()).isEqualTo(7L);
	}

	@Test
	void saveReplacesTheReadersPreviousReview() {
		Review previous = review(2, "Achei fraco.");
		Instant createdAt = previous.getCreatedAt();
		when(bookService.findById(1L)).thenReturn(book);
		when(userRepository.findByEmail("leitor@xopxe.com")).thenReturn(Optional.of(reader));
		when(reviewRepository.findByBookIdAndUserId(1L, 7L)).thenReturn(Optional.of(previous));
		when(reviewRepository.save(previous)).thenReturn(previous);

		var saved = reviewService.save(1L, "leitor@xopxe.com", new SaveReviewRequest(5, " "));

		assertThat(saved.rating()).isEqualTo(5);
		assertThat(saved.comment()).isNull();
		assertThat(previous.getCreatedAt()).isEqualTo(createdAt);
		assertThat(previous.getUpdatedAt()).isAfter(createdAt);
	}

	@Test
	void summaryAveragesTheRatings() {
		when(reviewRepository.findByBookIdOrderByUpdatedAtDesc(1L)).thenReturn(List.of(review(5, null), review(2, null)));

		ReviewSummary summary = reviewService.summary(1L);

		assertThat(summary.average()).isEqualTo(3.5);
		assertThat(summary.count()).isEqualTo(2);
	}

	@Test
	void summaryHasNoAverageWithoutReviews() {
		when(reviewRepository.findByBookIdOrderByUpdatedAtDesc(1L)).thenReturn(List.of());

		assertThat(reviewService.summary(1L).average()).isNull();
	}

	@Test
	void deleteReturns404WhenReaderHasNoReview() {
		when(userRepository.findByEmail("leitor@xopxe.com")).thenReturn(Optional.of(reader));
		when(reviewRepository.findByBookIdAndUserId(1L, 7L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> reviewService.delete(1L, "leitor@xopxe.com"))
				.isInstanceOf(ResponseStatusException.class)
				.extracting(e -> ((ResponseStatusException) e).getStatusCode())
				.isEqualTo(HttpStatus.NOT_FOUND);
		verify(reviewRepository, never()).delete(any());
	}

	@Test
	void moderatorDeletesAnyReview() {
		Review someoneElses = review(1, "Spam");
		when(reviewRepository.findById(9L)).thenReturn(Optional.of(someoneElses));

		reviewService.deleteAsModerator(9L);

		verify(reviewRepository).delete(someoneElses);
	}

	@Test
	void moderatorGets404ForMissingReview() {
		when(reviewRepository.findById(9L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> reviewService.deleteAsModerator(9L))
				.isInstanceOf(ResponseStatusException.class)
				.extracting(e -> ((ResponseStatusException) e).getStatusCode())
				.isEqualTo(HttpStatus.NOT_FOUND);
		verify(reviewRepository, never()).delete(any());
	}

	private Review review(int rating, String comment) {
		Review review = new Review();
		review.setBook(book);
		review.setUser(reader);
		review.setRating(rating);
		review.setComment(comment);
		review.setCreatedAt(Instant.parse("2026-01-01T00:00:00Z"));
		review.setUpdatedAt(Instant.parse("2026-01-01T00:00:00Z"));
		return review;
	}
}
