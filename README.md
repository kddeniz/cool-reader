# Cool Reader

<div align="center">

**[English](#english) • [Türkçe](#türkçe)**

</div>

---

## English

### Overview

**Cool Reader** is a free, browser-only markdown editor: you type Markdown on the left and see a live, DOMPurify-sanitized HTML preview on the right. There is no server, no build step, and no account.

🚀 **[Live demo](https://cool-reader.com/)** · **📦 [Source on GitHub](https://github.com/kddeniz/cool-reader)**

**Quick facts (for humans and AI summaries):** MIT License ([`LICENSE`](LICENSE)) · Dependencies: [marked](https://marked.js.org/) v12.0.2 (parse) and [DOMPurify](https://github.com/cure53/DOMPurify) v3.1.6 (sanitize) via jsDelivr with **SRI** · Google Fonts for typography · Preview updates debounced at 120ms · Export `.md` or standalone `.html` · CI: HTML validate + ESLint + Playwright on PRs to `main`.

### Key Features

- ✨ **Real-time Preview:** See your markdown rendered as you type with debounced updates (120ms) for smooth performance
- 🛡️ **Secure HTML Rendering:** All HTML is sanitized using [DOMPurify](https://github.com/cure53/DOMPurify) to prevent XSS attacks
- 📄 **File Support:** Open and edit `.md`, `.markdown`, and `.txt` files directly in the browser
- 💾 **Download:** Export your current markdown as a `.md` file, or the sanitized preview as a standalone `.html` file
- 🎯 **Drag & Drop:** Drop markdown files directly onto the editor panel to load them
- 📱 **Responsive Design:** Beautiful two-panel layout that adapts to different screen sizes
- 🌐 **Browser-Only:** No server required—completely client-side execution
- ⚡ **Lightweight:** Minimal dependencies (only [marked](https://marked.js.org/) for parsing and DOMPurify for sanitization)

### How to Use

1. **Open the App:** Open `index.html` in your web browser (or serve via any static file server)
2. **Write Markdown:** Type or paste markdown in the left panel
3. **See Preview:** View rendered HTML in the right panel in real-time
4. **Load Files:** Click the "Open file" button to load `.md` or text files
5. **Drag & Drop:** Drag markdown files onto the left panel to load them
6. **Download:** Click "Download (.md)" for the raw markdown, or "Download (.html)" for a standalone HTML page (same sanitized output as the preview, with embedded typography styles)
7. **Toggle Panel:** Use the ☰ button to expand/collapse the editor panel for reading mode

### Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Page skeleton, toolbar, two-panel layout, CDN dependencies for `marked` and `DOMPurify` (pinned + SRI) |
| `styles.css` | Responsive layout (~50/50 panels), reading mode for left panel, preview typography |
| `app.js` | Preview rendering with debounce, file handling, drag-and-drop, Markdown and HTML export, panel toggle |
| `schema-ld.json` | JSON-LD metadata for search engines (loaded as external `script` to align with CSP) |
| `staticwebapp.config.json` | Azure Static Web Apps global headers (CSP, `nosniff`, etc.) |
| `.github/workflows/ci.yml` | Quality checks: `html-validate`, ESLint, Playwright |
| `package.json` | **Dev-only** tooling (not required to run the app in a browser) |

### Architecture Constraints

**Browser-Only:** This is a purely client-side application:
- ✅ HTML, CSS, and JavaScript only
- ❌ No backend server
- ❌ No database
- ❌ No server-side processing

When adding features, maintain these constraints to keep the application lightweight and dependency-free.

### Security

Markdown-generated HTML is sanitized with **DOMPurify** before being inserted into the DOM via `innerHTML`. This prevents malicious scripts from being executed. When adding new features, be cautious of any raw HTML injection risks.

- **Reporting:** see [`SECURITY.md`](SECURITY.md) for how to disclose vulnerabilities responsibly.
- **Supply chain:** third-party scripts use pinned versions and **Subresource Integrity** (`integrity` on `<script>` tags).
- **Hosting:** when deployed on Azure Static Web Apps, [`staticwebapp.config.json`](staticwebapp.config.json) adds defense-in-depth headers (including a CSP aligned with this repo’s third-party origins).

### Dependencies

- **[marked](https://marked.js.org/)** (v12.0.2 via CDN) - Markdown parser
- **[DOMPurify](https://github.com/cure53/DOMPurify)** (v3.1.6 via CDN) - HTML sanitizer

Both are loaded from jsDelivr with SRI. **Google Fonts** are loaded from `fonts.googleapis.com` / `fonts.gstatic.com` (stylesheet URLs are not practical to pin with SRI the same way as single-file scripts; for stricter offline/privacy needs, self-host fonts and remove the Google `<link>` tags).

For offline use, vendor `marked` and `DOMPurify` locally, update `index.html` script `src` paths, and **recompute SRI hashes** for the new files.

### Common questions

**Does Cool Reader send my Markdown to a server?** No. Parsing and sanitization run entirely in your browser; this repository does not include a telemetry or upload pipeline.

**Does opening the app contact third parties?** Yes, for fonts (Google Fonts) and for the pinned parser/sanitizer scripts (jsDelivr). Your markdown content itself is not uploaded by this app.

**Can I use it offline?** After the first load you still need the bundled or CDN scripts; for fully offline use, vendor `marked` and `DOMPurify` locally and point `index.html` to those files.

### How to Run

1. **Quick Start:** Open `index.html` directly in your browser (file protocol)
2. **With a Server:** Serve the directory with any static file server (e.g., `python -m http.server`, `npx http-server`)

```bash
# Example: Python HTTP server
cd /path/to/cool-reader
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

### Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Modern JavaScript features (ES5+) are used. Older browsers may need polyfills.

### Development checks (optional)

If you want to run the same checks as CI locally, install [Node.js](https://nodejs.org/) 20+ and run:

```bash
npm ci
npm run validate:html
npm run lint
npm test
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for more detail.

### Contributing

Start with [`CONTRIBUTING.md`](CONTRIBUTING.md) (setup, PR expectations, and scripts).

Optional Cursor-specific guidance lives in [.cursor/rules/cool-reader.mdc](.cursor/rules/cool-reader.mdc). Meaningful architecture changes should also be reflected in [claude.md](claude.md).

### License

This project is licensed under the MIT License — see [`LICENSE`](LICENSE).

---

## Türkçe

### Genel Bakış

**Cool Reader**, ücretsiz ve yalnızca tarayıcıda çalışan bir markdown editörüdür: solda Markdown yazarsınız, sağda DOMPurify ile temizlenmiş canlı HTML önizlemesini görürsünüz. Sunucu, derleme adımı veya hesap yoktur.

🚀 **[Canlı demo](https://cool-reader.com/)** · **📦 [Kaynak kodu (GitHub)](https://github.com/kddeniz/cool-reader)**

**Hızlı bilgiler:** MIT Lisansı ([`LICENSE`](LICENSE)) · Bağımlılıklar: [marked](https://marked.js.org/) v12.0.2 ve [DOMPurify](https://github.com/cure53/DOMPurify) v3.1.6, jsDelivr üzerinden **SRI** ile · Tipografi için Google Fonts · Önizleme 120ms debounce · `.md` veya bağımsız `.html` dışa aktarma · CI: `main` PR’larında HTML doğrulama + ESLint + Playwright.

### Temel Özellikler

- ✨ **Canlı Önizleme:** Markdown yazarken HTML'ye dönüştürülen içeriği debounce edilmiş (120ms) güncellemelerle izleyin
- 🛡️ **Güvenli HTML İşlemesi:** Tüm HTML, XSS saldırılarını önlemek için [DOMPurify](https://github.com/cure53/DOMPurify) ile temizlenir
- 📄 **Dosya Desteği:** `.md`, `.markdown` ve `.txt` dosyalarını doğrudan tarayıcıda açın ve düzenleyin
- 💾 **İndir:** Geçerli markdown'ı `.md` olarak veya temizlenmiş önizlemeyi bağımsız bir `.html` dosyası olarak dışa aktarın
- 🎯 **Sürükle-Bırak:** Markdown dosyalarını doğrudan editör paneline bırakarak yükleyin
- 📱 **Duyarlı Tasarım:** Farklı ekran boyutlarına uyum sağlayan güzel iki panel düzeni
- 🌐 **Tarayıcı Tabanlı:** Sunucu gerekmez—tamamen istemci tarafı yürütme
- ⚡ **Hafif:** Minimal bağımlılıklar (yalnızca [marked](https://marked.js.org/) ayrıştırma ve DOMPurify temizlemesi için)

### Nasıl Kullanılır

1. **Uygulamayı Açın:** `index.html` dosyasını web tarayıcısında açın (veya herhangi bir statik dosya sunucusu ile servis edin)
2. **Markdown Yazın:** Sol panelde markdown yazın veya yapıştırın
3. **Önizlemeyi Görün:** Sağ panelde canlı olarak işlenmiş HTML'yi görüntüleyin
4. **Dosyaları Yükleyin:** `.md` veya metin dosyalarını yüklemek için "Dosya aç" düğmesini tıklayın
5. **Sürükle-Bırak:** Sol panele markdown dosyalarını sürükleyerek yükleyin
6. **İndir:** Ham markdown için "İndir (.md)", önizleme ile aynı temizlenmiş çıktıyı bağımsız sayfa olarak almak için "İndir (.html)" düğmesini tıklayın
7. **Paneli Aç/Kapat:** Okuma modu için editör panelini genişletmek/daraltmak üzere ☰ düğmesini kullanın

### Proje Yapısı

| Dosya | Amacı |
|-------|-------|
| `index.html` | Sayfa iskeleti, araç çubuğu, iki panel düzeni, `marked` ve `DOMPurify` için sabitlenmiş CDN + SRI |
| `styles.css` | Duyarlı düzen (~%50-%50 paneller), sol panel için okuma modu, önizleme tipografisi |
| `app.js` | Debounce ile önizleme, dosya işlemleri, sürükle-bırak, Markdown ve HTML dışa aktarma, panel aç/kapat |
| `schema-ld.json` | Arama motorları için JSON-LD (CSP ile uyum için harici `script` olarak) |
| `staticwebapp.config.json` | Azure Static Web Apps genel başlıkları (CSP, `nosniff`, vb.) |
| `.github/workflows/ci.yml` | Kalite: `html-validate`, ESLint, Playwright |
| `package.json` | **Yalnızca geliştirme** araçları (uygulamayı tarayıcıda çalıştırmak için gerekmez) |

### Mimari Kısıtlar

**Tarayıcı Tabanlı:** Bu tamamen istemci tarafı bir uygulamadır:
- ✅ Yalnızca HTML, CSS ve JavaScript
- ❌ Backend sunucusu yok
- ❌ Veritabanı yok
- ❌ Sunucu tarafı işlemeleri yok

Özellikler eklerken, uygulamayı hafif ve bağımlılıksız tutmak için bu kısıtlamaları koruyun.

### Güvenlik

Markdown tarafından üretilen HTML, `innerHTML` aracılığıyla DOM'a eklenmeden önce **DOMPurify** ile temizlenir. Bu, kötü amaçlı betiklerin yürütülmesini önler. Yeni özellikler eklerken, ham HTML enjeksiyonu risklerine dikkat edin.

- **Bildirim:** [`SECURITY.md`](SECURITY.md) dosyasındaki süreçle güvenlik açıklarını özel kanaldan iletin.
- **Tedarik zinciri:** Üçüncü taraf betikler sabit sürüm + **SRI** (`integrity`) ile yüklenir.
- **Barındırma:** Azure Static Web Apps üzerinde [`staticwebapp.config.json`](staticwebapp.config.json) ek savunma başlıkları (CSP dahil) sağlar.

### Bağımlılıklar

- **[marked](https://marked.js.org/)** (jsDelivr, v12.0.2, SRI ile) - Markdown ayrıştırıcı
- **[DOMPurify](https://github.com/cure53/DOMPurify)** (jsDelivr, v3.1.6, SRI ile) - HTML temizleyici

**Google Fonts** `fonts.googleapis.com` / `fonts.gstatic.com` üzerinden yüklenir (tek dosya betikleri gibi SRI ile sabitlemek zordur; daha katı gizlilik/çevrimdışı için fontları self-host edip Google `<link>` etiketlerini kaldırın).

Çevrimdışı kullanım için bu kütüphaneleri yerel olarak indirin, `index.html` içindeki `src` yollarını güncelleyin ve **SRI özetlerini yeniden hesaplayın**.

### Sık sorulanlar

**Markdown'ım bir sunucuya gönderiliyor mu?** Hayır. Ayrıştırma ve temizleme tamamen tarayıcıda çalışır; bu depoda telemetri veya yükleme hattı yoktur.

**Uygulama üçüncü taraflara bağlanıyor mu?** Evet: fontlar (Google Fonts) ve sabitlenmiş betikler (jsDelivr). Markdown içeriğiniz bu uygulama tarafından yüklenmez.

**Çevrimdışi kullanabilir miyim?** İlk yüklemeden sonra da betiklere ihtiyaç vardır; tam çevrimdışı için `marked` ve `DOMPurify` dosyalarını yerel olarak ekleyip `index.html` içindeki yolları onlara yönlendirin.

### Nasıl Çalıştırılır

1. **Hızlı Başlangıç:** `index.html` dosyasını doğrudan tarayıcıda açın (file protokolü)
2. **Sunucu ile:** Dizini herhangi bir statik dosya sunucusu ile servis edin (ör. `python -m http.server`, `npx http-server`)

```bash
# Örnek: Python HTTP sunucusu
cd /path/to/cool-reader
python3 -m http.server 8000
# Tarayıcınızda http://localhost:8000 adresini açın
```

### Tarayıcı Desteği

- Chrome/Chromium (en son)
- Firefox (en son)
- Safari (en son)
- Edge (en son)

Modern JavaScript özellikleri (ES5+) kullanılmıştır. Eski tarayıcılar polyfill gerektirebilir.

### Geliştirme kontrolleri (isteğe bağlı)

CI ile aynı kontrolleri yerelde çalıştırmak için [Node.js](https://nodejs.org/) 20+ kurun:

```bash
npm ci
npm run validate:html
npm run lint
npm test
```

Ayrıntılar için [`CONTRIBUTING.md`](CONTRIBUTING.md) dosyasına bakın.

### Katkıda Bulunma

Önce [`CONTRIBUTING.md`](CONTRIBUTING.md) dosyasını okuyun (kurulum, PR beklentileri, komutlar).

İsteğe bağlı Cursor yönergeleri: [.cursor/rules/cool-reader.mdc](.cursor/rules/cool-reader.mdc). Mimari değişikliklerde [claude.md](claude.md) dosyasını da güncelleyin.

### Lisans

Bu proje MIT Lisansı altındadır — ayrıntılar için [`LICENSE`](LICENSE) dosyasına bakın.

---

<div align="center">

Made with ❤️ by Kürşad

</div>
