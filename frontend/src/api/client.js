// Os caminhos começam com /api. Em dev o Vite repassa para o backend, no Docker
// o nginx e na Vercel o vercel.json. Mesmo endereço, então o cookie da sessão vai junto.

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
