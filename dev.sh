#!/usr/bin/env bash
#
# Sobe o projeto inteiro para desenvolvimento: banco, backend e frontend.
#
#   ./dev.sh          inicia tudo (Ctrl+C encerra backend e frontend)
#   ./dev.sh --stop   para o Postgres, que fica rodando em segundo plano
#
# -e: aborta no primeiro erro. -u: erro ao usar variável não definida.
# -o pipefail: um erro no meio de um pipe não passa despercebido.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

# Credenciais do Google (GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET), se existirem.
# set -a exporta tudo o que o .env define, para o backend enxergar.
if [[ -f "$ROOT/.env" ]]; then
	set -a
	source "$ROOT/.env"
	set +a
fi

# O backend precisa do Java 25. Se o JAVA_HOME aponta para outra versão
# (acontece com o SDKMAN), procuramos o Java 25 nas pastas mais comuns.
JAVA_REQUIRED=25

java_major() {
	local version
	version="$("$1/bin/java" -version 2>&1 | awk -F '"' '/version/ { print $2; exit }')"
	echo "${version%%.*}"
}

current_java_home() {
	if [[ -n "${JAVA_HOME:-}" ]]; then
		echo "$JAVA_HOME"
	elif command -v java >/dev/null 2>&1; then
		dirname "$(dirname "$(readlink -f "$(command -v java)")")"
	fi
}

java_home="$(current_java_home)"
if [[ -z "$java_home" || "$(java_major "$java_home")" != "$JAVA_REQUIRED" ]]; then
	java_home=""
	for candidate in \
		/usr/lib/jvm/java-"$JAVA_REQUIRED"* \
		"$HOME"/.sdkman/candidates/java/"$JAVA_REQUIRED".* \
		/Library/Java/JavaVirtualMachines/*-"$JAVA_REQUIRED"*/Contents/Home; do
		if [[ -x "$candidate/bin/java" && "$(java_major "$candidate")" == "$JAVA_REQUIRED" ]]; then
			java_home="$candidate"
			break
		fi
	done

	if [[ -z "$java_home" ]]; then
		echo "Erro: o backend precisa do Java $JAVA_REQUIRED (veja o INSTALACAO.md)." >&2
		exit 1
	fi
fi
export JAVA_HOME="$java_home"
export PATH="$JAVA_HOME/bin:$PATH"

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

# Ao sair (Ctrl+C ou erro), derruba os dois processos que abrimos aqui.
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
backend_pid="$!"
pids+=("$backend_pid")

# O Spring demora bem mais que o Vite para subir. Se o site abrir antes,
# os livros e o botão do Google não aparecem até recarregar a página.
echo "==> Esperando o backend responder"
until curl -sf http://localhost:8080/api/auth/providers >/dev/null 2>&1; do
	if ! kill -0 "$backend_pid" 2>/dev/null; then
		echo "Erro: o backend parou antes de subir (veja a mensagem acima)." >&2
		exit 1
	fi
	sleep 1
done

# --strictPort: se a 5173 estiver ocupada é melhor falhar do que subir em outra
# porta, porque o redirect do Google está registrado para a 5173.
echo "==> Frontend em http://localhost:5173"
(cd "$FRONTEND" && npm run dev -- --port 5173 --strictPort) &
pids+=("$!")

# Se um dos dois cair, encerra o outro em vez de deixar o projeto pela metade.
wait -n
