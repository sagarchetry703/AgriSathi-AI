import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, ExternalLink, RefreshCw, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchMarketPrices } from '../services/api';

export const MarketPage: React.FC = () => {
  const { t, district } = useApp();
  const [marketInfo, setMarketInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrices() {
      try {
        setLoading(true);
        const res = await fetchMarketPrices('Paddy', district);
        if (res && res.success) {
          setMarketInfo(res.data);
        }
      } finally {
        setLoading(false);
      }
    }
    loadPrices();
  }, [district]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.navMarket}</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Agricultural market intelligence & wholesale mandi status in Assam
        </p>
      </div>

      {/* Honest Status Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Live Mandi Feed Integration Status</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          In adherence to ethical agricultural data standards for GDG Build with AI, AgriSathi AI does not synthesize or invent artificial commodity prices. A verified AGMARKNET or eNAM live API key is currently awaiting state portal credentials.
        </p>
        <p className="text-[11px] text-amber-800">
          Official Portal:{' '}
          <a
            href="https://agmarknet.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="font-bold underline inline-flex items-center"
          >
            agmarknet.gov.in <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </p>
      </div>

      {/* Major Agricultural Wholesale Markets in Assam */}
      {marketInfo && marketInfo.referenceMandis && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            Principal Agricultural Produce Markets (APMC / Mandis) in Assam
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marketInfo.referenceMandis.map((m: any) => (
              <div
                key={m.name}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                  <span className="text-[10px] font-semibold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
                    {m.location}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Key Commodities: <span className="font-medium text-slate-700">{m.primaryCommodity}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-400 flex items-start space-x-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Farmers are advised to contact local Regulated Market Committees (RMC) for daily physical auction rates.</span>
          </div>
        </div>
      )}
    </div>
  );
};
