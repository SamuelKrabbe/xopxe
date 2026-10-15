package br.com.dominadores.xopxe.book;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Livro não encontrado."
                ));
    }

    @Transactional
    public Book create(Book book) {
        book.setId(null);
        validateBook(book);
        return bookRepository.save(book);
    }

    private void validateBook(Book book) {
        if (book.getTitle() == null || book.getTitle().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O título do livro é obrigatório."
            );
        }

        if (book.getAuthor() == null || book.getAuthor().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O autor do livro é obrigatório."
            );
        }

        if (book.getAccessType() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O tipo de acesso é obrigatório."
            );
        }

        if (book.getAccessType() == BookAccessType.FREE) {
            if (!isValidUrl(book.getPdfUrl())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Um endereço de PDF válido é obrigatório para livros gratuitos."
                );
            }
            book.setPurchaseUrl(null);
        }

        if (book.getAccessType() == BookAccessType.PURCHASE) {
            if (!isValidUrl(book.getPurchaseUrl())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Um endereço de compra válido é obrigatório para livros comerciais."
                );
            }
            book.setPdfUrl(null);
        }

        if (book.getCoverUrl() != null && !book.getCoverUrl().isBlank()
                && !isValidUrl(book.getCoverUrl())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O endereço da capa deve ser uma URL HTTP ou HTTPS válida."
            );
        }
    }

    private boolean isValidUrl(String value) {
        if (value == null || value.isBlank()) {
            return false;
        }

        try {
            java.net.URI uri = java.net.URI.create(value.trim());
            String scheme = uri.getScheme();

            return uri.isAbsolute()
                    && uri.getHost() != null
                    && ("https".equalsIgnoreCase(scheme)
                    || "http".equalsIgnoreCase(scheme));
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }
}