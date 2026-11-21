"use client";

import { useState } from "react";
import { Camera, Upload, LoaderCircle } from "lucide-react";

export default function DiagnosePage() {
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState("Rice");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze(file: File) {
    setPreview(URL.createObjectURL(file));
    setLoading(true); setError(""); setResult(null);
    const form = new FormData();
    form.append("file", file);
    form.append("crop", crop);
    try {
      const response = await fetch("http://localhost:8000/api/vision/analyze", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to analyze image");
      setResult(data);
      const history = JSON.parse(localStorage.getItem("agrisathi-history") || "[]");
      localStorage.setItem("agrisathi-history", JSON.stringify([{ id: crypto.randomUUID(), type: "diagnosis", title: `${crop} crop scan`, summary: data.condition || "Image reviewed", created_at: new Date().toISOString(), data }, ...history].slice(0, 50)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze image");
    } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header><p className="text-sm font-semibold text-[#2d7d46]">AI CROP DOCTOR</p><h1 className="mt-1 text-3xl font-bold text-[#153f27]">Scan a crop problem</h1></header>
      <div className="rounded-3xl border border-[#dfe7dc] bg-white p-5 shadow-sm sm:p-8">
        <label className="mb-2 block text-sm font-semibold text-[#34523f]">Crop type</label>
        <select value={crop} onChange={(e) => setCrop(e.target.value)} className="mb-5 h-12 w-full rounded-xl border border-[#dfe7dc] bg-white px-3">
          {["Rice","Tea","Mustard","Potato","Tomato","Chilli","Maize","Unknown"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#a9c9b1] bg-[#f7faf6] p-5 text-center">
          {preview ? <img src={preview} alt="Crop preview" className="max-h-64 rounded-xl object-contain" /> : <><Camera className="mb-3 h-10 w-10 text-[#2d7d46]" /><b className="text-lg">Take or upload a clear photo</b><span className="mt-1 text-sm text-[#6b7d70]">JPEG, PNG or WebP · up to 10 MB</span></>}
          <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && analyze(e.target.files[0])} />
        </label>
        {loading && <div className="mt-4 flex items-center gap-2 text-[#2d7d46]"><LoaderCircle className="h-5 w-5 animate-spin" />Analyzing image...</div>}
        {error && <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      </div>
      {result && <section className="rounded-3xl border border-[#dfe7dc] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#153f27]">{result.condition || "Review result"}</h2>
        {result.symptom_explanation && <p className="mt-2 text-[#55665a]">{result.symptom_explanation}</p>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#edf6ed] p-4"><b>Possible diseases</b><p className="mt-1 text-sm">{Array.isArray(result.possible_diseases) ? result.possible_diseases.join(", ") || "Not identified" : "Not identified"}</p></div>
          <div className="rounded-xl bg-amber-50 p-4"><b>Risk</b><p className="mt-1 text-sm">{result.risk || "Not assessed"}</p></div>
        </div>
        {result.safe_recommendations?.length > 0 && <div className="mt-5"><b>Safe recommendations</b><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{result.safe_recommendations.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul></div>}
        <p className="mt-5 border-t pt-4 text-xs text-[#718077]">{result.disclaimer || "AI review is advisory and is not a laboratory diagnosis."}</p>
      </section>}
    </div>
  );
}
