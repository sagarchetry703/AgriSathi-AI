import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun, 
  CloudRain, 
  Compass, 
  AlertTriangle,
  RefreshCw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchDistricts, fetchDistrictWeather } from '../services/api';

export const WeatherPage: React.FC = () => {
  const { t, district, setDistrict } = useApp();

  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const res = await fetchDistricts();
        if (res && res.success) {
          setDistrictsList(res.data.districts);
        }
      } catch (e) {
        // Fallback list
      }
    }
    loadDistricts();
  }, []);

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await fetchDistrictWeather(district);
        if (res && res.success) {
          setWeatherData(res.data);
        } else {
          setErrorMsg('Unable to retrieve live Open-Meteo weather data.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error fetching weather data.');
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [district]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & District Select */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.navWeather}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Live Open-Meteo forecast and agronomic advisories (Asia/Kolkata timezone)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">District:</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            {districtsList.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.agroZone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin text-forest-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">Retrieving real-time weather from Open-Meteo...</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {weatherData && !loading && (
        <>
          {/* Current Conditions Card */}
          <div className="bg-gradient-to-br from-forest-800 via-forest-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-forest-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-forest-300 uppercase tracking-wider">
                  Current Weather · {weatherData.district}
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black">
                    {weatherData.current?.temperature_2m}°C
                  </span>
                  <span className="text-sm text-forest-200">
                    Feels like {weatherData.current?.apparent_temperature ?? weatherData.current?.temperature_2m}°C
                  </span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-forest-700/50 border border-forest-500/30 flex items-center justify-center text-amber-300">
                <Sun className="w-10 h-10" />
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-forest-700/60 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-sky-300" />
                <div>
                  <p className="text-forest-300 text-[11px]">{t.humidity}</p>
                  <p className="font-bold">{weatherData.current?.relative_humidity_2m}%</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CloudRain className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-forest-300 text-[11px]">{t.rainChance}</p>
                  <p className="font-bold">{weatherData.rainProbability}%</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-emerald-300" />
                <div>
                  <p className="text-forest-300 text-[11px]">{t.wind}</p>
                  <p className="font-bold">{weatherData.current?.wind_speed_10m} km/h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Farming Advisory Box */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <CloudSun className="w-5 h-5 text-amber-700" />
              <span>{t.farmingAdvisory}</span>
            </div>
            <p className="text-sm text-amber-950 leading-relaxed">
              {weatherData.farmingAdvisory}
            </p>
            <p className="text-[10px] text-amber-700 mt-1">
              Source: {weatherData.source} · Updated: {new Date(weatherData.retrievedAt).toLocaleTimeString()}
            </p>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">7-Day Agricultural Forecast</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {weatherData.daily?.time?.map((dateStr: string, idx: number) => {
                const date = new Date(dateStr);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const maxT = weatherData.daily.temperature_2m_max[idx];
                const minT = weatherData.daily.temperature_2m_min[idx];
                const rainProb = weatherData.daily.precipitation_probability_max[idx];

                return (
                  <div
                    key={dateStr}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1.5"
                  >
                    <span className="text-xs font-bold text-slate-600 block">{dayName}</span>
                    <CloudSun className="w-6 h-6 text-amber-500 mx-auto" />
                    <div className="text-xs font-bold text-slate-900">
                      <span>{maxT}°</span>
                      <span className="text-slate-400 font-normal ml-1">{minT}°</span>
                    </div>
                    <span className="text-[10px] text-sky-600 font-semibold block">
                      ☔ {rainProb}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
