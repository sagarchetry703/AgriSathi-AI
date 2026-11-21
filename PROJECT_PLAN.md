# 🌾 AgriSathi AI — Project Plan

> **AgriSathi AI** is a full-stack AI-powered agricultural assistant platform designed for Indian farmers, delivering crop advice, disease diagnosis, weather integration, market price alerts, and multilingual support via web and voice.

---

## ✅ Environment Audit Summary

| Check | Result | Status |
|---|---|---|
| Node.js | v24.20.0 | ✅ Excellent (LTS+ ready) |
| npm | v11.19.0 | ✅ Latest |
| Git | v2.56.1 (Windows) | ✅ Installed |
| pnpm | Not found | ⚠️ Will use npm |
| Python | 3.14.2 | ✅ Available (for AI backend) |
| PowerShell | 5.1 | ✅ Compatible |
| OS | Windows 10 Home 26H2 | ✅ Compatible |
| Git Repo | Initialized, no commits | 🟡 Fresh start — perfect |
| Existing files | None (clean slate) | ✅ Ready |
| Global tools | claude-code, opencode-ai | ✅ AI tooling present |

### ⚠️ Setup Issues Identified

1. **pnpm not installed** — We will use `npm` as the package manager throughout.
2. **Git LFS configured** — Ensure large model files or media assets go through LFS or external storage (Cloudinary / S3), not raw Git.
3. **No remote origin** — Add GitHub/GitLab remote before first push.
4. **Windows `core.autocrlf=true`** — Acceptable, but add `.editorconfig` and `.gitattributes` to prevent line-ending drift across platforms.
5. **WMI access denied** — Normal for sandboxed environments; no impact on development.

---

## 🎯 Product Vision

**AgriSathi AI** ("Farmer's Companion AI") empowers Indian smallholder farmers with:
- 🌱 AI crop advisor (disease, pest, fertilizer, irrigation)
- 📸 Image-based plant disease diagnosis (Vision AI)
- 🌦️ Hyper-local weather forecasting with actionable alerts
- 💹 Real-time mandi price tracking (eNAM / Agmarknet integration)
- 🗣️ Multilingual voice interface (Hindi + 10 regional languages)
- 👨‍🌾 Community Q&A and expert connect
- 📲 Progressive Web App (PWA) — works offline in low-connectivity areas

---

## 🗂️ Milestone Roadmap

### Milestone 1 — Foundation & Scaffolding *(Week 1–2)*
- [ ] Monorepo setup (apps/web, apps/api, packages/shared)
- [ ] Next.js 15 frontend with Tailwind CSS + shadcn/ui
- [ ] FastAPI backend (Python 3.14) with async support
- [ ] PostgreSQL + Prisma ORM schema
- [ ] Redis cache layer
- [ ] Auth system (NextAuth.js v5 — credentials + OTP via mobile)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment config (.env structure, secrets management)
- [ ] `.gitignore`, `.editorconfig`, `.gitattributes`
- [ ] Initial Git commit + branch strategy

### Milestone 2 — Core AI Features *(Week 3–5)*
- [ ] Gemini 2.0 Flash integration (crop Q&A chat)
- [ ] LangChain RAG pipeline with agricultural knowledge base
- [ ] Plant disease detection (Vision AI / fine-tuned model)
- [ ] Crop recommendation engine (ML model + rules engine)
- [ ] AI response streaming (SSE / WebSocket)
- [ ] Conversation history & session management

### Milestone 3 — Data Integrations *(Week 5–7)*
- [ ] OpenWeatherMap / IMD API integration
- [ ] eNAM / Agmarknet mandi price API
- [ ] Soil health data (ICAR API or fallback mock)
- [ ] Government scheme scraper / data feed
- [ ] Webhook-based price alert system

### Milestone 4 — Multilingual & Voice *(Week 7–9)*
- [ ] i18n framework (next-intl) — Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, Punjabi, Odia, Malayalam + English
- [ ] Google Cloud Speech-to-Text (voice input)
- [ ] Google Cloud Text-to-Speech (voice responses)
- [ ] Language auto-detection
- [ ] RTL support where needed (Urdu)

### Milestone 5 — PWA & Offline *(Week 9–10)*
- [ ] Service Worker (Workbox)
- [ ] Offline-first data caching strategy
- [ ] Push notifications (mandi prices, weather alerts)
- [ ] App manifest, install prompt
- [ ] Lighthouse PWA score ≥ 90

### Milestone 6 — Community & Expert Connect *(Week 10–12)*
- [ ] Farmer Q&A forum
- [ ] Expert verification system
- [ ] Image upload (Cloudinary)
- [ ] Moderation pipeline (AI + human)
- [ ] Rating & reputation system

### Milestone 7 — Production Hardening *(Week 12–14)*
- [ ] End-to-end testing (Playwright)
- [ ] Unit + integration tests (Vitest, pytest)
- [ ] Performance optimization (Core Web Vitals)
- [ ] Security audit (OWASP top 10)
- [ ] Docker + docker-compose
- [ ] Deployment to Vercel (frontend) + Railway/Render (API)
- [ ] Monitoring (Sentry, Uptime Kuma)

---

## 👥 Team Roles (Planned)

| Role | Responsibility |
|---|---|
| Full-Stack Lead | Architecture, monorepo, CI/CD |
| AI/ML Engineer | Gemini integration, RAG, vision models |
| Frontend Dev | UI components, i18n, PWA |
| Backend Dev | FastAPI, DB schema, integrations |
| DevOps | Docker, deployment, monitoring |

---

## 📅 Timeline Overview

```
Week 1-2:   Milestone 1 — Foundation
Week 3-5:   Milestone 2 — Core AI
Week 5-7:   Milestone 3 — Data
Week 7-9:   Milestone 4 — Multilingual
Week 9-10:  Milestone 5 — PWA
Week 10-12: Milestone 6 — Community
Week 12-14: Milestone 7 — Production
```

---

## 🔑 Key Decisions Pending (Needs Approval Before M1)

1. **Package manager**: npm (confirmed, pnpm not installed)
2. **Frontend framework**: Next.js 15 (App Router) ← *Recommended*
3. **Backend language**: Python (FastAPI) or Node.js (Hono/Express)?
4. **AI provider**: Google Gemini 2.0 Flash ← *Primary*
5. **Database**: PostgreSQL + Prisma ← *Recommended*
6. **Deployment target**: Vercel + Railway / full-Docker?
7. **Mobile**: PWA only, or React Native later?
