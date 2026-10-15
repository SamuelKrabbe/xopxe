// Os caminhos são relativos (/api/...): em dev o Vite repassa ao backend
// (vite.config.js) e no Docker quem repassa é o nginx. Como tudo fica no mesmo
// endereço, o navegador manda o cookie de sessão sozinho.

async function request(method, path, body) {
  let response;

  try {
    response = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Só cai aqui quando o servidor não respondeu (backend desligado, sem rede).
    throw new Error("Não foi possível falar com o servidor. Ele está ligado?");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Não foi possível concluir a operação.");
  }

  return data;
}

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
