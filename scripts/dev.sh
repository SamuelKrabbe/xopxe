#!/usr/bin/env bash
#
# Sobe o projeto inteiro para desenvolvimento: banco, backend e frontend.
#
#   ./scripts/dev.sh
#
# Ctrl+C derruba backend e frontend. O banco continua rodando em segundo
# plano; para parar use:  ./scripts/dev.sh --stop

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

# A máquina pode ter docker ou podman; usamos o que existir.
if command -v docker >/dev/null 2>&1; then
	COMPOSE="docker compose"
elif command -v podman >/dev/null 2>&1; then
	COMPOSE="podman compose"
else
	echo "Erro: instale o docker ou o podman para subir o Postgres." >&2
	exit 1
fi

stop_database() {
	echo "==> Parando o Postgres"
	(cd "$BACKEND" && $COMPOSE down)
}

if [[ "${1:-}" == "--stop" ]]; then
	stop_database
	exit 0
fi

echo "==> Subindo o Postgres"
(cd "$BACKEND" && $COMPOSE up -d)

echo "==> Esperando o banco aceitar conexão"
for _ in $(seq 1 30); do
	if (cd "$BACKEND" && $COMPOSE exec -T postgres pg_isready -U xopxe >/dev/null 2>&1); then
		break
	fi
	sleep 1
done

if ! (cd "$BACKEND" && $COMPOSE exec -T postgres pg_isready -U xopxe >/dev/null 2>&1); then
	echo "Erro: o Postgres não respondeu a tempo." >&2
	exit 1
fi

# Ao sair (Ctrl+C), derruba os dois processos que abrimos aqui.
cleanup() {
	echo
	echo "==> Encerrando backend e frontend"
	kill 0
}
trap cleanup EXIT

echo "==> Backend em http://localhost:8080"
(cd "$BACKEND" && ./mvnw -B spring-boot:run) &

echo "==> Frontend em http://localhost:5173"
# --strictPort: se a 5173 estiver ocupada, é melhor falhar do que subir em
# outra porta — o backend só libera a 5173 no CORS.
(cd "$FRONTEND" && npm run dev -- --port 5173 --strictPort) &

wait
