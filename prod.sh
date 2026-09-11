#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
    echo ""
    echo "Stopping services..."
    kill 0 2>/dev/null || true
}

trap cleanup SIGINT SIGTERM EXIT

echo "Installing dependencies..."
pnpm install --force

echo "Loading production environment..."
cp .env.prod .env

echo "Clearing Laravel cache..."
php artisan optimize:clear

echo "Building Vite..."
pnpm build

echo "Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting TTS..."
(
    cd "$ROOT_DIR/services/tts"
    uv run python main.py
) &

wait