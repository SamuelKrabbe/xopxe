// Endereço do backend. Em produção dá para trocar criando um arquivo .env
// com VITE_API_URL=http://outro-endereco.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function postJson(path, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
  return postJson("/api/auth/login", { email, password });
}

export function register(name, email, password) {
  return postJson("/api/auth/register", { name, email, password });
}
