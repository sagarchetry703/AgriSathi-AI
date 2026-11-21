import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

console.log('\n🔍 --- AgriSathi AI: Gemini Configuration & Connectivity Check ---');
console.log(`📁 Target .env path: ${path.resolve(__dirname, '../.env')}`);

if (!apiKey) {
  console.log('❌ GEMINI_API_KEY is not configured in .env');
  console.log('👉 To configure your key:');
  console.log('   1. Open .env in your editor');
  console.log('   2. Set GEMINI_API_KEY=your_key_here');
  console.log('   3. Run: npm run verify:gemini\n');
  process.exit(0);
}

// Mask key for safety (only show first 6 and last 4 chars)
const maskedKey = apiKey.length > 10 
  ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`
  : '******';

console.log(`🔑 Key Detected: ${maskedKey} (${apiKey.length} chars)`);
console.log(`🤖 Target Model: ${modelName}`);
console.log('⏳ Connecting to Google Gemini API...');

const startTime = Date.now();
try {
  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: modelName });
  const prompt = 'Reply with one short greeting in Assamese and English for an Assam farmer.';
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const latency = Date.now() - startTime;

  console.log(`\n✅ Gemini API Connection SUCCESSFUL (${latency}ms)!`);
  console.log(`🤖 Active Model: ${modelName}`);
  console.log('🌾 Sample Response from Gemini:');
  console.log(`   "${text.trim()}"`);
  console.log('\n🚀 Both text and vision models are operational and ready!\n');
} catch (err) {
  console.error('\n❌ Gemini API Connection FAILED:');
  console.error(`   Error Code / Message: ${err.message}`);
  if (err.status) console.error(`   Status Code: ${err.status}`);
  console.log('\n👉 Troubleshooting Tips:');
  console.log('   - Verify your API key at https://aistudio.google.com/');
  console.log('   - Ensure your key has Generative Language API permissions enabled');
  console.log('   - Check for extra quotes or whitespace in .env\n');
  process.exit(1);
}
