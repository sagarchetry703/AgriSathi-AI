"use client";
import { useState } from "react";
import { FlaskConical, Upload } from "lucide-react";

export default function SoilPage() {
  const [result,setResult]=useState<any>(null); const [error,setError]=useState("");
  async function analyze(file:File){
    setError(""); setResult(null);
    const form=new FormData(); form.append("file",file);
    try{const r=await fetch("http://localhost:8000/api/soil/analyze",{method:"POST",body:form});const d=await r.json();if(!r.ok)throw new Error(d.detail);setResult(d);}catch(e){setError(e instanceof Error?e.message:"Unable to analyze report");}
  }
  return <div className="mx-auto max-w-3xl space-y-6"><header><p className="text-sm font-semibold text-[#2d7d46]">SOIL DOCTOR</p><h1 className="mt-1 text-3xl font-bold text-[#153f27]">Read a soil report</h1></header><label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#a9c9b1] bg-white p-6 text-center"><FlaskConical className="mb-3 h-10 w-10 text-[#2d7d46]"/><b>Upload a clear soil report image</b><span className="mt-1 text-sm text-[#718077]">JPEG, PNG or WebP · PDF preview is not extracted in this version</span><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e)=>e.target.files?.[0]&&analyze(e.target.files[0])}/></label>{error&&<div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}{result&&<div className="rounded-3xl border border-[#dfe7dc] bg-white p-6"><h2 className="font-bold text-[#153f27]">Extracted values — verify against your report</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{["pH","nitrogen","phosphorus","potassium","organic_carbon"].map(key=>{const v=result[key];return <div key={key} className="rounded-xl bg-[#edf6ed] p-3"><p className="text-xs capitalize text-[#718077]">{key.replace("_"," ")}</p><p className="mt-1 font-bold text-[#153f27]">{v?.value??"Not found"} {v?.unit||""}</p></div>})}</div></div>}</div>;
}
