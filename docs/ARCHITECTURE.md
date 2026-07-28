# Bellet — Architecture

> Approved by the user. This is the source of truth for the technical design.

## 1. High-level system

```
React + TS + Tailwind (SPA)  ──HTTPS/REST + JWT──▶  NestJS API (TS)
                                                        │
                          ┌─────────────────────────────┼──────────────────┐
                          ▼                             ▼                  ▼
                    PostgreSQL (Prisma)          MinIO (photos, S3)   Payment Provider
                                                                      (mock → bank card)
```

Dev environment runs via Docker Compose: `postgres` + `minio` (+ `api` in prod).

## 2. Monorepo layout

```
bellet/
├── docker-compose.yml          # postgres + minio
├── package.json                # workspace root
├── CLAUDE.md                   # session context
├── docs/
│   ├── ARCHITECTURE.md         # this file
│   └── TODO.md                 # task tracking + resume marker
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── common/             # guards, decorators, filters, pipes
│       ├── config/             # env config
│       └── modules/
│           ├── auth/           # phone request, SMS verify, JWT, refresh
│           ├── users/
│           ├── categories/     # Education, CarWash, Barber...
│           ├── businesses/     # "centers" (generic business)
│           ├── offerings/      # courses / services (bookable items)
│           ├── teachers/       # education-specific staff
│           ├── schedules/      # time slots
│           ├── bookings/
│           ├── payments/       # PaymentProvider abstraction
│           └── storage/        # MinIO / S3 upload service
└── frontend/
    └── src/
        ├── main.tsx
        ├── app/                # router, providers
        ├── api/                # typed API client (axios + react-query)
        ├── components/         # reusable Tailwind UI
        ├── features/
        │   ├── auth/
        │   ├── businesses/
        │   ├── offerings/
        │   ├── bookings/
        │   └── owner-dashboard/
        ├── hooks/
        ├── lib/
        └── types/
```

## 3. Data model (Prisma)

**Category decision (2026-07-13, owner):** the platform is education-only for now
— the only Category row is `education`. Future categories will NOT reuse the
course/teacher/group model; each gets its own domain tables when built (e.g.
car wash = queue slots by hour and availability, no teachers/groups). Do not try
to force new domains into Offering/Group.

**One business per owner:** `Business.ownerId` is unique (1:1). Owner dashboards
and endpoints assume a single business.

```
User
 ├─ id
 ├─ phone         (unique, REQUIRED)
 ├─ passwordHash  (bcrypt)
 ├─ phoneVerified (bool; set true after SMS verification)
 ├─ email         (optional, unique if present)
 ├─ name
 ├─ role          (OWNER | CLIENT)
 └─ createdAt

PhoneVerification
 ├─ id
 ├─ phone
 ├─ purpose      (ACCOUNT_VERIFICATION | PASSWORD_RESET)
 ├─ status       (PENDING | VERIFIED | EXPIRED)
 ├─ expiresAt    (+10 min)
 ├─ verifiedAt
 └─ createdAt

RefreshToken
 ├─ id, userId, tokenHash, expiresAt, revokedAt, createdAt

Category         (education only for now; future domains get own tables)
 ├─ id, name, slug

Business         (owner 1───1, ownerId unique)
 ├─ id, ownerId (User), categoryId, name, description, photos[]
 └─ addresses    (1───many; a center can have buildings in several towns)

Province         (fixed, seeded: Turkmenistan's 5 welayats + Aşgabat)
 ├─ id, slug, nameTk, nameEn, nameRu

Address          (business 1───many)
 ├─ id, businessId, provinceId, line (free-text street/building)

SavedCenter      (client ───many─── business bookmark)
 ├─ id, userId, businessId, createdAt
 └─ @@unique([userId, businessId])  — saving twice is a no-op, not a duplicate

Subject          (fixed, seeded: Language, IT, Math, Music, Art, Business, Exam)
 ├─ id, slug, nameTk/En/Ru, icon (Material Symbols name, drawn inline)

Offering         (business 1───many; a Course or a service)
 ├─ id, businessId, title, description, price, prepaymentAmount
 ├─ subjects     (many-to-many; a course can span several, e.g. Business+Language)
 └─ teachers     (many-to-many; education-specific, optional per category)

Teacher          (staff of a center; assigned to groups)
 ├─ id, businessId, name, bio, photo

Group (topar)    (offering 1───many; a concrete section of a course)
 ├─ id, offeringId, teacherId (one teacher, e.g. Merjen)
 ├─ addressId    (optional; which of the business's addresses this group meets at)
 ├─ days Int[]   (weekday pattern, e.g. [1,3,5] or [2,4,6])
 ├─ timeOfDay    (MORNING | AFTERNOON | EVENING — irdenki/günortanky/agşamky)
 ├─ startTime, endTime, capacity (0 = unlimited)

Booking          (client 1───many)
 ├─ id, clientId (User), offeringId, groupId (the chosen topar)
 └─ status       (PENDING → CONFIRMED → CANCELLED / COMPLETED)

Payment          (booking 1───1)
 ├─ id, bookingId, amount, provider, externalRef
 └─ status       (PENDING → PAID / FAILED / REFUNDED)
```

## 4. Roles

| Role   | Capabilities |
|--------|--------------|
| ADMIN  | Approve/reject businesses (`/admin`); seeded only (not via signup) |
| OWNER  | Create/edit own Business (starts PENDING), Offerings, Groups, Teachers; upload photos; view own bookings |
| CLIENT | Browse **approved** businesses/offerings; book a group + prepay; view own bookings |

**Business approval:** a new Business is `PENDING` and hidden from public browse
(`GET /businesses` returns only `APPROVED`). An ADMIN approves it via
`PATCH /admin/businesses/:id/approve` (or `/reject`). Signup lets a user choose
CLIENT or OWNER; ADMIN is seeded only.

Enforced by NestJS `RolesGuard` + `@Roles('OWNER')`. Ownership checked in service layer
(an OWNER manages only businesses they own).

## 5. Auth — password login + reverse-SMS verification

Login is **phone + password**. The **reverse-SMS** mechanism proves phone ownership
for two things: (a) verifying a new account, (b) forgot-password reset. The user proves
ownership by **sending an empty SMS from their phone to our SIM**; a future Android app
reads the incoming SMS and reports the sender to the server.

### Register (account verification)
```
1. POST /auth/register { phone, password, name?, email? }
      → create User (passwordHash, phoneVerified=false)
      → create PhoneVerification (ACCOUNT_VERIFICATION, PENDING, +10min)
      → returns { verificationId, sendSmsTo: "+993 XX XXXXXX" }

2. User sends EMPTY SMS from their phone  ──▶  our SIM (Android app)

3. POST /auth/sms/incoming { fromPhone }   [protected by GATEWAY_SECRET]
      → find latest PENDING verification where phone == fromPhone
      → mark VERIFIED; if ACCOUNT_VERIFICATION → set user.phoneVerified=true

4. Frontend polls GET /auth/status/:verificationId
      → once VERIFIED: returns { accessToken, refreshToken }  (auto-login)
```

### Login
```
POST /auth/login { phone, password }
      → verify password + phoneVerified → returns { accessToken, refreshToken }
```

### Forgot / reset password
```
1. POST /auth/forgot-password { phone }
      → create PhoneVerification (PASSWORD_RESET, PENDING, +10min)
      → returns { verificationId, sendSmsTo }

2. User sends EMPTY SMS  ──▶  our SIM  ──▶  POST /auth/sms/incoming (as above)
      → verification VERIFIED

3. Frontend polls GET /auth/status/:verificationId
      → once VERIFIED (PASSWORD_RESET): returns { resetToken }  (short-lived)

4. POST /auth/reset-password { resetToken, newPassword }
      → set new passwordHash; revoke existing refresh tokens
```

### Tokens
- **Access** JWT (short-lived, ~15m), **Refresh** JWT (long-lived, ~7d, hash stored in DB).
- `POST /auth/refresh` rotates tokens; `POST /auth/logout` revokes the refresh token.

### Abstraction / mock
Both the real Android app and the mock call ONE internal service `IncomingSmsService.report(fromPhone)`.
- Real:  `POST /auth/sms/incoming`      (Android app, needs `GATEWAY_SECRET`)
- Mock:  `POST /auth/dev/simulate-sms`  (dev-only, no SIM needed)

When the Android app ships, it calls the real endpoint — zero changes to auth logic.

### Security rules
1. `/auth/sms/incoming` requires `GATEWAY_SECRET`. This is the whole security model:
   only the app that physically reads the SIM may confirm an incoming SMS.
2. Verification expires (~10 min) → prevents replay of old SMS.
3. Rate-limit `/auth/request`.
4. `/auth/dev/simulate-sms` disabled in production.

## 6. Booking + payment flow

```
CLIENT picks offering + schedule
   → POST /bookings              (Booking PENDING)
   → POST /payments             → PaymentService.create()
                                     └─ PaymentProvider (interface)
                                          ├─ MockPaymentProvider  (now)
                                          └─ BankCardProvider     (later)
   → Payment PAID → Booking CONFIRMED
   (mock: dev endpoint flips PAID/FAILED to simulate the bank)
```

### PaymentProvider interface (the seam)
```ts
interface PaymentProvider {
  createPayment(input): Promise<{ id; status; redirectUrl? }>;
  verifyPayment(ref): Promise<PaymentStatus>;
}
```
Swap mock → real bank = one new class, no changes to bookings.

## 7. Cross-cutting
- **Storage**: `StorageService` wraps `@aws-sdk/client-s3` pointed at MinIO. Swappable to
  AWS by changing the endpoint URL only.
- **Validation**: `class-validator` DTOs on every endpoint.
- **Errors**: global NestJS exception filter → consistent JSON error shape.
- **Frontend state**: React Query + typed axios client; backend types flow to UI.
