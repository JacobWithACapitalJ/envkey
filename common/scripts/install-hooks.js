#!/usr/bin/env node

/**
 * Post-install hooks for Rush.
 * This script runs after `rush install` to handle any additional setup,
 * such as rebuilding native modules for Electron.
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../..');
const electronDir = path.join(rootDir, 'packages/client-electron');

/**
 * Check if we should run electron-rebuild.
 * Skip on CI environments where electron packaging isn't happening.
 */
function shouldRunElectronRebuild() {
  // Skip if electron package directory doesn't exist yet
  if (!fs.existsSync(electronDir)) {
    console.log('Electron package not found, skipping electron-rebuild');
    return false;
  }

  // Skip if explicitly disabled
  if (process.env.SKIP_ELECTRON_REBUILD === 'true') {
    console.log('SKIP_ELECTRON_REBUILD is set, skipping electron-rebuild');
    return false;
  }

  // Check if keytar is installed
  const keytarPath = path.join(electronDir, 'node_modules/keytar');
  if (!fs.existsSync(keytarPath)) {
    // Check in hoisted location
    const hoistedKeytarPath = path.join(rootDir, 'common/temp/node_modules/keytar');
    if (!fs.existsSync(hoistedKeytarPath)) {
      console.log('keytar not found, skipping electron-rebuild');
      return false;
    }
  }

  return true;
}

/**
 * Run electron-rebuild for native modules.
 */
function runElectronRebuild() {
  if (!shouldRunElectronRebuild()) {
    return;
  }

  console.log('Running electron-rebuild for native modules (keytar)...');

  try {
    // Use npx to run electron-rebuild
    const result = spawnSync('npx', ['electron-rebuild', '-f', '-w', 'keytar'], {
      cwd: electronDir,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env }
    });

    if (result.status === 0) {
      console.log('electron-rebuild completed successfully.');
    } else {
      console.warn('electron-rebuild exited with code:', result.status);
      console.warn('This may be expected on CI or non-desktop environments.');
    }
  } catch (error) {
    console.warn('electron-rebuild failed:', error.message);
    console.warn('This may be expected on CI or non-desktop environments.');
  }
}

// Main execution
console.log('Running post-install hooks...');
runElectronRebuild();
console.log('Post-install hooks completed.');
