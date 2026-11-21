import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, FarmerProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  district: string;
  setDistrict: (district: string) => void;
  isOnline: boolean;
  t: typeof TRANSLATIONS.en;
  profile: FarmerProfile;
  updateProfile: (profile: Partial<FarmerProfile>) => void;
}

const defaultProfile: FarmerProfile = {
  id: 'farmer-local',
  name: 'Kisaan Sathi',
  language: 'as',
  district: 'Jorhat',
  state: 'Assam',
  landAreaAcres: 2.5,
  soilType: 'Alluvial',
  primaryCrops: ['Rice', 'Tea', 'Mustard'],
  irrigationSource: 'Rainfed',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to Assamese ('as')
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('agrisathi_lang');
    return (saved as SupportedLanguage) || 'as';
  });

  // Initialize district from localStorage or default to Jorhat
  const [district, setDistrictState] = useState<string>(() => {
    return localStorage.getItem('agrisathi_district') || 'Jorhat';
  });

  const [profile, setProfileState] = useState<FarmerProfile>(() => {
    const saved = localStorage.getItem('agrisathi_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return defaultProfile;
  });

  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('agrisathi_lang', lang);
  };

  const setDistrict = (dist: string) => {
    setDistrictState(dist);
    localStorage.setItem('agrisathi_district', dist);
  };

  const updateProfile = (updates: Partial<FarmerProfile>) => {
    setProfileState((prev) => {
      const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('agrisathi_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        district,
        setDistrict,
        isOnline,
        t,
        profile,
        updateProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
