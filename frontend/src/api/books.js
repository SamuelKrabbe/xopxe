import { request } from "./client";

// Busca todos os livros. A busca e os filtros são feitos na própria tela (MainPage).
export function fetchBooks() {
  return request("GET", "/api/books");
}

// Guarda a lista no navegador para os livros aparecerem enquanto o Render acorda.
const SAVED_BOOKS_KEY = "xopxe-livros";

export function loadSavedBooks() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_BOOKS_KEY)) ?? [];
  } catch (error) {
    console.warn("Não foi possível ler os livros salvos.", error);
    return [];
  }
}

export function saveBooks(books) {
  try {
    localStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(books));
  } catch (error) {
    console.warn("Não foi possível salvar os livros no navegador.", error);
  }
}

export function fetchBookById(id) {
  return request("GET", `/api/books/${id}`);
}

export function createBook(bookData) {
  return request("POST", "/api/books", bookData);
}
