# 📡 AgriSathi AI — API Documentation

Base URL: `http://localhost:5000/api` (or environment-configured port)

All responses follow the standardized JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable info"
}
```
Or in error cases:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description"
  }
}
```

---

## 1. System Health
### `GET /api/health`
Returns service availability, Gemini status, and server time.
- **Response**: `{ status: "healthy", version: "1.0.0", geminiConfigured: true/false, timestamp: "..." }`

---

## 2. AgriVision AI (Crop Doctor)
### `POST /api/vision/analyze`
Accepts multipart form data or JSON containing an image file.
- **Parameters**:
  - `file`: Image file (JPEG, PNG, WebP, max 10MB)
  - `crop`: Selected crop name (e.g., "Rice", "Tea", "Mustard")
  - `language`: `en` | `as` | `hi` | `bn`
- **Response**:
  ```json
  {
    "cropIdentified": "Rice (Oryza sativa)",
    "condition": "diseased",
    "possibleDiseases": ["Bacterial Leaf Blight (Xanthomonas oryzae)"],
    "visualObservations": "Yellow to whitish lesions with wavy margins starting from leaf tips.",
    "symptomExplanation": "Lesions merge along the veins, causing leaves to dry out.",
    "alternatives": ["Brown Spot", "Nitrogen Deficiency"],
    "riskLevel": "Medium",
    "confidence": "Medium",
    "recommendedNextSteps": [
      "Avoid excessive nitrogen fertilizer application.",
      "Ensure proper field drainage.",
      "Apply copper hydroxide if recommended by local agricultural officer."
    ],
    "preventiveGuidance": ["Use resistant varieties such as Bahadur or Ranjit.", "Treat seeds before sowing."],
    "expertConsultationRecommended": true,
    "disclaimer": "AI advisory is for informational guidance only. Consult your local KVK or Agriculture Officer before applying chemical treatments."
  }
  ```

---

## 3. AgriVoice AI (Multilingual Assistant)
### `POST /api/assistant/chat`
- **Body**:
  ```json
  {
    "message": "মই ধান খেতিত কি সাৰ দিম?",
    "language": "as",
    "history": [],
    "district": "Jorhat"
  }
  ```
- **Response**:
  ```json
  {
    "response": "যোৰহাট জিলাত বৰ্তমান শালি ধানৰ বাবে সঠিক সময়ত ইউৰিয়া, ডি এ পি আৰু পটাশ সঠিক পৰিমাণত প্ৰয়োগ কৰক...",
    "language": "as",
    "sources": ["Assam Agricultural University Package of Practices"]
  }
  ```

---

## 4. Weather Intelligence
### `GET /api/weather/districts`
Returns verified Assam districts with geographic coordinates.
### `GET /api/weather/:district`
Returns live 7-day forecast from Open-Meteo for the requested district with transparent agronomic advisories.

---

## 5. Flood-to-Farm Intelligence
### `GET /api/flood/alerts`
Returns official ASDMA/NDMA alert status.
### `GET /api/flood/guidance`
Returns pre-flood, during-flood, and post-flood rehabilitation guides and emergency contacts.

---

## 6. Soil Doctor & Crop Advisor
### `POST /api/soil/analyze`
Extracts pH, N, P, K, and Organic Carbon from uploaded soil card image.
### `POST /api/crops/recommend`
Returns recommended crops for Assam agro-climatic zones based on district, soil, season, and irrigation.
