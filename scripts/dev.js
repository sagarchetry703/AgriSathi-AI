import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

console.log('🌾 Starting AgriSathi AI (Client + Server)...');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const server = spawn(npmCmd, ['run', 'dev', '--workspace=server'], {
  stdio: 'inherit',
  shell: true,
});

const client = spawn(npmCmd, ['run', 'dev', '--workspace=client'], {
  stdio: 'inherit',
  shell: true,
});

function shutdown() {
  console.log('\n🛑 Shutting down AgriSathi AI services...');
  server.kill('SIGTERM');
  client.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
