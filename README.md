# CineScript — AI Bollywood Script Generator

A cinematic, premium frontend that turns everyday moments into Bollywood blockbusters. Built with **React 19 + TanStack Start + Tailwind CSS + Framer Motion**.

---

## Quick start

```bash
bun install
bun run dev
```

The app reads its backend URL from `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Restart the dev server after editing `.env`. If the backend is unreachable, the script generator gracefully falls back to a local mock so the UI keeps working.

---

## Folder structure

```
cinescript/
├── .env                              # VITE_API_BASE_URL lives here
├── .env.example                      # Template for new environments
├── README.md
├── package.json
├── vite.config.ts
├── public/
└── src/
    ├── routes/                       # File-based routing (TanStack Router)
    │   ├── __root.tsx                # Root layout (HTML shell, providers)
    │   ├── index.tsx                 # / — landing + generator
    │   ├── login.tsx                 # /login
    │   └── signup.tsx                # /signup
    │
    ├── components/
    │   ├── Navbar.tsx                # Top nav (auth-aware)
    │   ├── Hero.tsx                  # Cinematic hero section
    │   ├── InputForm.tsx             # Situation + mood + generate
    │   ├── OutputDisplay.tsx         # Movie dashboard
    │   ├── CharacterCard.tsx         # Glass character card
    │   ├── SceneCard.tsx             # Scene + dialogue card
    │   ├── HistoryPanel.tsx          # Slide-in history sidebar
    │   ├── Loader.tsx                # Spinner + skeletons
    │   ├── Toast.tsx                 # Error toast
    │   └── AuthCard.tsx              # Shared login/signup form
    │
    ├── context/
    │   └── AuthContext.tsx           # Auth state + token persistence
    │
    ├── lib/
    │   ├── api.ts                    # Central API client (uses VITE_API_BASE_URL)
    │   ├── mockScript.ts             # Local fallback generator
    │   └── utils.ts
    │
    ├── styles.css                    # Design system tokens (gold/black theme)
    ├── router.tsx
    └── routeTree.gen.ts              # Auto-generated, do not edit
```

---

## Environment variables

| Name                 | Required | Example                       | Used in                  |
| -------------------- | -------- | ----------------------------- | ------------------------ |
| `VITE_API_BASE_URL`  | Yes      | `http://localhost:5000/api`   | `src/lib/api.ts`         |

All `VITE_*` variables are inlined at build time and shipped to the browser — never put secrets here.

---

## API contract

Every HTTP call originates from **`src/lib/api.ts`**. The auth token (returned by `/auth/login` or `/auth/signup`) is stored in `localStorage` and automatically sent as `Authorization: Bearer <token>` on every request.

Base URL: `${VITE_API_BASE_URL}`

### Authentication

#### `POST /auth/signup`
Create a new account.

**Request**
```json
{ "name": "Karan Johar", "email": "karan@studio.com", "password": "secret123" }
```
**Response 200**
```json
{
  "token": "jwt.token.here",
  "user": { "id": "usr_1", "name": "Karan Johar", "email": "karan@studio.com" }
}
```

#### `POST /auth/login`
**Request**
```json
{ "email": "karan@studio.com", "password": "secret123" }
```
**Response 200** — same shape as signup.

#### `GET /auth/me`
Returns the currently authenticated user. Requires `Authorization` header.

**Response 200**
```json
{ "user": { "id": "usr_1", "name": "Karan Johar", "email": "karan@studio.com" } }
```

#### `POST /auth/logout`
Invalidates the current token server-side. Requires `Authorization` header.

**Response 200** — `{ "ok": true }`

---

### Scripts

#### `POST /scripts/generate`
Generate a new Bollywood script from a situation + mood.

**Request**
```json
{ "situation": "I missed my train and met a stranger…", "mood": "Dramatic" }
```
`mood` ∈ `"Dramatic" | "Action" | "Comedy" | "Romantic" | "Tragic"`.

**Response 200**
```json
{
  "id": "scr_1",
  "title": "Jab Tak Tum Ho",
  "tagline": "Har lamha ek toofan hai…",
  "mood": "Dramatic",
  "situation": "I missed my train…",
  "characters": [
    { "name": "Aarav Khanna", "role": "The Protagonist", "description": "…" }
  ],
  "scenes": [
    {
      "number": 1,
      "title": "The Encounter",
      "description": "Rain drums on the windows…",
      "dialogues": [
        { "character": "Aarav", "line": "Tum yahaan?" }
      ]
    }
  ],
  "createdAt": 1715800000000
}
```

#### `GET /scripts`
List the authenticated user's scripts (newest first). Requires auth.

**Response 200** — `Script[]` (same shape as above).

#### `GET /scripts/:id`
Fetch a single script. Requires auth.

#### `DELETE /scripts/:id`
Delete a script. Requires auth. **Response 200** — `{ "ok": true }`.

---

## Error format

All non-2xx responses should return JSON with a human-readable message:

```json
{ "message": "Invalid credentials" }
```

The frontend surfaces this text directly via the `Toast` component / inline form errors.

---

## Suggested backend stack

Any HTTP server that implements the contract above will work — Express, Fastify, NestJS, FastAPI, Django REST, Go Fiber, etc. Recommended building blocks:

- **Auth**: JWT (HS256) issued on signup/login, verified via middleware.
- **DB**: PostgreSQL with `users` and `scripts` tables.
- **AI**: OpenAI / Gemini / Anthropic — generate the JSON shape returned by `/scripts/generate`.

---

## Design system

- Background `#0A0A0A`
- Gold gradient `#C9A227 → #FFD700`
- Typography: **Cormorant Garamond** (display) + **Inter** (body)
- Glassmorphism cards, gold glow on focus/hover, Framer Motion transitions.

All tokens live in `src/styles.css` (`oklch` values + custom utilities `text-gold-gradient`, `glass`, `glass-gold`, `glow-gold`, `shimmer`).
