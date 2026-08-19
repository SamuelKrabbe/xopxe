export function SearchBar({ search, setSearch }) {
  return (
    <section className="w-full">
      {/* Search */}
      <div className="mb-3 flex h-9 border border-black">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquise uma obra"
          className="w-full bg-transparent px-4 font-serif text-sm outline-none placeholder:text-black/70"
        />

        <button
          type="button"
          className="border-l border-black px-5 font-serif text-sm uppercase tracking-wide transition-colors hover:bg-black hover:text-[#e8dfc8]"
        >
          Buscar
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-5 border border-black">
        <Filter
          label="Gênero"
          options={[
            "Todos",
            "Fantasia",
            "Romance",
            "Drama",
            "Ficção científica",
          ]}
        />

        <Filter
          label="Autor"
          options={[
            "Todos",
            "Machado de Assis",
            "George Orwell",
            "J. R. R. Tolkien",
          ]}
        />

        <Filter
          label="Editora"
          options={[
            "Todas",
            "Penguin",
            "Companhia das Letras",
            "Intrínseca",
          ]}
        />

        <Filter
          label="Ano de publicação"
          options={[
            "Todos",
            "2020–2026",
            "2000–2019",
            "1900–1999",
            "Antes de 1900",
          ]}
        />

        <Filter
          label="Classificação"
          options={[
            "Todas",
            "★★★★★",
            "★★★★☆",
            "★★★☆☆",
            "★★☆☆☆",
          ]}
        />
      </div>
    </section>
  );
}

function Filter({ label, options }) {
  return (
    <div className="relative border-r border-black last:border-r-0">
      <label className="block border-b border-black bg-[#d4c3a0] px-3 py-1 text-center font-serif text-[10px] font-bold uppercase tracking-wider">
        {label}
      </label>

      <select
        className="h-9 w-full cursor-pointer appearance-none bg-transparent px-3 text-center font-serif text-xs outline-none"
        defaultValue={options[0]}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute bottom-2 right-2 text-xs">
        ▾
      </span>
    </div>
  );
}
