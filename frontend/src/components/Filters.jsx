import { RATING_RANGES, YEAR_RANGES } from "../data/filter-options";
import "../styles/Filters.css";

const ANY = "";
function traduzirGenero(generoOriginal) {
  if (!generoOriginal) return "Outros";
  
  const g = generoOriginal.toLowerCase();

  if (g.includes("juvenile")) return "Ficção Infantojuvenil";
  if (g.includes("fiction") || g.includes("ficção")) return "Ficção";
  
  if (g.includes("poetry") || g.includes("poesia")) return "Poesia";
  if (g.includes("biography") || g.includes("machado de assis")) return "Biografia";
  if (g.includes("history") || g.includes("história")) return "História";
  if (g.includes("philosophy") || g.includes("filosofia")) return "Filosofia";
  if (g.includes("business") || g.includes("economics")) return "Economia";
  if (g.includes("antiques") || g.includes("collectibles")) return "Antiguidades e Colecionáveis";
  
  // Adicionada a palavra "literary" para capturar "Literary Collections"
  if (g.includes("literatur") || g.includes("literary") || g.includes("authors") || g.includes("brasilianisch") || g.includes("criticism")) {
    return "Literatura";
  }

  return generoOriginal; 
}

function getGenreOptions(booksList) {
  if (!booksList) return [];

  // O Map garante que cada etiqueta em português (chave) só é registada uma única vez
  const categoriasUnicas = new Map();

  booksList.forEach(b => {
    if (!b.genre) return;
    const etiquetaTraduzida = traduzirGenero(b.genre);
    
    // Se a categoria traduzida ainda não estiver no Map, adicionamos juntamente com o valor original
    if (!categoriasUnicas.has(etiquetaTraduzida)) {
      categoriasUnicas.set(etiquetaTraduzida, b.genre);
    }
  });

  // Converte o Map de volta para a lista de opções do Select
  return Array.from(categoriasUnicas.entries()).map(([label, value]) => ({
    value: value,
    label: label
  })).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

// Função genérica para Autor e Editora (onde o valor é igual à tela)
function getOptions(booksList, field) {
  if (!booksList) return [];
  const values = [...new Set(booksList.map(b => b[field]).filter(Boolean))];
  
  return values.map(val => ({
    value: val,
    label: String(val)
  })).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

export function Filters({ books = [], filters, onFilterChange }) {
  return (
    <div className="filters">
      <FilterSelect
        id="genre"
        label="Gênero"
        anyLabel="Todos"
        value={filters.genre}
        options={getGenreOptions(books)}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="author"
        label="Autor"
        anyLabel="Todos"
        value={filters.author}
        options={getOptions(books, "author")}
        onChange={onFilterChange}
      />

      <FilterSelect
        id="publisher"
        label="Editora"
        anyLabel="Todas"
        value={filters.publisher}
        options={getOptions(books, "publisher")}
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