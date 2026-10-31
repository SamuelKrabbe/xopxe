import { YEAR_RANGES } from "../data/filter-options";
import "../styles/Filters.css";

const ANY = "";

function uniqueOptions(books, field) {
  const values = [...new Set(books.map((book) => book[field]).filter(Boolean))];

  return values
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((value) => ({ value, label: value }));
}

// Só mostra as faixas que têm algum livro.
function yearOptions(books) {
  const years = books.map((book) => Number(book.publicationDate?.substring(0, 4)));

  return YEAR_RANGES.filter((range) =>
    years.some((year) => year >= range.min && year <= range.max),
  );
}

export function Filters({ books = [], filters, onFilterChange }) {
  return (
    <div className="filters">
      <FilterSelect
        id="genre"
        label="Gênero"
        anyLabel="Todos"
        value={filters.genre}
        options={uniqueOptions(books, "genre")}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="author"
        label="Autor"
        anyLabel="Todos"
        value={filters.author}
        options={uniqueOptions(books, "author")}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="publisher"
        label="Editora"
        anyLabel="Todas"
        value={filters.publisher}
        options={uniqueOptions(books, "publisher")}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="year"
        label="Ano de publicação"
        anyLabel="Todos"
        value={filters.year}
        options={yearOptions(books)}
        onChange={onFilterChange}
      />
    </div>
  );
}

function FilterSelect({ id, label, anyLabel, value, options, onChange }) {
  return (
    <div className="filters__item">
      <label className="filters__label" htmlFor={`filter-${id}`}>
        {label}
      </label>

      <select
        id={`filter-${id}`}
        className="filters__select"
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
      >
        <option value={ANY}>{anyLabel}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}