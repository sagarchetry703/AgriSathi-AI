import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  Square, 
  Trash2, 
  Sprout, 
  User, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../services/api';
import { 
  startSpeechRecognition, 
  stopSpeechRecognition, 
  speakText, 
  stopSpeaking,
  checkSpeechRecognitionSupport,
  checkSpeechSynthesisSupport 
} from '../services/speech';
import { 
  saveChatMessageToIndexedDB, 
  getChatHistoryFromIndexedDB, 
  clearChatHistoryFromIndexedDB 
} from '../services/indexedDb';
import { ChatMessage } from '../types';

export const AskAIPage: React.FC = () => {
  const { t, language, district } = useApp();
  const location = useLocation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSttSupported = checkSpeechRecognitionSupport();
  const isTtsSupported = checkSpeechSynthesisSupport();

  // Load chat history from IndexedDB on mount
  useEffect(() => {
    async function loadHistory() {
      const history = await getChatHistoryFromIndexedDB();
      if (history.length > 0) {
        setMessages(history);
      } else {
        // Welcome initial message
        const welcomeMsg: ChatMessage = {
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content: language === 'as'
            ? 'নমস্কাৰ! মই এগ্রিচাথী এআই। আপোনাৰ খেতি, শস্যৰ বেমাৰ, সাৰ প্ৰয়োগ বা বতৰৰ বিষয়ে যিকোনো প্ৰশ্ন মোক সুধিব পাৰে।'
            : language === 'hi'
            ? 'नमस्ते! मैं एग्रीसाथी एआई हूँ। आप अपनी फसल, कीट नियंत्रण, खाद या मौसम के बारे में कोई भी सवाल पूछ सकते हैं।'
            : language === 'bn'
            ? 'নমস্কার! আমি এগ্রিসাথী এআই। আপনার ফসল, সার, রোগবালাই বা আবহাওয়া সম্পর্কে যেকোনো প্রশ্ন করতে পারেন।'
            : 'Namaskar! I am AgriSathi AI. You can ask me any question regarding your crops, pest management, fertilizers, or seasonal planning in Assam.',
          language,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMsg]);
      }
    }
    loadHistory();

    // Check if routed with an initial query from Crop Scan
    if (location.state && (location.state as any).initialQuery) {
      setInputText((location.state as any).initialQuery);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setErrorMsg(null);
    setInputText('');
    stopSpeechRecognition();
    setIsListening(false);

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      language,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    saveChatMessageToIndexedDB(userMessage);

    try {
      setIsLoading(true);
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendChatMessage(text, language, district, historyPayload);

      if (res && res.success && res.data) {
        const assistantMsg: ChatMessage = {
          id: 'reply-' + Date.now(),
          role: 'assistant',
          content: res.data.response,
          language: res.data.language || language,
          timestamp: new Date().toISOString(),
          sources: res.data.sources
        };
        setMessages((prev) => [...prev, assistantMsg]);
        saveChatMessageToIndexedDB(assistantMsg);

        // Auto-speak response if user was speaking
        if (isListening && isTtsSupported) {
          handleSpeak(res.data.response);
        }
      } else {
        setErrorMsg(res?.error?.message || 'Could not fetch AI response.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with AI assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopSpeechRecognition();
      setIsListening(false);
    } else {
      setErrorMsg(null);
      setIsListening(true);
      startSpeechRecognition(
        language,
        (transcript) => {
          setInputText(transcript);
        },
        (err) => {
          setErrorMsg(err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleClearHistory = async () => {
    await clearChatHistoryFromIndexedDB();
    setMessages([]);
    stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <span>{t.askAiTitle}</span>
            <span className="text-xs bg-forest-100 text-forest-800 font-semibold px-2 py-0.5 rounded-full">
              {district}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice & text advisory powered by Google Gemini
          </p>
        </div>

        <button
          onClick={handleClearHistory}
          title="Clear Chat History"
          className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-forest-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-sm text-sm ${
                  isUser
                    ? 'bg-forest-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                {/* Audio playback button for assistant messages */}
                {!isUser && isTtsSupported && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="flex items-center space-x-1 text-forest-700 hover:text-forest-800 font-semibold text-[11px]"
                    >
                      {isSpeaking ? (
                        <>
                          <Square className="w-3 h-3 text-red-500" />
                          <span>{t.stopSpeaking}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{t.speakResponse}</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px]">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center space-x-2 text-xs text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin text-forest-600" />
              <span>AgriSathi AI is preparing your farming advice...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 bg-white border border-slate-300 rounded-2xl p-1.5 shadow-md focus-within:ring-2 focus-within:ring-forest-600"
        >
          {/* Prominent Microphone Button */}
          {isSttSupported && (
            <button
              type="button"
              onClick={handleToggleListening}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                isListening
                  ? 'bg-red-600 text-white animate-recording'
                  : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
              title={isListening ? 'Stop listening' : 'Speak your question'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? t.recording : t.askInputPlaceholder}
            className="flex-1 bg-transparent px-2 text-sm text-slate-800 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
