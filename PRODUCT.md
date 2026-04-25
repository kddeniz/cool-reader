# Product

## Register

product

## Users

People who write or edit Markdown and want an immediate, trustworthy preview without installing an app, signing in, or running a build. Typical contexts: personal notes, README drafts, small docs, quick content checks, and reading or exporting `.md` on any device with a modern browser.

## Product Purpose

Cool Reader is a free, client-only Markdown editor: you type on the left, see a live HTML preview on the right. Preview output is sanitized with DOMPurify. You can open or drop `.md` / text files, download the current text as `.md`, or download the preview as a standalone `.html` file. There is no server, no database, and no account. Success means low friction (open and write), clear trust (safe rendering), and content staying in the foreground (minimal chrome).

The hosted site may load **Google Analytics** (gtag) for aggregated traffic; there is still no Cool Reader–hosted backend and the app does not upload your markdown to project-owned servers.

**UI tagline (toolbar):** Browser-only Markdown with live, sanitized HTML preview. Open or export .md and .html. No account.

## Brand Personality

Calm, focused, and quietly confident. The interface should feel like a good desk lamp: enough light to work, not a spectacle. Trust comes from clarity and predictable behavior, not from loud marketing. Three words: **steady**, **legible**, **restrained**.

## Anti-references

- Fake marketing density: big hero stats, identical icon cards, or “AI slop” layout patterns that distract from writing.
- Gradient text, side-stripe accent borders, or glassmorphism used as default decoration.
- Unnecessary modals for actions that can stay inline.
- Implied backend or account flows that the product does not offer.

## Design Principles

- **Content first:** The editor and preview own the screen; controls stay compact and legible.
- **Trust the pipeline:** Sanitized preview and honest export are part of the value story, not hidden implementation detail.
- **No setup story:** The product should read as “open and use” in one glance; short copy is allowed when it reduces confusion.
- **Restraint in chrome:** Favor one calm accent and muted structure; avoid competing focal points.
- **Motion with purpose only:** No layout animation; interactions stay subtle and fast.

## Accessibility & Inclusion

- Interactive controls should be keyboard reachable with visible focus.
- Text and UI colors should keep comfortable contrast on the default dark theme; respect `prefers-reduced-motion` where motion is used.
- Aim for practical alignment with **WCAG 2.1 Level AA** for core reading and control surfaces; improve over time as gaps are found.
