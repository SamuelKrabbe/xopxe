#!/usr/bin/env bash
# Sobe o sistema inteiro (banco, backend e site) com Docker ou Podman.
#
#   ./run.sh          constrói e sobe tudo em http://localhost:8000
#   ./run.sh down     desliga
#   ./run.sh logs     mostra os logs (Ctrl+C sai)
#   ./run.sh clean    desliga e apaga o banco (volta aos usuários de teste)
#
# Para programar com recarga automática, use o ./dev.sh.
set -euo pipefail
cd "$(dirname "$0")"

if command -v docker >/dev/null; then
	COMPOSE="docker compose"
elif command -v podman >/dev/null; then
	COMPOSE="podman compose"
else
	echo "Erro: instale o Docker ou o Podman (veja o INSTALACAO.md)." >&2
	exit 1
fi

case "${1:-up}" in
	up)
		if [[ ! -f .env ]]; then
			cp .env.example .env
			echo "Criei o .env. Sem as chaves do Google, o botão do Google não aparece."
		fi

		echo "==> Construindo e subindo. Da primeira vez demora alguns minutos..."
		# --force-recreate: recria os containers com o código novo.
		$COMPOSE up --build --force-recreate -d

		echo "==> Esperando o sistema responder..."
		tentativas=0
		until curl -sf http://localhost:8000/api/auth/providers >/dev/null; do
			tentativas=$((tentativas + 1))
			if [[ $tentativas == 120 ]]; then
				echo "Erro: o sistema não respondeu em 2 minutos. Veja o motivo com ./run.sh logs" >&2
				exit 1
			fi
			sleep 1
		done

		echo
		echo "Xopxe rodando em http://localhost:8000"
		echo "  Documentação da API: http://localhost:8000/swagger-ui.html"
		echo "  Usuários de teste:   admin@xopxe.com e user@xopxe.com (senha: password)"
		echo "  ./run.sh down desliga, ./run.sh logs mostra os logs"

		if command -v xdg-open >/dev/null; then
			xdg-open http://localhost:8000 >/dev/null 2>&1 &
		fi
		;;
	down)
		$COMPOSE down
		echo "Desligado."
		;;
	logs)
		$COMPOSE logs -f
		;;
	clean)
		# -v apaga o volume do banco.
		$COMPOSE down -v
		echo "Desligado e banco apagado."
		;;
	*)
		echo "Erro: comando desconhecido: $1. Use: ./run.sh [up|down|logs|clean]" >&2
		exit 1
		;;
esac
