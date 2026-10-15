import { useState } from "react";
import {
  BooksCatalog,
  BooksInfo,
  DefaultInfo,
  Filters,
  SearchBar,
} from "../components";
import { books } from "../data/books-mock";
import { findRatingRange, findYearRange } from "../data/filter-options";
import "../styles/MainPage.css";

const EMPTY_FILTERS = {
  genre: "",
  author: "",
  publisher: "",
  year: "",
  rating: "",
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

    if (book.year < range.min || book.year > range.max) {
      return false;
    }
  }

  if (filters.rating !== "") {
    const range = findRatingRange(filters.rating);

    if (book.rating < range.min) {
      return false;
    }
  }

  return true;
}

export function MainPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedBook, setSelectedBook] = useState(null);

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

        <BooksCatalog
          books={visibleBooks}
          selectedBook={selectedBook}
          onSelect={setSelectedBook}
        />
      </div>

      <aside className="main-page__side">
        <Filters filters={filters} onFilterChange={handleFilterChange} />

        {selectedBook ? (
          <BooksInfo selectedBook={selectedBook} />
            ) : (
              <DefaultInfo />
            )}
      </aside>
    </main>
  );
}
