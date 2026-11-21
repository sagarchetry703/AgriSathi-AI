import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Trash2, 
  Search, 
  Camera, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Download,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllDiagnosesFromIndexedDB, deleteDiagnosisFromIndexedDB } from '../services/indexedDb';
import { CropDiagnosisResult } from '../types';

export const MyFarmPage: React.FC = () => {
  const { t, profile, district } = useApp();

  const [diagnoses, setDiagnoses] = useState<CropDiagnosisResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await getAllDiagnosesFromIndexedDB();
      setDiagnoses(list);
    } catch (e) {
      console.error('Error reading IndexedDB diagnoses:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this diagnosis record from your device?')) {
      await deleteDiagnosisFromIndexedDB(id);
      loadData();
    }
  };

  const filteredDiagnoses = diagnoses.filter((d) => {
    const matchesSearch =
      d.cropIdentified.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.possibleDiseases.some((dis) => dis.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterCondition === 'all' || d.condition === filterCondition;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.navFarm}</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Your offline farm journal, crop diagnosis history, and emergency preparedness records
        </p>
      </div>

      {/* Farm Overview Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{profile.name}</h2>
              <p className="text-xs text-slate-500">
                {district}, Assam · {profile.landAreaAcres ?? 2.5} Acres · {profile.irrigationSource || 'Rainfed'}
              </p>
            </div>
          </div>

          <Link
            to="/profile"
            className="text-xs font-semibold text-forest-700 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-200 hover:bg-forest-100 self-start sm:self-auto"
          >
            Edit Farm Details
          </Link>
        </div>

        {/* Crops badges */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Primary Crops:</span>
          {profile.primaryCrops.map((c) => (
            <span
              key={c}
              className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Diagnosis History Header & Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
            <span>Crop Diagnosis Journal</span>
            <span className="text-xs font-semibold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
              {diagnoses.length} Records
            </span>
          </h3>

          <Link
            to="/scan"
            className="inline-flex items-center space-x-1.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm self-start sm:self-auto"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>New Crop Scan</span>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by crop or disease name..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="all">All Conditions</option>
            <option value="diseased">Diseased</option>
            <option value="pest_infestation">Pest Infestation</option>
            <option value="healthy">Healthy</option>
          </select>
        </div>
      </div>

      {/* Diagnoses List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading your farm records...</div>
      ) : filteredDiagnoses.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Camera className="w-10 h-10 text-slate-300 mx-auto mb-1" />
          <p className="text-sm font-semibold text-slate-700">No matching diagnosis records</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Photographs you scan are analyzed by Gemini and saved to your device for low-connectivity field review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiagnoses.map((diag) => (
            <div
              key={diag.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  {diag.imageThumbnail ? (
                    <img
                      src={diag.imageThumbnail}
                      alt={diag.cropIdentified}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-base shrink-0">
                      {diag.cropIdentified.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {diag.cropIdentified}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {diag.possibleDiseases[0] || 'No acute disease detected'}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center mt-0.5">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(diag.timestamp).toLocaleDateString()} at{' '}
                      {new Date(diag.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      diag.condition === 'healthy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : diag.riskLevel === 'High' || diag.riskLevel === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {diag.condition}
                  </span>

                  <button
                    onClick={() => handleDelete(diag.id)}
                    title="Delete record"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Symptoms summary */}
              {diag.visualObservations && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {diag.visualObservations}
                </p>
              )}

              {/* Top remedies */}
              {diag.recommendedNextSteps?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wide">
                    Prescribed Actions:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {diag.recommendedNextSteps.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-forest-600 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
