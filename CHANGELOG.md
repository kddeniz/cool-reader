# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Toolbar **Download (.html)**: exports the current markdown as a standalone HTML document (same sanitized body as the live preview, with embedded prose styles and optional Google Fonts link in the export).
- [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) `Link` response headers on the home page (Azure Static Web Apps) plus a minimal `/.well-known/api-catalog` and `docs/api.html` for agent / machine discovery.
- Playwright static server (`scripts/playwright-serve.mjs`): [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)–style negotiation for `.html` routes when `Accept` prefers `text/markdown` (`Content-Type: text/markdown`, `Vary: Accept`, `x-markdown-tokens`). Pure Azure Static Web Apps cannot vary by `Accept`; production parity for remote checks needs an edge that supports this (for example Cloudflare **Markdown for Agents** on the zone in front of the origin).

## [1.1.0] - 2026-04-24

### Added

- MIT `LICENSE` file, `SECURITY.md`, and root `CONTRIBUTING.md`.
- GitHub issue forms (bug / feature) and pull request template.
- Subresource Integrity (`integrity`) for pinned `marked` and `DOMPurify` CDN scripts.
- `staticwebapp.config.json` with baseline security headers (including CSP) for Azure Static Web Apps.
- `schema-ld.json` for JSON-LD, loaded via `<script type="application/ld+json" src="...">` to align with CSP.
- In-app `role="alert"` region for CDN load failures and file read errors.
- Optional dev tooling: `package.json`, ESLint, `html-validate`, Playwright smoke tests, and `CI` GitHub Actions workflow.
- `CHANGELOG.md` and `RELEASING.md`.
- Dependabot updates for GitHub Actions and npm dev dependencies.

### Changed

- Editor: visible `:focus-visible` ring; `aria-label` on the markdown textarea.
- `README.md` / `claude.md` / Cursor rules updated for maintenance, third parties, and checks.

### Repository

- Azure SWA workflow: `actions/checkout@v4`, `submodules: false`.

