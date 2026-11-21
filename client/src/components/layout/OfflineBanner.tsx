import React from 'react';
import { WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, t } = useApp();

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white text-xs px-4 py-2 flex items-center justify-center space-x-2 shadow-inner">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{t.offlineNotice}</span>
    </div>
  );
};
