#!/usr/bin/env node

/**
 * Builds the worker.js bundle from @envkey/core and copies it to the electron dist folder.
 * This script is called by `rush build:worker` and is a prerequisite for the electron build.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../..');
const coreDir = path.join(rootDir, 'packages/core');
const electronDir = path.join(rootDir, 'packages/client-electron');

console.log('Building worker.js from @envkey/core...');

try {
  // Build the worker using webpack
  execSync('npm run build:worker', {
    cwd: coreDir,
    stdio: 'inherit',
    env: { ...process.env }
  });

  // Ensure electron dist directory exists
  const electronDistDir = path.join(electronDir, 'dist');
  if (!fs.existsSync(electronDistDir)) {
    fs.mkdirSync(electronDistDir, { recursive: true });
  }

  // Copy worker.js to electron dist
  const workerSrc = path.join(coreDir, 'build/worker.js');
  const workerDest = path.join(electronDistDir, 'worker.js');

  if (fs.existsSync(workerSrc)) {
    fs.copyFileSync(workerSrc, workerDest);
    console.log(`Copied worker.js to ${workerDest}`);
  } else {
    console.error(`Error: worker.js not found at ${workerSrc}`);
    process.exit(1);
  }

  console.log('Worker build completed successfully.');
} catch (error) {
  console.error('Worker build failed:', error.message);
  process.exit(1);
}
