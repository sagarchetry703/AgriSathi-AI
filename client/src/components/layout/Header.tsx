import React from 'react';
import { Sprout, Globe, MapPin, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../types';

export const Header: React.FC = () => {
  const { language, setLanguage, district, setDistrict, isOnline, t } = useApp();

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'as', label: 'অসমীয়া' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'en', label: 'English' },
  ];

  const assamDistricts = [
    'Guwahati', 'Kamrup', 'Jorhat', 'Dibrugarh', 'Silchar', 
    'Tezpur', 'Nagaon', 'Barpeta', 'Sivasagar', 'Tinsukia', 'Dhubri'
  ];

  return (
    <header className="sticky top-0 z-40 bg-forest-900 text-white shadow-md border-b border-forest-800">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-forest-500/20 border border-forest-500/40 flex items-center justify-center text-forest-400">
            <Sprout className="w-5 h-5 text-forest-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight text-white">{t.appName}</span>
              <span className="text-[10px] font-semibold bg-forest-700/80 text-forest-200 px-1.5 py-0.5 rounded">Assam</span>
            </div>
            <p className="text-[11px] text-forest-200/80 hidden sm:block">{t.tagline}</p>
          </div>
        </div>

        {/* Controls: District & Language & Online Status */}
        <div className="flex items-center space-x-2">
          {/* Online/Offline indicator */}
          <div className="flex items-center text-xs">
            {isOnline ? (
              <span className="flex items-center text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded-full text-[11px]">
                <Wifi className="w-3 h-3 mr-1" />
                <span className="hidden md:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-1 rounded-full text-[11px]">
                <WifiOff className="w-3 h-3 mr-1" />
                <span>Offline</span>
              </span>
            )}
          </div>

          {/* District Selector */}
          <div className="relative flex items-center bg-forest-800/90 rounded-lg px-2 py-1 border border-forest-700 text-xs">
            <MapPin className="w-3.5 h-3.5 text-forest-300 mr-1 shrink-0" />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              {assamDistricts.map((d) => (
                <option key={d} value={d} className="bg-forest-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center bg-forest-800/90 rounded-lg px-2 py-1 border border-forest-700 text-xs">
            <Globe className="w-3.5 h-3.5 text-forest-300 mr-1 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-forest-900 text-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
