# SAYANOX FORGE

> **Local-first developer engineering, security analysis, project health and code intelligence workspace.**

[![CI](https://github.com/sayan9168/SAYANOX-FORGE/actions/workflows/ci.yml/badge.svg)](https://github.com/sayan9168/SAYANOX-FORGE/actions/workflows/ci.yml) [![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

## 🚀 Try FORGE

**Vercel deployment:** Connect this repository to Vercel and use the generated production URL as the public demo. Vercel automatically creates production deployments from the `main` branch after the GitHub repository is connected. citeturn1search1turn1search3

**One-click Vercel import:** https://vercel.com/new/clone?repository-url=https://github.com/sayan9168/SAYANOX-FORGE

No account is required by the application. Load a project folder in the browser and run the local analyzer. The demo is designed for safe testing with sample or non-sensitive source code.

> **Privacy note:** Do not upload production credentials or other sensitive material. FORGE is designed for local browser processing, but browser storage and browser security boundaries still matter.

## What is FORGE?

SAYANOX FORGE is a browser-native engineering cockpit built around a simple principle: **your source code should stay yours**. It analyzes project files locally in the browser, produces deterministic security signals, validates common configuration, generates project foundations, and exports portable reports — without a runtime backend or paid AI API.

## v0.3 — Feature-complete foundation

### 🛡️ Security intelligence
- 30 deterministic security rules covering secrets, injection, XSS sinks, SSRF, path traversal, weak cryptography, insecure transport, Docker exposure, credential URLs, CORS and more.
- Critical/high/medium/low/info severity model.
- Finding search and filtering.
- Per-rule suppression and path-pattern suppression.
- Security rule catalog with IDs, titles and severity.

### 🔎 Engineering analysis
- Browser folder ingestion using File APIs.
- Project health score.
- npm and Python dependency discovery.
- License hints.
- JSON/configuration validation.
- Project statistics and file-type distribution.
- Local scan history.

### 📦 Project generation
- React + TypeScript template.
- Node API template.
- Python service template.
- Static web template.
- Dependency-free ZIP export generated in the browser.

### 📊 Reporting
- SARIF 2.1.0.
- JSON.
- Markdown.
- HTML with output escaping.

### 🧩 Extension architecture
- Validated plugin registry.
- Duplicate protection.
- Plugin manifests.
- Failure isolation around plugin execution.

### ⚡ Developer experience
- Command palette (`Ctrl/Cmd + K`).
- Responsive desktop/mobile UI.
- No FORGE account required.
- No runtime backend dependency.
- No paid AI API.

## 🧪 Test it in the live demo

1. Open the Vercel production URL generated after importing the repository.
2. Start with the built-in sample project.
3. Open **Analyzer** and review findings.
4. Open **Security** to inspect the 30-rule catalog.
5. Try severity filters and ignored rules.
6. Open **Insights** for project statistics and validation.
7. Open **Generator** and export a sample project ZIP.
8. Export SARIF, JSON, Markdown or HTML reports.
9. If you want to test your own code, load a local project folder using **Open project**.

## 🏗️ Architecture

```text
src/
├── engine/
│   ├── analyzer.ts       # deterministic security engine
│   ├── dependencies.ts   # npm/Python dependency discovery
│   ├── files.ts          # browser file ingestion
│   ├── plugins.ts        # extension registry
│   ├── policy.ts         # severity/rule/path filtering
│   ├── project.ts        # project templates
│   ├── reports.ts        # report exporters
│   ├── validation.ts     # config validation + statistics
│   └── zip.ts            # dependency-free ZIP writer
├── types.ts
├── App.tsx
├── main.tsx
└── styles.css
```

## 🔐 Security model

FORGE is a **defensive developer tool**. Findings are heuristic advisory signals, not proof of exploitability. A clean scan is not proof that a project is secure. FORGE does not replace professional SAST/DAST, dependency vulnerability databases, penetration testing, code review, threat modeling or runtime monitoring.

Use FORGE only on code and systems you own or are explicitly authorized to assess.

## 🔒 Privacy model

Source analysis is designed to happen in the browser. FORGE does not require a FORGE backend or paid AI API. Scan history is stored locally in browser storage. The deployed application is a static frontend.

## 💻 Development

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

## 🌐 Deployment

### Vercel

Import `sayan9168/SAYANOX-FORGE` into Vercel, keep the project root at `/`, and use the standard Vite build configuration. Vercel can automatically deploy every push to `main` and generate preview deployments for branches/PRs. citeturn1search1turn1search3

**Vercel import:** https://vercel.com/new/clone?repository-url=https://github.com/sayan9168/SAYANOX-FORGE

No GitHub Pages workflow is included because GitHub Pages was not enabled for this repository; this avoids a permanently failing Pages job.

## 🤝 Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Security-sensitive changes should include regression tests and a short threat-model note. Never commit credentials, private keys, personal data or generated secrets.

## 🐛 Security reports

See [`SECURITY.md`](SECURITY.md) for responsible disclosure guidance. Do not publish real credentials, private keys or sensitive personal data in an issue.

## 📄 License

Apache License 2.0. See [`LICENSE`](LICENSE).

---

Built by **SAYANOX** with a privacy-first, browser-native engineering philosophy.
