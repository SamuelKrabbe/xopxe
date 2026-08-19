import { books } from "../data/books-mock";

function BookCard({ book, onClick }) {
  return (
    <article
      onClick={() => onClick(book)}
      className="group cursor-pointer border border-black/30 bg-[#e8dfc8] p-4 shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
    >
      <div className="flex gap-4">
        <div className="h-44 w-28 shrink-0 overflow-hidden border border-black/40 bg-[#d2c6aa]">
          <img
            src={book.cover}
            alt={`Capa de ${book.title}`}
            className="h-full w-full object-cover grayscale-[20%] sepia-[20%]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="mb-1 font-serif text-xs uppercase tracking-[0.2em] text-black/60">
            {book.genre}
          </p>

          <h2 className="font-serif text-2xl font-bold leading-tight text-[#211e18]">
            {book.title}
          </h2>

          <p className="mt-1 font-serif text-sm italic text-black/70">
            {book.author}
          </p>

          <div className="my-3 border-t border-black/20" />

          <p className="font-serif text-xs text-black/60">
            Publicado em {book.year}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="font-serif text-sm font-bold">
              ★ {book.rating}
            </span>

            <span className="font-serif text-xs text-black/60">
              {book.pages} páginas
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t-2 border-black/70 pt-2">
        <span className="font-serif text-[10px] uppercase tracking-[0.25em] text-black/60">
          Ler • Avaliar • Descobrir
        </span>
      </div>
    </article>
  );
}

export function BooksCatalog({ search, onClick }) {
  return (
    <section>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={onClick}
        />
      ))}
    </section>
  )
}
