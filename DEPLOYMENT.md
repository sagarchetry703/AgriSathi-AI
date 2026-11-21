# 🚀 AgriSathi AI — Deployment & Production Guide

This guide details deployment options for AgriSathi AI for the GDG Build with AI hackathon and production environments.

---

## 1. Local Development
```bash
# Clone the repository
git clone <repo-url>
cd AgriSathi-AI

# Install all workspace dependencies
npm install

# Start Express Backend on port 5000
npm run dev:server

# Start Vite React Frontend on port 5173
npm run dev

# Or launch both concurrently:
node scripts/dev.js
```

---

## 2. Production Build & Unified Server
The Express backend is pre-configured to serve the compiled React Vite single-page application and PWA assets directly:
```bash
# Build the client production bundle
cd client
npm run build
cd ..

# Start the unified production server
NODE_ENV=production PORT=5000 node server/src/index.js
```
The application will be live at `http://localhost:5000/`.

---

## 3. Google Cloud Run Deployment (Containerized)

### Dockerfile
Create `Dockerfile` at the root of the project:
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
COPY shared/ ./shared/
RUN npm install
COPY client/ ./client/
COPY server/ ./server/
RUN cd client && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 8080
CMD ["node", "server/src/index.js"]
```

### Deploy to Cloud Run
```bash
gcloud builds submit --tag gcr.io/[PROJECT-ID]/agrisathi-ai
gcloud run deploy agrisathi-ai \
  --image gcr.io/[PROJECT-ID]/agrisathi-ai \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_KEY"
```

---

## 4. Firebase Hosting Deployment (Client-Only or Cloud Run Backend)
To host the frontend on Firebase:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: client/dist
# Configure as a single-page app: Yes
firebase deploy --only hosting
```
