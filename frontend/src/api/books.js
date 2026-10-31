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

// Atualiza um livro existente. O id identifica a obra no banco.
export function updateBook(id, bookData) {
  return request("PUT", `/api/books/${id}`, bookData);
}

// Exclui um livro existente; o backend retorna 204 (sem corpo).
export function deleteBook(id) {
  return request("DELETE", `/api/books/${id}`);
}

// Envia a imagem da capa e devolve o endereço dela no backend (/api/books/covers/{id}).
// Não usa o request() porque o corpo é um arquivo, não JSON.
export async function uploadCover(file) {
  const body = new FormData();
  body.append("file", file);

  let response;
  try {
    response = await fetch("/api/books/covers", { method: "POST", body });
  } catch {
    throw new Error("Não foi possível falar com o servidor. Ele está ligado?");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? "Não foi possível enviar a imagem.");
  }
  return data.url;
}
