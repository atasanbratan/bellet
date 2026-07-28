# Bellet — TODO / Progress

> **HOW TO USE:** Work top-to-bottom. Check off `[x]` finished items. Keep the
> **CURRENT STATUS** block accurate so the next session resumes cleanly.

---

## ▶ CURRENT STATUS
- **Phase:** Phases 0–6 complete ✓. **Full-stack MVP built — backend + frontend.**
- **Group dates + enrollment window (2026-07-28):** each Group now carries an optional
  **startDate**, **durationWeeks** (weeks), and an **enrollment window** `enrollFrom→enrollUntil`
  (kabul edilişik). Migration `20260728120000_group_dates`. Booking is rejected outside the
  window with error codes `GROUP_FULL` / `ENROLL_NOT_OPEN` / `ENROLL_CLOSED`
  (`bookings.service` + `offerings/group-dates.ts`; frontend maps codes in `useBookingFlow`,
  disables/relabels the Book button in `GroupList`). Owners set dates when adding a group
  (`GroupDatesFields` in `GroupAddForm`) and **bulk-apply to selected groups** via one atomic
  endpoint `PATCH /offerings/:id/groups/dates` (`GroupDatesBulkPanel` in `GroupEditor`).
  Public display via `components/GroupDates.tsx` (start date, "{n} weeks", enrollment badge).
  Helpers: `lib/dates.ts`, `lib/enrollment.ts`. New i18n keys under `group.*` / `dash.*` (tk/en/ru).
- **Course model refined (2026-07-08):** a course (Offering) now runs as **Groups (toparlar)** —
  each group = day-pattern (e.g. 1,3,5 / 2,4,6) + time-of-day (morning/afternoon/evening) +
  one teacher + capacity. Bookings target a specific group; capacity enforced. Migration
  `20260708120000_groups` applied; seed has English (2 groups), Russian, Math. UI + i18n updated.
- **UI:** modern redesign (mesh-gradient hero, generated SVG cover art, glass nav) +
  **i18n in 3 languages: Türkmen / English / Русский** (dependency-free, switcher in nav,
  persisted in localStorage; strings in `frontend/src/i18n/translations.ts`).
- **Polish pass (2026-07-09):** owner dashboard now has **business edit + delete**,
  **offering inline edit**, **teacher edit/delete + photo upload** (click avatar);
  public browse has a **search box** (`GET /businesses?search=` matches name,
  description, and course titles, case-insensitive). Deletes that would orphan
  bookings are blocked server-side with **409** (business/offering/group) and the UI
  shows a friendly localized message. New i18n keys added in tk/en/ru.
- **Global search (2026-07-09):** Udemy-style long search bar centered in the nav
  (own row on mobile). Live dropdown suggestions grouped Centers / Courses / Teachers
  via new `GET /search?q=` (backend `modules/search`, approved businesses only,
  min 2 chars, 5 per group). Enter / "see all" → `/?search=…` (HomePage reads the
  URL param and scrolls to results). Component: `frontend/src/components/GlobalSearch.tsx`.
- **Content i18n (2026-07-09):** owner-entered content (course title/description,
  business description) can now be stored in **3 languages** via optional columns
  `titleTk/En/Ru`, `descriptionTk/En/Ru` (migration `i18n_content`). Legacy
  `title`/`description` hold the first available language (server keeps them in
  sync) for old data + search. Frontend picks the viewer's language and **falls
  back to any available translation** (`lib/i18nContent.ts` `locText`); owner
  forms have TK/EN/RU tab editors (`components/LangTabs.tsx`). Search (global +
  browse) matches all language columns.
- **Admin payments (2026-07-09):** admin dashboard has a **Payments** section —
  paginated table (`GET /admin/payments?page&pageSize`, ADMIN-only) of all course
  payments: client, course (localized), center, amount, status, date.
- **Refactor (2026-07-09):** repo rules in CLAUDE.md — **max 150 lines per
  frontend file, 300 per backend file** (exempt: `i18n/locales/*`,
  `components/visuals.tsx`). Pages are thin shells composing `features/<area>/`
  components (`owner/`, `admin/`, `home/`, `course/`, `business/`, `auth/`,
  `components/search/`); translations split into `i18n/locales/{tk,en,ru}.ts`;
  lang-value helpers in `lib/i18nContent.ts`. All files comply.
- **Dark mode (2026-07-09):** site-wide dark theme. Sun/moon toggle in the nav
  (`components/ThemeToggle.tsx`), persisted in localStorage, defaults to the OS
  preference; `lib/theme.ts` sets the `dark` class on `<html>` before React
  renders (no flash). Tailwind v4 class-based variant via `@custom-variant dark`
  in `index.css` (+ dark body/glass/mesh-soft styles); `dark:` utilities added
  across all components. Native inputs follow `color-scheme: dark`.
- **Category-aware UI (2026-07-10):** teachers/courses/groups are shown only for
  the education category (`lib/category.ts` `isEducation`). Other categories
  (car wash, barber…) show **Services** instead: no teachers section/sidebar, no
  group editor/picker, and clients **book directly without a group** (backend
  already allowed optional `groupId`; `useBookingFlow` now sends it only when
  picked). New i18n keys (`detail.services`, `dash.add_service`,
  `home.services_count`, `book.price`, …); nav-search "Courses" section renamed
  "Courses & services". Verified e2e with a carwash business
  ("Shine Awtoýuwalga" in dev data): create → approve → add service → book
  group-less → payment created.
- **Education-only + 1:1 owner (2026-07-13):** carwash/barber categories and any
  businesses under them were **removed** (migration
  `20260713090000_education_only_one_business_per_owner`); the category-branching
  "Services" UI from 2026-07-10 was reverted. **Owner decision:** future
  categories get their **own domain tables** (car wash = hourly queue slots), do
  not reuse Offering/Group — noted in ARCHITECTURE.md §3. `Business.ownerId` is
  now **unique**: one owner = one center; `POST /businesses` returns 409 for a
  second one, `GET /businesses/mine` returns the single business (or null).
- **Owner dashboard menu + payments (2026-07-13):** owner dashboard restructured
  like the admin one — sidebar sections My center / Teachers / Courses /
  Bookings / Payments (shared `components/DashboardSidebar.tsx`; owner sections
  in `features/owner/`). New `GET /owner/payments` (OWNER-scoped to own
  business).
- **Payments data table (2026-07-13):** admin + owner payments share
  `features/payments/` — stat tiles above the table (payment count, total
  amount, paid amount over the *filtered* set) and a filter input under every
  column header: client (name/phone), course (any language), center (admin
  only), status select, and date from/to. Backend: `QueryPaymentsDto` +
  `payments-where.ts`, debounced fetch on the frontend.
- **Group seats (2026-07-13):** group listings include active (non-cancelled)
  booking counts (`_count.bookings`); clients see "left/total seats" and full
  groups have a disabled Book button; owners see "taken/total" per group in the
  course editor (`lib/seats.ts`).
- **Owner courses UI simplified (2026-07-13):** the dashboard Courses section is
  now an accordion — each course is a collapsed row (title, price·advance,
  groups count); expanding shows edit/delete and its groups. The add-course and
  add-group forms open on demand behind "+ Add course" / "+ Add group" buttons
  (`OfferingsSection` → `OfferingRow` + `OfferingAddForm`; `GroupEditor`
  toggles `GroupAddForm`). New i18n key `group.title`.
- **Owner bookings data table (2026-07-13):** the dashboard Bookings section is
  now a full data table like Payments — stat tiles (total / confirmed /
  pending, cancelled as a subtitle) + per-column filters (client, course,
  status, date from/to) + pagination via new `GET /owner/bookings`
  (`QueryBookingsDto`, `bookings-where.ts`; stats via `groupBy(status)`).
  Shared table plumbing extracted: `lib/usePagedTable.ts` (hook + `tableParams`
  + filter-input style), `components/TablePager.tsx`, `components/StatTiles.tsx`
  — payments/users tables now reuse them; backend filter helpers unified in
  `common/query.ts`; owner API calls consolidated in `api/owner.ts`.
- **Teachers table view (2026-07-13):** the dashboard Teachers section is now a
  data table (columns Teacher / Bio / actions) styled like the other tables;
  add form behind "+ Add teacher" (`TeacherAddForm`), inline edit with
  save/cancel in the row, click-avatar photo upload kept. New key `table.bio`.
- **Group cards (2026-07-13):** groups render as cards on both sides via shared
  `components/GroupCard.tsx` (day chips, time, teacher, seats badge; `corner` /
  `footer` slots). Client course page: 2-col card grid with Book button in the
  card (full → disabled). Owner course editor: same cards with a delete × and
  "taken/total" seats.
- **Gateway online status (2026-07-13):** the Android app now reports itself
  online. New `SmsGateway` model (migration `sms_gateway`); `GatewayModule`
  (`backend/src/modules/gateway/`) exposes `POST /gateway/heartbeat`
  (GATEWAY_SECRET-guarded, called by the app on start/toggle/every 15 min) and
  admin-only `GET /admin/gateways`. A gateway is "online" until its heartbeat
  goes stale past `GATEWAY_ONLINE_TTL_SEC` (default 1200s = 20 min — survives
  one missed periodic beat); no explicit offline signal exists since Android
  can't reliably report its own shutdown. `AuthService.sendSmsTo` now returns
  the active gateway's number (falling back to `OUR_SMS_NUMBER` if none is
  online), so the "send an empty SMS to X" screen shows a live number instead
  of a static config value. Admin dashboard has a new **Gateways** tab listing
  phone numbers with an online/offline badge and relative last-seen time
  (polls every 15s). Kotlin app: new phone-number field in settings
  (typed once — Android can't reliably read the SIM's own number),
  `HeartbeatWorker` + `HeartbeatScheduler` (immediate + 15-min periodic via
  WorkManager); verified `./gradlew compileDebugKotlin` succeeds.
- **Multi-address + province filter + denser home (2026-07-17):** a business can
  now have **several addresses** (buildings in different towns) instead of one
  free-text field. New `Province` model (Turkmenistan's 5 welayats + Aşgabat,
  seeded) and `Address` model (`businessId`, `provinceId`, `line`); migration
  `20260717120000_business_addresses` drops `Business.address` and migrates
  existing values into one `Address` row each (province defaults to Ashgabat —
  unknown for old free text, owners should fix it). `Group.addressId` (optional)
  lets a group point at one of its business's addresses; validated server-side
  to belong to the same business. New modules: `modules/provinces` (public
  `GET /provinces` list) and `modules/addresses` (owner CRUD, nested under
  `businesses/:businessId/addresses`; blocks deleting an address a group still
  uses). Public browse takes `?province=<id>` and filters by
  `addresses.some.provinceId`. Frontend: owner dashboard "My center" has a new
  **Addresses** panel (`features/owner/AddressesPanel.tsx`); group add form has
  a province+line picker; `GroupCard`/`BusinessDetailPage` show address info.
  Home page: **Hero cut down to a slim header bar** (title + subtitle + one CTA,
  no big gradient banner) so the business grid is visible immediately; added a
  province `<select>` next to search; `BusinessGrid` is now **4 cards per row**
  on large screens (denser cards: smaller cover, tighter padding/type).
- **Stitch design system (2026-07-17):** adopted the palette/shape language from
  the owner's Google Stitch project ("Bellet Professional"). Its tokens map onto
  Tailwind's built-ins exactly: primary `#0f172a` = `slate-900`, accent `#0d9488`
  = `teal-600`. So: **indigo → teal** across the app (50 files); `emerald` folded
  into teal (the design system's functional palette is red=unavailable,
  amber=pending, **teal=confirmed** — emerald was a second green fighting the
  accent); off-palette fuchsia/violet/sky removed. Radii collapsed to a 3-tier
  scale (`rounded-lg` 8px cards / `rounded` 4px controls / `rounded-full`
  avatars). Elevation per spec: flat cards + 1px border, hover only
  `0 4px 12px rgba(15,23,42,.08)`; dropped the coloured shadow glows and card
  translate. Header is solid, not glass. Cover gradients retoned candy→slate/teal,
  logo flattened to a solid teal mark, rainbow stat tiles unified to one teal chip.
  `types.ts` had crossed the 150-line cap → split into `types/catalog.ts` +
  `types/admin.ts` behind the existing barrel.
- **Stitch public screens + subjects (2026-07-17):** rebuilt Browse and Centre
  Detail to the Stitch layouts.
  - **Subject** model (seeded: Language, IT, Math, Music, Art, Business, Exam
    prep) **many-to-many with Offering** — owner decision: a course can cover
    several subjects. Migration `20260717140000_course_subjects`. New
    `GET /subjects` (each with a count of approved centres teaching it, for the
    sidebar). `modules/subjects/`.
  - **Browse** (`GET /businesses`) now takes `?subject=&province=&search=` and is
    **paginated** (`?page&pageSize`, default 12, max 48) returning the standard
    `Paginated<T>` envelope — this closes the long-standing "browse is
    unpaginated" TODO. Filter/paging logic extracted to
    `businesses/browse-query.ts`. Each card carries the centre's deduped subject
    set (union across its courses).
  - **Frontend:** left `SubjectsPanel` sidebar (counts, 2px teal active bar),
    unified `BrowseFilters` bar, result count, numbered `Pager` (window logic in
    pure `lib/pageWindow.ts`). Detail page is Stitch's 12-col split: About +
    **Our locations** + Teachers (col-4) / courses as `CourseRow` accordions with
    inline `GroupScheduleRow` schedules — days/time/teacher/seat bar (col-8).
    Owner course forms got a `SubjectPicker` (toggle chips) — without it subjects
    would be seed-only and the filter dead on arrival.
  - **Deliberate deviations from the mockups** (see notes below): no ★ ratings
    (no such data — owner chose to omit rather than fake); no Material Symbols
    icon font (Google CDN is not dependable in-country — same reason storage is
    self-hosted; subject glyphs are inline SVG in `visuals.tsx`); no "Search"
    button (our search is live/debounced, a button would be a no-op); group rows
    are informational and booking stays on the course page, which is where the
    pick→confirm→pay state machine lives.
  - Dev seed gained `prisma/demo-centers.ts` — 8 extra approved centres across
    the welayats so the grid/filter/pagination have something to show.
  - Verified: browse/detail/dark screenshotted via headless Playwright+Firefox;
    subject round-trip (owner PATCH multi-subject → filter goes live → counts
    refresh → bad id = 400), pagination 3 pages over 9 centres, combined
    subject+province+search all curl-checked.
- **Owner dashboard Overview (2026-07-17):** Stitch's owner bento, added as the
  **landing section**; the existing My center / Teachers / Courses / Bookings /
  Payments sections all stay (owner's choice), so the paginated+filterable
  payments/bookings tables are untouched.
  - New `GET /owner/stats` (`modules/owner/`, OWNER-guarded) → revenue (sum of
    PAID advances on this centre's bookings), bookings, distinct students with a
    live booking, courses, teachers.
  - **Trend deltas are computed, not faked**: last 30 days vs the 30 before.
    `deltaPct` is **null when the previous window was empty** — a percentage
    change from zero is meaningless and "+100%" would overstate it; the UI then
    shows no badge and hides the explanatory note. 0% renders neutral grey, not
    green.
  - Frontend: `OverviewSection` (tiles + bento), `OverviewTiles`/`OverviewTile`,
    `CoursesSummary` (fill bar per course = seats taken across its groups),
    `RecentBookings` (5 newest, reuses `ownerApi.listBookings` + the existing
    `EMPTY_FILTERS`), `TeachersSummary`. Panel "manage/see all" buttons jump to
    the corresponding sidebar section.
  - Shared stat glyphs moved `features/admin/StatTile.tsx` → `components/StatIcons.tsx`
    (now used by both dashboards; features must not import each other's internals).
  - `DashboardSidebar` active state restyled to the design system's teal edge +
    tint (was a solid black block); benefits the admin sidebar too.
  - Seed: `seedDemoBookings` adds two paid bookings on the demo centre — one in
    the current window, one backdated 45 days — so the overview has real revenue
    and a real trend out of the box. Verified: 50 TMT prior + 100 TMT recent →
    total 150, deltaPct +100; guards 403 (client) / 401 (anon).
- **Demo cover photos from Stitch (2026-07-17):** pulled the AI-generated
  imagery out of the owner's Stitch mockups and attached it to the demo centres.
  - **Self-hosted, not hotlinked.** The mockups point at
    `lh3.googleusercontent.com/aida-public/…`; those are Google-CDN links that
    expire (one of the 20 was already dead when downloaded) and Google's CDN is
    not something to depend on in-country — the same reason storage is MinIO.
    So the files ship in `backend/prisma/demo-assets/` (~436 KB) and
    `prisma/demo-photos.ts` uploads them to MinIO at seed time under stable keys
    (`businesses/demo/*.jpg`), which keeps seeding offline and idempotent.
    Nothing in the repo references Google's CDN.
  - **Only venue interiors were used** (classroom, lobby, computer/language lab,
    music room, art studio, study desk, seminar, coding), each matched to what
    the centre teaches. Deliberately excluded: **a Google Maps screenshot of
    Toronto** (Google's copyrighted map data), and **7 photorealistic
    AI-generated faces** — attaching invented people to named teachers would
    present fabricated staff as real. Teacher photos remain empty pending the
    owner's call.
  - These are placeholder/demo assets for seeded fake centres only; real owners
    upload their own photos through the existing MinIO flow.
- **Admin overview bento (2026-07-17):** the Stitch admin canvas, applied the
  same way as the owner one — the **Overview** section becomes the bento; the
  Businesses / Users / Payments / Gateways sections all stay.
  - `AdminOverview` = existing stats tiles + meters, then an operational grid:
    **`PendingApprovals`** (approve/reject inline, xl 2/3) + **`GatewaysSummary`**
    (online dot, relative last-seen, polls 15s, xl 1/3). These are the two
    things that actually need a human: centres waiting on a decision, and
    whether any SMS gateway is alive — phone verification silently breaks when
    none is. Stat tiles regridded to `xl:grid-cols-5` (5 tiles were wrapping
    3+2 and leaving a hole).
  - **Not built, no backend for it** (mockup shows them; flagged to owner):
    *Platform Activity* (an audit log — a real feature, not a panel) and
    *Platform Config* (maintenance-mode/alert toggles — these are env vars
    today, and making them runtime-editable has security implications).
    Also dropped Stitch's **"SMS Success Rate 99.2%"** tile: delivery outcomes
    aren't recorded anywhere server-side, so the number would be invented.
    `GatewaysSummary` shows real online/offline instead.
  - Seed gained `seedPendingCenters` (2 PENDING centres, so the admin queue
    isn't empty) and `seedDemoGateways` (one beating now, one backdated 4h so
    it reads offline via the TTL). Verified: approve in the UI clears the row
    and the centre appears in public browse; PENDING centres stay hidden from
    browse.
- **Share + Save on centres (2026-07-17):** the two listing-page actions.
  - **Save = client bookmark.** New `SavedCenter` model (migration
    `20260717160000_saved_centers`) with `@@unique([userId, businessId])`, so
    saving twice is a no-op instead of a duplicate row. `modules/saved/`:
    `POST/DELETE /businesses/:id/save` (both idempotent), `GET /me/saved`
    (full card shape for the Saved page) and `GET /me/saved/ids` (ids only, so
    the browse grid marks hearts without refetching cards). Unapproved centres
    can't be bookmarked → 404; anonymous → 401.
  - **Frontend:** `SavedProvider` holds the id set once per session and toggles
    optimistically, rolling back if the request fails. `SaveButton`
    (icon variant on cards, labelled on detail; logged-out → `/login`),
    `ShareButton` (native share sheet where available, clipboard fallback with
    a "Link copied" flash — no backend). New `/saved` page + nav link, both
    auth-gated.
  - Verified in-browser: hearting a card persists across reload, the Saved page
    lists exactly the saved centres, logged-out hearting redirects to login and
    the nav link is hidden.
- **Header avatar menu (2026-07-17):** Saved / My Bookings / Logout moved out of
  the nav bar into a monogram avatar dropdown (`components/UserMenu.tsx`).
  Browse, Dashboard and Admin stay as top-level links.
  - The access token previously carried only `sub/role/phone`, so the client had
    **no name to build a monogram from**. `issueTokens` now includes `name`;
    it's a 15-minute token re-minted on refresh, so it can't drift far from the
    row, and this avoids an extra `/me` round-trip plus an avatar loading state.
    `name` is optional at signup → the monogram falls back to the phone.
  - Menu closes on outside-click and Escape, has `role="menu"`/`menuitem` and
    `aria-expanded`, and shows the saved count as a badge.
  - Extracted `lib/useClickOutside.ts` rather than writing the search
    dropdown's mousedown/contains logic a second time; `useGlobalSearch` now
    uses it too and gained Escape-to-close for free.
  - Fixed a pre-existing wrinkle: logging out from an auth-gated page landed on
    `/login`, because the route guard fired the moment the session cleared and
    beat the `navigate('/')`. It now navigates away first, then clears.
- **Pixel identicon avatars (2026-07-17):** users now get a deterministic pixel
  avatar instead of a monogram — `lib/identicon.ts` (pure) + `components/Identicon.tsx`.
  Used in the header `UserMenu` and the admin Users table.
  - **Generated locally, zero deps.** An avatar service (DiceBear/Gravatar) would
    put a third party in the render path — the Google-CDN problem again — and
    hand them a user identifier. Reuses the existing `hashString` from `cover.ts`.
  - Keyed on **user id, not name**: name is optional at signup, so the monogram
    was falling back to a phone number. The identicon needs no name at all.
  - 5×5 grid mirrored down the middle (mirroring is what makes random bits read
    as a face rather than noise); a separate hash picks the ink so colour isn't
    correlated with the pattern.
  - Two fixes found only by looking: (1) `rounded-full` clipped the corner
    pixels and turned them into blobs → square tile + one cell of padding;
    (2) the first ink set used the app's dark shades, which **vanished against
    the dark-mode tile** → mid-tone inks that hold contrast on both slate-100
    and slate-800. Verified in light and dark.
  - Note: avatars are the one place the no-rainbow rule is relaxed — variety is
    functional here (telling users apart), unlike UI chrome. `Avatar`
    (monogram+gradient) still serves teachers/businesses, which do have names.
- **Cover aspect ratios (2026-07-17):** the browse card and the detail banner
  show the same photo, but framed it completely differently.
  - **Underlying bug:** both used a fixed height with a fluid width, so the
    ratio — and therefore the crop — changed with the viewport (banner was
    3.8:1 at 768px but 5.2:1 at 1440px). Now pinned with `aspect-*`, so
    framing is deterministic at every width.
  - Sources are all ~1.84:1 (512×279). Card is now `aspect-[16/9]` → shows
    ~100% of the photo (was ~88%). Banner is `aspect-[3/1]` on desktop →
    ~61% (was ~35%, i.e. a thin slice that looked unrelated to the card), and
    stays 16:9 on phones where 3:1 would be a ~125px sliver.
  - Owner chose this over a truly identical ratio: 16:9 on both would mean a
    ~700px banner pushing About/Locations/Courses below the fold.
  - Measured in-browser at 1440/768/390: card 1.78 everywhere, banner 3.00
    then 1.78 on mobile.
- **Next tasks (not yet done):** Stitch's multi-step Checkout (deferred by the
  owner). Also still open: automated tests; Admin audit log / platform config
  (above); `{n} groups` strings don't pluralise ("1 groups"); the 7 AI-generated
  face images from Stitch are unused pending the owner's call on demo teacher
  avatars.
- **Verified:** backend end-to-end (see below); frontend builds + serves at :5173 and
  proxies /api to the backend.
- **Run it:** `npm run infra:up` then `npm run dev:backend` + `npm run dev:frontend`.
- **Roles + approval (2026-07-08):** signup now offers **Client / Business owner**. New
  businesses are **PENDING** and hidden from public browse until an **ADMIN** approves them
  (`/admin` dashboard: approve/reject). Migration `20260708140000_business_approval`.
- **Test users (password `password123`):** admin `+99360000000`, owner `+99361000000`,
  client `+99361111111`.
- **Waiting on user:** bank card payment documentation (for real payment provider, Future).

---

## Phase 0 — Project setup ✓
- [x] Monorepo structure (`backend/`, `frontend/`, root `package.json` workspaces)
- [x] `docker-compose.yml`: postgres + minio (volumes; postgres healthcheck)
- [x] Backend: NestJS init + config module + `.env.example` + `/api/health`
- [x] Frontend: Vite + React + TypeScript + Tailwind v4 init
- [x] Root README with run instructions

## Phase 1 — Data model ✓
- [x] Prisma schema: User, RefreshToken, PhoneVerification, Category, Business,
      Offering, Teacher, Schedule, Booking, Payment (+ enums)
- [x] Initial migration (`20260707095539_init`)
- [x] Seed script (3 categories + test owner/client + sample business/course)

## Phase 2 — Auth (password + reverse-SMS verification) ✓
- [x] `POST /auth/register { phone, password, name?, email? }` → create user + verification
- [x] `POST /auth/login { phone, password }`
- [x] `IncomingSmsService.report(fromPhone)` — match & verify pending verification
- [x] `POST /auth/sms/incoming` — protected by `GATEWAY_SECRET`
- [x] `POST /auth/dev/simulate-sms` — dev-only mock (disabled in prod)
- [x] `GET /auth/status/:verificationId` — polling → tokens (verify) or resetToken (reset)
- [x] `POST /auth/forgot-password` + `POST /auth/reset-password`
- [x] JWT access + refresh tokens (rotating, DB-stored hash) + `/refresh` + `/logout`
- [x] `RolesGuard` + `@Roles()`, `CurrentUser` decorator, `JwtAuthGuard`
- [x] Rate limit (ThrottlerGuard) on `/auth`; verification expiry (10 min)

## Phase 3 — Business & offerings (OWNER) ✓
- [x] Categories module (seeded Education/CarWash/Barber) — `GET /categories`
- [x] Business CRUD (owner-scoped) + `GET /businesses/mine`
- [x] Offering CRUD (with teacher links)
- [x] Teacher CRUD (+ photo upload)
- [x] Schedule CRUD (`POST /offerings/:id/schedules`, `DELETE /offerings/schedules/:id`)
- [x] `StorageService` (MinIO, auto-bucket + public policy) + photo upload endpoints

## Phase 4 — Browsing (CLIENT) ✓
- [x] List / search businesses by category (`GET /businesses?category=slug`)
- [x] Business detail (`GET /businesses/:id`: info, photos, offerings, teachers, schedules)
- [x] Offering detail (`GET /offerings/:id`)

## Phase 5 — Booking + payment ✓
- [x] Booking flow (`POST /bookings`, `GET /bookings/mine`, cancel, owner view)
- [x] `PaymentProvider` interface + `MockPaymentProvider` (swappable via DI token)
- [x] Payment created with booking (prepayment/awans) + redirectUrl
- [x] Payment PAID → Booking CONFIRMED
- [x] Dev endpoint `POST /payments/dev/simulate` (dev-only)

## Phase 6 — Frontend ✓
- [x] API client (axios) with auto token-refresh + typed models + AuthContext
- [x] Auth UI: register → "send empty SMS to X" → poll status → auto-login;
      login; forgot-password → SMS → reset (all with dev "Simulate SMS" button)
- [x] Client browse UI (category filter, business list, business detail)
- [x] Booking + mock-payment dialog; My Bookings (pay advance / cancel)
- [x] Owner dashboard (create business, manage teachers/offerings/schedules/photos,
      view bookings) with route guards (RequireAuth / RequireOwner)

## Phase 7 — Polish (in progress)
- [x] Business edit + delete UI (owner dashboard)
- [x] Offering edit UI (inline form)
- [x] Teacher edit/delete UI + photo upload (click avatar)
- [x] Search on public browse (`?search=` — name/description/course title)
- [x] Global nav search bar (Udemy-style) + `GET /search?q=` grouped suggestions
- [x] Content i18n: course title/description + business description in TK/EN/RU
      with fallback to any available translation
- [x] Admin payments table with pagination
- [x] 409 guards: block deleting business/offering/group that has bookings
- [x] One business per owner (unique ownerId) + education-only categories
- [x] Owner dashboard sidebar menu + owner payments view
- [x] Payments data table: per-column filters, date range, stats row
- [x] Group seats: total + remaining shown; full groups not bookable
- [ ] Pagination for public business list
- [ ] Automated tests (backend e2e, frontend)

## Future (not yet)
- [ ] Real bank card `PaymentProvider` (awaiting user's bank docs)
- [x] Android SMS-gateway app → calls `POST /auth/sms/incoming`
      **(2026-07-09: built in Kotlin at `gateway/` — manifest SmsReceiver +
      WorkManager + Compose UI; see `gateway/README.md`. Not yet compiled /
      tested on a device — needs Android Studio build + real phone.)**
- [ ] Additional categories: car wash, barber, etc. — **each with its own domain
      tables** (e.g. car wash = hourly queue slots), not the course/group model
      (owner decision 2026-07-13)
