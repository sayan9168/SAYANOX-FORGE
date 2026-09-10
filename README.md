# SAYANOX FORGE

> **Local-first developer engineering, security analysis, project health and code intelligence workspace.**

SAYANOX FORGE is a browser-native engineering cockpit built around a simple principle: **your source code should stay yours**. It analyzes project files locally in the browser, produces deterministic security signals, validates common configuration, generates project foundations, and exports portable reports — without a backend or paid AI API.

## Why FORGE?

Modern developer tooling often sends source code to remote services. FORGE takes a different approach: load a project into your browser and inspect it locally. The engine is deterministic and inspectable, so a developer can understand why a finding was produced instead of relying on an opaque model decision.

## v0.3 — Final feature release

### 🛡️ Security intelligence
- 30 deterministic security rules covering secrets, injection, XSS sinks, SSRF, path traversal, weak cryptography, insecure transport, Docker exposure, credential URLs, CORS and more.
- Severity-aware findings: critical, high, medium, low and info.
- Search/filter findings.
- Per-rule suppression.
- Path-pattern suppression for generated/vendor directories.
- Security rule catalog with IDs, titles and severity.

### 🔎 Engineering analysis
- Local project folder ingestion through browser file APIs.
- Project health score.
- Dependency discovery for npm and Python requirements.
- License hints.
- JSON/configuration validation.
- Project statistics: file count, total size and file-type distribution.
- Local scan history stored in browser storage.

### 📦 Project generation
- React + TypeScript template.
- Node API template.
- Python service template.
- Static web template.
- Real dependency-free ZIP export directly in the browser.

### 📊 Reporting
- SARIF 2.1.0 export.
- JSON export.
- Markdown export.
- HTML export with output escaping.
- Reports include version, score, file count and findings.

### 🧩 Extension architecture
- Validated plugin registry.
- Duplicate plugin protection.
- Plugin manifests.
- Isolated failure handling so one plugin cannot crash the scan pipeline.

### ⚡ Developer experience
- Command palette with `Ctrl/Cmd + K`.
- Responsive desktop/mobile workspace.
- No account required by the application.
- No source upload by the application.
- No paid AI API.
- No runtime backend dependency.

## Architecture

```text
src/
├── engine/
│   ├── analyzer.ts       # 30-rule deterministic security engine
│   ├── dependencies.ts   # npm/Python dependency discovery
│   ├── files.ts          # browser file ingestion
│   ├── plugins.ts        # extension registry
│   ├── policy.ts         # severity/rule/path filtering
│   ├── project.ts        # project templates
│   ├── reports.ts        # SARIF/JSON/Markdown/HTML
│   ├── validation.ts     # config validation + project statistics
│   └── zip.ts            # dependency-free ZIP writer
├── types.ts              # shared domain contracts
├── App.tsx               # workspace UI
├── main.tsx              # application bootstrap
└── styles.css            # responsive design system
```

## Security model

FORGE is a **defensive developer tool**. Findings are heuristic advisory signals, not proof of exploitability. A clean scan is not proof that a project is secure. FORGE does not replace professional SAST/DAST, dependency vulnerability databases, penetration testing, code review, threat modeling, or runtime monitoring.

Do not paste production credentials into the UI. Keep sensitive projects and secrets out of browser storage. Review every finding before making a security decision.

## Privacy

The application is designed to process loaded source files locally in the browser. It does not require a FORGE backend or paid AI API. Browser storage is used only for local scan history. Deployments can be independently inspected from the source repository.

## Development

Requirements: a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm test
npm run build
```

Production preview:

```bash
npm run build
npm run preview
```

## CI

GitHub Actions runs type checking, tests and a production build on pushes and pull requests targeting `main`.

## Contributing

See `CONTRIBUTING.md`. Security-sensitive changes should include regression tests and a short threat-model note. Never commit credentials, private keys, personal data, or generated secrets.

## Responsible security research

Use FORGE only on code and systems you own or are explicitly authorized to assess. If you discover a security issue in FORGE itself, follow `SECURITY.md` and provide a reproducible report without including real secrets.

## Project status

SAYANOX FORGE v0.3 is the intended feature-complete release of the browser-native workspace. Future work should prioritize maintenance, compatibility, test coverage, accessibility, performance, and carefully scoped security improvements rather than unnecessary feature bloat.

## License

Apache License 2.0. See `LICENSE`.
