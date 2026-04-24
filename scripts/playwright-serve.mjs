#!/usr/bin/env node
/**
 * Static file server for Playwright that applies staticwebapp.config.json
 * (global + first matching route headers) so local tests match production on Azure.
 */
import http from "node:http";
import { readFileSync, existsSync, statSync, createReadStream } from "node:fs";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  prefersMarkdown,
  htmlToMarkdown,
  estimateMarkdownTokens,
} from "./markdown-negotiation.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const configPath = join(root, "staticwebapp.config.json");
const swa = JSON.parse(readFileSync(configPath, "utf8"));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "text/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
  ".yml": "text/yaml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function getMime(filePath) {
  const m = MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream";
  return m;
}

function isUnderRoot(absolute) {
  const n = normalize(absolute);
  const r = normalize(root);
  return n === r || n.startsWith(r + sep);
}

function firstRouteHeaders(pathname) {
  const out = { ...swa.globalHeaders };
  const routes = swa.routes ?? [];
  for (const r of routes) {
    if (r.route === pathname && r.headers) {
      return { ...out, ...r.headers };
    }
  }
  return out;
}

function resolveFileUrl(pathname) {
  if (pathname === "" || pathname === "/") {
    return join(root, "index.html");
  }
  const rel = decodeURIComponent(pathname);
  if (rel.includes("\0") || rel.includes("..")) {
    return null;
  }
  const fromRoot = rel.startsWith("/") ? rel.slice(1) : rel;
  return join(root, fromRoot);
}

const port = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? "4173", 10);

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  let pathname;
  try {
    pathname = new URL(req.url ?? "", `http://${req.headers.host}`).pathname;
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad Request");
    return;
  }

  let filePath = resolveFileUrl(pathname);
  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }
  if (!isUnderRoot(filePath)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    const indexPath = join(filePath, "index.html");
    if (existsSync(indexPath)) {
      filePath = indexPath;
    }
  }

  if (!existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const accept = req.headers.accept;
  if (ext === ".html" && prefersMarkdown(accept)) {
    const html = readFileSync(filePath, "utf8");
    const markdown = htmlToMarkdown(html);
    const tokens = estimateMarkdownTokens(markdown);
    const headers = firstRouteHeaders(pathname);
    delete headers["content-type"];
    delete headers["Content-Type"];
    headers["Content-Type"] = "text/markdown; charset=utf-8";
    headers.Vary = "Accept";
    headers["x-markdown-tokens"] = String(tokens);
    const buf = Buffer.from(markdown, "utf8");
    headers["Content-Length"] = String(buf.length);
    if (req.method === "HEAD") {
      res.writeHead(200, headers);
      res.end();
      return;
    }
    res.writeHead(200, headers);
    res.end(buf);
    return;
  }

  const headers = firstRouteHeaders(pathname);
  if (!headers["content-type"] && !headers["Content-Type"]) {
    if (pathname === "/.well-known/api-catalog" || filePath.endsWith("api-catalog")) {
      headers["Content-Type"] = "application/json; charset=utf-8";
    } else {
      headers["Content-Type"] = getMime(filePath);
    }
  }
  if (ext === ".html") {
    headers.Vary = headers.Vary ? `${headers.Vary}, Accept` : "Accept";
  }
  if (req.method === "HEAD") {
    res.writeHead(200, headers);
    res.end();
    return;
  }
  res.writeHead(200, headers);
  createReadStream(filePath).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.error(`playwright-serve: http://127.0.0.1:${port}/ (root ${root})`);
});
