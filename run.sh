#!/usr/bin/env bash
#
# Sobe o sistema inteiro (banco, backend e site) com Docker ou Podman.
#
#   ./run.sh          constrói e sobe tudo em http://localhost:8000
#   ./run.sh down     desliga
#   ./run.sh logs     mostra o que o sistema está escrevendo (Ctrl+C sai)
#   ./run.sh clean    desliga e apaga o banco (volta aos usuários de teste)
#
# Para programar com recarga automática, use o ./dev.sh.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

URL="http://localhost:8000"

BOLD=$'\033[1m'
GREEN=$'\033[32m'
RED=$'\033[31m'
DIM=$'\033[2m'
RESET=$'\033[0m'

info() { echo "${BOLD}==>${RESET} $*"; }
ok() { echo "${GREEN}${BOLD}✓${RESET} $*"; }
fail() {
	echo "${RED}${BOLD}✗${RESET} $*" >&2
	exit 1
}

if command -v docker >/dev/null 2>&1; then
	COMPOSE=(docker compose)
elif command -v podman >/dev/null 2>&1; then
	COMPOSE=(podman compose)
else
	fail "Instale o Docker ou o Podman (veja o INSTALACAO.md)."
fi

up() {
	if [[ ! -f .env ]]; then
		cp .env.example .env
		info "Criei o .env (sem as chaves do Google, o botão do Google não aparece)."
	fi

	info "Construindo e subindo. Da primeira vez demora alguns minutos..."
	# --force-recreate: sem isso o podman mantém o container antigo rodando o código velho.
	"${COMPOSE[@]}" up --build --force-recreate -d

	info "Esperando o sistema responder..."
	for _ in $(seq 120); do
		if curl -sf "$URL/api/auth/providers" >/dev/null 2>&1; then
			echo
			ok "Xopxe rodando em ${BOLD}$URL${RESET}"
			echo "  Documentação da API: $URL/swagger-ui.html"
			echo "  Usuários de teste:   admin@xopxe.com e user@xopxe.com (senha: password)"
			echo "  ${DIM}./run.sh down desliga · ./run.sh logs mostra os logs${RESET}"

			if command -v xdg-open >/dev/null 2>&1; then
				xdg-open "$URL" >/dev/null 2>&1 &
			fi
			return
		fi
		sleep 1
	done

	fail "O sistema não respondeu em 2 minutos. Veja o motivo com ./run.sh logs"
}

case "${1:-up}" in
	up)
		up
		;;
	down)
		"${COMPOSE[@]}" down
		ok "Desligado."
		;;
	logs)
		"${COMPOSE[@]}" logs -f
		;;
	clean)
		# -v apaga o volume do banco; na próxima subida ele é recriado do zero.
		"${COMPOSE[@]}" down -v
		ok "Desligado e banco apagado."
		;;
	*)
		fail "Comando desconhecido: $1. Use: ./run.sh [up|down|logs|clean]"
		;;
esac
