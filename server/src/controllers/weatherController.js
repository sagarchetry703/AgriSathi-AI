import { ASSAM_DISTRICTS } from '../config/districts.js';

// Transparent agronomic rules based on live meteorological data
function generateFarmingAdvisory(current, rainProb, maxTemp, minTemp) {
  const advisories = [];

  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const precip = current.precipitation;

  if (rainProb >= 70 || precip > 5) {
    advisories.push('⚠️ High likelihood of rain. Postpone all chemical spraying and fertilizer broadcasting to prevent chemical runoff.');
    advisories.push('Ensure bund drainage cuts are open in low-lying paddy plots to prevent sudden drowning of young seedlings.');
  } else if (rainProb < 20 && humidity < 50) {
    advisories.push('☀️ Dry atmospheric conditions observed. Favorable window for foliar spraying, intercultural weeding, and nursery bed preparation.');
  }

  if (windSpeed > 25) {
    advisories.push('💨 High wind speeds detected (>25 km/h). Avoid high-pressure tractor spraying to avoid drift; secure temporary seedling shade netting.');
  }

  if (humidity > 85 && temp >= 22 && temp <= 30) {
    advisories.push('🍄 Warm and humid conditions favor fungal pathogens (Blast in Rice, Late Blight in Potato, Blister Blight in Tea). Monitor field boundaries closely.');
  }

  if (advisories.length === 0) {
    advisories.push('🌱 Weather conditions are normal for seasonal operations. Maintain standard soil moisture and pest scouting.');
  }

  return advisories.join(' ');
}

export async function getDistricts(req, res) {
  const districtsList = Object.entries(ASSAM_DISTRICTS).map(([name, data]) => ({
    name,
    latitude: data.lat,
    longitude: data.lon,
    agroZone: data.agroZone
  }));

  res.status(200).json({
    success: true,
    data: {
      state: 'Assam',
      timezone: 'Asia/Kolkata',
      districts: districtsList
    }
  });
}

export async function getDistrictWeather(req, res) {
  try {
    const districtName = req.params.district || 'Guwahati';
    const coords = ASSAM_DISTRICTS[districtName] || ASSAM_DISTRICTS.Guwahati;

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', coords.lat.toString());
    url.searchParams.set('longitude', coords.lon.toString());
    url.searchParams.set('timezone', 'Asia/Kolkata');
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,apparent_temperature,weather_code');
    url.searchParams.set('hourly', 'temperature_2m,precipitation_probability,precipitation,relative_humidity_2m');
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code');
    url.searchParams.set('forecast_days', '7');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    const rainProb = (hourly.precipitation_probability && hourly.precipitation_probability.length > 0)
      ? hourly.precipitation_probability[0]
      : 0;

    const advisory = generateFarmingAdvisory(
      current,
      rainProb,
      daily.temperature_2m_max ? daily.temperature_2m_max[0] : 30,
      daily.temperature_2m_min ? daily.temperature_2m_min[0] : 18
    );

    res.status(200).json({
      success: true,
      data: {
        district: districtName,
        coordinates: { lat: coords.lat, lon: coords.lon },
        timezone: 'Asia/Kolkata',
        current,
        hourly,
        daily,
        rainProbability: rainProb,
        farmingAdvisory: advisory,
        source: 'Open-Meteo Forecast API (Real-time)',
        status: 'live',
        retrievedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Weather error:', err);
    res.status(502).json({
      success: false,
      error: { code: 'WEATHER_FETCH_FAILED', message: 'Live Open-Meteo weather data is temporarily unreachable.' }
    });
  }
}
