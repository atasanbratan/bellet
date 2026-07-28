# Bellet — Project Context (read this first)

**Bellet** is a multi-vendor **booking / reservation platform** (Turkmen: *bellemek* =
to reserve/mark). Clients browse businesses, book a service/course, and pay an
**advance (awans)** online.

- **Phase 1 domain:** education centers (bilim merkezleri) offering courses.
- **Later domains:** car wash (maşyn ýuwdurmak), barber (saç aldyrmak), etc.
  The data model is generic so new categories need no schema rewrite.

## Language note
The user (owner) may describe requirements in **Turkmen**; always reply in **English**.
If unsure of a Turkmen phrase, state your understanding and confirm before building.

## How to continue work
1. Read `docs/ARCHITECTURE.md` — the full technical design (approved by the user).
2. Read `docs/TODO.md` — phased task list + the **"CURRENT STATUS"** marker at the top.
   Continue from the first unchecked task.
3. After finishing tasks, **update `docs/TODO.md`**: check off items and move the
   "CURRENT STATUS" marker so the next session knows where to resume.

## Stack (decided, do not re-litigate)
- Backend: **NestJS + TypeScript**
- DB: **PostgreSQL + Prisma**
- Storage: **MinIO** (S3-compatible, self-hosted — AWS is blocked in the country)
- Frontend: **React + TypeScript + Tailwind CSS** (Vite)
- Auth: **passwordless, phone-first, reverse-SMS verification** (see architecture)
- Payments: **mock provider now**, real bank card later (user will provide docs)
- Dev env: **Docker Compose** (postgres + minio)

## Two hard rules (security)
1. `/auth/sms/incoming` MUST be protected by `GATEWAY_SECRET`. Only the (future)
   Android SMS-gateway app may call it. Otherwise anyone could log in as any phone.
2. The dev/mock endpoints (`/auth/dev/simulate-sms`, payment simulation) MUST be
   disabled in production.

## Code quality rules (enforced — check before finishing any task)

### One file = one purpose
- **Hard caps: 150 lines per frontend file, 300 per backend file.** Target well
  under them; if a file nears its cap, split it *as part of the same task* —
  never leave it for later.
  Verify: `find backend/src frontend/src -name '*.ts*' | xargs wc -l | sort -rn | head`
- **Exempt from the cap** (declared data/art, splitting would hurt cohesion):
  `frontend/src/i18n/locales/*.ts` (translation dictionaries) and
  `frontend/src/components/visuals.tsx` (SVG art collection). Add a file here
  only with a real reason, and note the reason in this list.
- One React component per file (tiny private subcomponents used only by that
  component are OK). One Nest service/controller per file.
- **Never grow a file by appending features.** Adding a section/form/panel to an
  existing page means creating a new component in `features/<area>/` and
  composing it — not inlining JSX into the page.

### Where code lives (frontend)
- `pages/` — thin route shells only: fetch top-level data, hold selection state,
  compose feature components. No business logic, no big JSX.
- `features/<area>/` — the real UI, one component per file
  (existing areas: `owner/`, `admin/`).
- `components/` — reusable cross-feature pieces (LangTabs, visuals, Layout…).
- `lib/` — pure logic helpers (no JSX). `api/` — all HTTP calls.
- `i18n/locales/{tk,en,ru}.ts` — every user-visible string in all 3 languages.

### Where code lives (backend)
- One Nest module per domain in `modules/<domain>/` (controller, service, dto/).
- Controllers stay thin: guards + validation + delegate to the service.
- All DB access in services via Prisma; shared helpers in `common/`.

### General style
- Duplication: the moment the same logic appears twice, extract it
  (`lib/` on the frontend, `common/` or the owning service on the backend).
- Components take narrow props (ids + data + callbacks), own their local form
  state, and report changes via `onChange`-style callbacks — no prop-drilling
  of whole page state.
- User-facing errors are translated and friendly (e.g. 409 → "has bookings"),
  never raw exceptions.
- Comments explain *why*, not *what*; keep them rare and useful.
- Before declaring a task done: typecheck/build both sides
  (`npx tsc` backend, `npx tsc -b && npx vite build` frontend) and re-run the
  line-count check above.
