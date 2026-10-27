import { useState } from "react";
import "../styles/BooksInfo.css";


function traduzirGenero(generoOriginal) {
  if (!generoOriginal) return "N/I";
  
  const g = generoOriginal.toLowerCase();

  if (g.includes("juvenile")) return "Ficção Infantojuvenil";
  if (g.includes("fiction") || g.includes("ficção")) return "Ficção";
  if (g.includes("poetry") || g.includes("poesia")) return "Poesia";
  if (g.includes("biography") || g.includes("machado de assis")) return "Biografia";
  if (g.includes("history") || g.includes("história")) return "História";
  if (g.includes("philosophy") || g.includes("filosofia")) return "Filosofia";
  if (g.includes("business") || g.includes("economics")) return "Economia";
  if (g.includes("antiques") || g.includes("collectibles")) return "Antiguidades e Colecionáveis";
  
  if (g.includes("literatur") || g.includes("literary") || g.includes("authors") || g.includes("brasilianisch") || g.includes("criticism")) {
    return "Literatura";
  }

  return generoOriginal; 
}

export function BooksInfo({ selectedBook }) {
  const safeRating = selectedBook.rating || 5.0;
  const rating = Math.round(safeRating);

  const stars =
    "★".repeat(rating) +
    "☆".repeat(5 - rating);

  const [userRating, setUserRating] = useState(0);
  const [hasCover, setHasCover] = useState(true);

  return (
    <div className="book-info">
      <section className="panel">
        <div className="book-info__top">

          {hasCover && selectedBook.coverUrl ? (
            <img
              className="book-info__cover"
              src={selectedBook.coverUrl}
              alt={`Capa de ${selectedBook.title}`}
              onError={() => setHasCover(false)}
            />
          ) : (
            <div className="book-info__cover book-info__cover-fallback">
              Capa 
            </div>
          )}

          <div className="book-info__details">
            <div className="book-info__rating">
              <h2 className="panel__title">
                Classificação
              </h2>

              <span className="stars" role="img" aria-label={`${safeRating.toFixed(1).replace(".", ",")} de 5 estrelas`}>
                {stars}
              </span>

              <span aria-hidden="true">
                {safeRating.toFixed(1).replace(".", ",")}
              </span>
            </div>

            <h3 className="book-info__label">
              Sinopse
            </h3>

            <p className="book-info__synopsis">
              {selectedBook.synopsis ?? "Sinopse não disponível."}
            </p>

            <dl className="book-info__meta">
              <div>
                <dt>Autor</dt>
                <dd>{selectedBook.author}</dd>
              </div>

              <div>
                <dt>Editora</dt>
                <dd>{selectedBook.publisher}</dd>
              </div>

              <div>
                <dt>Gênero</dt>
                <dd>{traduzirGenero(selectedBook.genre)}</dd>
              </div>

              <div>
                <dt>Ano</dt>
                <dd>{selectedBook.publicationDate?.substring(0, 4) || "N/I"}</dd>
              </div>

              <div>
                <dt>Páginas</dt>
                <dd>{selectedBook.pages || "N/I"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="book-info__columns">
        <section className="panel">
          <h3 className="panel__title panel__title--small">
            Avaliações recentes
          </h3>
          <p className="book-info__empty">
            Nenhuma avaliação ainda.
          </p>
        </section>

        <section className="panel">
          <h3 className="panel__title panel__title--small">
            Faça sua avaliação
          </h3>
          <div className="star-picker">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="star-picker__star"
                aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
                aria-pressed={star <= userRating}
                onClick={() => setUserRating(star)}
              >
                <span aria-hidden="true">{star <= userRating ? "★" : "☆"}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}