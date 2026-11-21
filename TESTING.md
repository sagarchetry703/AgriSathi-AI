# 🧪 AgriSathi AI — Testing Strategy & Verification

## 1. Testing Scope
- **Backend Unit & Integration Tests**: Supertest + Node test runner / Vitest for all Express REST routes.
- **Frontend Component & Integration Tests**: React Testing Library + Vitest for user journeys.
- **End-to-End User Flow**: Validation of camera upload, AI analysis fallback, voice synthesis, offline IndexedDB persistence.

## 2. Automated Test Matrix

| Test Suite | File | Coverage |
|---|---|---|
| Health & Config | `server/tests/health.test.js` | Status code 200, environment flag validation |
| Weather Service | `server/tests/weather.test.js` | Open-Meteo fetching, coordinate lookup, advisory rules |
| Flood Service | `server/tests/flood.test.js` | ASDMA guidance payload, official links |
| Crop Advisor | `server/tests/crops.test.js` | Regional suitability engine for Kharif/Rabi |
| Input Validation | `server/tests/validation.test.js` | Zod schema checks, file upload restrictions |

## 3. Manual Acceptance Checklist (GDG Demonstration)
1. **Camera / Photo Scan**: Upload clear photo of affected rice leaf; verify structured disease identification and safe remedy.
2. **Voice & Text Multilingual Chat**: Ask question in Assamese ("ধানত পোক লাগিলে কি কৰিব?"); verify Assamese response.
3. **Voice Playback**: Click Speak button; verify SpeechSynthesis trigger with audio feedback.
4. **Live Weather**: Select Jorhat; verify real-time temperature, humidity, and agro-advisories.
5. **Flood-to-Farm**: Review ASDMA emergency guidance and submergence-resistant rice recommendations.
6. **Offline Simulation**: Disconnect Wi-Fi; navigate to My Farm; verify previous scan history and emergency guides remain readable.
