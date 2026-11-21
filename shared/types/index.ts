// Shared types and interfaces for AgriSathi AI

export type SupportedLanguage = 'en' | 'as' | 'hi' | 'bn';

export interface FarmerProfile {
  id: string;
  name: string;
  phone?: string;
  language: SupportedLanguage;
  district: string;
  state: string;
  landAreaAcres?: number;
  soilType?: string;
  primaryCrops: string[];
  irrigationSource?: 'Rainfed' | 'Borewell' | 'Canal' | 'River' | 'Other';
  createdAt: string;
  updatedAt: string;
}

export interface CropDiagnosisResult {
  id: string;
  timestamp: string;
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
  imageThumbnail?: string; // base64 thumbnail for local history
  dataSource: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  language: SupportedLanguage;
  sources?: string[];
}

export interface WeatherCondition {
  district: string;
  coordinates: { lat: number; lon: number };
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    apparent_temperature?: number;
    weather_code?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    relative_humidity_2m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    weather_code?: number[];
  };
  rainProbability: number;
  farmingAdvisory: string;
  source: string;
  status: 'live' | 'cached' | 'unavailable';
  retrievedAt: string;
}

export interface FloodAlertInfo {
  status: 'live' | 'unavailable';
  source: string;
  retrievedAt: string;
  alerts: Array<{
    id: string;
    district: string;
    severity: 'Warning' | 'Alert' | 'Normal';
    description: string;
    date: string;
  }>;
  message: string;
  officialResources: Array<{
    name: string;
    url: string;
    scope: string;
  }>;
}

export interface FloodGuidance {
  before: string[];
  during: string[];
  after: string[];
  emergencyContacts: Array<{
    title: string;
    number: string;
    description: string;
  }>;
  floodResistantVarieties: Array<{
    crop: string;
    variety: string;
    submergenceToleranceDays: number;
    notes: string;
  }>;
}

export interface SoilReportExtraction {
  id: string;
  timestamp: string;
  fileName: string;
  pH: { value: number | null; unit: string; verified: boolean };
  nitrogen: { value: number | null; unit: string; verified: boolean };
  phosphorus: { value: number | null; unit: string; verified: boolean };
  potassium: { value: number | null; unit: string; verified: boolean };
  organicCarbon: { value: number | null; unit: string; verified: boolean };
  extractionStatus: 'success' | 'partial' | 'failed';
  verificationRequired: boolean;
  explanation: string;
  cropSuitabilityNotes: string[];
  disclaimer: string;
}

export interface CropRecommendationRequest {
  district: string;
  soilType: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Year-round';
  irrigation: 'Rainfed' | 'Irrigated' | 'Partial';
  landArea?: number;
  preferredCrops?: string[];
}

export interface CropRecommendationItem {
  crop: string;
  localNameAs: string;
  suitability: 'High' | 'Medium' | 'Low';
  reason: string;
  soilRequirements: string;
  seasonalSuitability: string;
  waterRequirements: string;
  possibleConstraints: string;
  recommendedPractices: string[];
  sourceAttribution: string;
}

export interface MarketPriceItem {
  commodity: string;
  mandi: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  date: string;
  isLive: boolean;
  dataProvider: string;
}
