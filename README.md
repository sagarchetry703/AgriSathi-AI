# 🌾 AgriSathi AI (এগ্রিচাথী এআই)
> **Smart Farming Assistant for Northeast India** · *GDG Build with AI Hackathon*

---

## 🌟 Overview
**AgriSathi AI** is a mobile-first, farmer-centric agricultural technology web application tailored specifically for farmers in **Assam and Northeast India**. Inspired by the accessible user experience of CashewAI, it prioritizes real, working functionality:
- 📸 **AgriVision AI (Crop Doctor)**: Multimodal crop disease and symptom detection using Google Gemini.
- 🗣️ **AgriVoice AI**: Multilingual conversational farming assistant with voice input & spoken audio responses in **Assamese (অসমীয়া)**, **Hindi (हिन्दी)**, **Bengali (বাংলা)**, and **English**.
- ⛅ **Weather Intelligence**: Real-time Open-Meteo forecast with transparent, rule-based agronomic advisories for 10+ Assam districts.
- 🌊 **Flood-to-Farm Intelligence**: Official emergency preparedness guidelines from ASDMA and submergence-tolerant rice varieties (Swarna Sub-1, Bahadur Sub-1).
- 🧪 **Soil Doctor**: Soil Health Card parameter extractor with manual verification and regional soil health tips.
- 🧭 **Smart Crop Advisor**: Agro-climatic suitability engine based on Assam Agricultural University (AAU) package of practices.
- 📶 **Offline-First PWA**: Progressive Web App with IndexedDB persistence, allowing farmers to review diagnoses and emergency guidelines even with zero internet.

---

## 🏗️ Architecture & Technology Stack
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, React Router, Lucide React.
- **Backend**: Node.js 22, Express.js, Zod validation, Multer for multipart uploads.
- **AI / LLM**: Google Gemini API via official `@google/generative-ai` SDK (Gemini 2.0 Flash).
- **Weather API**: Open-Meteo REST API (free, open data, Asia/Kolkata timezone).
- **Offline Storage**: IndexedDB (`AgriSathiDB`) + LocalStorage + Service Worker (`sw.js`).
- **Voice Interface**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).

---

## 📱 Navigation & Core Experience
1. **Home**: District weather card, prominent crop scan & voice ask buttons, recent diagnoses, quick flood advisories.
2. **Crop Scan**: Large camera capture button, crop selector, Gemini multimodal image diagnosis, structured remedies, and "Save to My Farm".
3. **Ask AI**: Voice-enabled conversational agricultural advisory with audio replay and stop controls.
4. **Weather**: 7-day forecast cards for Assam districts with transparent spray and irrigation rules.
5. **My Farm**: Offline journal of past diagnoses with search, filtering, and emergency records.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ (Node.js 22+ recommended)
- npm or pnpm

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### 3. Running Locally
```bash
# Run both client and server:
node scripts/dev.js

# Or in separate terminals:
npm run dev:server   # Starts Express backend on http://localhost:5000
npm run dev          # Starts Vite frontend on http://localhost:5173
```

### 4. Running Production Build
```bash
cd client
npm run build
cd ..
node server/src/index.js
```
The complete application will be served at `http://localhost:5000/`.

---

## 🧪 Testing & Verification
Run the backend and end-to-end integration test suites:
```bash
node server/tests/server.test.js
node server/tests/e2e.test.js
```

---

## 📄 Documentation
- [PROJECT_PLAN.md](file:///d:/Projects/AgriSathi-AI/PROJECT_PLAN.md) — Full milestone breakdown & agronomic specs
- [ARCHITECTURE.md](file:///d:/Projects/AgriSathi-AI/ARCHITECTURE.md) — System topology & design patterns
- [API_DOCUMENTATION.md](file:///d:/Projects/AgriSathi-AI/API_DOCUMENTATION.md) — REST API endpoints & schemas
- [DATABASE_DESIGN.md](file:///d:/Projects/AgriSathi-AI/DATABASE_DESIGN.md) — IndexedDB & LocalStorage schema
- [TESTING.md](file:///d:/Projects/AgriSathi-AI/TESTING.md) — Test matrix and acceptance verification
- [SECURITY.md](file:///d:/Projects/AgriSathi-AI/SECURITY.md) — Secrets, rate limiting, and AI safety guardrails
- [SOURCE_REGISTRY.md](file:///d:/Projects/AgriSathi-AI/SOURCE_REGISTRY.md) — Official agricultural & meteorological sources
- [KNOWN_LIMITATIONS.md](file:///d:/Projects/AgriSathi-AI/KNOWN_LIMITATIONS.md) — Ethical and technical limitations
- [DEPLOYMENT.md](file:///d:/Projects/AgriSathi-AI/DEPLOYMENT.md) — Cloud Run & Firebase deployment instructions
