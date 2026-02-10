# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EnvKey is an end-to-end encrypted configuration and secrets management platform. It provides:
- Self-hosted/cloud API for managing environment variables and secrets
- Desktop application (Electron)
- CLI tool
- React-based web UI
- Language SDKs (Node.js, Python, Go, Ruby, PHP)

**Note:** EnvKey Cloud shut down February 1st, 2025. The codebase remains open source under MIT License.

## Monorepo Structure

This is a **Rush.js monorepo** using **pnpm** (v9.15.4) for package management.

```
/packages              # Core applications and libraries
├── core               # @envkey/core - Shared types, crypto, utilities
├── infra              # @envkey/infra - AWS infrastructure helpers
├── api-express        # @envkey/api-express - Express API server (Community Edition)
├── client-core-process # Background service for state management
├── client-ui          # React web interface
├── client-cli         # CLI tool
├── client-electron    # Electron desktop wrapper
├── client-shared      # Shared client utilities
├── tests              # Integration tests
└── test-core          # Test utilities

/sdks                  # Published SDKs
├── node               # npm: "envkey"
├── webpack-plugin     # npm: "envkey-webpack-plugin"
├── vscode             # VSCode extension
├── envkey-source      # Go-based CLI integration tool
├── envkeygo           # Go SDK library
└── envkeygo-example   # Go SDK example app

/public/sdks/languages-and-frameworks  # Python, Ruby, PHP SDKs
```

## Build Commands

### Root Level
```bash
pnpm run lint           # Lint all TypeScript files
```

### Per-Package Commands (run from package directory)

**Core** (`packages/core`):
```bash
pnpm run check          # TypeScript type check
pnpm run build:worker   # Build worker process with webpack
```

**API** (`packages/api-express`):
```bash
pnpm run start          # Start dev server with nodemon
pnpm run build          # Production webpack build
pnpm run check          # TypeScript type check
pnpm run db:migrate     # Run database migrations
pnpm run db:migrate:down    # Rollback migration
pnpm run db:migrate:unlock  # Unlock stuck migration
```

**CLI** (`packages/client-cli`):
```bash
pnpm run start          # Run CLI in development
pnpm run build          # Build webpack bundle
pnpm run check          # TypeScript type check
```

**UI** (`packages/client-ui`):
```bash
pnpm run build          # Production webpack build
pnpm run build:watch    # Development server with hot reload
pnpm run check          # TypeScript type check
```

**Desktop** (`packages/client-electron`):
```bash
pnpm run build          # Bundle for packaging
pnpm run build:start    # Build and run locally
pnpm run start          # Run Electron in dev mode
pnpm run package:mac    # macOS distribution
pnpm run package:win    # Windows distribution
pnpm run package:linux  # Linux distribution
```

## Running Tests

**Prerequisites:**
1. Build envkey-source: `./public/scripts/build_envkey_source`
2. Start API on localhost:3000: `./public/scripts/start_api_community_dev`

**Run tests** (from `packages/tests`):
```bash
pnpm test               # Development (with notify)
pnpm run test-ci        # CI mode with junit reporter
pnpm run test-inspect   # Debug mode with inspector
```

Required environment variables are set automatically in pnpm scripts:
- `NODE_TLS_REJECT_UNAUTHORIZED=0`
- `REENCRYPTION_MIN_DELAY=200`
- `REENCRYPTION_JITTER=0`

## Development Scripts

Located in `/public/scripts/`:
- `start_api_community_dev` - Start API server (runs local proxy and DBs first)
- `start_dbs` - Start database containers
- `start_core_process` - Start client core process
- `start_ui_dev_server` - Start UI webpack dev server
- `build_envkey_source` - Build Go envkey-source binary
- `build_worker` - Build TypeScript worker
- `build_electron` - Build Electron app
- `test` - Run full test suite (builds envkey-source, runs Go and TS tests)

## Architecture

### Core Package (`@envkey/core`)
Central shared library containing:
- **types/** - TypeScript interfaces for entire system (api/, crypto/, model/, rbac/, logs/)
- **lib/** - Utility implementations (crypto/, client/, graph/)
- Uses TweetNaCl for end-to-end encryption

### Client Architecture
- **client-core-process** - Background service managing Redux-like state, handles API communication
- **client-cli** and **client-ui** - Connect to core-process for state management
- **client-electron** - Wraps UI in Electron shell

### API Architecture
- Express.js server with WebSocket support for real-time updates
- Knex.js for MySQL database with versioned migrations
- Supports Community (self-hosted) and Enterprise editions

### SDK Integration
The `envkey-source` Go tool is the primary integration method:
```bash
envkey-source -- any-shell-command
```
Language SDKs wrap this tool or implement the protocol directly.

## Key Technical Details

- **TypeScript** 5.3.3, strict mode disabled
- **Node.js** 16.14.0+ required
- **Webpack** 5 for bundling
- **React** 17 for UI
- **Electron** 25 for desktop
- Uses `ts-node` at runtime for many packages (no compile step needed)
- 2-space indentation (see `.editorconfig`)

## Database

MySQL with Knex.js migrations in `packages/api-express/migrations/`. Run migrations with:
```bash
cd packages/api-express
pnpm run db:migrate
```
