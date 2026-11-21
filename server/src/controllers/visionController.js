import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { CROPS_DATA } from '../config/crops.js';

function getGeminiClient() {
  if (!config.geminiApiKey) {
    return null;
  }
  return new GoogleGenerativeAI(config.geminiApiKey);
}

function parseJsonFromText(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch (innerErr) {
        // Fallback
      }
    }
    return { rawResponse: text };
  }
}

export async function analyzeCropImage(req, res, next) {
  try {
    let imageBuffer;
    let mimeType = 'image/jpeg';
    let cropSelected = req.body.crop || 'Unknown';
    let language = req.body.language || 'en';

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body.imageBase64) {
      const base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
      if (req.body.imageBase64.includes('image/png')) mimeType = 'image/png';
      else if (req.body.imageBase64.includes('image/webp')) mimeType = 'image/webp';
    } else {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_IMAGE', message: 'Please provide a crop image either as a file upload or base64.' }
      });
    }

    // Safety check on image buffer size (10MB max, min 10 bytes)
    if (imageBuffer.length < 10 || imageBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_IMAGE_SIZE', message: 'Image must be between 10 bytes and 10MB.' }
      });
    }

    const ai = getGeminiClient();

    // If Gemini API key is not configured, inform honestly or use agricultural rule knowledge
    if (!ai) {
      // Find matching crop in local knowledge base to provide informative fallback
      const localCrop = CROPS_DATA.find(c => c.name.toLowerCase().includes(cropSelected.toLowerCase()) || c.id === cropSelected.toLowerCase());
      const diseaseInfo = localCrop ? localCrop.commonDiseases[0] : null;

      return res.status(200).json({
        success: true,
        data: {
          id: 'demo-' + Date.now(),
          timestamp: new Date().toISOString(),
          cropSelected,
          cropIdentified: localCrop ? localCrop.name : `${cropSelected} (Assam Agro Region)`,
          condition: diseaseInfo ? 'diseased' : 'unclear',
          possibleDiseases: diseaseInfo ? [diseaseInfo.name] : ['Symptom Assessment Pending Live AI Key'],
          visualObservations: 'Image received successfully. Server is running in agricultural reference mode without a live GEMINI_API_KEY.',
          symptomExplanation: diseaseInfo ? diseaseInfo.symptoms : 'To analyze live photographs with multimodal AI, set GEMINI_API_KEY in the server environment.',
          alternatives: ['Nutrient deficiency', 'Weather stress / sun scald'],
          riskLevel: 'Medium',
          confidence: 'Low',
          recommendedNextSteps: diseaseInfo ? [diseaseInfo.organicRemedy, diseaseInfo.safeRemedy] : ['Inspect leaves for active pests or bacterial ooze.', 'Contact local KVK officer.'],
          preventiveGuidance: ['Ensure proper field drainage after Brahmaputra valley rains.', 'Avoid excessive nitrogenous fertilizer application.'],
          expertConsultationRecommended: true,
          disclaimer: 'Informational agricultural advisory only. Please configure GEMINI_API_KEY for live vision inference, and consult your district KVK before chemical treatment.',
          dataSource: 'Local Assam Agricultural Knowledge Base (Live Gemini API Key Not Configured)'
        }
      });
    }

    // Call live Gemini 2.0 Flash Vision
    const model = ai.getGenerativeModel({
      model: config.geminiVisionModel,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
You are an expert plant pathologist and agricultural extension adviser specializing in the crops of Assam and Northeast India.
The farmer has submitted an image of their crop. The farmer selected crop category: "${cropSelected}".
Language requested for response: "${language}" (en: English, as: Assamese, hi: Hindi, bn: Bengali).

Analyze the image carefully:
1. Identify if the photo is actually an agricultural crop. If it is blurry, irrelevant, or non-agricultural, explicitly set condition to "unclear".
2. Identify the specific crop, visible symptoms (lesions, discoloration, wilting, curling, insect presence, fungal growth).
3. Identify the most likely disease, pest infestation, or nutrient deficiency, referencing diseases prevalent in Assam (e.g., Bacterial Leaf Blight in Rice, Red Spider Mite in Tea, Aphids in Mustard, Late Blight in Potato, Bacterial Wilt in Tomato).
4. Provide alternative possible explanations.
5. Provide safe, actionable, farmer-friendly next steps including organic remedies and standard safe measures. NEVER invent hazardous chemical dosage formulas.
6. Rate qualitative confidence (Low, Medium, High) and risk level (Low, Medium, High, Critical).

Respond ONLY with valid JSON matching this exact structure:
{
  "cropIdentified": "string",
  "condition": "healthy" | "diseased" | "pest_infestation" | "nutrient_deficiency" | "unclear",
  "possibleDiseases": ["string"],
  "visualObservations": "string (what is visible on leaves/stem/fruit)",
  "symptomExplanation": "string (plain language explanation)",
  "alternatives": ["string"],
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "confidence": "Low" | "Medium" | "High",
  "recommendedNextSteps": ["string (step by step)"],
  "preventiveGuidance": ["string (for future prevention)"],
  "expertConsultationRecommended": boolean,
  "disclaimer": "Informational advisory only. Always verify with local Krishi Vigyan Kendra (KVK) or Block Agriculture Officer before chemical application."
}
`;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    const parsedData = parseJsonFromText(responseText);

    const diagnosis = {
      id: 'diag-' + Date.now(),
      timestamp: new Date().toISOString(),
      cropSelected,
      cropIdentified: parsedData.cropIdentified || cropSelected,
      condition: parsedData.condition || 'unclear',
      possibleDiseases: parsedData.possibleDiseases || [],
      visualObservations: parsedData.visualObservations || 'No specific visual symptoms recorded.',
      symptomExplanation: parsedData.symptomExplanation || '',
      alternatives: parsedData.alternatives || [],
      riskLevel: parsedData.riskLevel || 'Medium',
      confidence: parsedData.confidence || 'Medium',
      recommendedNextSteps: parsedData.recommendedNextSteps || ['Consult local KVK extension officer.'],
      preventiveGuidance: parsedData.preventiveGuidance || ['Ensure field sanitation and balanced fertilization.'],
      expertConsultationRecommended: parsedData.expertConsultationRecommended !== false,
      disclaimer: parsedData.disclaimer || 'Informational advisory only. Always verify with local KVK or Agriculture Officer.',
      dataSource: 'Google Gemini 2.0 Flash Vision Multimodal Analysis'
    };

    res.status(200).json({
      success: true,
      data: diagnosis
    });
  } catch (err) {
    console.error('Vision analysis error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'VISION_ANALYSIS_FAILED', message: err.message || 'Failed to analyze crop image.' }
    });
  }
}
