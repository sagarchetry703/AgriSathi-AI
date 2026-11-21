import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/index.js';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

test('E2E: Serves production frontend index.html on root GET /', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  const text = await res.text();
  assert.ok(text.includes('AgriSathi AI'));
  assert.ok(text.includes('root'));
});

test('E2E: Serves PWA manifest.json', async () => {
  const res = await fetch(`${baseUrl}/manifest.json`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.short_name, 'AgriSathi');
});

test('E2E: Serves Service Worker sw.js', async () => {
  const res = await fetch(`${baseUrl}/sw.js`);
  assert.equal(res.status, 200);
  const text = await res.text();
  assert.ok(text.includes('agrisathi-shell'));
});

test('E2E: Open-Meteo live weather integration returns live data for Jorhat', async () => {
  const res = await fetch(`${baseUrl}/api/weather/Jorhat`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.district, 'Jorhat');
  assert.equal(json.data.status, 'live');
  assert.ok(typeof json.data.current.temperature_2m === 'number');
  assert.ok(json.data.farmingAdvisory.length > 0);
});

test('E2E: AgriVision fallback and local rules return valid diagnosis for Tea', async () => {
  const res = await fetch(`${baseUrl}/api/vision/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      crop: 'Tea',
      language: 'as'
    })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.cropIdentified.includes('Tea') || json.data.cropIdentified.includes('চাহ'));
  assert.ok(json.data.recommendedNextSteps.length > 0);
  assert.ok(json.data.disclaimer.length > 0);
});
