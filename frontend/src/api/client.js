// Os caminhos começam com /api. Em dev o Vite manda para o backend
// (vite.config.js) e no Docker é o nginx. Como fica tudo no mesmo endereço,
// o navegador já manda o cookie da sessão.

export async function request(method, path, body) {
  let response;

  try {
    response = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Só chega aqui se o servidor não respondeu (backend desligado ou sem internet).
    throw new Error("Não foi possível falar com o servidor. Ele está ligado?");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Não foi possível concluir a operação.");
  }

  return data;
}
