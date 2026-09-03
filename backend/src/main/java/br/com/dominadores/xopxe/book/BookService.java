package br.com.dominadores.xopxe.book;

import br.com.dominadores.xopxe.book.BookDtos.CreateBookRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {

	private final BookRepository bookRepository;

	public List<Book> list(String query, String genre) {
		throw new UnsupportedOperationException("Não implementado.");
	}

	public Book findById(Long id) {
		throw new UnsupportedOperationException("Não implementado.");
	}

	public Book create(CreateBookRequest request) {
		throw new UnsupportedOperationException("Não implementado.");
	}
}
