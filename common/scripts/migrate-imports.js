#!/usr/bin/env node

/**
 * Import Migration Script
 *
 * Converts TypeScript path aliases to workspace package references:
 *   @core/*      -> @envkey/core/*
 *   @infra/*     -> @envkey/infra/*
 *   @core_proc/* -> @envkey/client-core-process/*
 *
 * Usage:
 *   node common/scripts/migrate-imports.js [--dry-run] [--path <path>]
 *
 * Options:
 *   --dry-run   Show what would be changed without modifying files
 *   --path      Specific path to migrate (default: packages/)
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const pathIndex = args.indexOf('--path');
const targetPath = pathIndex !== -1 ? args[pathIndex + 1] : 'packages';

// Import path mappings: old alias -> new package reference
const pathMappings = {
  '@core/': '@envkey/core/',
  '@infra/': '@envkey/infra/',
  '@core_proc/': '@envkey/client-core-process/',
};

// Statistics
let filesScanned = 0;
let filesModified = 0;
let importsModified = 0;

/**
 * Recursively find all TypeScript files in a directory
 */
function findTsFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules, dist, build directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
        findTsFiles(fullPath, files);
      }
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Migrate imports in a single file
 */
function migrateFile(filePath) {
  filesScanned++;

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let fileImportsModified = 0;

  for (const [oldPath, newPath] of Object.entries(pathMappings)) {
    // Match import/export statements with the old path alias
    // Handles: import { X } from "@core/types"
    //          import X from "@core/lib/utils"
    //          export { X } from "@core/types"
    //          import type { X } from "@core/types"
    const importRegex = new RegExp(
      `((?:import|export)\\s+(?:type\\s+)?(?:\\{[^}]*\\}|\\*\\s+as\\s+\\w+|\\w+)\\s+from\\s+["'])${escapeRegex(oldPath)}`,
      'g'
    );

    const matches = content.match(importRegex);
    if (matches) {
      content = content.replace(importRegex, `$1${newPath}`);
      modified = true;
      fileImportsModified += matches.length;
    }

    // Also handle dynamic imports: import("@core/types")
    const dynamicImportRegex = new RegExp(
      `(import\\s*\\(\\s*["'])${escapeRegex(oldPath)}`,
      'g'
    );

    const dynamicMatches = content.match(dynamicImportRegex);
    if (dynamicMatches) {
      content = content.replace(dynamicImportRegex, `$1${newPath}`);
      modified = true;
      fileImportsModified += dynamicMatches.length;
    }

    // Handle require statements: require("@core/types")
    const requireRegex = new RegExp(
      `(require\\s*\\(\\s*["'])${escapeRegex(oldPath)}`,
      'g'
    );

    const requireMatches = content.match(requireRegex);
    if (requireMatches) {
      content = content.replace(requireRegex, `$1${newPath}`);
      modified = true;
      fileImportsModified += requireMatches.length;
    }
  }

  if (modified) {
    filesModified++;
    importsModified += fileImportsModified;

    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`${dryRun ? '[DRY RUN] Would modify' : 'Modified'}: ${relativePath} (${fileImportsModified} imports)`);

    if (!dryRun) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Main execution
 */
function main() {
  const rootDir = path.resolve(__dirname, '../..');
  const searchDir = path.join(rootDir, targetPath);

  console.log(`\nImport Migration Script`);
  console.log(`========================`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Target: ${searchDir}\n`);
  console.log(`Path mappings:`);
  for (const [oldPath, newPath] of Object.entries(pathMappings)) {
    console.log(`  ${oldPath} -> ${newPath}`);
  }
  console.log('');

  if (!fs.existsSync(searchDir)) {
    console.error(`Error: Directory not found: ${searchDir}`);
    process.exit(1);
  }

  const files = findTsFiles(searchDir);
  console.log(`Found ${files.length} TypeScript files to scan\n`);

  for (const file of files) {
    migrateFile(file);
  }

  console.log(`\nSummary:`);
  console.log(`  Files scanned: ${filesScanned}`);
  console.log(`  Files ${dryRun ? 'would be ' : ''}modified: ${filesModified}`);
  console.log(`  Imports ${dryRun ? 'would be ' : ''}migrated: ${importsModified}`);

  if (dryRun && filesModified > 0) {
    console.log(`\nRun without --dry-run to apply changes.`);
  }
}

main();
