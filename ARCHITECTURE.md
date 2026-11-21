# 🏗️ AgriSathi AI — System Architecture

> Version 0.1 · Draft · Last updated: 2026-11-21

---

## High-Level Architecture

```mermaid
flowchart TD
    subgraph Client["📱 Client Layer"]
        PWA["Next.js PWA\n(Web Browser / Mobile)"]
        Voice["Voice Interface\n(STT / TTS)"]
    end

    subgraph Gateway["🔀 API Gateway"]
        NEXT_API["Next.js API Routes\n(BFF / Edge)"]
        AUTH["NextAuth.js v5\n(OTP + Credentials)"]
    end

    subgraph Core["⚙️ Core Services (FastAPI)"]
        CHAT["Chat & AI Service\n/api/chat"]
        VISION["Vision / Disease\nDetection Service"]
        CROP["Crop Advisor\nService"]
        ALERT["Alert & Notification\nService"]
    end

    subgraph AI["🤖 AI Layer"]
        GEMINI["Google Gemini\n2.0 Flash"]
        RAG["LangChain RAG\nPipeline"]
        KB["Agricultural\nKnowledge Base\n(Vector DB)"]
        VISION_MODEL["Plant Disease\nVision Model"]
    end

    subgraph Data["💾 Data Layer"]
        POSTGRES["PostgreSQL\n(Primary DB)"]
        REDIS["Redis\n(Cache / Sessions)"]
        PINECONE["Pinecone / pgvector\n(Vector Store)"]
        CLOUDINARY["Cloudinary\n(Image Storage)"]
    end

    subgraph External["🌐 External APIs"]
        WEATHER["OpenWeatherMap\n/ IMD API"]
        MANDI["eNAM / Agmarknet\nMandi Prices"]
        SMS["Twilio / MSG91\n(SMS OTP)"]
        ICAR["ICAR Soil API"]
    end

    PWA <--> NEXT_API
    Voice <--> NEXT_API
    NEXT_API <--> AUTH
    NEXT_API <--> Core
    CHAT <--> GEMINI
    CHAT <--> RAG
    RAG <--> KB
    RAG <--> PINECONE
    VISION <--> VISION_MODEL
    CROP <--> GEMINI
    Core <--> POSTGRES
    Core <--> REDIS
    Core <--> CLOUDINARY
    ALERT <--> WEATHER
    ALERT <--> MANDI
    AUTH <--> SMS
    CROP <--> ICAR
```

---

## Monorepo Structure

```
AgriSathi-AI/
├── apps/
│   ├── web/                    # Next.js 15 frontend (PWA)
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Login, OTP, register
│   │   │   ├── (dashboard)/    # Farmer dashboard
│   │   │   ├── chat/           # AI chat interface
│   │   │   ├── diagnose/       # Plant disease upload
│   │   │   ├── weather/        # Weather dashboard
│   │   │   ├── prices/         # Mandi prices
│   │   │   ├── community/      # Q&A forum
│   │   │   └── api/            # Next.js API routes (BFF)
│   │   ├── components/         # UI components
│   │   │   ├── ui/             # shadcn/ui base components
│   │   │   ├── chat/           # Chat-specific components
│   │   │   ├── forms/          # Form components
│   │   │   └── layout/         # Header, sidebar, footer
│   │   ├── lib/                # Client utilities
│   │   ├── hooks/              # Custom React hooks
│   │   ├── stores/             # Zustand state stores
│   │   ├── i18n/               # Translations (11 languages)
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   ├── ta.json
│   │   │   └── ...
│   │   ├── public/             # Static assets, icons, manifest
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                    # FastAPI Python backend
│       ├── app/
│       │   ├── main.py         # FastAPI entrypoint
│       │   ├── config.py       # Settings (pydantic-settings)
│       │   ├── routers/        # Route modules
│       │   │   ├── chat.py
│       │   │   ├── vision.py
│       │   │   ├── crop.py
│       │   │   ├── weather.py
│       │   │   ├── prices.py
│       │   │   └── auth.py
│       │   ├── services/       # Business logic
│       │   ├── models/         # Pydantic schemas
│       │   ├── db/             # DB session, migrations
│       │   └── utils/
│       ├── tests/
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── shared/                 # Shared TypeScript types
│   ├── ui/                     # Shared UI component library
│   └── config/                 # Shared ESLint, TS, Tailwind configs
│
├── infra/
│   ├── docker-compose.yml      # Local dev stack
│   ├── docker-compose.prod.yml
│   └── nginx/
│
├── docs/                       # Additional documentation
├── scripts/                    # Dev utility scripts
├── .github/
│   └── workflows/              # CI/CD (GitHub Actions)
├── .env.example
├── .gitignore
├── .gitattributes
├── .editorconfig
├── PROJECT_PLAN.md
├── ARCHITECTURE.md
├── IMPLEMENTATION_STATUS.md
└── README.md
```

---

## Technology Stack

### Frontend (apps/web)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui + Radix UI | Latest |
| State | Zustand + React Query (TanStack) | Latest |
| Forms | React Hook Form + Zod | Latest |
| Auth Client | NextAuth.js | v5 |
| i18n | next-intl | Latest |
| Charts | Recharts / Tremor | Latest |
| PWA | next-pwa (Workbox) | Latest |
| Animation | Framer Motion | Latest |
| Icons | Lucide React | Latest |

### Backend (apps/api)

| Layer | Technology | Version |
|---|---|---|
| Framework | FastAPI | 0.115.x |
| Language | Python | 3.14.x |
| ORM | SQLAlchemy 2 + Alembic | Latest |
| Validation | Pydantic v2 | Latest |
| AI SDK | LangChain + Google Gen AI | Latest |
| Task Queue | Celery + Redis | Latest |
| HTTP Client | HTTPX | Latest |
| Testing | pytest + pytest-asyncio | Latest |

### Infrastructure

| Component | Technology |
|---|---|
| Primary DB | PostgreSQL 16 |
| Cache / Queue | Redis 7 |
| Vector Store | pgvector (embedded in Postgres) |
| Image Storage | Cloudinary |
| Email | Resend |
| SMS / OTP | MSG91 (India-focused) |
| Monitoring | Sentry (errors) + Uptime Kuma |
| Container | Docker + Docker Compose |

### AI & ML

| Component | Technology |
|---|---|
| LLM | Google Gemini 2.0 Flash |
| Embeddings | text-embedding-004 |
| Vision | Gemini Vision / fine-tuned PlantVillage model |
| RAG Framework | LangChain |
| Knowledge Base | ICAR guidelines, Krishi Vigyan Kendra data |
| Speech-to-Text | Google Cloud Speech-to-Text v2 |
| Text-to-Speech | Google Cloud Text-to-Speech |

---

## Data Models (Core)

```mermaid
erDiagram
    FARMER {
        uuid id PK
        string mobile_number UK
        string name
        string language_preference
        string state
        string district
        json farm_profile
        timestamp created_at
    }
    CROP_SESSION {
        uuid id PK
        uuid farmer_id FK
        string crop_type
        string season
        json location
        timestamp created_at
    }
    CHAT_MESSAGE {
        uuid id PK
        uuid session_id FK
        string role
        text content
        json metadata
        timestamp created_at
    }
    DIAGNOSIS {
        uuid id PK
        uuid farmer_id FK
        string image_url
        string detected_disease
        float confidence_score
        text recommendation
        timestamp created_at
    }
    PRICE_ALERT {
        uuid id PK
        uuid farmer_id FK
        string commodity
        string mandi
        float target_price
        boolean is_active
    }
    FARMER ||--o{ CROP_SESSION : "has"
    CROP_SESSION ||--o{ CHAT_MESSAGE : "contains"
    FARMER ||--o{ DIAGNOSIS : "submits"
    FARMER ||--o{ PRICE_ALERT : "sets"
```

---

## API Design (REST + SSE)

### Key Endpoints

```
POST   /api/v1/auth/otp/request       # Request OTP
POST   /api/v1/auth/otp/verify        # Verify OTP + issue JWT
GET    /api/v1/farmers/me             # Farmer profile
PUT    /api/v1/farmers/me             # Update profile

POST   /api/v1/chat/message           # Send message → SSE stream
GET    /api/v1/chat/history/{session} # Chat history
DELETE /api/v1/chat/history/{session} # Clear history

POST   /api/v1/diagnose/upload        # Upload plant image → diagnosis
GET    /api/v1/diagnose/{id}          # Get diagnosis result

GET    /api/v1/weather/current        # Current weather by lat/lon
GET    /api/v1/weather/forecast       # 7-day forecast

GET    /api/v1/prices/live            # Live mandi prices
GET    /api/v1/prices/history         # Price history
POST   /api/v1/prices/alert           # Set price alert

GET    /api/v1/crops/recommend        # Crop recommendation
GET    /api/v1/crops/calendar         # Crop calendar
```

---

## Security Architecture

- **Auth**: JWT (short-lived access + long-lived refresh) + mobile OTP
- **API**: Rate limiting (slowapi), CORS strict origin list
- **Input validation**: Pydantic v2 strict mode + Zod on frontend
- **Image uploads**: Signed Cloudinary upload URLs (never raw S3 exposure)
- **Secrets**: Environment variables only — never hardcoded
- **HTTPS**: Enforced at Nginx/Vercel/Railway layer
- **SQL injection**: SQLAlchemy ORM (parameterized queries only)
- **XSS**: React auto-escaping + CSP headers

---

## Offline / PWA Strategy

```
Network available:
  → Fetch fresh data → Cache in IndexedDB → Render

Network unavailable:
  → Serve from Service Worker cache
  → Queue mutations (chat, alerts) in background sync
  → Show offline banner, degrade gracefully
  → Push notifications resume when online
```

---

## Deployment Architecture

```mermaid
flowchart LR
    DEV["Dev Machine\n(localhost)"] --> |"docker-compose up"| LOCAL["Local Stack\nPostgres + Redis"]
    DEV --> |"git push"| GH["GitHub"]
    GH --> |"GitHub Actions CI"| TEST["Test + Build"]
    TEST --> |"Deploy"| VERCEL["Vercel\n(Next.js Frontend)"]
    TEST --> |"Deploy"| RAILWAY["Railway\n(FastAPI Backend)"]
    RAILWAY --> NEON["Neon PostgreSQL\n(Managed)"]
    RAILWAY --> UPSTASH["Upstash Redis\n(Managed)"]
```
