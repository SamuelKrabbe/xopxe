import { useState } from "react";
import { deleteReview, saveReview } from "../api/reviews";
import "../styles/Reviews.css";

// myReview só é lido quando o formulário é criado. Quando o usuário muda,
// o BooksInfo troca a key e o formulário é criado de novo.
export function ReviewForm({ bookId, user, myReview, onChange }) {
  const [rating, setRating] = useState(myReview?.rating ?? 0);
  const [comment, setComment] = useState(myReview?.comment ?? "");
  const [hasReview, setHasReview] = useState(Boolean(myReview));
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!user) {
    return <p className="book-info__empty">Entre na sua conta para avaliar.</p>;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (rating === 0) {
      setError("Escolha de 1 a 5 estrelas.");
      return;
    }

    setIsSending(true);
    setError("");
    setStatus("");

    try {
      await saveReview(bookId, rating, comment);
      setHasReview(true);
      setStatus("Avaliação salva.");
      onChange();
    } catch (problem) {
      setError(problem.message);
    } finally {
      setIsSending(false);
    }
  }

  async function handleDelete() {
    setIsSending(true);
    setError("");
    setStatus("");

    try {
      await deleteReview(bookId);
      setRating(0);
      setComment("");
      setHasReview(false);
      setStatus("Avaliação apagada.");
      onChange();
    } catch (problem) {
      setError(problem.message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="star-picker" role="group" aria-label="Sua nota">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="star-picker__star"
            aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
            aria-pressed={star <= rating}
            onClick={() => {
              setRating(star);
              setError("");
            }}
          >
            <span aria-hidden="true">{star <= rating ? "★" : "☆"}</span>
          </button>
        ))}
      </div>

      <label className="review-form__label" htmlFor={`review-comment-${bookId}`}>
        Comentário (opcional)
      </label>
      <textarea
        id={`review-comment-${bookId}`}
        className="review-form__comment"
        value={comment}
        maxLength={1000}
        onChange={(event) => setComment(event.target.value)}
      />

      {error && <p className="review-form__error" role="alert">{error}</p>}
      {status && <p className="review-form__status" role="status">{status}</p>}

      <div className="review-form__actions">
        <button type="submit" className="book-info__action" disabled={isSending}>
          {hasReview ? "Atualizar" : "Enviar"}
        </button>

        {hasReview && (
          <button
            type="button"
            className="review-form__delete"
            disabled={isSending}
            onClick={handleDelete}
          >
            Apagar
          </button>
        )}
      </div>
    </form>
  );
}
