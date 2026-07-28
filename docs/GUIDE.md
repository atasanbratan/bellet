# Bellet — Run & Try-It Guide

A hands-on guide for anyone who wants to run Bellet locally and click through
every role: **Client**, **Business owner**, and **Admin**.

---

## 1. What you need installed

| Tool | Version | Check with |
|------|---------|-----------|
| Node.js | 20+ | `node -v` |
| Docker (with Compose) | any recent | `docker compose version` |
| GNU Make | any | `make -v` |

---

## 2. First-time setup (one command)

```bash
make setup
```

This installs dependencies, creates `backend/.env`, starts Postgres + MinIO in
Docker, applies database migrations, and seeds demo data + test users.

<details>
<summary>Prefer to do it manually? (click)</summary>

```bash
npm install
cp backend/.env.example backend/.env
npm run infra:up
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```
</details>

## 3. Start the app

```bash
make dev        # backend + frontend together; Ctrl-C stops both
```

Then open **http://localhost:5173**.

Other useful commands: `make help` (list everything), `make stop`
(stop servers + infra), `make db-reset` (wipe and re-seed the database).

---

## 4. Test users

All test users share the password **`password123`**.

| Role | Phone | What they can do |
|------|-------|------------------|
| **Client** | `+99361111111` | Browse, book a course, pay the advance |
| **Owner** | `+99361000000` | Manage their center, courses, teachers, bookings, payments |
| **Admin** | `+99360000000` | Approve businesses, see all users & payments |

Log in via **Login** in the top-right corner. The UI is available in
**Türkmen / English / Русский** — switch with the TK/EN/RU control in the nav.

---

## 5. Try it as a CLIENT

1. Log in as the client (`+99361111111`).
2. Browse the home page, or use the **big search bar** in the nav — it finds
   centers, courses, and teachers as you type (try `engl` or `Merjen`).
3. Open a center → open a course → you'll see its **groups (toparlar)**:
   day pattern (e.g. Mon·Wed·Fri), time, teacher, seats.
4. Click **Book** on a group → **Continue** → **Pay advance**.
   Payment is a *mock* (no real money); on success the booking is CONFIRMED.
5. Check **My Bookings** in the nav — you can also cancel from there.

## 6. Try it as an OWNER

1. Log in as the owner (`+99361000000`) → **Dashboard** appears in the nav.
2. **Each owner has exactly one center.** A brand-new owner sees only the
   create form; **new centers start as PENDING** and stay hidden from clients
   until an admin approves them (see section 8).
3. The dashboard has a sidebar menu:
   - **My center** — edit name, description (**TK/EN/RU tabs**: visitors see
     their own language, or whatever translation exists), manage **addresses**
     (a center can list several buildings, each tagged with its welayat), and
     upload photos (stored in MinIO).
   - **Teachers** — add, edit, delete; click a teacher's avatar to upload
     their photo.
   - **Courses** — add with multilingual titles, set price and advance
     (awans); then add **groups**: pick days (1·3·5 / 2·4·6 shortcuts),
     time of day, start/end, capacity, and a teacher. Each group shows
     **seats taken / total**.
   - **Bookings** — every client booking of your courses with its payment
     status.
   - **Payments** — all payments made to your center, with totals on top and
     a filter under each column (client, course, status, date range).
4. Deleting a course/center that already has bookings is blocked with a
   friendly message — that's intentional.

## 7. Register a NEW user (reverse-SMS flow)

Registration is phone-first: instead of receiving a code, you *send* an SMS.

1. Click **Sign up**, choose **Client** or **Business owner**, fill the form
   (any `+993…` phone that isn't taken).
2. The app shows a number and waits: "send an empty SMS from your phone to X".
   In production an Android SMS-gateway app detects your SMS; in development
   just click **"Simulate SMS (dev)"** — you'll be logged in automatically.
3. The same flow powers **Forgot password**.

## 8. Try it as an ADMIN

1. Log in as the admin (`+99360000000`) → **Admin** appears in the nav.
2. Sections in the sidebar:
   - **Overview** — user/business/booking/revenue stats with charts.
   - **Businesses** — the approval queue. **Approve** a pending center and it
     instantly appears in public browse; **Reject** hides it.
   - **Users** — paginated table of everyone registered.
   - **Payments** — paginated table of all course payments: client, course,
     center, amount, status, date.
3. Full loop to test approval: register a new owner (section 7) → create a
   center → log in as admin → approve it → log in as client → book it.

---

## 9. Where things run

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | — |
| API | http://localhost:3000/api | health: `/api/health` |
| MinIO console | http://localhost:9001 | minioadmin / minioadmin |
| Postgres | localhost:5432 | bellet / bellet |
| Prisma Studio (DB browser) | `make db-studio` | — |

## 10. Troubleshooting

- **Port already in use** → `make stop`, then `make dev` again.
- **Weird data / want a clean slate** → `make db-reset` (destroys all data,
  re-seeds the test users above).
- **Photos don't load** → make sure Docker is running (`docker ps` should show
  `bellet-postgres` and `bellet-minio`).
- **"Simulate SMS" button missing** → it only appears in development mode,
  which is what `make dev` runs.
