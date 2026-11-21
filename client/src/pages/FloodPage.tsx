import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  ShieldAlert, 
  PhoneCall, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  FileText 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchFloodGuidance, fetchFloodAlerts } from '../services/api';

export const FloodPage: React.FC = () => {
  const { t, district } = useApp();

  const [guidance, setGuidance] = useState<any>(null);
  const [alerts, setAlerts] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>('before');

  useEffect(() => {
    async function loadFloodInfo() {
      try {
        const [gRes, aRes] = await Promise.all([
          fetchFloodGuidance().catch(() => null),
          fetchFloodAlerts().catch(() => null)
        ]);
        if (gRes && gRes.success) setGuidance(gRes.data);
        if (aRes && aRes.success) setAlerts(aRes.data);
      } catch (e) {
        console.error('Failed to load flood info:', e);
      }
    }
    loadFloodInfo();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.floodTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {t.floodSubtitle}
        </p>
      </div>

      {/* Official Alert Feed Status Box */}
      {alerts && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-3xl flex items-start space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <h3 className="font-bold text-sky-950">Official Flood Warning Feed Status</h3>
            <p className="text-sky-800 mt-0.5 leading-relaxed">
              {alerts.message}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {alerts.officialResources?.map((res: any) => (
                <a
                  key={res.name}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-[11px] font-bold text-sky-800 bg-white border border-sky-300 px-2.5 py-1 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  <span>{res.name}</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Helpline Numbers */}
      {guidance && guidance.emergencyContacts && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <PhoneCall className="w-4 h-4 text-red-600 mr-1.5" />
            Assam Disaster Emergency Helplines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guidance.emergencyContacts.map((contact: any) => (
              <div
                key={contact.title}
                className="p-3 bg-red-50/60 border border-red-100 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-red-950">{contact.title}</h4>
                  <p className="text-[10px] text-red-700 mt-0.5">{contact.description}</p>
                </div>
                <a
                  href={`tel:${contact.number.split('/')[0].trim()}`}
                  className="text-xs font-black text-red-700 bg-white px-2.5 py-1.5 rounded-xl border border-red-200 hover:bg-red-100 shrink-0"
                >
                  {contact.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Preparedness Tabs */}
      {guidance && guidance.guidance && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex border-b border-slate-100 pb-2 space-x-2">
            <button
              onClick={() => setActiveTab('before')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'before'
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.beforeFlood}
            </button>
            <button
              onClick={() => setActiveTab('during')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'during'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.duringFlood}
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'after'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.afterFlood}
            </button>
          </div>

          {/* Checklist content */}
          <div className="space-y-2 pt-1">
            {guidance.guidance[activeTab]?.map((item: string, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3 text-xs sm:text-sm text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submergence-Resistant Crop Varieties */}
      {guidance && guidance.floodResistantVarieties && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <ShieldAlert className="w-4 h-4 text-forest-700 mr-1.5" />
            Flood-Resistant Rice Varieties for Assam Plains
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {guidance.floodResistantVarieties.map((v: any) => (
              <div
                key={v.variety}
                className="p-4 bg-forest-50/70 border border-forest-100 rounded-2xl space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-forest-950">{v.variety}</h4>
                  <span className="text-[10px] font-bold bg-forest-200 text-forest-900 px-2 py-0.5 rounded-full">
                    {v.submergenceToleranceDays} Days Submergence
                  </span>
                </div>
                <p className="text-[11px] text-forest-800 leading-relaxed mt-1">
                  {v.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
