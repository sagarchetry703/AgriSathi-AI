# 🏛️ AgriSathi AI — Architecture

## 1. System Overview
AgriSathi AI is built on a modern decoupled architecture:
- **Client (Frontend)**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Server (Backend)**: Node.js 22+, Express, TypeScript/ESM, Zod, Multer, Helmet, Rate Limiter.
- **AI Engine**: Google Gemini API via official `@google/genai` / `@google/generative-ai` SDK.
- **Weather API**: Open-Meteo REST API (free, open data, Asia/Kolkata timezone).
- **Client Storage**: IndexedDB (for structured diagnosis & history) + LocalStorage (for profile settings).
- **Offline / PWA**: Web App Manifest + Service Worker caching application shell and knowledge data.

```
+-------------------------------------------------------------------------+
|                              Farmer Client                              |
|   +------------------------------------------------------------------+  |
|   |                      React + Vite UI Layer                       |  |
|   |  - Mobile Bottom Nav (Home, Scan, Ask AI, Weather, My Farm)      |  |
|   |  - Web Speech API (STT Voice Input + TTS Audio Playback)         |  |
|   |  - Service Worker (Offline Cache) + IndexedDB (Local History)    |  |
|   +---------------------------------+--------------------------------+  |
+-------------------------------------|-----------------------------------+
                                      | HTTP REST / JSON
                                      v
+-------------------------------------------------------------------------+
|                           AgriSathi Express Server                      |
|   +------------------------------------------------------------------+  |
|   |  Middleware: Helmet, CORS, Rate Limit, Uploads (Multer), Error   |  |
|   +------------------------------------------------------------------+  |
|   |  Controllers & Routes:                                           |  |
|   |  - /api/vision/analyze  --> Gemini Multimodal Vision API         |  |
|   |  - /api/assistant/chat  --> Gemini Multilingual Context Chat     |  |
|   |  - /api/weather/*       --> Open-Meteo Weather Service           |  |
|   |  - /api/flood/*         --> Assam ASDMA / NDMA Flood Service     |  |
|   |  - /api/soil/*          --> Soil Report Extraction Service       |  |
|   |  - /api/crops/*         --> Assam Agro-Ecological Rule Engine    |  |
|   |  - /api/market/*        --> Mandi Price Service (Honest States)  |  |
|   +------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

## 2. Core Design Principles
1. **Farmer-First Usability**: High contrast, large tactile touch targets (>48px), multilingual audio + text.
2. **Honesty & Safety in AI**: No fabricated certainty; AI provides non-diagnostic observation, preventive care, and always refers to Krishi Vigyan Kendra (KVK) for critical cases.
3. **Resilience to Low Connectivity**: Offline storage allows farmers to review previous diagnoses, weather advisories, and flood safety guides even when cell towers are down.
4. **Security by Design**: API keys remain server-side. File uploads are validated by mime-type and byte limits. Input validated by Zod.
