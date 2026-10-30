import { request } from "./client";

// Qualquer um pode ver. Para salvar ou apagar precisa estar logado (senão dá 401).
export function fetchReviews(bookId) {
  return request("GET", `/api/books/${bookId}/reviews`);
}

export function saveReview(bookId, rating, comment) {
  return request("PUT", `/api/books/${bookId}/reviews/mine`, { rating, comment });
}

export function deleteReview(bookId) {
  return request("DELETE", `/api/books/${bookId}/reviews/mine`);
}

// Só o admin pode usar. Para os outros o backend responde 403.
export function moderateReview(reviewId) {
  return request("DELETE", `/api/reviews/${reviewId}`);
}
