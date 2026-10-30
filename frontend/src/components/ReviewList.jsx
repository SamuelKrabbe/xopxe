import { useState } from "react";
import { moderateReview } from "../api/reviews";
import { stars } from "../data/stars";
import "../styles/Reviews.css";

const SHOWN_REVIEWS = 5;

export function ReviewList({ reviews, canModerate, onChange }) {
  const [error, setError] = useState("");

  async function handleRemove(review) {
    if (!window.confirm(`Remover a avaliação de ${review.authorName}?`)) return;

    try {
      await moderateReview(review.id);
      onChange();
    } catch (problem) {
      setError(problem.message);
    }
  }

  if (reviews.length === 0) {
    return <p className="book-info__empty">Nenhuma avaliação ainda.</p>;
  }

  return (
    <>
      {error && <p className="review-form__error" role="alert">{error}</p>}

      <ul className="review-list">
        {reviews.slice(0, SHOWN_REVIEWS).map((review) => (
          <li key={review.id} className="review review--stacked">
            <div className="review__header">
              <p className="review__reader">{review.authorName}</p>
              <span
                className="review__stars"
                role="img"
                aria-label={`${review.rating} de 5 estrelas`}
              >
                {stars(review.rating)}
              </span>
            </div>

            {review.comment && <p className="review__comment">{review.comment}</p>}

            <span className="review__date">
              {new Date(review.updatedAt).toLocaleDateString("pt-BR")}
            </span>

            {canModerate && (
              <button
                type="button"
                className="review__moderate"
                aria-label={`Remover a avaliação de ${review.authorName}`}
                onClick={() => handleRemove(review)}
              >
                Remover
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
