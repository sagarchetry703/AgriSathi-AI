# 🛡️ AgriSathi AI — Security & Privacy Architecture

## 1. Credentials & Secrets Management
- All API keys (including `GEMINI_API_KEY`) are strictly managed on the **Express backend**.
- No API keys or sensitive credentials are ever prefixed with `VITE_` or exposed to client-side bundles.
- `.env` files are ignored by git; an updated `.env.example` provides template variables without real secrets.

## 2. API Security & Hardening
- **Helmet**: Secures HTTP response headers (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options).
- **CORS**: Restricted to approved origins (`CLIENT_ORIGIN` default: `http://localhost:5173`).
- **Rate Limiting**: AI endpoints (`/api/vision/analyze`, `/api/assistant/chat`) are rate-limited via `express-rate-limit` to prevent abuse and denial of service.
- **Payload & Upload Controls**:
  - Image upload limit: 10MB maximum.
  - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
  - Multipart stream validation using `multer` with memory storage to prevent disk exhaustion.

## 3. AI Safety & Farmer Health Guardrails
- **No Hallucinated Dosage**: Prompts explicitly forbid generating hazardous chemical concentration formulas.
- **Mandatory Disclaimers**: Every diagnosis and treatment response attaches a disclaimer directing the farmer to consult local Agriculture Officers or Krishi Vigyan Kendras (KVK).
- **Unclear Image Rejection**: Low-quality, blurry, or non-crop photos are flagged with "unclear" status rather than guessing a disease.

## 4. Data Privacy
- Farmer photographs are processed in-memory for analysis and not permanently stored on the server.
- Diagnosis records are stored locally in the farmer's browser using **IndexedDB**, guaranteeing data sovereignty.
