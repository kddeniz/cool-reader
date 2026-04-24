# Contributing to Cool Reader

Thanks for your interest in contributing. This project is intentionally small: **static HTML, CSS, and JavaScript only**—no backend, no build step required to run the app.

## Before you start

- Read [`README.md`](README.md) for scope and behavior.
- Read [`claude.md`](claude.md) for architecture constraints and file map.
- Optional: if you use Cursor, [`.cursor/rules/cool-reader.mdc`](.cursor/rules/cool-reader.mdc) summarizes conventions (SRI, accessibility, sanitization).

## How to run locally

1. Clone the repository.
2. Serve the repo root as static files (recommended over `file://` so behavior matches production):

   ```bash
   cd cool-reader
   python3 -m http.server 8000
   # Open http://localhost:8000
   ```

3. Or open `index.html` in a browser (CDN scripts require network on first load).

## Development checks

From the repository root (requires [Node.js](https://nodejs.org/) 20+):

```bash
npm ci
npm run validate:html
npm run lint
npm test
```

See [`package.json`](package.json) for scripts. CI runs these on pull requests.

## Pull request guidelines

- **One logical change per PR** when possible (easier review and bisect).
- **Keep the browser-only constraint**: no server code, no database, no bundler required for the shipped app unless explicitly agreed in an issue.
- **Preview security**: any path from user markdown to HTML must go through **DOMPurify** (or equivalent) before `innerHTML` or similar APIs.
- **Accessibility**: preserve keyboard focus visibility, labels, and ARIA where applicable.
- **CDN pins**: if you bump `marked` or `DOMPurify`, update **SRI `integrity` hashes** in `index.html` and document the change in [`CHANGELOG.md`](CHANGELOG.md).
- **Docs**: update `README.md` and `claude.md` if behavior, structure, or security posture changes.

## Reporting bugs

Use [GitHub Issues](https://github.com/kddeniz/cool-reader/issues) with the **Bug report** template. For security issues, see [`SECURITY.md`](SECURITY.md)—do not file public issues for undisclosed vulnerabilities.

## Code of conduct

Be respectful and constructive. Assume good intent; focus feedback on the work.

## Releases

See [`RELEASING.md`](RELEASING.md) for versioning, tags, and GitHub Releases.

## License

By contributing, you agree that your contributions will be licensed under the same terms as the project ([`LICENSE`](LICENSE) — MIT).
