#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing dependencies..."
pnpm install --force

echo "Clearing Laravel cache..."
php artisan optimize:clear

echo "Building Vite..."
pnpm build

echo "Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache