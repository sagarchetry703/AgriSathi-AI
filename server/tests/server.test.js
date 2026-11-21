import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
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

test('GET /api/health returns 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.equal(data.service, 'AgriSathi AI Express Backend');
});

test('GET /api/weather/districts returns list of Assam districts', async () => {
  const res = await fetch(`${baseUrl}/api/weather/districts`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.districts.length >= 10);
  assert.ok(json.data.districts.some(d => d.name === 'Guwahati'));
  assert.ok(json.data.districts.some(d => d.name === 'Jorhat'));
});

test('GET /api/flood/guidance returns Assam flood safety checklist', async () => {
  const res = await fetch(`${baseUrl}/api/flood/guidance`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.guidance.before.length > 0);
  assert.ok(json.data.emergencyContacts.length > 0);
});

test('POST /api/crops/recommend returns Kharif crop suitability for Jorhat', async () => {
  const res = await fetch(`${baseUrl}/api/crops/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      district: 'Jorhat',
      soilType: 'Alluvial',
      season: 'Kharif',
      irrigation: 'Rainfed'
    })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.recommendations.length > 0);
  assert.ok(json.data.recommendations.some(r => r.crop.includes('Rice')));
});

test('POST /api/assistant/chat returns multilingual response', async () => {
  const res = await fetch(`${baseUrl}/api/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'ধান খেতিত কি সাৰ দিম?',
      language: 'as',
      district: 'Jorhat'
    })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.response.length > 0);
  assert.equal(json.data.language, 'as');
});
