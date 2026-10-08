#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

readonly REMOTE_HOST="homeserver"
REMOTE_DIR="${DEPLOY_DIR:-/home/dtrensuri/dt-rensuri-cv}"
COMPOSE_FILE="docker-compose.prod.yml"
SSH_OPTS=(-o BatchMode=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=3)

usage() {
    cat <<EOF
Usage: $(basename "$0") [options]

Build Docker images locally, upload them to the server, and start the stack.

Options:
  -d, --dir DIRECTORY   Remote deployment directory (default: ${REMOTE_DIR})
  -h, --help            Show this help

Environment overrides:
    DEPLOY_DIR, SSH_KEY

The remote server must already contain ${REMOTE_DIR}/.env.prod.
EOF
}

run_remote() {
    ssh "${SSH_OPTS[@]}" "${SSH_TARGET}" "$@"
}

require_command() {
    command -v "$1" >/dev/null 2>&1 || {
        printf 'Missing required command: %s\n' "$1" >&2
        exit 1
    }
}

while (($# > 0)); do
    case "$1" in
        -d|--dir)
            REMOTE_DIR="${2:?Missing value for $1}"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            printf 'Unknown option: %s\n\n' "$1" >&2
            usage >&2
            exit 2
            ;;
    esac
done

SSH_TARGET="${REMOTE_HOST}"

if [[ -n "${SSH_KEY:-}" ]]; then
    SSH_OPTS+=(-i "$SSH_KEY")
fi

require_command docker
require_command ssh
require_command rsync

[[ -f "${SCRIPT_DIR}/${COMPOSE_FILE}" ]] || {
    printf 'Compose file not found: %s\n' "${SCRIPT_DIR}/${COMPOSE_FILE}" >&2
    exit 1
}

printf 'Checking SSH connection to %s...\n' "$SSH_TARGET"
run_remote true

printf 'Checking remote directory %s...\n' "$REMOTE_DIR"
if ! run_remote "test -d '$REMOTE_DIR' && test -f '$REMOTE_DIR/.env.prod'"; then
    printf '\nRemote directory setup failed.\n' >&2
    printf 'Create %s and %s/.env.prod on the server, then rerun this script.\n' "$REMOTE_DIR" "$REMOTE_DIR" >&2
    exit 1
fi

readonly IMAGE_NAMES=(
    dt-rensuri-cv-app:production
    dt-rensuri-cv-nginx:production
)

printf 'Building Docker images locally...\n'
docker compose -f "${SCRIPT_DIR}/${COMPOSE_FILE}" build --pull app nginx

printf 'Uploading Compose configuration...\n'
rsync -az \
    -e "ssh ${SSH_OPTS[*]}" \
    "${SCRIPT_DIR}/${COMPOSE_FILE}" "${SSH_TARGET}:${REMOTE_DIR}/"

IMAGE_ARCHIVE="$(mktemp --tmpdir="${TMPDIR:-/tmp}" dt-rensuri-cv-images.XXXXXX.tar.gz)"
cleanup() {
    rm -f "$IMAGE_ARCHIVE"
}
trap cleanup EXIT

printf 'Exporting local Docker images...\n'
docker save "${IMAGE_NAMES[@]}" | gzip > "$IMAGE_ARCHIVE"

printf 'Uploading Docker images to %s...\n' "$REMOTE_HOST"
rsync -az --progress \
    -e "ssh ${SSH_OPTS[*]}" \
    "$IMAGE_ARCHIVE" "${SSH_TARGET}:${REMOTE_DIR}/.dt-rensuri-cv-images.tar.gz"

printf 'Loading Docker images on remote server...\n'
run_remote "gzip -dc '$REMOTE_DIR/.dt-rensuri-cv-images.tar.gz' | docker load && rm -f '$REMOTE_DIR/.dt-rensuri-cv-images.tar.gz'"

printf 'Deploying Docker Compose stack...\n'
run_remote "cd '$REMOTE_DIR' && \
    docker compose --env-file .env.prod -f '$COMPOSE_FILE' config -q && \
    docker compose --env-file .env.prod -f '$COMPOSE_FILE' up -d --no-build --remove-orphans"

printf 'Deployment completed successfully on %s.\n' "$REMOTE_HOST"