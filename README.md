# SAYANOX FORGE

> Local-first developer engineering, security analysis, project health and code intelligence workspace.

SAYANOX FORGE is a browser-native engineering cockpit designed around a simple principle: **your source code should stay yours**. The current release performs deterministic static checks directly in the browser with no backend and no paid AI API.

## Features

- 🛡️ High-signal secret and risky-code detection
- 🔎 Deterministic static analysis with severity levels
- 📊 Project health scoring
- 📁 Local project folder loading via browser APIs
- 🧩 Plugin-ready engine interfaces
- ⚡ Responsive developer workspace UI
- 🔒 No telemetry or source upload by the application
- 🧱 Deterministic, inspectable rules instead of opaque AI decisions

## Stack

React + TypeScript + Vite + Web APIs. Runtime dependencies are intentionally small.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Security model

FORGE is a defensive developer tool. Its current rules are advisory and intentionally conservative. A finding is not proof of exploitability, and a clean scan is not proof that a project is secure. Do not paste production credentials into the UI.

## Architecture

```text
src/
├── engine/       # deterministic scanners and local file ingestion
├── types.ts      # shared domain contracts and plugin interface
├── App.tsx       # workspace orchestration
├── main.tsx      # application bootstrap
└── styles.css    # responsive design system
```

## Roadmap

- Dependency and license manifest parser
- SARIF export/import
- Config and policy packs
- ZIP/project export
- Worker-based scanning for large projects
- Persistent scan history
- Extension/plugin SDK
- Optional Rust/Go native engine

## License

Apache License 2.0. See `LICENSE`.
