import { useEffect, useState } from "react";
import {
  BooksCatalog,
  BooksInfo,
  DefaultInfo,
  Filters,
  SearchBar,
} from "../components";
import { findYearRange } from "../data/filter-options";
import { fetchBooks } from "../api/books";
import "../styles/MainPage.css";

const EMPTY_FILTERS = {
  genre: "",
  author: "",
  publisher: "",
  year: "",
};

function matchesSearch(book, search) {
  const term = search.trim().toLowerCase();

  if (term === "") {
    return true;
  }

  return (
    book.title.toLowerCase().includes(term) ||
    book.author.toLowerCase().includes(term)
  );
}

function matchesFilters(book, filters) {
  if (filters.genre !== "" && book.genre !== filters.genre) {
    return false;
  }

  if (filters.author !== "" && book.author !== filters.author) {
    return false;
  }

  if (filters.publisher !== "" && book.publisher !== filters.publisher) {
    return false;
  }

  if (filters.year !== "") {
    const range = findYearRange(filters.year);

    const bookYear = book.publicationDate ? parseInt(book.publicationDate.substring(0, 4)) : 0;

    if (bookYear < range.min || bookYear > range.max) {
      return false;
    }
  }

  return true;
}

export function MainPage({ user }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch((error) => setLoadError(error.message));
  }, []);

  const visibleBooks = books.filter(
    (book) => matchesSearch(book, search) && matchesFilters(book, filters),
  );

  function handleFilterChange(name, value) {
    setFilters((previous) => ({ ...previous, [name]: value }));
  }

  return (
    <main className="main-page">
      <div className="main-page__list">
        <SearchBar search={search} onSearchChange={setSearch} />

        <h2 className="main-page__section-title">Lançamentos</h2>

        {/* Mostra o erro da API, senão parecia que nenhum livro bateu com os filtros. */}
        {loadError ? (
          <p className="main-page__error" role="alert">
            {loadError} Recarregue a página para tentar de novo.
          </p>
        ) : (
          <BooksCatalog
            books={visibleBooks}
            selectedBook={selectedBook}
            onSelect={setSelectedBook}
          />
        )}
      </div>

      <aside className="main-page__side">
        <Filters
          books={books}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {selectedBook ? (
          <BooksInfo key={selectedBook.id} selectedBook={selectedBook} user={user} />
        ) : (
          <DefaultInfo books={books} />
        )}
      </aside>
    </main>
  );
}