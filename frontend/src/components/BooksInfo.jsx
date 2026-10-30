import { useEffect, useRef, useState } from "react";
import { fetchReviews } from "../api/reviews";
import { PdfReader } from "./PdfReader";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { stars } from "../data/stars";
import "../styles/BooksInfo.css";

export function BooksInfo({ selectedBook, user }) {
  const [reviews, setReviews] = useState(null);
  const [reviewsError, setReviewsError] = useState("");
  // Muda depois de salvar ou apagar uma avaliação, para recarregar a lista.
  const [reviewsVersion, setReviewsVersion] = useState(0);
  const [hasCover, setHasCover] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const panelRef = useRef(null);

  // No celular o painel fica embaixo da lista, então rola a tela até ele.
  // No computador ele já aparece do lado.
  useEffect(() => {
    const top = panelRef.current.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight / 2) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    fetchReviews(selectedBook.id)
      .then(setReviews)
      .catch((problem) => setReviewsError(problem.message));
  }, [selectedBook.id, reviewsVersion]);

  const myReview = reviews?.reviews.find((review) => review.userId === user?.id);

  return (
    <div className="book-info" ref={panelRef}>
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

              {reviews?.average != null ? (
                <span>
                  <span aria-hidden="true">{stars(reviews.average)} </span>
                  {reviews.average.toFixed(1).replace(".", ",")} de 5 ·{" "}
                  {reviews.count} {reviews.count === 1 ? "avaliação" : "avaliações"}
                </span>
              ) : (
                <span>{reviews ? "Sem avaliações ainda." : ""}</span>
              )}
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
                <dd>{selectedBook.publicationDate?.substring(0, 4) || "N/I"}</dd>
              </div>
            </dl>

            <div className="book-info__actions">
              {selectedBook.accessType === "FREE" ? (
                <button
                  type="button"
                  className="book-info__action"
                  onClick={() => setIsReading(true)}
                >
                  Ler agora
                </button>
              ) : (
                <a
                  className="book-info__action"
                  href={selectedBook.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Comprar
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="book-info__columns">
        <section className="panel">
          <h3 className="panel__title panel__title--small">
            Avaliações recentes
          </h3>
          {reviewsError ? (
            <p className="book-info__empty" role="alert">{reviewsError}</p>
          ) : (
            reviews && (
              <ReviewList
                reviews={reviews.reviews}
                canModerate={user?.role === "ADMIN"}
                onChange={() => setReviewsVersion((version) => version + 1)}
              />
            )
          )}
        </section>

        <section className="panel">
          <h3 className="panel__title panel__title--small">
            Faça sua avaliação
          </h3>
          {/* Espera carregar para o formulário já abrir com a avaliação do usuário. */}
          {reviews && (
            <ReviewForm
              key={user?.id ?? "anonymous"}
              bookId={selectedBook.id}
              user={user}
              myReview={myReview}
              onChange={() => setReviewsVersion((version) => version + 1)}
            />
          )}
        </section>
      </div>

      {isReading && (
        <PdfReader book={selectedBook} onClose={() => setIsReading(false)} />
      )}
    </div>
  );
}
