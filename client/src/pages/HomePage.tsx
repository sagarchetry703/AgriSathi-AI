import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  MessageSquare, 
  CloudSun, 
  Sprout, 
  ShieldAlert, 
  ArrowRight, 
  ChevronRight, 
  AlertTriangle,
  Droplets,
  Wind,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchDistrictWeather, fetchFloodAlerts } from '../services/api';
import { getAllDiagnosesFromIndexedDB } from '../services/indexedDb';
import { CropDiagnosisResult } from '../types';

export const HomePage: React.FC = () => {
  const { t, district, language } = useApp();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [recentDiagnoses, setRecentDiagnoses] = useState<CropDiagnosisResult[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadHomeData() {
      try {
        setLoadingWeather(true);
        const [wRes, dList] = await Promise.all([
          fetchDistrictWeather(district).catch(() => null),
          getAllDiagnosesFromIndexedDB().catch(() => [])
        ]);

        if (isMounted) {
          if (wRes && wRes.success) {
            setWeatherData(wRes.data);
          }
          setRecentDiagnoses(dList.slice(0, 3));
        }
      } finally {
        if (isMounted) setLoadingWeather(false);
      }
    }
    loadHomeData();
    return () => { isMounted = false; };
  }, [district]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Farmer Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-forest-700/50">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-forest-700/60 border border-forest-500/40 text-forest-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Sprout className="w-3.5 h-3.5 text-forest-400" />
            <span>Assam & NE Agricultural Assistant</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.greeting}
          </h1>
          <p className="text-forest-200 text-sm sm:text-base mt-1 max-w-xl">
            {t.welcomeSubtitle}
          </p>

          {/* Quick weather summary bar if available */}
          {weatherData && (
            <div className="mt-4 pt-4 border-t border-forest-700/50 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-forest-100">
              <div className="flex items-center space-x-1.5 font-medium">
                <CloudSun className="w-4 h-4 text-amber-300" />
                <span>{district}: {weatherData.current?.temperature_2m ?? '--'}°C</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Droplets className="w-4 h-4 text-sky-300" />
                <span>Rain: {weatherData.rainProbability ?? 0}%</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Wind className="w-4 h-4 text-emerald-300" />
                <span>{weatherData.current?.wind_speed_10m ?? '--'} km/h</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CORE ACTION BUTTONS: Big & Farmer-Friendly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Large Crop Scan Button */}
        <Link
          to="/scan"
          className="group relative bg-white border-2 border-forest-600/30 hover:border-forest-600 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center space-x-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-forest-600 group-hover:bg-forest-700 text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105 shrink-0">
            <Camera className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-forest-700 transition-colors">
              {t.scanCropTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-0.5">
              {t.scanCropDesc}
            </p>
          </div>
          <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-forest-600 transition-colors shrink-0" />
        </Link>

        {/* Large Ask AI Button */}
        <Link
          to="/ask"
          className="group relative bg-white border-2 border-emerald-600/30 hover:border-emerald-600 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center space-x-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105 shrink-0">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {t.askAiTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-0.5">
              {t.askAiDesc}
            </p>
          </div>
          <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
        </Link>
      </div>

      {/* Farming Weather Advisory Card */}
      {weatherData && weatherData.farmingAdvisory && (
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4.5 flex items-start space-x-3.5 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
            <CloudSun className="w-5 h-5" />
          </div>
          <div className="flex-1 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-900">{t.farmingAdvisory} ({district})</span>
              <Link to="/weather" className="text-xs font-semibold text-amber-800 hover:underline flex items-center">
                7-Day Forecast <ArrowRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
            <p className="text-amber-800/90 leading-relaxed text-xs sm:text-sm">
              {weatherData.farmingAdvisory}
            </p>
          </div>
        </div>
      )}

      {/* Recent Diagnoses Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-forest-700" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">{t.viewHistory}</h3>
          </div>
          <Link to="/farm" className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center">
            View All ({recentDiagnoses.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {recentDiagnoses.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">{t.noHistory}</p>
            <Link
              to="/scan"
              className="inline-flex items-center text-xs font-semibold text-forest-700 mt-2 bg-forest-50 px-3 py-1.5 rounded-full border border-forest-200"
            >
              Take First Photo <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentDiagnoses.map((diag) => (
              <div
                key={diag.id}
                className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <div className="flex items-start space-x-3">
                  {diag.imageThumbnail ? (
                    <img
                      src={diag.imageThumbnail}
                      alt={diag.cropIdentified}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {diag.cropIdentified.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{diag.cropIdentified}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {diag.possibleDiseases[0] || 'Health check verified'}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(diag.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    diag.condition === 'healthy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : diag.riskLevel === 'High' || diag.riskLevel === 'Critical'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {diag.condition}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Regional Modules Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/flood"
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-forest-500 shadow-sm transition-all text-center flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Droplets className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">{t.navFlood}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">ASDMA Safety</span>
        </Link>

        <Link
          to="/advisor"
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-forest-500 shadow-sm transition-all text-center flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">{t.navAdvisor}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Kharif & Rabi</span>
        </Link>

        <Link
          to="/soil"
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-forest-500 shadow-sm transition-all text-center flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">{t.navSoil}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Card Extractor</span>
        </Link>

        <Link
          to="/market"
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-forest-500 shadow-sm transition-all text-center flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">{t.navMarket}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Mandi Status</span>
        </Link>
      </div>
    </div>
  );
};
