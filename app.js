(function () {
  "use strict";

  var DEBOUNCE_MS = 120;

  var app = document.getElementById("app");
  var editor = document.getElementById("editor");
  var preview = document.getElementById("preview");
  var toggleBtn = document.getElementById("toggleEditor");
  var fileInput = document.getElementById("fileInput");
  var downloadBtn = document.getElementById("downloadBtn");
  var downloadHtmlBtn = document.getElementById("downloadHtmlBtn");
  var dropZone = document.getElementById("dropZone");
  var appAlert = document.getElementById("appAlert");
  var renderTimer = null;

  function setAppAlert(message) {
    if (!appAlert) return;
    if (!message) {
      appAlert.textContent = "";
      appAlert.hidden = true;
      return;
    }
    appAlert.textContent = message;
    appAlert.hidden = false;
  }

  function getMarkdownText() {
    return editor.value;
  }

  function markdownToSanitizedHtml(markdown) {
    if (typeof marked === "undefined" || typeof DOMPurify === "undefined") {
      return null;
    }
    return DOMPurify.sanitize(marked.parse(markdown));
  }

  function buildStandaloneExportHtml(sanitizedBodyHtml) {
    var fontHref =
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap";
    var css =
      "*,*::before,*::after{box-sizing:border-box}html,body{height:100%;margin:0}" +
      "body{font-family:'Source Serif 4',Georgia,serif;font-size:1.0625rem;line-height:1.7;" +
      "color:oklch(0.945 0.012 292);background:oklch(0.205 0.018 285);-webkit-font-smoothing:antialiased}" +
      ".cr-export{max-width:68ch;margin:0 auto;padding:1.5rem 1.5rem 2.5rem}" +
      ".cr-export>*{min-width:0}" +
      ".cr-export h1,.cr-export h2,.cr-export h3,.cr-export h4{font-weight:700;letter-spacing:-0.02em;line-height:1.28;color:oklch(0.945 0.012 292)}" +
      ".cr-export h1{margin:0 0 0.65em;font-size:2rem;padding-bottom:0.35em;border-bottom:1px solid oklch(0.36 0.028 292)}" +
      ".cr-export h2{margin:1.35em 0 0.45em;font-size:1.45rem;font-weight:600}" +
      ".cr-export h3{margin:1.25em 0 0.4em;font-size:1.2rem;font-weight:600}" +
      ".cr-export h4{margin:1.1em 0 0.35em;font-size:1.05rem;font-weight:600}" +
      ".cr-export p{margin:0.7em 0}" +
      ".cr-export a{color:oklch(0.74 0.13 28);text-decoration-thickness:1px;text-underline-offset:0.2em}" +
      ".cr-export strong{font-weight:700}" +
      ".cr-export hr{margin:2em 0;border:none;height:1px;background:linear-gradient(90deg,transparent,oklch(0.36 0.028 292) 12%,oklch(0.36 0.028 292) 88%,transparent)}" +
      ".cr-export code{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:0.88em;padding:0.12em 0.38em;border-radius:0.375rem;" +
      "border:1px solid oklch(0.36 0.028 292);background:oklch(0.17 0.02 288)}" +
      ".cr-export pre{margin:1.1em 0;padding:1rem 1.1rem;overflow:auto;border-radius:0.625rem;border:1px solid oklch(0.36 0.028 292);" +
      "background:oklch(0.17 0.02 288);box-shadow:inset 0 1px 0 oklch(0.4 0.02 292 / 0.25)}" +
      ".cr-export pre code{padding:0;border:none;background:transparent;font-size:0.84em;line-height:1.6}" +
      ".cr-export ul,.cr-export ol{margin:0.65em 0;padding-left:1.35em}" +
      ".cr-export li{margin:0.35em 0;padding-left:0.25em}" +
      ".cr-export li::marker{color:oklch(0.62 0.032 292)}" +
      ".cr-export blockquote{margin:1.1em 0;padding:0.9rem 1.1rem;border-radius:0.5rem;border:1px solid oklch(0.36 0.028 292);" +
      "background:oklch(0.26 0.035 292 / 0.45);color:oklch(0.62 0.032 292);font-style:italic}" +
      ".cr-export table{width:100%;margin:1.1em 0;border-collapse:collapse;font-size:0.95em;font-variant-numeric:tabular-nums}" +
      ".cr-export th,.cr-export td{padding:0.5rem 0.65rem;border:1px solid oklch(0.36 0.028 292);text-align:left}" +
      ".cr-export th{font-family:ui-sans-serif,system-ui,sans-serif;font-size:0.78em;font-weight:600;text-transform:uppercase;" +
      "letter-spacing:0.06em;color:oklch(0.62 0.032 292);background:oklch(0.17 0.02 288)}" +
      ".cr-export img{max-width:100%;height:auto;border-radius:0.5rem;margin:0.75em 0}" +
      '.cr-export img[src=""]{display:none}';
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
      css +
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

  function renderPreview() {
    var safe = markdownToSanitizedHtml(getMarkdownText());
    if (safe === null) {
      preview.innerHTML = "";
      setAppAlert(
        "Could not load marked and DOMPurify for preview. Check your network connection or refresh the page."
      );
      return;
    }
    setAppAlert("");
    preview.innerHTML = safe;
  }

  function scheduleRender() {
    if (renderTimer) clearTimeout(renderTimer);
    renderTimer = setTimeout(function () {
      renderTimer = null;
      renderPreview();
    }, DEBOUNCE_MS);
  }

  function renderNow() {
    if (renderTimer) clearTimeout(renderTimer);
    renderTimer = null;
    renderPreview();
  }

  function pickFileFromList(fileList) {
    if (!fileList || !fileList.length) return null;
    var i;
    for (i = 0; i < fileList.length; i++) {
      var f = fileList[i];
      var name = (f.name || "").toLowerCase();
      if (name.endsWith(".md") || name.endsWith(".markdown")) return f;
    }
    for (i = 0; i < fileList.length; i++) {
      var t = fileList[i].type || "";
      if (t === "text/markdown" || t === "text/x-markdown") return fileList[i];
    }
    for (i = 0; i < fileList.length; i++) {
      if ((fileList[i].type || "").indexOf("text/") === 0) return fileList[i];
    }
    return fileList[0];
  }

  function readFileAsText(file, callback) {
    var reader = new FileReader();
    reader.onload = function () {
      callback(null, String(reader.result || ""));
    };
    reader.onerror = function () {
      callback(reader.error || new Error("Read error"));
    };
    reader.readAsText(file);
  }

  function applyFileContent(file) {
    readFileAsText(file, function (err, text) {
      if (err) {
        setAppAlert("Could not read file: " + String(err.message || err));
        return;
      }
      setAppAlert("");
      editor.value = text;
      renderNow();
      editor.focus();
    });
  }

  editor.addEventListener("input", scheduleRender);

  fileInput.addEventListener("change", function () {
    var file = pickFileFromList(fileInput.files);
    fileInput.value = "";
    if (file) applyFileContent(file);
  });

  dropZone.addEventListener("dragenter", function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("drop-active");
  });

  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("drop-active");
  });

  dropZone.addEventListener("dragleave", function (e) {
    if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove("drop-active");
  });

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("drop-active");
    var file = pickFileFromList(e.dataTransfer && e.dataTransfer.files);
    if (file) applyFileContent(file);
  });

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 2500);
  }

  downloadBtn.addEventListener("click", function () {
    var blob = new Blob([getMarkdownText()], { type: "text/markdown;charset=utf-8" });
    triggerDownload(blob, "document.md");
  });

  if (downloadHtmlBtn) {
    downloadHtmlBtn.addEventListener("click", function () {
      var safe = markdownToSanitizedHtml(getMarkdownText());
      if (safe === null) {
        setAppAlert(
          "Could not load marked and DOMPurify for HTML export. Check your network connection or refresh the page."
        );
        return;
      }
      setAppAlert("");
      var html = buildStandaloneExportHtml(safe);
      var blob = new Blob([html], { type: "text/html;charset=utf-8" });
      triggerDownload(blob, "document.html");
    });
  }

  function setEditorCollapsed(collapsed) {
    app.classList.toggle("app--editor-collapsed", collapsed);
    toggleBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
    if (!collapsed) editor.focus();
  }

  toggleBtn.addEventListener("click", function () {
    setEditorCollapsed(!app.classList.contains("app--editor-collapsed"));
  });

  renderNow();
})();
