import { request } from "./client";

export function login(email, password) {
  return request("POST", "/api/auth/login", { email, password });
}

export function register(name, email, password) {
  return request("POST", "/api/auth/register", { name, email, password });
}

export function logout() {
  return request("POST", "/api/auth/logout");
}

export function fetchProviders() {
  return request("GET", "/api/auth/providers");
}

// Devolve o usuário logado, ou null se não houver sessão (401).
export async function fetchCurrentUser() {
  const response = await fetch("/api/auth/me");

  return response.ok ? response.json() : null;
}
