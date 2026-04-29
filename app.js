(function () {
  "use strict";

  var DEBOUNCE_MS = 120;
  var TR = typeof CoolReaderTheme === "undefined" ? null : CoolReaderTheme;

  var app = document.getElementById("app");
  var editor = document.getElementById("editor");
  var preview = document.getElementById("preview");
  var toggleBtn = document.getElementById("toggleEditor");
  var fileInput = document.getElementById("fileInput");
  var downloadBtn = document.getElementById("downloadBtn");
  var downloadHtmlBtn = document.getElementById("downloadHtmlBtn");
  var printThemeBtn = document.getElementById("printThemeBtn");
  var themePreset = document.getElementById("themePreset");
  var themeBodySize = document.getElementById("themeBodySize");
  var themeLineHeight = document.getElementById("themeLineHeight");
  var themeBodyFont = document.getElementById("themeBodyFont");
  var themeReset = document.getElementById("themeReset");
  var themeDetails = document.getElementById("themeDetails");
  var dropZone = document.getElementById("dropZone");
  var appAlert = document.getElementById("appAlert");
  var syncScrollToggle = document.getElementById("syncScrollToggle");
  var renderTimer = null;
  var currentTheme = null;

  var SYNC_SCROLL_KEY = "coolReaderSyncScroll";
  var syncScrollEnabled = true;
  var isApplyingSyncScroll = false;
  var editorSyncRaf = null;
  var previewSyncRaf = null;

  function getThemeApi() {
    if (!TR) return null;
    return TR;
  }

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

  function loadSyncScrollPref() {
    try {
      if (typeof window.localStorage === "undefined") return true;
      var v = window.localStorage.getItem(SYNC_SCROLL_KEY);
      if (v === null) return true;
      return v !== "0" && v !== "false";
    } catch {
      return true;
    }
  }

  function saveSyncScrollPref() {
    try {
      if (typeof window.localStorage !== "undefined") {
        window.localStorage.setItem(SYNC_SCROLL_KEY, syncScrollEnabled ? "1" : "0");
      }
    } catch {
      /* no-op */
    }
  }

  function updateSyncScrollToggleUi() {
    if (!syncScrollToggle) return;
    syncScrollToggle.setAttribute("aria-pressed", syncScrollEnabled ? "true" : "false");
  }

  function isEditorSplitVisible() {
    return app && !app.classList.contains("app--editor-collapsed");
  }

  function isSyncScrollActive() {
    return syncScrollEnabled && isEditorSplitVisible();
  }

  function getScrollMax(el) {
    return Math.max(0, el.scrollHeight - el.clientHeight);
  }

  function getScrollRatio(el) {
    var max = getScrollMax(el);
    if (max <= 0) return 0;
    var r = el.scrollTop / max;
    if (r < 0) return 0;
    if (r > 1) return 1;
    return r;
  }

  function setScrollFromRatio(el, ratio) {
    var max = getScrollMax(el);
    var r = ratio;
    if (r < 0) r = 0;
    if (r > 1) r = 1;
    el.scrollTop = r * max;
  }

  function applyEditorScrollToPreview() {
    if (!isSyncScrollActive()) return;
    if (isApplyingSyncScroll) return;
    isApplyingSyncScroll = true;
    setScrollFromRatio(preview, getScrollRatio(editor));
    isApplyingSyncScroll = false;
  }

  function applyPreviewScrollToEditor() {
    if (!isSyncScrollActive()) return;
    if (isApplyingSyncScroll) return;
    isApplyingSyncScroll = true;
    setScrollFromRatio(editor, getScrollRatio(preview));
    isApplyingSyncScroll = false;
  }

  function onEditorScrollForSync() {
    if (!isSyncScrollActive() || isApplyingSyncScroll) return;
    if (editorSyncRaf !== null) return;
    editorSyncRaf = window.requestAnimationFrame(function () {
      editorSyncRaf = null;
      applyEditorScrollToPreview();
    });
  }

  function onPreviewScrollForSync() {
    if (!isSyncScrollActive() || isApplyingSyncScroll) return;
    if (previewSyncRaf !== null) return;
    previewSyncRaf = window.requestAnimationFrame(function () {
      previewSyncRaf = null;
      applyPreviewScrollToEditor();
    });
  }

  function markdownToSanitizedHtml(markdown) {
    if (typeof marked === "undefined" || typeof DOMPurify === "undefined") {
      return null;
    }
    return DOMPurify.sanitize(marked.parse(markdown));
  }

  function buildStandaloneExportHtml(sanitizedBodyHtml) {
    var api = getThemeApi();
    if (api) {
      return api.getExportDocumentHtml(sanitizedBodyHtml, currentTheme || api.normTheme({}));
    }
    return minimalFallbackExport(sanitizedBodyHtml);
  }

  function minimalFallbackExport(sanitizedBodyHtml) {
    return (
      "<!DOCTYPE html>\n" +
      '<html lang="en"><head><meta charset="utf-8"><title>document</title></head><body><main class="cr-export">' +
      sanitizedBodyHtml +
      "</main></body></html>\n"
    );
  }

  function loadInitialTheme() {
    var api = getThemeApi();
    if (api) {
      currentTheme = api.loadStoredTheme();
      return;
    }
    currentTheme = { presetId: "evening", colors: {}, fonts: {}, layout: {} };
  }

  function applyReadingTheme() {
    var api = getThemeApi();
    if (api && preview) {
      api.applyToElement(preview, currentTheme);
    }
  }

  function persistTheme() {
    var api = getThemeApi();
    if (api) {
      api.saveTheme(currentTheme);
    }
  }

  function updateSlidersFromTheme() {
    if (!getThemeApi() || !currentTheme) return;
    var t = getThemeApi().normTheme(currentTheme);
    var L = t.layout;
    if (themeBodySize) {
      themeBodySize.value = String(Math.max(875, Math.min(1400, Math.round(L.bodyFontRem * 1000))));
    }
    if (themeLineHeight) {
      var lh = Math.round(L.lineHeight * 100);
      themeLineHeight.value = String(Math.max(128, Math.min(200, lh)));
    }
    if (themeBodyFont) {
      var fp = t.fonts && t.fonts.prose;
      if (fp && themeBodyFont.querySelector("option[value=\"" + fp + "\"]")) {
        themeBodyFont.value = fp;
      } else {
        themeBodyFont.value = "source-serif-4";
      }
    }
  }

  function readThemePanelIntoTheme() {
    if (!getThemeApi() || !currentTheme) return;
    var t = getThemeApi().normTheme(currentTheme);
    var L = Object.assign({}, t.layout);
    var F = Object.assign({}, t.fonts);
    if (themeBodySize) {
      L.bodyFontRem = Math.max(0.875, Math.min(1.4, Number(themeBodySize.value) / 1000));
    }
    if (themeLineHeight) {
      L.lineHeight = Math.max(1.28, Math.min(2, Number(themeLineHeight.value) / 100));
    }
    if (themeBodyFont && themeBodyFont.value) {
      F.prose = themeBodyFont.value;
    }
    currentTheme = getThemeApi().normTheme(
      Object.assign({}, currentTheme, {
        presetId: "custom",
        layout: L,
        fonts: F,
      })
    );
  }

  function populatePresets() {
    if (!getThemeApi() || !themePreset) return;
    var list = getThemeApi().PRESET_LIST;
    var i;
    for (i = 0; i < list.length; i++) {
      var opt = document.createElement("option");
      opt.value = list[i].id;
      opt.textContent = list[i].label;
      themePreset.appendChild(opt);
    }
    var customOpt = document.createElement("option");
    customOpt.value = "custom";
    customOpt.textContent = "Custom";
    themePreset.appendChild(customOpt);
  }

  function populateBodyFontSelect() {
    if (!getThemeApi() || !themeBodyFont) return;
    var opts = getThemeApi().PROSE_FONT_OPTIONS;
    var i;
    for (i = 0; i < opts.length; i++) {
      var o = document.createElement("option");
      o.value = opts[i].id;
      o.textContent = opts[i].label;
      themeBodyFont.appendChild(o);
    }
  }

  function selectPresetInUi() {
    if (!getThemeApi() || !themePreset || !currentTheme) return;
    var id = currentTheme.presetId;
    if (id === "custom") {
      themePreset.value = "custom";
      return;
    }
    if (themePreset.querySelector("option[value=\"" + id + "\"]")) {
      themePreset.value = id;
    } else {
      themePreset.value = "evening";
    }
  }

  function initReadingThemeControls() {
    if (!getThemeApi()) {
      if (printThemeBtn) printThemeBtn.hidden = true;
      if (themeDetails) themeDetails.hidden = true;
      return;
    }
    loadInitialTheme();
    populatePresets();
    populateBodyFontSelect();
    if (
      currentTheme.presetId &&
      currentTheme.presetId !== "custom" &&
      getThemeApi().PRESET_LIST.every(function (p) {
        return p.id !== currentTheme.presetId;
      })
    ) {
      currentTheme = getThemeApi().getPreset("evening");
    }
    selectPresetInUi();
    updateSlidersFromTheme();
    applyReadingTheme();

    if (themePreset) {
      themePreset.addEventListener("change", function () {
        if (themePreset.value === "custom") return;
        currentTheme = getThemeApi().getPreset(themePreset.value);
        updateSlidersFromTheme();
        applyReadingTheme();
        persistTheme();
      });
    }
    if (themeBodySize) {
      themeBodySize.addEventListener("input", function () {
        readThemePanelIntoTheme();
        if (themePreset) themePreset.value = "custom";
        applyReadingTheme();
        persistTheme();
      });
    }
    if (themeLineHeight) {
      themeLineHeight.addEventListener("input", function () {
        readThemePanelIntoTheme();
        if (themePreset) themePreset.value = "custom";
        applyReadingTheme();
        persistTheme();
      });
    }
    if (themeBodyFont) {
      themeBodyFont.addEventListener("change", function () {
        readThemePanelIntoTheme();
        if (themePreset) themePreset.value = "custom";
        applyReadingTheme();
        persistTheme();
      });
    }
    if (themeReset) {
      themeReset.addEventListener("click", function () {
        currentTheme = getThemeApi().getPreset("evening");
        if (themePreset) themePreset.value = "evening";
        updateSlidersFromTheme();
        applyReadingTheme();
        persistTheme();
      });
    }
    if (printThemeBtn) {
      printThemeBtn.addEventListener("click", function () {
        var safe = markdownToSanitizedHtml(getMarkdownText());
        if (safe === null) {
          setAppAlert(
            "Could not load marked and DOMPurify for print. Check your network connection or refresh the page."
          );
          return;
        }
        setAppAlert("");
        var html = buildStandaloneExportHtml(safe);
        var w = window.open("", "coolreader-print", "popup=yes,width=900,height=1200");
        if (!w) {
          setAppAlert("The browser blocked the print window. Allow pop-ups for this site, then try again.");
          return;
        }
        w.document.open();
        w.document.write(html);
        w.document.close();
        var printInvoked = false;
        function doPrint() {
          if (printInvoked) return;
          printInvoked = true;
          var closeTimer = null;
          function tryClose() {
            if (closeTimer !== null) {
              clearTimeout(closeTimer);
              closeTimer = null;
            }
            try {
              w.close();
            } catch {
              /* no-op */
            }
          }
          try {
            w.focus();
            w.addEventListener(
              "afterprint",
              function () {
                tryClose();
              },
              { once: true }
            );
            closeTimer = setTimeout(tryClose, 120000);
            w.print();
          } catch {
            tryClose();
          }
        }
        w.onload = doPrint;
        setTimeout(doPrint, 100);
      });
    }
    if (themeDetails) {
      themeDetails.addEventListener("toggle", function () {
        var s = themeDetails.querySelector("summary");
        if (s) s.setAttribute("aria-expanded", themeDetails.open ? "true" : "false");
      });
      document.addEventListener("click", function (e) {
        if (!themeDetails.open) return;
        if (themeDetails.contains(e.target)) return;
        themeDetails.removeAttribute("open");
      });
    }
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
    var ratio = null;
    if (isSyncScrollActive()) {
      ratio = getScrollRatio(editor);
    }
    preview.innerHTML = safe;
    if (ratio !== null) {
      window.requestAnimationFrame(function () {
        if (!isSyncScrollActive()) return;
        isApplyingSyncScroll = true;
        setScrollFromRatio(preview, ratio);
        isApplyingSyncScroll = false;
      });
    }
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

  function onEditorKeydownTabIndent(e) {
    if (e.key !== "Tab") return;
    if (e.defaultPrevented) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.shiftKey) return;

    e.preventDefault();

    var ta = editor;
    var start = ta.selectionStart;
    var end = ta.selectionEnd;
    var val = ta.value;
    var TAB = "\t";

    if (start === end) {
      ta.value = val.slice(0, start) + TAB + val.slice(end);
      ta.selectionStart = ta.selectionEnd = start + TAB.length;
    } else {
      var startLine = val.lastIndexOf("\n", start - 1) + 1;
      var endLine = end;
      while (endLine < val.length && val[endLine] !== "\n") {
        endLine += 1;
      }
      if (endLine < val.length) {
        endLine += 1;
      }
      var block = val.slice(startLine, endLine);
      var lines = block.split("\n");
      var indented = lines
        .map(function (line) {
          return TAB + line;
        })
        .join("\n");
      ta.value = val.slice(0, startLine) + indented + val.slice(endLine);
      ta.selectionStart = start + TAB.length;
      ta.selectionEnd = end + TAB.length * lines.length;
    }

    scheduleRender();
  }

  syncScrollEnabled = loadSyncScrollPref();
  updateSyncScrollToggleUi();

  editor.addEventListener("scroll", onEditorScrollForSync, { passive: true });
  preview.addEventListener("scroll", onPreviewScrollForSync, { passive: true });

  if (syncScrollToggle) {
    syncScrollToggle.addEventListener("click", function () {
      syncScrollEnabled = !syncScrollEnabled;
      updateSyncScrollToggleUi();
      saveSyncScrollPref();
      if (syncScrollEnabled && isEditorSplitVisible()) {
        window.requestAnimationFrame(applyEditorScrollToPreview);
      }
    });
  }

  editor.addEventListener("input", scheduleRender);
  editor.addEventListener("keydown", onEditorKeydownTabIndent);

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
    if (!collapsed) {
      editor.focus();
      if (syncScrollEnabled) {
        window.requestAnimationFrame(applyEditorScrollToPreview);
      }
    }
  }

  toggleBtn.addEventListener("click", function () {
    setEditorCollapsed(!app.classList.contains("app--editor-collapsed"));
  });

  initReadingThemeControls();
  renderNow();
})();

