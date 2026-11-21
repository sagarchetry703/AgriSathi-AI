# 🌾 AgriSathi AI

> **AI-powered agricultural assistant for Indian farmers**

AgriSathi AI ("Farmer's Companion") empowers Indian smallholder farmers with AI-driven crop advice, plant disease diagnosis, weather forecasts, mandi price alerts, and multilingual voice support — accessible as a Progressive Web App that works offline.

## ✨ Features

- 🤖 **AI Crop Advisor** — Chat with Gemini 2.0 Flash for personalized farming guidance
- 📸 **Disease Detection** — Upload plant photos for instant AI diagnosis
- 🌦️ **Weather Forecasting** — Hyper-local weather with actionable farming alerts
- 💹 **Mandi Prices** — Real-time market prices from eNAM/Agmarknet
- 🗣️ **Multilingual Voice** — Hindi + 10 regional languages with voice I/O
- 👨‍🌾 **Community Q&A** — Connect with experts and fellow farmers
- 📲 **PWA / Offline** — Works without internet in rural areas

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI (Python 3.14), SQLAlchemy 2 |
| AI | Google Gemini 2.0 Flash, LangChain, pgvector |
| Database | PostgreSQL 16, Redis 7 |
| Auth | NextAuth.js v5 (Mobile OTP) |
| Deployment | Vercel + Railway |

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- Python ≥ 3.12
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/agrisathi-ai.git
cd agrisathi-ai

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# 3. Start infrastructure (Postgres + Redis)
npm run docker:up

# 4. Install frontend dependencies
npm install

# 5. Install backend dependencies
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..

# 6. Run development servers
npm run dev:all
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run dev:api` | Start FastAPI dev server (port 8000) |
| `npm run dev:all` | Start both servers concurrently |
| `npm run build` | Build Next.js for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all tests |
| `npm run docker:up` | Start Postgres + Redis containers |
| `npm run docker:down` | Stop infrastructure containers |

## 📂 Project Structure

```
AgriSathi-AI/
├── apps/
│   ├── web/          # Next.js 15 frontend (PWA)
│   └── api/          # FastAPI Python backend
├── packages/
│   ├── shared/       # Shared TypeScript types
│   └── config/       # Shared ESLint, TS configs
├── infra/            # Docker Compose, Nginx
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```

## 📄 License

MIT © AgriSathi AI
