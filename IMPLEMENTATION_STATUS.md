# 📊 AgriSathi AI — Implementation Status

> Last updated: 2026-11-21 · Status: **Pre-Development**

---

## Overall Progress

```
Milestone 1 — Foundation      ████████░░░░░░░░ 50%  🟡 In Progress
Milestone 2 — Core AI         ░░░░░░░░░░░░░░░░  0%  ⬜ Blocked on M1
Milestone 3 — Data            ░░░░░░░░░░░░░░░░  0%  ⬜ Blocked on M2
Milestone 4 — Multilingual    ░░░░░░░░░░░░░░░░  0%  ⬜ Blocked on M1
Milestone 5 — PWA             ░░░░░░░░░░░░░░░░  0%  ⬜ Blocked on M1
Milestone 6 — Community       ░░░░░░░░░░░░░░░░  0%  ⬜ Blocked on M2
Milestone 7 — Production      ░░░░░░░░░░░░░░░░  0%  ⬜ Blocked on M6
```

---

## Milestone 1 — Foundation & Scaffolding

| Task | Status | Notes |
|---|---|---|
| Monorepo root setup | ✅ Done | npm workspaces configured |
| `.gitignore` / `.gitattributes` / `.editorconfig` | ✅ Done | LF enforced, Windows CRLF handled |
| Next.js 15 scaffold (apps/web) | ✅ Done | App Router + TS + pages |
| Tailwind CSS 4 + shadcn/ui | ✅ Done | Brand colors configured |
| FastAPI scaffold (apps/api) | ✅ Done | Python 3.14, 6 routers |
| PostgreSQL schema + Prisma | 🟡 Partial | docker-compose ready, schema pending |
| Redis setup | ✅ Done | docker-compose configured |
| NextAuth.js v5 (OTP auth) | 🟡 Partial | Login page + mock OTP endpoint |
| Environment config (.env.example) | ✅ Done | 15 env vars documented |
| Docker Compose (local dev) | ✅ Done | pgvector + Redis 7 |
| GitHub Actions CI | ✅ Done | Frontend + backend pipelines |
| Initial Git commit | 🟡 Pending | npm install in progress |

---

## Milestone 2 — Core AI Features

| Task | Status | Notes |
|---|---|---|
| Gemini 2.0 Flash integration | ⬜ Pending | Needs API key |
| LangChain RAG pipeline | ⬜ Pending | |
| Agricultural knowledge base ingestion | ⬜ Pending | ICAR docs |
| Plant disease Vision AI | ⬜ Pending | |
| Crop recommendation engine | ⬜ Pending | |
| AI streaming (SSE) | ⬜ Pending | |
| Session / conversation management | ⬜ Pending | |

---

## Milestone 3 — Data Integrations

| Task | Status | Notes |
|---|---|---|
| OpenWeatherMap integration | ⬜ Pending | API key needed |
| IMD fallback | ⬜ Pending | |
| eNAM mandi price API | ⬜ Pending | |
| Agmarknet scraper | ⬜ Pending | |
| ICAR Soil API | ⬜ Pending | |
| Govt scheme data feed | ⬜ Pending | |
| Price alert webhooks | ⬜ Pending | |

---

## Milestone 4 — Multilingual & Voice

| Task | Status | Notes |
|---|---|---|
| next-intl setup | ⬜ Pending | |
| Hindi translations | ⬜ Pending | |
| Tamil, Telugu, Kannada | ⬜ Pending | |
| Bengali, Marathi, Gujarati | ⬜ Pending | |
| Punjabi, Odia, Malayalam | ⬜ Pending | |
| English base | ⬜ Pending | |
| Google STT integration | ⬜ Pending | Cloud API key |
| Google TTS integration | ⬜ Pending | Cloud API key |
| Language auto-detection | ⬜ Pending | |

---

## Milestone 5 — PWA & Offline

| Task | Status | Notes |
|---|---|---|
| Service Worker (Workbox) | ⬜ Pending | |
| Offline caching strategy | ⬜ Pending | |
| Push notifications | ⬜ Pending | |
| App manifest + icons | ⬜ Pending | |
| Install prompt | ⬜ Pending | |
| Lighthouse audit ≥ 90 | ⬜ Pending | |

---

## Milestone 6 — Community & Expert Connect

| Task | Status | Notes |
|---|---|---|
| Farmer Q&A forum | ⬜ Pending | |
| Expert verification system | ⬜ Pending | |
| Image upload (Cloudinary) | ⬜ Pending | API key needed |
| AI moderation pipeline | ⬜ Pending | |
| Rating & reputation system | ⬜ Pending | |

---

## Milestone 7 — Production Hardening

| Task | Status | Notes |
|---|---|---|
| Playwright E2E tests | ⬜ Pending | |
| Vitest unit tests | ⬜ Pending | |
| pytest API tests | ⬜ Pending | |
| Security audit | ⬜ Pending | |
| Docker production build | ⬜ Pending | |
| Vercel deployment | ⬜ Pending | |
| Railway API deployment | ⬜ Pending | |
| Sentry monitoring | ⬜ Pending | |

---

## 🔑 API Keys & Secrets Needed

| Service | Key Name | Status |
|---|---|---|
| Google Gemini | `GEMINI_API_KEY` | ❌ Not configured |
| Google Cloud (STT/TTS) | `GOOGLE_CLOUD_API_KEY` | ❌ Not configured |
| OpenWeatherMap | `OPENWEATHER_API_KEY` | ❌ Not configured |
| Cloudinary | `CLOUDINARY_*` (3 vars) | ❌ Not configured |
| MSG91 (SMS OTP) | `MSG91_API_KEY` | ❌ Not configured |
| Resend (Email) | `RESEND_API_KEY` | ❌ Not configured |
| NextAuth Secret | `NEXTAUTH_SECRET` | ❌ Not configured |
| DB Connection | `DATABASE_URL` | ❌ Not configured |
| Redis URL | `REDIS_URL` | ❌ Not configured |

---

## 📝 Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-11-21 | Use npm (not pnpm) | pnpm not installed on dev machine |
| 2026-11-21 | Windows dev environment | CRLF handling via .gitattributes |
| 2026-11-21 | Python 3.14 for backend | Already installed, latest stable |
| 2026-11-21 | Node.js 24 for frontend | LTS+, full support |
| 2026-11-21 | Git initialized, no remote | Add remote before first push |

---

## 🚨 Current Blockers

### BLOCKER 1 — CRITICAL: npm has no internet access
**Detected**: 2026-11-21 via background network probe

```
npm error code ENOTFOUND
npm error syscall getaddrinfo
npm error errno ENOTFOUND
npm error network request to https://registry.npmjs.org failed
```

All npm install / npx commands will fail until resolved. This affects:
- `npx create-next-app` (scaffold)
- Any `npm install` for packages
- Python `pip install` likely affected too

**Possible causes:**
1. Machine is behind a corporate/ISP proxy
2. DNS resolution failing for `registry.npmjs.org`
3. Firewall blocking outbound HTTPS on port 443
4. npm proxy config not set

**Recommended fixes (try in order):**
```powershell
# 1. Test raw connectivity
ping registry.npmjs.org

# 2. Check if npm proxy is needed
npm config get proxy
npm config get https-proxy

# 3. Set proxy if behind one (replace with your proxy URL)
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port

# 4. Try alternative registry
npm config set registry https://registry.npmmirror.com

# 5. Check DNS
nslookup registry.npmjs.org
```

### BLOCKER 2 — Plan approval pending
Awaiting developer approval before starting Milestone 1 implementation.

---

Once BLOCKER 1 is resolved and plan approved, Milestone 1 begins with:
1. `npm init` for monorepo root with workspaces
2. `npx create-next-app@latest apps/web`
3. FastAPI scaffold in `apps/api`
4. Docker Compose for local Postgres + Redis
