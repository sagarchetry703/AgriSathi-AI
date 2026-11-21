import React, { useState } from 'react';
import { Compass, Sprout, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchCropRecommendations } from '../services/api';
import { CropRecommendationItem } from '../types';

export const CropAdvisorPage: React.FC = () => {
  const { t, district } = useApp();

  const [season, setSeason] = useState('Kharif');
  const [soilType, setSoilType] = useState('Alluvial');
  const [irrigation, setIrrigation] = useState('Rainfed');
  const [landArea, setLandArea] = useState<number>(2.5);
  const [recommendations, setRecommendations] = useState<CropRecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetchCropRecommendations({
        district,
        soilType,
        season,
        irrigation,
        landArea
      });
      if (res && res.success && res.data) {
        setRecommendations(res.data.recommendations || []);
        setHasQueried(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.navAdvisor}</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Agro-climatic crop suitability recommendations based on Assam Agricultural University (AAU) Package of Practices
        </p>
      </div>

      {/* Input Parameters Form */}
      <form
        onSubmit={handleGetRecommendations}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value="Kharif">Kharif (Monsoon / Sali Rice)</option>
              <option value="Rabi">Rabi (Winter / Mustard, Potato)</option>
              <option value="Zaid">Zaid / Summer (Ahu / Veg)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value="Alluvial">Alluvial (Brahmaputra Plains)</option>
              <option value="Red Loam">Red Loam (Foot-hills)</option>
              <option value="Sandy Loam">Sandy Loam (Char / Riverbank)</option>
              <option value="Clayey">Heavy Clayey (Lowland Paddy)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Irrigation Availability</label>
            <select
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value="Rainfed">Rainfed (Dependent on rain)</option>
              <option value="Borewell">Borewell / Shallow Tube Well</option>
              <option value="River Lift">River Lift / Canal</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Land Area (Acres)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={landArea}
              onChange={(e) => setLandArea(parseFloat(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Evaluating Regional Suitability...</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              <span>Get Suitable Crop Options</span>
            </>
          )}
        </button>
      </form>

      {/* Results List */}
      {hasQueried && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">
            Recommended Crops for {district} ({season} Season)
          </h3>

          <div className="space-y-4">
            {recommendations.map((item) => (
              <div
                key={item.crop}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{item.crop}</h4>
                    <span className="text-xs text-slate-500">{item.localNameAs}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.suitability === 'High'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.suitability} Suitability
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {item.reason}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-700 block mb-0.5">Soil & Water:</span>
                    <span className="text-slate-600">{item.soilRequirements} ({item.waterRequirements})</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-700 block mb-0.5">Constraints:</span>
                    <span className="text-slate-600">{item.possibleConstraints}</span>
                  </div>
                </div>

                {item.recommendedPractices?.length > 0 && (
                  <div className="pt-1">
                    <span className="text-xs font-bold text-forest-800 block mb-1">Recommended Practices:</span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {item.recommendedPractices.map((p, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 text-[10px] text-slate-400">
                  Source: {item.sourceAttribution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
