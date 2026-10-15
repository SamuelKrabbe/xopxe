package br.com.dominadores.xopxe.book;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

	/** Os parâmetros já chegam em minúsculas; null desliga o filtro. */
	@Query("""
			select b from Book b
			where (:genre is null or lower(b.genre) = :genre)
			  and (:term is null or lower(b.title) like :term or lower(b.author) like :term)
			order by b.title
			""")
	List<Book> search(@Param("term") String term, @Param("genre") String genre);
}
