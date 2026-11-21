"use client";

import { useState } from "react";
import { Mic, Send, Volume2 } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("as");
  const [messages, setMessages] = useState<{role: string; text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!message.trim()) return;
    const text = message.trim();
    setMessages((old) => [...old, { role: "user", text }]);
    setMessage(""); setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/assistant/chat", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({message:text, language}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "AI assistant is unavailable");
      setMessages((old) => [...old, { role: "assistant", text: data.response }]);
    } catch (err) {
      setMessages((old) => [...old, { role: "assistant", text: err instanceof Error ? err.message : "Unable to respond" }]);
    } finally { setLoading(false); }
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = {as:"as-IN",hi:"hi-IN",bn:"bn-IN",en:"en-IN"}[language] || "en-IN";
    speechSynthesis.speak(utterance);
  }

  function listen() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = {as:"as-IN",hi:"hi-IN",bn:"bn-IN",en:"en-IN"}[language] || "en-IN";
    recognition.onresult = (event: any) => setMessage(event.results[0][0].transcript);
    recognition.start();
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <header className="mb-5 flex items-end justify-between"><div><p className="text-sm font-semibold text-[#2d7d46]">MULTILINGUAL ASSISTANT</p><h1 className="mt-1 text-3xl font-bold text-[#153f27]">Ask AgriSathi</h1></div><select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-10 rounded-xl border border-[#dfe7dc] bg-white px-3 text-sm"><option value="as">অসমীয়া</option><option value="en">English</option><option value="hi">हिन्दी</option><option value="bn">বাংলা</option></select></header>
      <div className="min-h-[55vh] space-y-3 rounded-3xl border border-[#dfe7dc] bg-white p-4 sm:p-6">
        {messages.length === 0 && <div className="mx-auto mt-24 max-w-sm text-center text-[#718077]"><MessageIcon /><p className="mt-3">Ask in Assamese, English, Hindi or Bengali.</p></div>}
        {messages.map((item, i) => <div key={i} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${item.role === "user" ? "bg-[#2d7d46] text-white" : "bg-[#edf3ec] text-[#34523f]"}`}>{item.text}{item.role === "assistant" && <button onClick={() => speak(item.text)} className="ml-3 inline-block text-[#2d7d46]" aria-label="Speak response"><Volume2 className="h-4 w-4" /></button>}</div></div>)}
        {loading && <p className="text-sm text-[#718077]">AgriSathi is thinking...</p>}
      </div>
      <div className="mt-4 flex gap-2"><button onClick={listen} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#dfe7dc] bg-white text-[#2d7d46]" aria-label="Voice input"><Mic className="h-5 w-5" /></button><input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your farming question..." className="h-12 min-w-0 flex-1 rounded-xl border border-[#dfe7dc] bg-white px-4 outline-none focus:border-[#78a985]" /><button onClick={send} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2d7d46] text-white" aria-label="Send"><Send className="h-5 w-5" /></button></div>
    </div>
  );
}

function MessageIcon(){ return <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf6ed] text-2xl">🌾</div>; }
