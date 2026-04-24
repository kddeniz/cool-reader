(function () {
  "use strict";

  var DEBOUNCE_MS = 120;

  var app = document.getElementById("app");
  var editor = document.getElementById("editor");
  var preview = document.getElementById("preview");
  var toggleBtn = document.getElementById("toggleEditor");
  var fileInput = document.getElementById("fileInput");
  var downloadBtn = document.getElementById("downloadBtn");
  var dropZone = document.getElementById("dropZone");
  var renderTimer = null;

  function getMarkdownText() {
    return editor.value;
  }

  function renderPreview() {
    if (typeof marked === "undefined" || typeof DOMPurify === "undefined") {
      preview.innerHTML =
        "<p>Önizleme için <code>marked</code> ve <code>DOMPurify</code> yüklenemedi. Ağ bağlantısını kontrol edin.</p>";
      return;
    }
    var raw = getMarkdownText();
    var html = marked.parse(raw);
    preview.innerHTML = DOMPurify.sanitize(html);
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
      callback(reader.error || new Error("Okuma hatası"));
    };
    reader.readAsText(file);
  }

  function applyFileContent(file) {
    readFileAsText(file, function (err, text) {
      if (err) {
        preview.textContent = "Dosya okunamadı: " + String(err.message || err);
        return;
      }
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

  downloadBtn.addEventListener("click", function () {
    var blob = new Blob([getMarkdownText()], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 2500);
  });

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
