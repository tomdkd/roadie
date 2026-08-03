# --- STAGE 1: PHP base ---
FROM php:8.4.22-fpm-alpine3.22 AS base
ARG APP_ENV=prod
ENV APP_ENV=${APP_ENV:-prod}
ENV DEFAULT_URI=http://localhost
ENV APP_NAME=Roadie
ENV APP_DEBUG=1
ENV MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0
ENV CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
ENV DB_HOST=roadie-db
ENV DB_PORT=5432
# Keep a DATABASE_URL template (escaped) so build doesn't try to expand undefined vars.
# It will be constructed at container start by the entrypoint script when needed.
ENV DATABASE_URL="postgresql://$${DB_USER}:$${DB_PASSWORD}@$${DB_HOST}:$${DB_PORT}/$${DB_NAME}?serverVersion=16&charset=utf8"

RUN apk add --no-cache acl fcgi file gettext git libpq-dev zip unzip nginx

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_pgsql intl zip opcache apcu $( [ "$APP_ENV" = "dev" ] && echo xdebug )

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app

# --- STAGE 2: Frontend build ---
FROM node:26-alpine AS frontend-build
WORKDIR /app/front
COPY front/package.json front/package-lock.json* ./
RUN npm ci
COPY front .
RUN npm run build

# --- STAGE 3: Backend install ---
FROM base AS backend-build
ARG APP_ENV=prod
ENV APP_ENV=${APP_ENV}

COPY back/composer.json back/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader
COPY back/. ./
RUN cp .env.dist .env
RUN if [ "$APP_ENV" = "prod" ]; then composer install --no-dev --optimize-autoloader; else composer install --optimize-autoloader; fi

# --- STAGE 4: Final image ---
FROM base AS roadie
ARG APP_ENV=prod
ENV APP_ENV=${APP_ENV}

COPY --from=backend-build /app /app
COPY --from=frontend-build /app/front/dist /app/front/dist
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
COPY back/docker/nginx/conf.d/default.conf /etc/nginx/http.d/default.conf
RUN chown -R www-data:www-data /app/var /app/front/dist
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
EXPOSE 80
CMD ["sh", "-c", "php-fpm -D; nginx -g 'daemon off;' "]
