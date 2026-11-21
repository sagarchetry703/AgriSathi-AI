import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Camera, MessageSquare, CloudSun, Sprout } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { t } = useApp();

  const navItems = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/weather', label: t.navWeather, icon: CloudSun },
    { to: '/scan', label: t.navScan, icon: Camera, isCenter: true },
    { to: '/ask', label: t.navAskAI, icon: MessageSquare },
    { to: '/farm', label: t.navFarm, icon: Sprout },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center -mt-5 relative group`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                        isActive
                          ? 'bg-forest-600 text-white ring-4 ring-forest-100'
                          : 'bg-forest-700 text-white hover:bg-forest-600'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1 ${
                        isActive ? 'text-forest-700' : 'text-slate-600'
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive ? 'text-forest-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                  <span className="text-[11px] mt-1 truncate max-w-[64px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
