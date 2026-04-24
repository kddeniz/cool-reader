/**
 * Markdown for Agents–style negotiation helpers (dev / Playwright server only).
 * @see https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 */
import TurndownService from "turndown";

/**
 * @param {string | undefined} accept
 * @returns {boolean}
 */
export function prefersMarkdown(accept) {
  if (!accept || typeof accept !== "string") return false;
  const parts = accept.split(",").map((s) => s.trim()).filter(Boolean);
  let qHtml = 0;
  let qMd = 0;
  for (const part of parts) {
    const bits = part.split(";").map((b) => b.trim());
    const type = (bits[0] ?? "").toLowerCase();
    let q = 1;
    for (let i = 1; i < bits.length; i++) {
      const eq = bits[i].indexOf("=");
      const k = (eq === -1 ? bits[i] : bits[i].slice(0, eq)).trim().toLowerCase();
      const v = (eq === -1 ? "" : bits[i].slice(eq + 1)).trim();
      if (k === "q") {
        const n = Number.parseFloat(v);
        if (!Number.isNaN(n)) q = Math.min(1, Math.max(0, n));
      }
    }
    if (type === "text/html" || type === "application/xhtml+xml") {
      qHtml = Math.max(qHtml, q);
    }
    if (type === "text/markdown" || type === "text/x-markdown") {
      qMd = Math.max(qMd, q);
    }
    if (type === "*/*") {
      qHtml = Math.max(qHtml, q * 0.02);
      qMd = Math.max(qMd, q * 0.02);
    }
  }
  if (qMd === 0) return false;
  return qMd > qHtml;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function extractDescription(html) {
  const byName =
    html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  return byName ? byName[1].trim() : "";
}

/**
 * @param {string} html
 * @returns {string}
 */
export function htmlToMarkdown(html) {
  const title = extractTitle(html);
  const description = extractDescription(html);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;

  const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
  td.remove(["script", "style", "noscript"]);

  let md = td.turndown(bodyHtml).trim();
  const fm = [];
  if (title) fm.push(`title: ${JSON.stringify(title)}`);
  if (description) fm.push(`description: ${JSON.stringify(description)}`);
  if (fm.length > 0) {
    md = `---\n${fm.join("\n")}\n---\n\n${md}`;
  }
  return md;
}

/**
 * Rough token estimate for x-markdown-tokens (no tokenizer dependency).
 * @param {string} markdown
 * @returns {number}
 */
export function estimateMarkdownTokens(markdown) {
  return Math.max(1, Math.ceil(markdown.length / 4));
}
