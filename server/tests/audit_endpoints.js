import app from '../src/index.js';

async function testAllEndpoints() {
  console.log('--- Testing All 15 Express REST Endpoints ---');
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  const endpoints = [
    { name: '1. Health', method: 'GET', url: '/api/health' },
    { name: '2. Vision Analyze', method: 'POST', url: '/api/vision/analyze', body: { imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', crop: 'Rice', language: 'en' } },
    { name: '3. Assistant Chat', method: 'POST', url: '/api/assistant/chat', body: { message: 'What is the best time to sow mustard in Assam?', language: 'en', district: 'Jorhat' } },
    { name: '4. Weather Districts', method: 'GET', url: '/api/weather/districts' },
    { name: '5. District Weather', method: 'GET', url: '/api/weather/Dibrugarh' },
    { name: '6. Flood Alerts', method: 'GET', url: '/api/flood/alerts' },
    { name: '7. Flood Guidance', method: 'GET', url: '/api/flood/guidance' },
    { name: '8. Soil Analyze', method: 'POST', url: '/api/soil/analyze', body: { imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' } },
    { name: '9. Crops Recommend', method: 'POST', url: '/api/crops/recommend', body: { district: 'Silchar', soilType: 'Alluvial', season: 'Rabi', irrigation: 'Rainfed' } },
    { name: '10. Market Prices', method: 'GET', url: '/api/market/prices?commodity=Paddy&district=Guwahati' },
    { name: '11. Profile Get', method: 'GET', url: '/api/profile' },
    { name: '12. Profile Put', method: 'PUT', url: '/api/profile', body: { name: 'Kisaan Audit', district: 'Kamrup' } },
    { name: '13. History Post', method: 'POST', url: '/api/history', body: { cropIdentified: 'Rice', condition: 'healthy' } },
    { name: '14. History Get', method: 'GET', url: '/api/history' },
    { name: '15. History Delete', method: 'DELETE', url: '/api/history/test-id-123' },
  ];

  let passed = 0;
  for (const ep of endpoints) {
    try {
      const opts = { method: ep.method };
      if (ep.body) {
        opts.headers = { 'Content-Type': 'application/json' };
        opts.body = JSON.stringify(ep.body);
      }
      const res = await fetch(`${baseUrl}${ep.url}`, opts);
      const json = await res.json();
      if (res.status >= 200 && res.status < 300) {
        console.log(`✅ ${ep.name} -> HTTP ${res.status} SUCCESS`);
        passed++;
      } else {
        console.error(`❌ ${ep.name} -> HTTP ${res.status}`, json);
      }
    } catch (err) {
      console.error(`❌ ${ep.name} -> Error: ${err.message}`);
    }
  }

  server.close();
  console.log(`\nResults: ${passed} / ${endpoints.length} Endpoints Verified Successfully.`);
}

testAllEndpoints();
