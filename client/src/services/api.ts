// Centralized REST API client for AgriSathi AI

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function analyzeCropPhoto(fileOrBase64: File | string, crop: string, language: string) {
  if (typeof fileOrBase64 === 'string') {
    // Send as JSON base64
    const res = await fetch(`${API_BASE}/vision/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: fileOrBase64,
        crop,
        language
      })
    });
    return res.json();
  } else {
    // Send as Multipart form-data
    const formData = new FormData();
    formData.append('file', fileOrBase64);
    formData.append('crop', crop);
    formData.append('language', language);

    const res = await fetch(`${API_BASE}/vision/analyze`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  }
}

export async function sendChatMessage(message: string, language: string, district: string, history: Array<{ role: string; content: string }>) {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language,
      district,
      history
    })
  });
  return res.json();
}

export async function fetchDistricts() {
  const res = await fetch(`${API_BASE}/weather/districts`);
  return res.json();
}

export async function fetchDistrictWeather(district: string) {
  const res = await fetch(`${API_BASE}/weather/${encodeURIComponent(district)}`);
  return res.json();
}

export async function fetchFloodGuidance() {
  const res = await fetch(`${API_BASE}/flood/guidance`);
  return res.json();
}

export async function fetchFloodAlerts() {
  const res = await fetch(`${API_BASE}/flood/alerts`);
  return res.json();
}

export async function analyzeSoilCard(fileOrBase64: File | string) {
  if (typeof fileOrBase64 === 'string') {
    const res = await fetch(`${API_BASE}/soil/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: fileOrBase64 })
    });
    return res.json();
  } else {
    const formData = new FormData();
    formData.append('file', fileOrBase64);
    const res = await fetch(`${API_BASE}/soil/analyze`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  }
}

export async function fetchCropRecommendations(params: {
  district: string;
  soilType: string;
  season: string;
  irrigation: string;
  landArea?: number;
}) {
  const res = await fetch(`${API_BASE}/crops/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function fetchMarketPrices(commodity?: string, district?: string) {
  const params = new URLSearchParams();
  if (commodity) params.set('commodity', commodity);
  if (district) params.set('district', district);
  const res = await fetch(`${API_BASE}/market/prices?${params.toString()}`);
  return res.json();
}
