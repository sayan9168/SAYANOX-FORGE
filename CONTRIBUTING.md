# Contributing to SAYANOX FORGE

Thanks for helping improve FORGE. The project values small, reviewable, deterministic changes over unnecessary complexity.

## Before you start

1. Fork the repository or create a focused feature branch.
2. Read `README.md` and `SECURITY.md`.
3. Keep source processing local and privacy-preserving.
4. Never commit credentials, tokens, private keys, personal data, or real customer source.

## Development workflow

```bash
npm install
npm run lint
npm test
npm run build
```

A pull request should leave all three quality checks passing.

## Code standards

- Prefer TypeScript with explicit domain types.
- Keep engine functions deterministic and dependency-light.
- Avoid network calls unless a future feature explicitly documents the trust boundary.
- Escape untrusted content when generating HTML.
- Do not use `eval` or dynamic code execution in the application.
- Keep browser-only APIs behind small, testable helpers.
- Add regression tests for bug fixes.
- Update documentation when behavior or configuration changes.

## Security rules

New analyzer rules should include:

- a unique `SECxxx` identifier;
- an accurate severity;
- a concise explanation;
- a deterministic pattern;
- at least one positive test;
- a clean/negative test where practical;
- an explicit note if false positives are expected.

Remember that heuristic rules are advisory signals. Avoid claiming exploitability when the rule only indicates risk.

## Pull requests

Use a focused title such as `feat:`, `fix:`, `security:`, `test:`, `docs:` or `chore:`. Explain the user-visible behavior, testing performed, and any security/privacy implications.

## Responsible disclosure

Do not publish real secrets or weaponized proof-of-concept material in issues. For vulnerabilities in FORGE, follow `SECURITY.md` and provide enough information for maintainers to reproduce and fix the issue safely.
