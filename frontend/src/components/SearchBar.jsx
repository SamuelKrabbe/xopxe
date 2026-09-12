import "../styles/SearchBar.css";

export function SearchBar({ search, onSearchChange }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        className="search-bar__input"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Pesquise uma obra"
        aria-label="Pesquise uma obra"
      />

      {search && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onSearchChange("")}
        >
          Limpar
        </button>
      )}
    </div>
  );
}
