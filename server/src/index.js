import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config/env.js';
import { apiRouter } from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for client origin
app.use(cors({
  origin: true, // Allow dev and production origins
  credentials: true,
}));

// Body parser with 50MB limit to handle high-resolution crop photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount Master API Router
app.use('/api', apiRouter);

// Serve static frontend build if in production
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));

// SPA fallback for frontend client routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(clientDist, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>AgriSathi AI</title></head>
          <body style="font-family:sans-serif;text-align:center;padding:50px;">
            <h2>🌾 AgriSathi AI Backend API is Running on Port ${config.port}</h2>
            <p>Frontend is running at <a href="${config.clientOrigin}">${config.clientOrigin}</a> during development.</p>
            <p>API Health Check: <a href="/api/health">/api/health</a></p>
          </body>
        </html>
      `);
    }
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = config.port;

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('server/src/index.js')) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🌾 AgriSathi AI Server running at http://localhost:${PORT}`);
    console.log(`📡 API Endpoints mounted at http://localhost:${PORT}/api`);
    console.log(`🔑 Gemini Configured: ${Boolean(config.geminiApiKey)}`);
    console.log(`⛅ Open-Meteo Weather: Asia/Kolkata timezone ready`);
    console.log(`======================================================\n`);
  });
}

export default app;
