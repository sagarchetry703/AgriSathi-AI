import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  MessageSquare, 
  CloudSun, 
  Sprout, 
  Droplets, 
  Compass, 
  FlaskConical, 
  TrendingUp, 
  User 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { t } = useApp();

  const primaryItems = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/scan', label: t.navScan, icon: Camera, highlight: true },
    { to: '/ask', label: t.navAskAI, icon: MessageSquare },
    { to: '/weather', label: t.navWeather, icon: CloudSun },
    { to: '/farm', label: t.navFarm, icon: Sprout },
  ];

  const secondaryItems = [
    { to: '/flood', label: t.navFlood, icon: Droplets },
    { to: '/soil', label: t.navSoil, icon: FlaskConical },
    { to: '/advisor', label: t.navAdvisor, icon: Compass },
    { to: '/market', label: t.navMarket, icon: TrendingUp },
    { to: '/profile', label: t.navProfile, icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-61px)] shrink-0 p-4">
      <div className="space-y-6">
        {/* Main Navigation */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
            Primary Assistant
          </p>
          <div className="space-y-1">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      item.highlight
                        ? isActive
                          ? 'bg-forest-600 text-white shadow-sm'
                          : 'bg-forest-50 text-forest-800 hover:bg-forest-100 border border-forest-200'
                        : isActive
                        ? 'bg-forest-50 text-forest-800 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Secondary Modules */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
            Regional Farming Tools
          </p>
          <div className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-forest-50 text-forest-800 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-900">GDG Build with AI</p>
          <p className="text-[11px] text-emerald-700 mt-0.5">Assam & NE Agricultural Initiative</p>
        </div>
      </div>
    </aside>
  );
};
