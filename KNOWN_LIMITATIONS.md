# ⚠️ AgriSathi AI — Known Limitations & Truthful Status Report

In accordance with GDG Build with AI integrity guidelines, this report explicitly documents the technical boundaries, third-party dependencies, and design considerations of AgriSathi AI.

---

## 1. Gemini Multimodal Crop Vision
- **Informative Guidance, Not Laboratory PCR Testing**: Plant disease identification from a photograph evaluates visible foliar lesions, insect frass, and discoloration. It cannot perform biochemical or microbiological confirmation. Every diagnosis advises consulting a district Krishi Vigyan Kendra (KVK).
- **Network Dependency**: Live multimodal image inference requires internet connectivity to communicate with Google Gemini 2.0 Flash. When offline or without an API key, the system seamlessly activates local Assam Agricultural University reference guidelines.

## 2. Voice & Speech Recognition (STT / TTS)
- **Browser Web Speech Engine**: Speech-to-Text and Text-to-Speech rely on the browser's native `SpeechRecognition` and `SpeechSynthesis` implementations.
- **Assamese Voice Synthesis Availability**: While text chat is fully fluent in Assamese, device operating systems (iOS, Android, Windows) vary in their pre-installed Assamese TTS voice packs. When an Assamese voice is missing on the client OS, audio playback automatically falls back gracefully to a regional voice without breaking the interface.

## 3. Real-Time Mandi Prices (Market Intelligence)
- **AGMARKNET / eNAM Access**: Real-time wholesale mandi rates require an authenticated Government of India data token. In strict compliance with project ethics, AgriSathi AI displays an honest "Awaiting Live Feed Provisioning" status rather than fabricating fictitious prices.

## 4. Flood Early Warnings
- **Reference Guidance vs. Emergency Evacuation**: AgriSathi AI provides flood survival checklists, submergence-tolerant seed options, and ASDMA official links. It is an agricultural advisory platform and is NOT an official state disaster warning dissemination system. Farmers must always obey local district administration evacuation announcements.
