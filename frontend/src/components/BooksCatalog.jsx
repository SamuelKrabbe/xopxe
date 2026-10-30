import { useState } from "react";
import "../styles/BooksCatalog.css";

export function BooksCatalog({ books, selectedBook, onSelect }) {
  if (books.length === 0) {
    return (
      <p className="catalog__empty" role="status">
        Nenhuma obra encontrada com esses filtros.
      </p>
    );
  }

  return (
    <ul className="catalog">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard
            book={book}
            isSelected={book.id === selectedBook?.id}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}

function BookCard({ book, isSelected, onSelect }) {
  const [hasCover, setHasCover] = useState(true);

  return (
    <button
      type="button"
      className={isSelected ? "book-card book-card--selected" : "book-card"}
      aria-pressed={isSelected}
      onClick={() => onSelect(book)}
    >
      <div className="book-card__cover">
        {hasCover && book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Capa de ${book.title}`}
            onError={() => setHasCover(false)}
          />
        ) : (
          <span className="book-card__cover-fallback">Capa</span>
        )}
      </div>

      <div className="book-card__info">
        <h3 className="book-card__title">{book.title}</h3>

        <p className="book-card__line">{book.publicationDate?.substring(0, 4)}</p>

        <p className="book-card__line">{book.author}</p>

        <p className="book-card__line">{book.publisher}</p>
      </div>
    </button>
  );
}
