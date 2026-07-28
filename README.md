# Bellet

Multi-vendor **booking / reservation platform** (Turkmen: *bellemek* = to reserve).
Clients browse businesses, book a course/service, and pay an advance (*awans*) online.

Phase 1 domain: **education centers**. Later: car wash, barber, etc.

- **New here? Read [`docs/GUIDE.md`](docs/GUIDE.md)** — how to run it and try
  every role (client / owner / admin), step by step.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — technical design.
- [`docs/TODO.md`](docs/TODO.md) — progress and current status.
- [`gateway/`](gateway/README.md) — Android (Kotlin) SMS-gateway app for
  production reverse-SMS verification.

## Stack
- **Backend:** NestJS + TypeScript, PostgreSQL + Prisma
- **Storage:** MinIO (S3-compatible, self-hosted)
- **Frontend:** React + TypeScript + Tailwind CSS (Vite)
- **Auth:** password + phone verification via reverse SMS
- **Dev infra:** Docker Compose (Postgres + MinIO)

## Quick start

Requires Node 20+, Docker, and Make.

```bash
make setup      # first time only: install, .env, infra, migrate, seed
make dev        # start backend (:3000) + frontend (:5173); Ctrl-C stops both
```

Open **http://localhost:5173** and log in with a test user
(password `password123`):

| Role | Phone |
|------|-------|
| Client | `+99361111111` |
| Owner | `+99361000000` |
| Admin | `+99360000000` |

`make help` lists every command (db reset, Prisma Studio, logs, …).
No Make? The manual steps are in [`docs/GUIDE.md`](docs/GUIDE.md).

## Services

- API: http://localhost:3000/api  (health: `/api/health`)
- Frontend: http://localhost:5173
- MinIO console: http://localhost:9001  (minioadmin / minioadmin)
- Postgres: `localhost:5432`  (bellet / bellet)
