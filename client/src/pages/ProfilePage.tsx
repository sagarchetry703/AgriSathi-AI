import React, { useState } from 'react';
import { User, Save, Download, Upload, CheckCircle2, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllDiagnosesFromIndexedDB } from '../services/indexedDb';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, t, district, setDistrict } = useApp();

  const [name, setName] = useState(profile.name);
  const [landArea, setLandArea] = useState(profile.landAreaAcres?.toString() || '2.5');
  const [soilType, setSoilType] = useState(profile.soilType || 'Alluvial');
  const [irrigation, setIrrigation] = useState(profile.irrigationSource || 'Rainfed');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(profile.primaryCrops || ['Rice', 'Tea']);
  const [savedMsg, setSavedMsg] = useState(false);

  const availableCrops = ['Rice', 'Tea', 'Mustard', 'Potato', 'Tomato', 'Chilli', 'Maize', 'Jute'];

  const toggleCrop = (c: string) => {
    if (selectedCrops.includes(c)) {
      setSelectedCrops(selectedCrops.filter(item => item !== c));
    } else {
      setSelectedCrops([...selectedCrops, c]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      district,
      landAreaAcres: parseFloat(landArea) || 2.5,
      soilType,
      irrigationSource: irrigation as any,
      primaryCrops: selectedCrops
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleExportData = async () => {
    const diagnoses = await getAllDiagnosesFromIndexedDB();
    const exportBundle = {
      profile,
      diagnoses,
      exportedAt: new Date().toISOString(),
      app: 'AgriSathi AI'
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrisathi-farm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.navProfile}</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure your farm profile and manage local offline records
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Farmer Details</h2>
            <p className="text-xs text-slate-400">Stored on your local device</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Farmer / Farm Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Operational Land (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Primary Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800"
              >
                <option value="Alluvial">Alluvial (Brahmaputra Plains)</option>
                <option value="Red Loam">Red Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Clayey">Heavy Clayey</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Irrigation Source</label>
            <select
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800"
            >
              <option value="Rainfed">Rainfed</option>
              <option value="Borewell">Borewell</option>
              <option value="Canal">Canal</option>
              <option value="River">River Lift</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">Cultivated Crops</label>
            <div className="flex flex-wrap gap-2">
              {availableCrops.map((c) => {
                const isSelected = selectedCrops.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCrop(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-forest-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Farm Profile</span>
        </button>

        {savedMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile saved to your device!</span>
          </div>
        )}
      </form>

      {/* Data Export / Import Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Backup & Data Portability</h3>
        <p className="text-xs text-slate-500">
          Your diagnoses and conversations remain on your phone. You can export a copy as JSON anytime.
        </p>
        <button
          type="button"
          onClick={handleExportData}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Farm Records (.JSON)</span>
        </button>
      </div>
    </div>
  );
};
