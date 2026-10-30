import { request } from "./client";

// Busca todos os livros. A busca e os filtros são feitos na própria tela (MainPage).
export function fetchBooks() {
  return request("GET", "/api/books");
}

export function fetchBookById(id) {
  return request("GET", `/api/books/${id}`);
}

export function createBook(bookData) {
  return request("POST", "/api/books", bookData);
}
