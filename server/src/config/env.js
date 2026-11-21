import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root if available, then server dir, then cwd
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const config = {
  get port() {
    return process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  },
  get nodeEnv() {
    return process.env.NODE_ENV || 'development';
  },
  get clientOrigin() {
    return process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  },
  get geminiApiKey() {
    return (process.env.GEMINI_API_KEY || '').trim();
  },
  get geminiModel() {
    return process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
  },
  get geminiVisionModel() {
    return process.env.GEMINI_VISION_MODEL || 'gemini-3.1-flash-lite';
  },
  get weatherCacheTtl() {
    return parseInt(process.env.WEATHER_CACHE_TTL || '3600', 10);
  },
};
