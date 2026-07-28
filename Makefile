# Bellet — dev convenience targets.
# Run `make` or `make help` to see everything.

.DEFAULT_GOAL := help
.PHONY: help install setup env dev dev-backend dev-frontend \
        infra-up infra-down infra-logs \
        db-migrate db-seed db-generate db-studio db-reset \
        build stop clean

## ---------------------------------------------------------------------------
## Meta
## ---------------------------------------------------------------------------

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

## ---------------------------------------------------------------------------
## First-time setup
## ---------------------------------------------------------------------------

install: ## Install all workspace dependencies
	npm install

env: ## Create backend/.env from the example if it is missing
	@test -f backend/.env || (cp backend/.env.example backend/.env && echo "Created backend/.env")

setup: install env infra-up db-generate db-migrate db-seed ## Full one-shot setup for a fresh clone
	@echo "\nSetup complete. Run 'make dev' to start."

## ---------------------------------------------------------------------------
## Development (run these day-to-day)
## ---------------------------------------------------------------------------

dev: infra-up ## Start backend + frontend together (Ctrl-C stops both)
	@echo "Starting backend (:3000) and frontend (:5173)... Ctrl-C to stop."
	@trap 'kill 0' INT TERM EXIT; \
		npm run dev:backend & \
		npm run dev:frontend & \
		wait

dev-backend: infra-up ## Start only the backend (NestJS, :3000)
	npm run dev:backend

dev-frontend: ## Start only the frontend (Vite, :5173)
	npm run dev:frontend

## ---------------------------------------------------------------------------
## Infrastructure (Postgres + MinIO via Docker)
## ---------------------------------------------------------------------------

infra-up: ## Start Postgres + MinIO in the background
	npm run infra:up

infra-down: ## Stop Postgres + MinIO
	npm run infra:down

infra-logs: ## Tail infrastructure logs
	npm run infra:logs

## ---------------------------------------------------------------------------
## Database (Prisma)
## ---------------------------------------------------------------------------

db-generate: ## Generate the Prisma client
	npm run prisma:generate -w @bellet/backend

db-migrate: ## Apply / create dev migrations
	npm run prisma:migrate -w @bellet/backend

db-seed: ## Seed categories + test users + sample data
	npm run prisma:seed -w @bellet/backend

db-studio: ## Open Prisma Studio (DB browser)
	npm run prisma:studio -w @bellet/backend

db-reset: ## Drop, re-migrate, and re-seed the database (DESTRUCTIVE)
	cd backend && npx prisma migrate reset

## ---------------------------------------------------------------------------
## Build & housekeeping
## ---------------------------------------------------------------------------

build: ## Production build of backend + frontend
	npm run build -w @bellet/backend
	npm run build -w @bellet/frontend

stop: infra-down ## Stop infra and any stray dev server on :3000
	@lsof -ti :3000 | xargs -r kill 2>/dev/null || true
	@echo "Stopped."

clean: ## Remove build output and node_modules
	rm -rf node_modules backend/node_modules backend/dist \
		frontend/node_modules frontend/dist
