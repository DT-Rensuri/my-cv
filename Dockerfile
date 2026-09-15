# =========================
# Composer
# =========================
FROM composer:2 AS composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

# Local Composer packages
COPY packages ./packages

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts


# =========================
# Frontend
# =========================
FROM node:22 AS frontend

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./

COPY resources/js/packages ./resources/js/packages

RUN corepack enable && pnpm install --frozen-lockfile

COPY resources ./resources
COPY public ./public

RUN pnpm build

# =========================
# Laravel PHP
# =========================
FROM php:8.4-fpm AS app

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libicu-dev \
        libzip-dev \
        libpq-dev \
        unzip \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        intl \
        mbstring \
        opcache \
        pdo_mysql \
        pdo_pgsql \
        zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer /var/www/html/vendor ./vendor

COPY . .

COPY --from=frontend /app/public/build ./public/build

RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache

USER www-data

EXPOSE 9000

CMD ["php-fpm"]