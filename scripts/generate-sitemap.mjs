#!/usr/bin/env node
/**
 * Writes /sitemap.xml from <link rel="canonical"> in repo-root *.html.
 * https://www.sitemaps.org/protocol.html
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(root, "sitemap.xml");

const canonicalRe =
  /<link\s+[^>]*\brel\s*=\s*["']canonical["'][^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
const canonicalReAlt =
  /<link\s+[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*\brel\s*=\s*["']canonical["'][^>]*>/gi;

function collectCanonicals(html) {
  const urls = [];
  let m;
  canonicalRe.lastIndex = 0;
  while ((m = canonicalRe.exec(html)) !== null) {
    urls.push(m[1].trim());
  }
  canonicalReAlt.lastIndex = 0;
  while ((m = canonicalReAlt.exec(html)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const urls = new Set();
let latestMtimeMs = 0;

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) {
    continue;
  }
  const filePath = path.join(root, name);
  const html = fs.readFileSync(filePath, "utf8");
  for (const href of collectCanonicals(html)) {
    if (href) {
      urls.add(href);
    }
  }
  latestMtimeMs = Math.max(latestMtimeMs, fs.statSync(filePath).mtimeMs);
}

if (urls.size === 0) {
  console.error("generate-sitemap: no <link rel=\"canonical\"> found in *.html at repo root.");
  process.exit(1);
}

const sorted = [...urls].sort();
const lastmod =
  Number.isFinite(latestMtimeMs) && latestMtimeMs > 0
    ? new Date(latestMtimeMs).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

const body = sorted
  .map(
    (loc) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

fs.writeFileSync(outPath, xml, "utf8");
console.log(`Wrote ${outPath} (${sorted.length} URL(s)).`);
