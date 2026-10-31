package br.com.dominadores.xopxe.review;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	/** Busca o usuário junto, na mesma consulta. */
	@EntityGraph(attributePaths = "user")
	List<Review> findByBookIdOrderByUpdatedAtDesc(Long bookId);

	Optional<Review> findByBookIdAndUserId(Long bookId, Long userId);
}
