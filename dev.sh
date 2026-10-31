#!/usr/bin/env bash
# Sobe o projeto para desenvolvimento: banco, backend e frontend.
#
#   ./dev.sh          inicia tudo (Ctrl+C encerra backend e frontend)
#   ./dev.sh --stop   para o Postgres, que fica rodando em segundo plano
set -euo pipefail
cd "$(dirname "$0")"

# Chaves do Google, se existirem. O set -a exporta as variáveis para o backend.
if [[ -f .env ]]; then
	set -a
	source .env
	set +a
fi

if command -v docker >/dev/null; then
	COMPOSE="docker compose"
elif command -v podman >/dev/null; then
	COMPOSE="podman compose"
else
	echo "Erro: instale o docker ou o podman para subir o Postgres." >&2
	exit 1
fi

if [[ "${1:-}" == "--stop" ]]; then
	echo "==> Parando o Postgres"
	(cd backend && $COMPOSE down)
	exit 0
fi

# O backend precisa do Java 25.
versao_java() {
	"$1/bin/java" -version 2>&1 | grep -m 1 version | cut -d '"' -f 2 | cut -d . -f 1
}

if [[ -z "${JAVA_HOME:-}" ]] && command -v java >/dev/null; then
	JAVA_HOME="$(dirname "$(dirname "$(readlink -f "$(command -v java)")")")"
fi

if [[ -z "${JAVA_HOME:-}" || "$(versao_java "$JAVA_HOME")" != 25 ]]; then
	JAVA_HOME=""
	for pasta in /usr/lib/jvm/java-25* ~/.sdkman/candidates/java/25.* /Library/Java/JavaVirtualMachines/*-25*/Contents/Home; do
		if [[ "$(versao_java "$pasta")" == 25 ]]; then
			JAVA_HOME="$pasta"
			break
		fi
	done
fi

if [[ -z "$JAVA_HOME" ]]; then
	echo "Erro: o backend precisa do Java 25 (veja o INSTALACAO.md)." >&2
	exit 1
fi
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$PATH"

echo "==> Subindo o Postgres"
(cd backend && $COMPOSE up -d)

echo "==> Esperando o banco aceitar conexão"
tentativas=0
until (cd backend && $COMPOSE exec -T postgres pg_isready -U xopxe) >/dev/null 2>&1; do
	tentativas=$((tentativas + 1))
	if [[ $tentativas == 30 ]]; then
		echo "Erro: o Postgres não respondeu em 30 segundos." >&2
		exit 1
	fi
	sleep 1
done

if [[ ! -d frontend/node_modules ]]; then
	echo "==> Instalando as dependências do frontend"
	(cd frontend && npm install)
fi

# Ao sair (Ctrl+C ou erro), encerra backend e frontend. O banco continua rodando.
trap 'kill $(jobs -p) 2>/dev/null' EXIT

echo "==> Backend em http://localhost:8080"
(cd backend && ./mvnw -B spring-boot:run) &
backend=$!

echo "==> Esperando o backend responder"
until curl -sf http://localhost:8080/api/auth/providers >/dev/null; do
	if ! kill -0 $backend 2>/dev/null; then
		echo "Erro: o backend parou antes de subir (veja a mensagem acima)." >&2
		exit 1
	fi
	sleep 1
done

# --strictPort: só sobe na 5173, que é a porta cadastrada no Google.
echo "==> Frontend em http://localhost:5173"
(cd frontend && npm run dev -- --port 5173 --strictPort) &

# Se um dos dois cair, encerra o outro.
wait -n
