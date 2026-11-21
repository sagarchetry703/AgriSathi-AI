# 🌱 AgriSathi AI — Project Plan
> Smart Farming Assistant for Northeast India (GDG Build with AI)

---

## 1. Executive Summary
**AgriSathi AI** is a mobile-first, farmer-centric agricultural technology web application tailored specifically for farmers in **Assam and Northeast India**. Inspired by the simple, accessible UX ethos of CashewAI, it prioritizes real, working functionality:
- Instant crop image analysis with Gemini Multimodal AI.
- Multilingual voice-enabled farming assistant (Assamese, Hindi, Bengali, English).
- Live local weather intelligence via Open-Meteo with transparent agronomic advisories.
- Assam-specific Flood-to-Farm preparedness and emergency resources.
- Soil report digestion (Soil Doctor) with field-level editable verification.
- Regional Smart Crop Advisor backed by verified agro-ecological zone knowledge.
- Offline-first PWA architecture with IndexedDB caching for low-connectivity rural belts.

---

## 2. Target Crops of Northeast India
1. **Rice (ধান)**: Sali (Winter paddy), Ahu (Autumn), Bao (Deepwater flood-tolerant).
2. **Tea (চাহ)**: CTC & Orthodox plucking care, red spider mite, blister blight.
3. **Mustard (সৰিয়হ)**: Major Rabi oilseed in Brahmaputra alluvial plains; aphid control.
4. **Potato (আলু)**: Late blight management, cold storage considerations.
5. **Tomato (বিলাহী)**: Bacterial wilt and leaf curl virus management.
6. **Chilli (জলকীয়া)**: Anthracnose and thrips management, Bhut Jolokia special context.
7. **Maize (মাকৈ)**: Fall armyworm monitoring, rainfed hill/plain suitability.

---

## 3. Milestones & Work Breakdown Structure

### Stage 1: Architecture & Specifications (Complete)
- Define full specification, system boundaries, and security policies.
- Establish shared types and schemas across client and server.

### Stage 2: Monorepo & Core Infrastructure (In Progress)
- Express.js backend with TypeScript/ESM, Zod, Multer, Helmet, Rate Limiter.
- Vite + React + TypeScript + Tailwind CSS mobile-first frontend.
- Shared domain types.

### Stage 3: UI/UX System & Main Navigation
- Bottom navigation for mobile (Home, Crop Scan, Ask AI, Weather, My Farm).
- Responsive desktop layout with collapsible sidebar.
- Agricultural theme (Dark forest green `#14532d`, vibrant farm green `#16a34a`, clean white, amber alerts).
- PWA manifests, icons, and service worker.

### Stage 4: Backend REST APIs & Services
- Express router setup with error handler, request logger, CORS, validation.
- Endpoints: `/api/health`, `/api/vision/analyze`, `/api/assistant/chat`, `/api/weather/*`, `/api/flood/*`, `/api/soil/*`, `/api/crops/*`, `/api/market/*`, `/api/history/*`.

### Stage 5: AgriVision AI (Crop Doctor)
- Gemini multimodal crop image analysis.
- Detailed visual symptom breakdown, risk assessment, organic/safe treatments, non-hallucinatory confidence indicators.
- Unclear photo rejection and safety guardrails.

### Stage 6: AgriVoice AI (Multilingual Assistant)
- 4-language support: Assamese (অসমীয়া), Hindi (हिन्दी), Bengali (বাংলা), English.
- Browser Web Speech STT and SpeechSynthesis TTS with fallback.
- Contextual farming prompts with local KVK safety disclaimers.

### Stage 7: Weather Intelligence
- Open-Meteo live integration for 10 Assam districts (Guwahati, Jorhat, Dibrugarh, Silchar, Tezpur, etc.).
- Transparent agronomic rules for spray, irrigation, and harvest advisories.

### Stage 8: Assam Flood-to-Farm Module
- ASDMA and NDMA Sachet integration links and status.
- Pre-flood, during-flood, and post-flood rehabilitation checklists.
- Assam Agricultural University (AAU) recommended submergence-tolerant rice varieties (Swarna Sub-1, Bahadur Sub-1).

### Stage 9: Soil Doctor & Crop Advisor
- Soil health card extractor (pH, N, P, K, Organic Carbon) with manual correction UI.
- Agro-ecological crop suitability recommendations based on district, soil, season, and irrigation.

### Stage 10: Market Intelligence & History
- Transparent mandi pricing tracking (honest unavailable state when live feed is absent).
- Local-first IndexedDB history with search, export, import, and delete.

### Stage 11: My Farm Dashboard
- Consolidated dashboard bringing together live weather, crop health, flood alerts, and recent diagnoses.

### Stage 12: Testing, Security & Hardening
- Unit and integration tests, Vite production build, security headers, rate limiting.
