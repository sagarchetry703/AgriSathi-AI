# 💾 AgriSathi AI — Database & Storage Design

## 1. Storage Strategy
AgriSathi AI follows a **Local-First, Privacy-Respecting** design:
- Primary operational data (crop diagnoses, chat history, soil reports, profile) lives on the farmer's device in **IndexedDB** and **LocalStorage**.
- This ensures zero latency, offline usability, and no risk of leaking private farm photos to third-party databases.
- The architecture is modular: an optional Firebase/PostgreSQL synchronization adapter can be attached without altering the UI or backend contract.

## 2. IndexedDB Stores (`AgriSathiDB`, Version 1)

### Store: `crop_diagnoses`
- KeyPath: `id` (UUID string)
- Indexes: `timestamp`, `cropIdentified`, `condition`, `riskLevel`
- Record Structure:
  ```ts
  {
    id: string;
    timestamp: string; // ISO
    cropSelected: string;
    cropIdentified: string;
    condition: 'healthy' | 'diseased' | 'pest_infestation' | 'nutrient_deficiency' | 'unclear';
    possibleDiseases: string[];
    visualObservations: string;
    symptomExplanation: string;
    alternatives: string[];
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown';
    confidence: 'Low' | 'Medium' | 'High';
    recommendedNextSteps: string[];
    preventiveGuidance: string[];
    expertConsultationRecommended: boolean;
    disclaimer: string;
    imageThumbnail?: string; // compressed base64
    notes?: string;
  }
  ```

### Store: `chat_conversations`
- KeyPath: `id`
- Indexes: `timestamp`, `language`
- Record Structure:
  ```ts
  {
    id: string;
    timestamp: string;
    role: 'user' | 'assistant';
    content: string;
    language: 'en' | 'as' | 'hi' | 'bn';
  }
  ```

### Store: `soil_records`
- KeyPath: `id`
- Record Structure:
  ```ts
  {
    id: string;
    timestamp: string;
    fileName: string;
    pH: { value: number | null; unit: string; verified: boolean };
    nitrogen: { value: number | null; unit: string; verified: boolean };
    phosphorus: { value: number | null; unit: string; verified: boolean };
    potassium: { value: number | null; unit: string; verified: boolean };
    organicCarbon: { value: number | null; unit: string; verified: boolean };
    explanation: string;
  }
  ```

## 3. LocalStorage Keys
- `agrisathi_profile`: Farmer's name, district, preferred language, land area, crops.
- `agrisathi_weather_cache`: Cached Open-Meteo response with expiration timestamp (1 hour TTL).
- `agrisathi_flood_cache`: Cached flood safety checklist and emergency contacts.
