# --- STAGE 1: Base ---
FROM php:8.4.22-fpm-alpine3.22 AS base

RUN apk add --no-cache acl fcgi file gettext git libpq-dev zip unzip

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_pgsql intl zip opcache apcu

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app

# --- STAGE 2: Dev ---
FROM base AS dev
ENV APP_ENV=dev
RUN install-php-extensions xdebug

# --- STAGE 3: Build prod ---
FROM base AS build
ENV APP_ENV=prod
COPY ./back/composer.json ./back/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader
COPY ./back/* .
RUN composer install --no-dev --optimize-autoloader

# --- STAGE 4: Prod ---
FROM base AS prod
ENV APP_ENV=prod
COPY --from=build /app /app
COPY .env.dist .env
COPY ./back/docker/php/conf.d/prod.ini $PHP_INI_DIR/conf.d/app.ini
RUN chown -R www-data:www-data /app/var
USER www-data