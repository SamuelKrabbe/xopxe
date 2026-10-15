import { useState } from "react";
import "../styles/BooksInfo.css";

export function BooksInfo({ selectedBook }) {
  const rating = Math.round(selectedBook.rating);

  const stars =
    "★".repeat(rating) +
    "☆".repeat(5 - rating);

  const [userRating, setUserRating] = useState(0);
  const [hasCover, setHasCover] = useState(true);

  return (
    <div className="book-info">

      <section className="panel">
        <div className="book-info__top">

          {hasCover && selectedBook.cover ? (
            <img
              className="book-info__cover"
              src={selectedBook.cover}
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

              <span className="stars">
                {stars}
              </span>

              <span>
                {selectedBook.rating}
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
                <dd>{selectedBook.genre}</dd>
              </div>

              <div>
                <dt>Ano</dt>
                <dd>{selectedBook.year}</dd>
              </div>

              <div>
                <dt>Páginas</dt>
                <dd>{selectedBook.pages}</dd>
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
                onClick={() => setUserRating(star)}
              >
                {star <= userRating ? "★" : "☆"}
              </button>
            ))}

          </div>

        </section>

      </div>

    </div>
  );
}
