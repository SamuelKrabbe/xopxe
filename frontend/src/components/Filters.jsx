import { books } from "../data/books-mock";
import { RATING_RANGES, YEAR_RANGES } from "../data/filter-options";
import "./Filters.css";

const ANY = "";

function uniqueValues(field) {
  const values = books.map((book) => book[field]);

  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function Filters({ filters, onFilterChange }) {
  return (
    <div className="filters">
      <FilterSelect
        id="genre"
        label="Gênero"
        anyLabel="Todos"
        value={filters.genre}
        options={uniqueValues("genre").map((genre) => ({
          value: genre,
          label: genre,
        }))}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="author"
        label="Autor"
        anyLabel="Todos"
        value={filters.author}
        options={uniqueValues("author").map((author) => ({
          value: author,
          label: author,
        }))}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="publisher"
        label="Editora"
        anyLabel="Todas"
        value={filters.publisher}
        options={uniqueValues("publisher").map((publisher) => ({
          value: publisher,
          label: publisher,
        }))}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="year"
        label="Ano de publicação"
        anyLabel="Todos"
        value={filters.year}
        options={YEAR_RANGES}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="rating"
        label="Classificação"
        anyLabel="Todas"
        value={filters.rating}
        options={RATING_RANGES}
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
