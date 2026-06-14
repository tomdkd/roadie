BACK_SERVICE=php-fpm
FRONT_SERVICE=frontend

.DEFAULT_GOAL := help

help: ## Display all available make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Run all containers in detached mode
	docker compose up -d

down: ## Stop all containers and remove orphans
	docker compose down --remove-orphans

install: ## Install the application (Backend + Frontend)
	@if [ ! -f .env ]; then cp .env.dist .env; fi
	@cp .env ./back/.env
	docker compose build
	docker compose up -d
	docker compose exec $(BACK_SERVICE) composer install
	docker compose exec $(BACK_SERVICE) php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

cache: ## Clear the application cache
	docker compose exec $(BACK_SERVICE) php bin/console cache:clear

qa: ## Run static analysis and code style checks (PHP + TypeScript)
	docker compose exec $(BACK_SERVICE) vendor/bin/phpstan analyse src
	docker compose exec $(BACK_SERVICE) vendor/bin/php-cs-fixer fix src --dry-run
	docker compose exec $(FRONT_SERVICE) npm run lint

test: ## Run the test suite
	docker compose exec $(BACK_SERVICE) bin/phpunit

console: ## Execute a command in the Symfony console. Usage: make console cmd="your:command"
	docker compose exec $(BACK_SERVICE) php bin/console $(cmd)