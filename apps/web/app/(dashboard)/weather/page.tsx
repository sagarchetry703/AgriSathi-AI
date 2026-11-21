"use client";
import { useEffect, useState } from "react";
import { CloudSun, Droplets, Wind } from "lucide-react";

export default function WeatherPage() {
  const [district, setDistrict] = useState("Guwahati");
  const [data, setData] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [error, setError] = useState("");
  async function load(name: string) {
    setError("");
    try { const r = await fetch(`http://localhost:8000/api/weather/district/${encodeURIComponent(name)}`); const d = await r.json(); if(!r.ok) throw new Error(d.detail); setData(d); } catch(e){ setError(e instanceof Error ? e.message : "Weather unavailable"); }
  }
  useEffect(() => { fetch("http://localhost:8000/api/weather/districts").then(r=>r.json()).then(d=>setDistricts(d.districts||[])); load(district); }, []);
  const current = data?.current || {};
  return <div className="space-y-6"><header><p className="text-sm font-semibold text-[#2d7d46]">WEATHER INTELLIGENCE</p><h1 className="mt-1 text-3xl font-bold text-[#153f27]">Local forecast</h1></header><select value={district} onChange={(e)=>{setDistrict(e.target.value);load(e.target.value)}} className="h-12 w-full max-w-xs rounded-xl border border-[#dfe7dc] bg-white px-3">{districts.map(d=><option key={d.name}>{d.name}</option>)}</select>{error&&<div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{error}</div>}{data&&<><div className="grid gap-4 sm:grid-cols-3"><Metric icon={<CloudSun/>} label="Temperature" value={`${current.temperature_2m ?? "—"} °C`}/><Metric icon={<Droplets/>} label="Humidity" value={`${current.relative_humidity_2m ?? "—"} %`}/><Metric icon={<Wind/>} label="Wind" value={`${current.wind_speed_10m ?? "—"} km/h`}/></div><div className="rounded-3xl border border-[#dfe7dc] bg-white p-6"><h2 className="font-bold text-[#153f27]">Farming advice</h2><p className="mt-2 text-sm text-[#55665a]">{data.farming_advisory}</p><p className="mt-4 text-xs text-[#718077]">Source: {data.source} · Timezone: {data.timezone} · Status: {data.status}</p></div></>}</div>;
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="rounded-2xl border border-[#dfe7dc] bg-white p-5 text-[#2d7d46]"><div className="mb-3 [&>svg]:h-6 [&>svg]:w-6">{icon}</div><p className="text-xs text-[#718077]">{label}</p><p className="mt-1 text-2xl font-bold text-[#153f27]">{value}</p></div>}
