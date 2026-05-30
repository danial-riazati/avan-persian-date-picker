import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const playgroundDir = path.join(root, 'examples/playground');
const outputDir = path.join(root, 'docs/screenshots');

const SHOTS = [
  { selector: '[data-screenshot="single-calendar"]', file: 'single-calendar.png' },
  { selector: '[data-screenshot="inline-picker"]', file: 'inline-picker.png' },
  { selector: '[data-screenshot="popover-picker"]', file: 'popover-picker.png' },
  { selector: '[data-screenshot="two-month-range"]', file: 'two-month-range.png' },
  { selector: '[data-screenshot="range-inline"]', file: 'range-inline.png' },
  { selector: '[data-screenshot="ltr-calendar"]', file: 'ltr-calendar.png' },
];

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, 'localhost', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(port);
      });
    });
    server.on('error', reject);
  });
}

function waitForServer(url, timeoutMs = 60_000) {
  const started = Date.now();

  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // retry
      }

      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }

      setTimeout(tick, 400);
    };

    tick();
  });
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  console.log('Building playground…');
  await run('corepack', ['pnpm', 'exec', 'vite', 'build'], { cwd: playgroundDir });

  const port = await getFreePort();
  const baseUrl = `http://localhost:${port}/screenshots.html`;

  console.log(`Starting preview server on ${port}…`);
  const preview = spawn(
    'corepack',
    ['pnpm', 'exec', 'vite', 'preview', '--port', String(port), '--strictPort'],
    {
      cwd: playgroundDir,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  preview.stderr?.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  preview.stdout?.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  try {
    await waitForServer(baseUrl);

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.fonts.ready);
    await page.waitForSelector('.avan-calendar');
    await page.waitForTimeout(500);

    for (const shot of SHOTS) {
      const element = page.locator(shot.selector);
      await element.scrollIntoViewIfNeeded();
      await element.screenshot({ path: path.join(outputDir, shot.file) });
      console.log(`Saved ${shot.file}`);
    }

    await browser.close();
  } finally {
    preview.kill('SIGTERM');
  }

  console.log(`Screenshots written to ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
