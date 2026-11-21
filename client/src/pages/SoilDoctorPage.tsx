import React, { useState, useRef } from 'react';
import { 
  FlaskConical, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  RefreshCw, 
  FileText,
  Info 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeSoilCard } from '../services/api';
import { SoilReportExtraction } from '../types';

export const SoilDoctorPage: React.FC = () => {
  const { t } = useApp();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extraction, setExtraction] = useState<SoilReportExtraction | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleExtract = async () => {
    if (!imageFile && !imagePreview) return;
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await analyzeSoilCard(imageFile || imagePreview!);
      if (res && res.success && res.data) {
        setExtraction(res.data);
      } else {
        setErrorMsg(res?.error?.message || 'Failed to extract soil data.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with soil analysis service.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateValue = (field: 'pH' | 'nitrogen' | 'phosphorus' | 'potassium' | 'organicCarbon', val: string) => {
    if (!extraction) return;
    const num = parseFloat(val);
    setExtraction({
      ...extraction,
      [field]: {
        ...extraction[field],
        value: isNaN(num) ? null : num,
        verified: true
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.navSoil}</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Upload your Soil Health Card photo to extract chemical parameters and receive tailored regional recommendations
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        {imagePreview ? (
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 max-h-64 flex items-center justify-center border border-slate-200">
            <img src={imagePreview} alt="Soil card" className="w-full h-full object-contain max-h-64" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-2xl bg-emerald-50/40 hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center text-emerald-800"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Upload Soil Health Card (Image or PDF)</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Clear photo of laboratory test values</span>
          </button>
        )}

        {imagePreview && !extraction && (
          <div className="flex gap-2">
            <button
              onClick={handleExtract}
              disabled={loading}
              className="flex-1 py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reading Soil Parameters with AI...</span>
                </>
              ) : (
                <>
                  <FlaskConical className="w-4 h-4" />
                  <span>Extract Soil Values</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
                setExtraction(null);
              }}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl"
            >
              Clear
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Extracted Values with User Verification & Editing */}
      {extraction && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Extracted Soil Parameters</h3>
              <p className="text-xs text-slate-500">
                Please verify the extracted numbers against your physical card and adjust if needed:
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              Editable
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* pH */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 block">Soil pH</label>
              <input
                type="number"
                step="0.1"
                value={extraction.pH?.value ?? ''}
                onChange={(e) => handleUpdateValue('pH', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <span className="text-[10px] text-slate-400">Target: 5.5 - 6.5</span>
            </div>

            {/* Nitrogen */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 block">Nitrogen (N)</label>
              <input
                type="number"
                value={extraction.nitrogen?.value ?? ''}
                onChange={(e) => handleUpdateValue('nitrogen', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <span className="text-[10px] text-slate-400">Unit: kg/ha</span>
            </div>

            {/* Phosphorus */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 block">Phosphorus (P)</label>
              <input
                type="number"
                value={extraction.phosphorus?.value ?? ''}
                onChange={(e) => handleUpdateValue('phosphorus', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <span className="text-[10px] text-slate-400">Unit: kg/ha</span>
            </div>

            {/* Potassium */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 block">Potassium (K)</label>
              <input
                type="number"
                value={extraction.potassium?.value ?? ''}
                onChange={(e) => handleUpdateValue('potassium', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <span className="text-[10px] text-slate-400">Unit: kg/ha</span>
            </div>

            {/* Organic Carbon */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 block">Organic Carbon (OC)</label>
              <input
                type="number"
                step="0.01"
                value={extraction.organicCarbon?.value ?? ''}
                onChange={(e) => handleUpdateValue('organicCarbon', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <span className="text-[10px] text-slate-400">Unit: %</span>
            </div>
          </div>

          {/* Explanation */}
          {extraction.explanation && (
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-1">
              <h4 className="text-xs font-bold text-emerald-950 uppercase">Soil Health Assessment</h4>
              <p className="text-xs text-emerald-900 leading-relaxed">{extraction.explanation}</p>
            </div>
          )}

          {/* Crop suitability tips */}
          {extraction.cropSuitabilityNotes?.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Crop Recommendations for this Soil</h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {extraction.cropSuitabilityNotes.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5 bg-slate-50 p-2 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-400 flex items-start space-x-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{extraction.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
