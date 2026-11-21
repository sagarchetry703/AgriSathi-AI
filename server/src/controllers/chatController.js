import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

function getGeminiClient() {
  if (!config.geminiApiKey) {
    return null;
  }
  return new GoogleGenerativeAI(config.geminiApiKey);
}

export async function handleAssistantChat(req, res, next) {
  try {
    const { message, language = 'en', history = [], district = 'Guwahati' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_MESSAGE', message: 'Please provide a non-empty message.' }
      });
    }

    const langNames = {
      en: 'English',
      as: 'Assamese (অসমীয়া)',
      hi: 'Hindi (हिन्दी)',
      bn: 'Bengali (বাংলা)'
    };

    const targetLang = langNames[language] || 'English';
    const ai = getGeminiClient();

    if (!ai) {
      // Informative offline / demo mode fallback in requested language
      let fallbackResponse = '';
      if (language === 'as') {
        fallbackResponse = `নমস্কাৰ! মই এগ্রিচাথী এআই (AgriSathi AI)। আপোনাৰ বাৰ্তা পালোঁ: "${message}". চাৰ্ভাৰত লাইভ GEMINI_API_KEY কনফিগাৰ কৰা নাই, কিন্তু মনত ৰাখিব: অসমত বৰ্তমান বতৰৰ ওপৰত ভিত্তি কৰি খেতিৰ যত্ন লওক আৰু সাৰ প্ৰয়োগৰ বাবে আপোনাৰ ওচৰৰ কৃষি বিজ্ঞান কেন্দ্ৰ (KVK) বা কৃষি বিষয়াৰ পৰামৰ্শ লওক।`;
      } else if (language === 'hi') {
        fallbackResponse = `नमस्ते! मैं एग्रीसाथी एआई (AgriSathi AI) हूँ। आपका प्रश्न प्राप्त हुआ: "${message}". सर्वर पर लाइव GEMINI_API_KEY कॉन्फ़िगर नहीं है। असम और पूर्वोत्तर के मौसम के अनुसार फसलों की उचित देखभाल करें और रासायनिक उर्वरकों के उपयोग हेतु अपने नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।`;
      } else if (language === 'bn') {
        fallbackResponse = `নমস্কার! আমি এগ্রিসাথী এআই (AgriSathi AI)। আপনার বার্তাটি পেয়েছি: "${message}"। সার্ভারে লাইভ GEMINI_API_KEY কনফিগার করা নেই। তবে আবহাওয়ার পূর্বাভাস দেখে ফসলের যত্ন নিন এবং প্রয়োজনে স্থানীয় কৃষি বিজ্ঞান কেন্দ্রের সাথে পরামর্শ করুন।`;
      } else {
        fallbackResponse = `Namaskar! I am AgriSathi AI, your smart farming companion for Northeast India. I received your query: "${message}". The server is currently operating in local reference mode (GEMINI_API_KEY not configured). Always inspect fields for adequate drainage and consult your district KVK for specific chemical dosage guidance.`;
      }

      return res.status(200).json({
        success: true,
        data: {
          response: fallbackResponse,
          language,
          sources: ['AgriSathi Agricultural Knowledge Base (Local Mode)']
        }
      });
    }

    const systemInstruction = `
You are AgriSathi AI, a friendly, practical, and highly knowledgeable agricultural extension assistant dedicated to farmers in Assam and Northeast India.
The farmer is located in or near district: "${district}".
You MUST reply strictly and fluently in the requested language: ${targetLang}.
Guidelines:
1. Use clear, simple, farmer-friendly terms. Avoid overly complex academic jargon.
2. Address local crops: Rice (Sali, Ahu, Bao), Assam Tea, Mustard, Potato, Tomato, Chilli (including Bhut Jolokia), and Maize.
3. Consider regional challenges like Brahmaputra river flooding, heavy monsoon rain, humidity, waterlogging, acidic soils, and pest pressures.
4. Give actionable agronomic recommendations (weeding, drainage, organic inputs, biological pest control, balanced NPK).
5. NEVER invent lethal or toxic pesticide dosage formulas.
6. Always append a kind reminder that severe problems should be confirmed with the local Krishi Vigyan Kendra (KVK) or Block Agriculture Development Officer (ADO).
`.trim();

    const model = ai.getGenerativeModel({
      model: config.geminiModel,
      systemInstruction
    });

    // Sanitize conversation history for Gemini:
    // 1. First message must be from role 'user'
    // 2. Roles must strictly alternate between 'user' and 'model'
    const sanitizedHistory = [];
    let expectedRole = 'user';

    for (const item of history) {
      if (!item || !item.content || typeof item.content !== 'string' || !item.content.trim()) {
        continue;
      }
      const role = (item.role === 'assistant' || item.role === 'model') ? 'model' : 'user';
      if (role === expectedRole) {
        sanitizedHistory.push({
          role,
          parts: [{ text: item.content.trim() }]
        });
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      }
    }

    // Ensure history ends on a model response so sendMessage(message) is the next user prompt
    if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
      sanitizedHistory.pop();
    }

    const chatSession = model.startChat({
      history: sanitizedHistory
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    res.status(200).json({
      success: true,
      data: {
        response: responseText,
        language,
        sources: ['Google Gemini AI Assistant', 'Assam Agro-climatic Extension Guidelines']
      }
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'CHAT_FAILED', message: err.message || 'Failed to process farming conversation.' }
    });
  }
}
