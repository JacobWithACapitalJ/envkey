# Agent Guidelines for EnvKey Monorepo

## Package Manager: pnpm (NOT npm)

This monorepo uses **Rush.js with pnpm**. Never use `npm` commands directly.

| Instead of | Use |
|---|---|
| `npm install` | `rush update` |
| `npm run build` | `rush build` or `pnpm build` (from package dir) |
| `npm run <script>` | `pnpm <script>` (from package dir) |
| `npm test` | `pnpm test` (from package dir) |
| `npm run start` | `pnpm start` (from package dir) |

### Why this matters

- `npm run` ignores the pnpm workspace symlinks and can resolve dependencies incorrectly
- `npm install` will create a `package-lock.json` and `node_modules` layout incompatible with Rush/pnpm
- Rush manages the dependency graph and build order; always prefer `rush build` for multi-package builds

### Rush commands (run from repo root)

```bash
rush update          # Install/update all dependencies
rush build           # Build all packages in dependency order
rush build:go        # Build Go projects (envkey-source, envkeygo)
rush test:go         # Test Go projects
rush start:api       # Start API dev server
rush start:ui        # Start UI dev server
rush start:cli       # Start CLI in dev mode
rush start:electron  # Start Electron app
```

### Per-package commands (run from the package directory)

```bash
pnpm build           # Build this package
pnpm test            # Run tests for this package
pnpm start           # Start dev mode for this package
pnpm check           # TypeScript type check
```

## Electron Packaging

Before packaging the Electron app, ensure these are built first:

1. CLI bundle: `cd packages/client-cli && pnpm build`
2. envkey-source binary: `rush build:go`
3. Electron bundle: `cd packages/client-electron && pnpm build`
4. Package: `cd packages/client-electron && pnpm package:mac` (auto-stages binaries)
