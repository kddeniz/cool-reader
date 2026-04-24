## What

<!-- Short description of the change -->

## Why

<!-- Motivation / issue link -->

## How to test

<!-- e.g. npm test, manual steps in browser -->

## Checklist

- [ ] Browser-only constraint preserved (no backend / no required build for the shipped static files unless agreed)
- [ ] Markdown → HTML path still sanitized (DOMPurify) before DOM insertion
- [ ] `README.md` / `claude.md` updated if behavior or architecture changed
- [ ] If CDN library versions changed: SRI `integrity` updated in `index.html` and `CHANGELOG.md` entry added
