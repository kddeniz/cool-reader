# Releasing Cool Reader

Cool Reader ships as **static files** in the repository root. There is no npm publish step for the app itself; optional npm tooling exists only for checks and tests.

## Version bumps

Keep these in sync when you cut a release:

1. [`CHANGELOG.md`](CHANGELOG.md) — add a new section with date and changes.
2. [`schema-ld.json`](schema-ld.json) — update `softwareVersion` (JSON-LD).
3. [`index.html`](index.html) — if `softwareVersion` appears elsewhere in the future, keep it aligned (today it lives in `schema-ld.json` only).

## Dependency pins (CDN)

When upgrading **marked** or **DOMPurify**:

1. Update the `src` URLs in `index.html` (pinned versions).
2. Recompute **SRI** `sha384-…` hashes for each file (see `CONTRIBUTING.md`).
3. Document the change in `CHANGELOG.md`.

## Git tag + GitHub Release

1. Ensure `main` is green (`CI` workflow passes).
2. Create an annotated tag, e.g. `git tag -a v1.2.0 -m "v1.2.0"`.
3. Push the tag: `git push origin v1.2.0`.
4. On GitHub: **Releases → Draft a new release**, select the tag, paste the relevant section from `CHANGELOG.md`, publish.

## Post-release

- Confirm the live site (if deployed) serves updated assets and that `staticwebapp.config.json` headers still match the app’s third-party origins.
