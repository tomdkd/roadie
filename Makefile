ROADIE_SERVICE=roadie
APP_ENV ?= prod
export APP_ENV
DOCKER_COMPOSE := $(shell if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then printf 'docker compose'; else printf 'docker-compose'; fi)

.DEFAULT_GOAL := help

help: ## Display all available make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Run all containers in detached mode
	$(DOCKER_COMPOSE) up -d

down: ## Stop all containers and remove orphans
	$(DOCKER_COMPOSE) down --remove-orphans

build: ## Build the roadie image
	$(DOCKER_COMPOSE) build --build-arg APP_ENV=$(APP_ENV)

install: ## Build and start the application (Backend + Frontend)
	$(DOCKER_COMPOSE) build --build-arg APP_ENV=$(APP_ENV)
	$(DOCKER_COMPOSE) up -d
	$(DOCKER_COMPOSE) exec $(ROADIE_SERVICE) composer install
	$(DOCKER_COMPOSE) exec $(ROADIE_SERVICE) php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

local: ## Start the application locally in dev mode
	@if [ -z "$(APP_SECRET)" ]; then echo "APP_SECRET is required for local startup"; exit 1; fi
	APP_ENV=dev $(DOCKER_COMPOSE) build --build-arg APP_ENV=dev
	APP_ENV=dev DB_HOST=roadie-db DB_PORT=5432 DB_NAME=roadie DB_USER=app DB_PASSWORD='!ChangeMe!' $(DOCKER_COMPOSE) up -d

cache: ## Clear the application cache
	$(DOCKER_COMPOSE) exec $(ROADIE_SERVICE) php bin/console cache:clear

qa: ## Run static analysis and code style checks (PHP + TypeScript)
	$(DOCKER_COMPOSE) exec $(ROADIE_SERVICE) vendor/bin/phpstan analyse src
	$(DOCKER_COMPOSE) exec $(ROADIE_SERVICE) vendor/bin/php-cs-fixer fix src --dry-run
	$(DOCKER_COMPOSE) exec $(ROADIE_SERVICE) npm run lint

test: ## Run the test suite
	$(DOCKER_COMPOSE) exec $(ROADIE_SERVICE) bin/phpunit

console: ## Execute a command in the Symfony console. Usage: make console cmd="your:command"
	$(DOCKER_COMPOSE) exec $(ROADIE_SERVICE) php bin/console $(cmd)
