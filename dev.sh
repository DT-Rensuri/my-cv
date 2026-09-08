#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
    echo ""
    echo "Stopping services..."
    kill 0
}

trap cleanup SIGINT SIGTERM EXIT

echo "Starting Laravel..."
php artisan serve &

echo "Starting Vite..."
pnpm dev --force &

echo "Starting TTS..."
(
    cd "$ROOT_DIR/services/tts"
    uv run python main.py
) &

wait