package br.com.dominadores.xopxe.book;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {

	// Finders de busca/filtro entram aqui (ex.: findByGenreIgnoreCase, ...).
}
