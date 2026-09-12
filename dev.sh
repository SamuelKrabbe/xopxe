#!/usr/bin/env bash
#
# Sobe o projeto inteiro para desenvolvimento: banco, backend e frontend.
#
#   ./dev.sh          inicia tudo — Ctrl+C encerra backend e frontend
#   ./dev.sh --stop   para o Postgres, que fica rodando em segundo plano
#
# -e: aborta no primeiro erro. -u: erro ao usar variável não definida.
# -o pipefail: um erro no meio de um pipe não passa despercebido.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

# A máquina pode ter docker ou podman; usamos o que estiver instalado.
if command -v docker >/dev/null 2>&1; then
	COMPOSE=(docker compose)
elif command -v podman >/dev/null 2>&1; then
	COMPOSE=(podman compose)
else
	echo "Erro: instale o docker ou o podman para subir o Postgres." >&2
	exit 1
fi

# O compose.yaml mora em backend/, então todo comando roda a partir de lá.
compose() {
	(cd "$BACKEND" && "${COMPOSE[@]}" "$@")
}

database_is_ready() {
	compose exec -T postgres pg_isready -U xopxe >/dev/null 2>&1
}

if [[ "${1:-}" == "--stop" ]]; then
	echo "==> Parando o Postgres"
	compose down
	exit 0
fi

echo "==> Subindo o Postgres"
compose up -d

echo "==> Esperando o banco aceitar conexão"
for _ in $(seq 30); do
	if database_is_ready; then
		break
	fi
	sleep 1
done

if ! database_is_ready; then
	echo "Erro: o Postgres não respondeu em 30 segundos." >&2
	exit 1
fi

# Na primeira execução o node_modules ainda não existe.
if [[ ! -d "$FRONTEND/node_modules" ]]; then
	echo "==> Instalando as dependências do frontend"
	(cd "$FRONTEND" && npm install)
fi

# Ao sair — Ctrl+C ou erro — derruba os dois processos que abrimos aqui.
# O banco continua de pé; use ./dev.sh --stop para pará-lo.
pids=()

cleanup() {
	if [[ ${#pids[@]} -gt 0 ]]; then
		echo
		echo "==> Encerrando backend e frontend"
		kill "${pids[@]}" 2>/dev/null || true
	fi
}

trap cleanup EXIT

echo "==> Backend em http://localhost:8080"
(cd "$BACKEND" && ./mvnw -B spring-boot:run) &
pids+=("$!")

# --strictPort: se a 5173 estiver ocupada é melhor falhar do que subir em outra
# porta, porque o backend só libera a 5173 no CORS.
echo "==> Frontend em http://localhost:5173"
(cd "$FRONTEND" && npm run dev -- --port 5173 --strictPort) &
pids+=("$!")

# Se um dos dois cair, encerra o outro em vez de deixar o projeto pela metade.
wait -n
