const BASE_URL = "http://localhost:8080";

async function request(method, path, body) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      credentials: "include", 
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Não foi possível falar com o servidor. Ele está ligado?");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Não foi possível concluir a operação.");
  }

  return data;
}

export function fetchBooks(query = "", genre = "") {
  const params = new URLSearchParams();
  
  if (query) {
    params.append("q", query);
  }
  
  if (genre && genre !== "Todos") {
    params.append("genre", genre);
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";
  return request("GET", `/api/books${queryString}`);
}

export function fetchBookById(id) {
  return request("GET", `/api/books/${id}`);
}

export function createBook(bookData) {
  return request("POST", "/api/books", bookData);
}