/**
 * AgriSathi AI — Shared Types
 *
 * Type definitions shared between frontend and backend.
 */

// === Auth ===
export interface OTPRequest {
  mobile: string;
}

export interface OTPVerifyRequest {
  mobile: string;
  otp: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
}

// === Farmer Profile ===
export interface FarmerProfile {
  id: string;
  mobile_number: string;
  name: string;
  language_preference: SupportedLanguage;
  state: string;
  district: string;
  farm_profile: FarmProfile;
  created_at: string;
}

export interface FarmProfile {
  farm_size_acres: number;
  crops: string[];
  soil_type?: string;
  irrigation_type?: "rainfed" | "irrigated" | "mixed";
}

// === Chat ===
export interface ChatMessage {
  message: string;
  session_id?: string;
  language?: SupportedLanguage;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  sources: ChatSource[];
}

export interface ChatSource {
  title: string;
  url?: string;
  snippet: string;
}

// === Diagnosis ===
export interface DiagnosisResult {
  id: string;
  image_url: string;
  detected_disease: string;
  confidence_score: number;
  recommendation: string;
  created_at: string;
}

// === Weather ===
export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  wind_speed: number;
  rain_probability: number;
}

export interface WeatherForecast {
  date: string;
  weather: WeatherData;
  farming_advisory: string;
}

// === Mandi Prices ===
export interface MandiPrice {
  commodity: string;
  mandi: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
  date: string;
}

export interface PriceAlert {
  id: string;
  commodity: string;
  mandi: string;
  target_price: number;
  alert_type: "above" | "below";
  is_active: boolean;
}

// === Crop ===
export interface CropRecommendation {
  crop: string;
  suitability: "High" | "Medium" | "Low";
  expected_yield: string;
  advice: string;
}

export type Season = "kharif" | "rabi" | "zaid";

// === i18n ===
export type SupportedLanguage =
  | "en"  // English
  | "hi"  // Hindi
  | "ta"  // Tamil
  | "te"  // Telugu
  | "kn"  // Kannada
  | "bn"  // Bengali
  | "mr"  // Marathi
  | "gu"  // Gujarati
  | "pa"  // Punjabi
  | "or"  // Odia
  | "ml"; // Malayalam

// === API ===
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
}
