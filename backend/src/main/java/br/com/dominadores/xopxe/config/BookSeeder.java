package br.com.dominadores.xopxe.config;

import br.com.dominadores.xopxe.book.BookDtos.CreateBookRequest;
import br.com.dominadores.xopxe.book.BookRepository;
import br.com.dominadores.xopxe.book.BookService;
import java.io.IOException;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.json.JsonMapper;

/**
 * Preenche o banco com os livros de seed/books.json se não tiver nenhum livro.
 * Esse arquivo é gerado pelo frontend/importador.js.
 */
@Component
@RequiredArgsConstructor
public class BookSeeder implements CommandLineRunner {

    static final String SEED_FILE = "seed/books.json";

    private final BookRepository bookRepository;
    private final BookService bookService;
    private final JsonMapper jsonMapper;

    // Tudo numa transação só: se um livro der erro, nenhum é salvo e ele tenta
    // de novo na próxima vez que o backend subir.
    @Override
    @Transactional
    public void run(String... args) throws IOException {
        if (bookRepository.count() > 0) {
            return;
        }

        // Usa o BookService para passar pela mesma validação do cadastro.
        for (CreateBookRequest book : readSeedFile()) {
            bookService.create(book);
        }
    }

    CreateBookRequest[] readSeedFile() throws IOException {
        try (InputStream input = new ClassPathResource(SEED_FILE).getInputStream()) {
            return jsonMapper.readValue(input, CreateBookRequest[].class);
        }
    }
}
