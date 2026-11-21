import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Bookmark, 
  MessageSquare,
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeCropPhoto } from '../services/api';
import { saveDiagnosisToIndexedDB } from '../services/indexedDb';
import { CropDiagnosisResult } from '../types';

export const CropScanPage: React.FC = () => {
  const { t, language } = useApp();
  const navigate = useNavigate();

  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const assamCrops = [
    { id: 'Rice', label: 'Rice (ধান / Sali, Ahu, Bao)' },
    { id: 'Tea', label: 'Tea (চাহ / Camellia assamensis)' },
    { id: 'Mustard', label: 'Mustard (সৰিয়হ / Toria)' },
    { id: 'Potato', label: 'Potato (আলু)' },
    { id: 'Tomato', label: 'Tomato (বিলাহী)' },
    { id: 'Chilli', label: 'Chilli (জলকীয়া / Bhut Jolokia)' },
    { id: 'Maize', label: 'Maize (মাকৈ)' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setDiagnosis(null);
    setSavedSuccess(false);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid crop image (JPEG or PNG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size must be under 10MB.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setDiagnosis(null);
    setErrorMsg(null);
    setSavedSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!imagePreview && !imageFile) {
      setErrorMsg('Please capture or upload a crop photo first.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);

      const payload = imageFile || imagePreview!;
      const res = await analyzeCropPhoto(payload, selectedCrop, language);

      if (res && res.success && res.data) {
        const result: CropDiagnosisResult = {
          ...res.data,
          imageThumbnail: imagePreview || undefined
        };
        setDiagnosis(result);
      } else {
        setErrorMsg(res?.error?.message || 'Failed to analyze crop photo.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while analyzing photograph.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveDiagnosis = async () => {
    if (!diagnosis) return;
    try {
      await saveDiagnosisToIndexedDB(diagnosis);
      setSavedSuccess(true);
    } catch (e) {
      setErrorMsg('Could not save diagnosis to offline storage.');
    }
  };

  const handleAskInChat = () => {
    if (!diagnosis) return;
    navigate('/ask', {
      state: {
        initialQuery: `মই মোৰ ${diagnosis.cropIdentified} শস্যত ${diagnosis.possibleDiseases[0] || 'বেমাৰ'} দেখা পাইছো। ইয়াৰ পৰা হাত সাৰিবলৈ কি ব্যৱস্থা গ্ৰহণ কৰিব পাৰোঁ?`
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.scanCropTitle}</h1>
        <p className="text-sm text-slate-600 mt-1">{t.scanCropDesc}</p>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Crop Selector Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Step 1: Select Affected Crop
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
        >
          {assamCrops.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Camera / Upload Section */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Step 2: Photograph or Upload Leaf
        </label>

        {imagePreview ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-80">
            <img
              src={imagePreview}
              alt="Crop capture"
              className="w-full h-full object-contain max-h-80"
            />
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 bg-slate-900/80 text-white p-2 rounded-full hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Big Camera Button */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-forest-600/40 bg-forest-50/60 hover:bg-forest-50 hover:border-forest-600 transition-all text-forest-800 group active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-full bg-forest-600 text-white flex items-center justify-center shadow-md mb-2 group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <span className="font-bold text-sm">{t.takePhoto}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Use Phone Camera</span>
            </button>

            {/* Upload File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-slate-700 group active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm">{t.uploadPhoto}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Choose from Gallery</span>
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        {imagePreview && !diagnosis && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-forest-600 hover:bg-forest-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{t.analyzing}</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Analyze Crop Photo Now</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* DIAGNOSIS RESULT CARD */}
      {diagnosis && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-5 animate-fadeIn">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Identified Crop
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {diagnosis.cropIdentified}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Source: {diagnosis.dataSource}</p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                diagnosis.condition === 'healthy'
                  ? 'bg-emerald-100 text-emerald-800'
                  : diagnosis.riskLevel === 'High' || diagnosis.riskLevel === 'Critical'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {diagnosis.condition.toUpperCase()}
            </span>
          </div>

          {/* Condition / Diseases */}
          {diagnosis.possibleDiseases.length > 0 && (
            <div className="p-4 bg-red-50/70 border border-red-200/80 rounded-2xl space-y-1">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wide">
                Detected Condition / Disease
              </span>
              <p className="font-bold text-red-950 text-base">
                {diagnosis.possibleDiseases.join(', ')}
              </p>
              {diagnosis.symptomExplanation && (
                <p className="text-xs text-red-800 mt-1 leading-relaxed">
                  {diagnosis.symptomExplanation}
                </p>
              )}
            </div>
          )}

          {/* Visual Observations */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Visual Observations</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {diagnosis.visualObservations}
            </p>
          </div>

          {/* Recommended Next Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-forest-800 uppercase flex items-center">
              <CheckCircle2 className="w-4 h-4 text-forest-600 mr-1.5" />
              Recommended Next Steps & Remedies
            </h4>
            <ul className="space-y-1.5">
              {diagnosis.recommendedNextSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-slate-700 bg-forest-50/50 p-2.5 rounded-xl border border-forest-100 flex items-start space-x-2"
                >
                  <span className="font-bold text-forest-700 shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preventive Measures */}
          {diagnosis.preventiveGuidance.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase">
                Long-Term Prevention
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                {diagnosis.preventiveGuidance.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Disclaimer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{diagnosis.disclaimer}</span>
          </div>

          {/* Action Footer: Save & Ask */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSaveDiagnosis}
              disabled={savedSuccess}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                savedSuccess
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-forest-600 hover:bg-forest-700 text-white shadow-sm'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{savedSuccess ? t.savedSuccessfully : t.saveToFarm}</span>
            </button>

            <button
              onClick={handleAskInChat}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center space-x-2 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-forest-700" />
              <span>Ask Follow-up in AI Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
