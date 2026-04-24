# Security policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| Latest `main` branch | Yes |
| Older commits / forks | Best effort only |

Cool Reader is a static, browser-only app. Security fixes apply to the files served from this repository and the documented CDN pins (`marked`, `DOMPurify`).

## Reporting a vulnerability

**Please do not open a public GitHub issue for undisclosed security vulnerabilities.**

Instead, report privately using one of these options:

1. **GitHub Security Advisories** (preferred): use [Security advisories](https://github.com/kddeniz/cool-reader/security/advisories/new) if enabled on the repository.
2. **Email**: contact the maintainer via the address on their [GitHub profile](https://github.com/kddeniz) (if listed).

Include:

- A short description of the issue and impact
- Steps to reproduce (browser, URL or `file://`, sample markdown if relevant)
- Whether you believe it affects XSS / sanitization, CDN integrity, or hosting headers

## What we consider in scope

- XSS or script execution via markdown → HTML preview (sanitization bypass)
- Unsafe handling of user-controlled content in the DOM
- Supply-chain issues affecting pinned CDN assets (SRI bypass, wrong file served)
- Misconfiguration of static hosting security headers (when applicable)

## Out of scope

- Social engineering, spam, or abuse of GitHub features
- Issues in third-party services (jsDelivr, Azure, Google Fonts) unless directly caused by this project’s integration

## Response expectations

Maintainers will aim to acknowledge reports within **7 days**. Critical issues (e.g. confirmed XSS in default configuration) are prioritized for fix and disclosure coordination.

Thank you for helping keep users safe.
