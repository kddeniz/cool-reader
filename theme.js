/* global: CoolReaderTheme (attached below) */
(function (global) {
  "use strict";

  var STORAGE_KEY = "coolReader.readingTheme.v1";

  /** @typedef {{ stack: string, gFamily: string, gSpec: string }} FontDef */

  var FONT_CHOICES = {
    "source-serif-4": {
      stack: "'Source Serif 4', Georgia, 'Times New Roman', serif",
      gFamily: "Source+Serif+4",
      gSpec: "ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400",
    },
    lora: {
      stack: "'Lora', Georgia, serif",
      gFamily: "Lora",
      gSpec: "wght@400;500;600;700",
    },
    "literata": {
      stack: "'Literata', 'Georgia', serif",
      gFamily: "Literata",
      gSpec: "opsz,wght@14..72,400;14..72,600;14..72,700",
    },
    "newsreader": {
      stack: "'Newsreader', 'Georgia', serif",
      gFamily: "Newsreader",
      gSpec: "ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400",
    },
    "jetbrains-mono": {
      stack: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace",
      gFamily: "JetBrains+Mono",
      gSpec: "wght@400;500",
    },
  };

  /**
   * @typedef {{ schemaVersion: number, presetId: string, colors: object, fonts: object, layout: object }} ReadingTheme
   */

  var DEFAULT_THEME = {
    schemaVersion: 1,
    presetId: "evening",
    colors: {
      text: "oklch(0.945 0.012 292)",
      bg: "oklch(0.205 0.018 285)",
      link: "oklch(0.74 0.13 28)",
      linkHover: "oklch(0.82 0.11 28)",
      muted: "oklch(0.62 0.032 292)",
      border: "oklch(0.36 0.028 292)",
      codeBg: "oklch(0.17 0.02 288)",
      quoteBg: "oklch(0.26 0.035 292 / 0.45)",
      tableHeaderBg: "oklch(0.17 0.02 288)",
      thText: "oklch(0.62 0.032 292)",
      preInset: "oklch(0.4 0.02 292 / 0.25)",
    },
    fonts: {
      prose: "source-serif-4",
      code: "jetbrains-mono",
    },
    layout: {
      bodyFontRem: 1.0625,
      lineHeight: 1.7,
      maxWidthCh: 68,
      h1Rem: 2,
      h2Rem: 1.45,
      h3Rem: 1.2,
      h4Rem: 1.05,
    },
  };

  var PRESET_THEMES = {
    evening: { presetId: "evening" },
    paper: {
      presetId: "paper",
      colors: {
        text: "oklch(0.22 0.02 265)",
        bg: "oklch(0.97 0.01 90)",
        link: "oklch(0.45 0.12 28)",
        linkHover: "oklch(0.38 0.14 28)",
        muted: "oklch(0.45 0.02 265)",
        border: "oklch(0.82 0.02 90)",
        codeBg: "oklch(0.92 0.01 90)",
        quoteBg: "oklch(0.94 0.02 95 / 0.8)",
        tableHeaderBg: "oklch(0.9 0.02 90)",
        thText: "oklch(0.42 0.03 265)",
        preInset: "oklch(0.5 0.04 28 / 0.12)",
      },
      fonts: { prose: "lora", code: "jetbrains-mono" },
      layout: { bodyFontRem: 1.05, lineHeight: 1.75, maxWidthCh: 66 },
    },
    sepia: {
      presetId: "sepia",
      colors: {
        text: "oklch(0.28 0.04 75)",
        bg: "oklch(0.9 0.04 75)",
        link: "oklch(0.5 0.1 28)",
        linkHover: "oklch(0.42 0.12 28)",
        muted: "oklch(0.48 0.05 75)",
        border: "oklch(0.72 0.06 75)",
        codeBg: "oklch(0.85 0.05 70)",
        quoteBg: "oklch(0.88 0.04 80 / 0.65)",
        tableHeaderBg: "oklch(0.86 0.04 70)",
        thText: "oklch(0.45 0.05 75)",
        preInset: "oklch(0.4 0.04 30 / 0.15)",
      },
      fonts: { prose: "literata", code: "jetbrains-mono" },
    },
    ocean: {
      presetId: "ocean",
      colors: {
        text: "oklch(0.9 0.04 220)",
        bg: "oklch(0.2 0.04 240)",
        link: "oklch(0.7 0.12 200)",
        linkHover: "oklch(0.78 0.1 195)",
        muted: "oklch(0.62 0.05 220)",
        border: "oklch(0.4 0.04 240)",
        codeBg: "oklch(0.17 0.04 250)",
        quoteBg: "oklch(0.28 0.05 235 / 0.5)",
        tableHeaderBg: "oklch(0.16 0.04 250)",
        thText: "oklch(0.58 0.05 220)",
        preInset: "oklch(0.5 0.04 200 / 0.25)",
      },
      fonts: { prose: "newsreader", code: "jetbrains-mono" },
    },
    contrast: {
      presetId: "contrast",
      colors: {
        text: "oklch(0.98 0.01 265)",
        bg: "oklch(0.1 0.01 265)",
        link: "oklch(0.7 0.2 50)",
        linkHover: "oklch(0.85 0.15 55)",
        muted: "oklch(0.7 0.04 265)",
        border: "oklch(0.5 0.04 265)",
        codeBg: "oklch(0.08 0.02 265)",
        quoteBg: "oklch(0.18 0.03 265 / 0.6)",
        tableHeaderBg: "oklch(0.12 0.02 265)",
        thText: "oklch(0.72 0.04 265)",
        preInset: "oklch(0.4 0.3 0 / 0.35)",
      },
    },
  };

  function simpleMerge(a, b) {
    if (!b) return Object.assign({}, a);
    return {
      schemaVersion: typeof b.schemaVersion === "number" ? b.schemaVersion : a.schemaVersion,
      presetId: b.presetId != null ? b.presetId : a.presetId,
      colors: Object.assign({}, a.colors, b.colors || {}),
      fonts: Object.assign({}, a.fonts, b.fonts || {}),
      layout: Object.assign({}, a.layout, b.layout || {}),
    };
  }

  function normTheme(raw) {
    var t = simpleMerge(DEFAULT_THEME, !raw || typeof raw !== "object" ? {} : raw);
    t.schemaVersion = 1;
    return t;
  }

  function getMergedTheme(overrides) {
    return normTheme(overrides || {});
  }

  function getPreset(presetId) {
    if (!presetId || !Object.prototype.hasOwnProperty.call(PRESET_THEMES, presetId)) {
      return normTheme({});
    }
    return normTheme(simpleMerge(DEFAULT_THEME, PRESET_THEMES[presetId]));
  }

  function loadStoredTheme() {
    try {
      if (typeof global.localStorage === "undefined") {
        return getMergedTheme({});
      }
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return getMergedTheme({});
      var data = global.JSON.parse(raw);
      if (!data || typeof data !== "object") return getMergedTheme({});
      return normTheme(simpleMerge(DEFAULT_THEME, data));
    } catch {
      return getMergedTheme({});
    }
  }

  function saveTheme(theme) {
    try {
      if (typeof global.localStorage === "undefined") return;
      var t = normTheme(theme);
      global.localStorage.setItem(STORAGE_KEY, global.JSON.stringify(t));
    } catch {
      /* ignore quota or private mode */
    }
  }

  function getFontOrFallback(key) {
    var f = FONT_CHOICES[key];
    return f ? f.stack : FONT_CHOICES["source-serif-4"].stack;
  }

  function themeToVariables(theme) {
    var t = normTheme(theme);
    var c = t.colors;
    var L = t.layout;
    var proseFont = getFontOrFallback(t.fonts.prose);
    var codeFont = getFontOrFallback(t.fonts.code);
    return {
      "--cr-prose-text": c.text,
      "--cr-prose-bg": c.bg,
      "--cr-prose-link": c.link,
      "--cr-prose-link-hover": c.linkHover,
      "--cr-prose-muted": c.muted,
      "--cr-prose-border": c.border,
      "--cr-prose-code-bg": c.codeBg,
      "--cr-prose-quote-bg": c.quoteBg,
      "--cr-prose-table-header-bg": c.tableHeaderBg,
      "--cr-prose-th-text": c.thText,
      "--cr-prose-pre-inset": c.preInset,
      "--cr-font-prose": proseFont,
      "--cr-font-code": codeFont,
      "--cr-prose-size": String(L.bodyFontRem) + "rem",
      "--cr-prose-line-height": String(L.lineHeight),
      "--cr-prose-max": String(L.maxWidthCh) + "ch",
      "--cr-h1": String(L.h1Rem) + "rem",
      "--cr-h2": String(L.h2Rem) + "rem",
      "--cr-h3": String(L.h3Rem) + "rem",
      "--cr-h4": String(L.h4Rem) + "rem",
    };
  }

  function applyToElement(el, theme) {
    if (!el) return;
    var map = themeToVariables(theme);
    var k;
    for (k in map) {
      if (Object.prototype.hasOwnProperty.call(map, k)) {
        el.style.setProperty(k, map[k]);
      }
    }
  }

  var FALLBACK_FONT_HREF =
    "https://fonts.googleapis.com/css2?" +
    "family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600&" +
    "family=JetBrains+Mono:wght@400;500&display=swap";

  function buildGoogleFontsHref(theme) {
    var t = normTheme(theme);
    var fCode = FONT_CHOICES[t.fonts.code];
    var fProse = FONT_CHOICES[t.fonts.prose];
    var families = [];
    function add(def) {
      if (!def) return;
      var i;
      for (i = 0; i < families.length; i++) {
        if (families[i].gFamily === def.gFamily) return;
      }
      families.push({ gFamily: def.gFamily, gSpec: def.gSpec });
    }
    add(fProse);
    add(fCode);
    if (families.length === 0) {
      return FALLBACK_FONT_HREF;
    }
    return (
      "https://fonts.googleapis.com/css2?" +
      families
        .map(function (d) {
          return "family=" + d.gFamily + ":" + d.gSpec;
        })
        .join("&") +
      "&display=swap"
    );
  }

  var EXPORT_PROSE_BASE =
    "*,*::before,*::after{box-sizing:border-box}html,body{height:100%;margin:0}" +
    "body{font-family:var(--cr-font-prose);font-size:var(--cr-prose-size);line-height:var(--cr-prose-line-height);" +
    "color:var(--cr-prose-text);background:var(--cr-prose-bg);-webkit-font-smoothing:antialiased}" +
    ".cr-export{max-width:var(--cr-prose-max);margin:0 auto;padding:1.5rem 1.5rem 2.5rem}" +
    ".cr-export>*{min-width:0}" +
    ".cr-export h1,.cr-export h2,.cr-export h3,.cr-export h4{font-weight:700;letter-spacing:-0.02em;line-height:1.28;" +
    "color:var(--cr-prose-text);font-family:var(--cr-font-prose)}" +
    ".cr-export h1{margin:0 0 0.65em;font-size:var(--cr-h1);padding-bottom:0.35em;border-bottom:1px solid var(--cr-prose-border)}" +
    ".cr-export h2{margin:1.35em 0 0.45em;font-size:var(--cr-h2);font-weight:600}" +
    ".cr-export h3{margin:1.25em 0 0.4em;font-size:var(--cr-h3);font-weight:600}" +
    ".cr-export h4{margin:1.1em 0 0.35em;font-size:var(--cr-h4);font-weight:600}" +
    ".cr-export p{margin:0.7em 0}" +
    ".cr-export a{color:var(--cr-prose-link);text-decoration-thickness:1px;text-underline-offset:0.2em}" +
    ".cr-export a:hover{color:var(--cr-prose-link-hover)}" +
    ".cr-export strong{font-weight:700}" +
    ".cr-export hr{margin:2em 0;border:none;height:1px;background:linear-gradient(90deg,transparent," +
    "var(--cr-prose-border) 12%,var(--cr-prose-border) 88%,transparent)}" +
    ".cr-export code{font-family:var(--cr-font-code);font-size:0.88em;padding:0.12em 0.38em;border-radius:0.375rem;" +
    "border:1px solid var(--cr-prose-border);background:var(--cr-prose-code-bg)}" +
    ".cr-export pre{margin:1.1em 0;padding:1rem 1.1rem;overflow:auto;border-radius:0.625rem;border:1px solid " +
    "var(--cr-prose-border);background:var(--cr-prose-code-bg);box-shadow:inset 0 1px 0 var(--cr-prose-pre-inset)}" +
    ".cr-export pre code{padding:0;border:none;background:transparent;font-size:0.84em;line-height:1.6}" +
    ".cr-export ul,.cr-export ol{margin:0.65em 0;padding-left:1.35em}" +
    ".cr-export li{margin:0.35em 0;padding-left:0.25em}" +
    ".cr-export li::marker{color:var(--cr-prose-muted)}" +
    ".cr-export blockquote{margin:1.1em 0;padding:0.9rem 1.1rem;border-radius:0.5rem;" +
    "border:1px solid var(--cr-prose-border);background:var(--cr-prose-quote-bg);color:var(--cr-prose-muted);" +
    "font-style:italic}" +
    ".cr-export table{width:100%;margin:1.1em 0;border-collapse:collapse;font-size:0.95em;font-variant-numeric:tabular-nums}" +
    ".cr-export th,.cr-export td{padding:0.5rem 0.65rem;border:1px solid var(--cr-prose-border);text-align:left}" +
    ".cr-export th{font-family:ui-sans-serif,system-ui,sans-serif;font-size:0.78em;font-weight:600;" +
    "text-transform:uppercase;letter-spacing:0.06em;color:var(--cr-prose-th-text);background:var(--cr-prose-table-header-bg)}" +
    ".cr-export img{max-width:100%;height:auto;border-radius:0.5rem;margin:0.75em 0}" +
    ".cr-export img[src=\"\"]{display:none}";

  var PRINT_MEDIA =
    "@media print{body{background:var(--cr-prose-bg) !important}.cr-export{max-width:none;padding:0.5rem 0}}";

  function buildRootBlock(theme) {
    var t = themeToVariables(theme);
    var parts = [];
    var k;
    for (k in t) {
      if (Object.prototype.hasOwnProperty.call(t, k)) {
        parts.push(k + ":" + t[k] + ";");
      }
    }
    return ":root{" + parts.join("") + "}";
  }

  function getExportStyleBlock(theme) {
    return buildRootBlock(theme) + EXPORT_PROSE_BASE + PRINT_MEDIA;
  }

  function getExportDocumentHtml(sanitizedBodyHtml, theme) {
    var t = normTheme(theme);
    var fontHref = buildGoogleFontsHref(t);
    return (
      "<!DOCTYPE html>\n" +
      '<html lang="en">\n' +
      "<head>\n" +
      '<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      "<title>document</title>\n" +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="' +
      fontHref +
      '" rel="stylesheet">\n' +
      "<style>\n" +
      getExportStyleBlock(t) +
      "\n</style>\n" +
      "</head>\n" +
      "<body>\n" +
      '<main class="cr-export">\n' +
      sanitizedBodyHtml +
      "\n</main>\n" +
      "</body>\n" +
      "</html>\n"
    );
  }

  var PRESET_LIST = [
    { id: "evening", label: "Evening" },
    { id: "paper", label: "Paper" },
    { id: "sepia", label: "Sepia" },
    { id: "ocean", label: "Ocean" },
    { id: "contrast", label: "High contrast" },
  ];

  /** UI labels for body (prose) font keys in {@link FONT_CHOICES} */
  var PROSE_FONT_OPTIONS = [
    { id: "source-serif-4", label: "Source Serif 4" },
    { id: "lora", label: "Lora" },
    { id: "literata", label: "Literata" },
    { id: "newsreader", label: "Newsreader" },
  ];

  global.CoolReaderTheme = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_THEME: DEFAULT_THEME,
    PRESET_LIST: PRESET_LIST,
    PRESET_THEMES: PRESET_THEMES,
    PROSE_FONT_OPTIONS: PROSE_FONT_OPTIONS,
    FONT_CHOICES: Object.keys(FONT_CHOICES),
    normTheme: normTheme,
    getPreset: getPreset,
    getMergedTheme: getMergedTheme,
    loadStoredTheme: loadStoredTheme,
    saveTheme: saveTheme,
    themeToVariables: themeToVariables,
    applyToElement: applyToElement,
    buildGoogleFontsHref: buildGoogleFontsHref,
    getExportStyleBlock: getExportStyleBlock,
    getExportDocumentHtml: getExportDocumentHtml,
  };
})(typeof window !== "undefined" ? window : globalThis);
