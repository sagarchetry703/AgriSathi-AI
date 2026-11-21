import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { analyzeCropImage } from '../controllers/visionController.js';
import { handleAssistantChat } from '../controllers/chatController.js';
import { getDistricts, getDistrictWeather } from '../controllers/weatherController.js';
import { getFloodAlerts, getFloodGuidance } from '../controllers/floodController.js';
import { analyzeSoilReport } from '../controllers/soilController.js';
import { recommendCrops } from '../controllers/cropsController.js';
import { getMarketPrices } from '../controllers/marketController.js';
import { getProfile, updateProfile, getHistory, addHistory, deleteHistory } from '../controllers/profileController.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'AgriSathi AI Express Backend',
    version: '1.0.0',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString()
  });
});

// AgriVision AI (Crop Doctor)
apiRouter.post('/vision/analyze', upload.single('file'), analyzeCropImage);

// AgriVoice AI (Assistant Chat)
apiRouter.post('/assistant/chat', handleAssistantChat);

// Weather Intelligence
apiRouter.get('/weather/districts', getDistricts);
apiRouter.get('/weather/:district', getDistrictWeather);

// Flood-to-Farm Intelligence
apiRouter.get('/flood/alerts', getFloodAlerts);
apiRouter.get('/flood/guidance', getFloodGuidance);

// Soil Doctor
apiRouter.post('/soil/analyze', upload.single('file'), analyzeSoilReport);

// Smart Crop Advisor
apiRouter.post('/crops/recommend', recommendCrops);

// Market Intelligence
apiRouter.get('/market/prices', getMarketPrices);

// Farmer Profile & Cloud Backup
apiRouter.get('/profile', getProfile);
apiRouter.put('/profile', updateProfile);
apiRouter.get('/history', getHistory);
apiRouter.post('/history', addHistory);
apiRouter.delete('/history/:id', deleteHistory);
