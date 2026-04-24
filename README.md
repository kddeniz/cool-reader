# Cool Reader

<div align="center">

**[English](#english) • [Türkçe](#türkçe)**

</div>

---

## English

### Overview

**Cool Reader** is a free, browser-only markdown editor: you type Markdown on the left and see a live, DOMPurify-sanitized HTML preview on the right. There is no server, no build step, and no account.

🚀 **[Live demo](https://cool-reader.com/)** · **📦 [Source on GitHub](https://github.com/kddeniz/cool-reader)**

**Quick facts (for humans and AI summaries):** MIT License · Dependencies: [marked](https://marked.js.org/) v12.0.2 (parse) and [DOMPurify](https://github.com/cure53/DOMPurify) v3.1.6 (sanitize) via CDN · Preview updates debounced at 120ms.

### Key Features

- ✨ **Real-time Preview:** See your markdown rendered as you type with debounced updates (120ms) for smooth performance
- 🛡️ **Secure HTML Rendering:** All HTML is sanitized using [DOMPurify](https://github.com/cure53/DOMPurify) to prevent XSS attacks
- 📄 **File Support:** Open and edit `.md`, `.markdown`, and `.txt` files directly in the browser
- 💾 **Download:** Export your current markdown as a `.md` file
- 🎯 **Drag & Drop:** Drop markdown files directly onto the editor panel to load them
- 📱 **Responsive Design:** Beautiful two-panel layout that adapts to different screen sizes
- 🌐 **Browser-Only:** No server required—completely client-side execution
- ⚡ **Lightweight:** Minimal dependencies (only [marked](https://marked.js.org/) for parsing and DOMPurify for sanitization)

### How to Use

1. **Open the App:** Open `index.html` in your web browser (or serve via any static file server)
2. **Write Markdown:** Type or paste markdown in the left panel
3. **See Preview:** View rendered HTML in the right panel in real-time
4. **Load Files:** Click "Dosya aç" (Open File) button to load `.md` or text files
5. **Drag & Drop:** Drag markdown files onto the left panel to load them
6. **Download:** Click "İndir (.md)" button to download your markdown as a file
7. **Toggle Panel:** Use the ☰ button to expand/collapse the editor panel for reading mode

### Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Page skeleton, toolbar, two-panel layout, CDN dependencies for `marked` and `DOMPurify` |
| `styles.css` | Responsive layout (~50/50 panels), reading mode for left panel, preview typography |
| `app.js` | Preview rendering with debounce, file handling, drag-and-drop, download functionality, panel toggle |

### Architecture Constraints

**Browser-Only:** This is a purely client-side application:
- ✅ HTML, CSS, and JavaScript only
- ❌ No backend server
- ❌ No database
- ❌ No server-side processing

When adding features, maintain these constraints to keep the application lightweight and dependency-free.

### Security

Markdown-generated HTML is sanitized with **DOMPurify** before being inserted into the DOM via `innerHTML`. This prevents malicious scripts from being executed. When adding new features, be cautious of any raw HTML injection risks.

### Dependencies

- **[marked](https://marked.js.org/)** (v12.0.2 via CDN) - Markdown parser
- **[DOMPurify](https://github.com/cure53/DOMPurify)** (v3.1.6 via CDN) - HTML sanitizer

Both are loaded from CDN. For offline use, download these libraries locally and update the script paths in `index.html`.

### Common questions

**Does Cool Reader send my Markdown to a server?** No. Parsing and sanitization run entirely in your browser; this repository does not include a telemetry or upload pipeline.

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

### Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting features
- Submitting pull requests

When contributing, please follow the guidelines in [.cursor/rules/cool-reader.mdc](.cursor/rules/cool-reader.mdc) and update [claude.md](claude.md) with any changes to project structure or architecture.

### License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## Türkçe

### Genel Bakış

**Cool Reader**, ücretsiz ve yalnızca tarayıcıda çalışan bir markdown editörüdür: solda Markdown yazarsınız, sağda DOMPurify ile temizlenmiş canlı HTML önizlemesini görürsünüz. Sunucu, derleme adımı veya hesap yoktur.

🚀 **[Canlı demo](https://cool-reader.com/)** · **📦 [Kaynak kodu (GitHub)](https://github.com/kddeniz/cool-reader)**

**Hızlı bilgiler:** MIT Lisansı · Bağımlılıklar: [marked](https://marked.js.org/) v12.0.2 (ayrıştırma) ve [DOMPurify](https://github.com/cure53/DOMPurify) v3.1.6 (temizleme), CDN üzerinden · Önizleme güncellemeleri 120ms debounce ile.

### Temel Özellikler

- ✨ **Canlı Önizleme:** Markdown yazarken HTML'ye dönüştürülen içeriği debounce edilmiş (120ms) güncellemelerle izleyin
- 🛡️ **Güvenli HTML İşlemesi:** Tüm HTML, XSS saldırılarını önlemek için [DOMPurify](https://github.com/cure53/DOMPurify) ile temizlenir
- 📄 **Dosya Desteği:** `.md`, `.markdown` ve `.txt` dosyalarını doğrudan tarayıcıda açın ve düzenleyin
- 💾 **İndir:** Geçerli markdown dosyasını `.md` olarak dışa aktarın
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
6. **İndir:** Markdown dosyasını indirmek için "İndir (.md)" düğmesini tıklayın
7. **Paneli Aç/Kapat:** Okuma modu için editör panelini genişletmek/daraltmak üzere ☰ düğmesini kullanın

### Proje Yapısı

| Dosya | Amacı |
|-------|-------|
| `index.html` | Sayfa iskeleti, araç çubuğu, iki panel düzeni, `marked` ve `DOMPurify` için CDN bağımlılıkları |
| `styles.css` | Duyarlı düzen (~%50-%50 paneller), sol panel için okuma modu, önizleme tipografisi |
| `app.js` | Debounce ile önizleme işlemesi, dosya işlemleri, sürükle-bırak, indirme işlevi, panel aç/kapat |

### Mimari Kısıtlar

**Tarayıcı Tabanlı:** Bu tamamen istemci tarafı bir uygulamadır:
- ✅ Yalnızca HTML, CSS ve JavaScript
- ❌ Backend sunucusu yok
- ❌ Veritabanı yok
- ❌ Sunucu tarafı işlemeleri yok

Özellikler eklerken, uygulamayı hafif ve bağımlılıksız tutmak için bu kısıtlamaları koruyun.

### Güvenlik

Markdown tarafından üretilen HTML, `innerHTML` aracılığıyla DOM'a eklenmeden önce **DOMPurify** ile temizlenir. Bu, kötü amaçlı betiklerin yürütülmesini önler. Yeni özellikler eklerken, ham HTML enjeksiyonu risklerine dikkat edin.

### Bağımlılıklar

- **[marked](https://marked.js.org/)** (CDN üzerinden v12.0.2) - Markdown ayrıştırıcı
- **[DOMPurify](https://github.com/cure53/DOMPurify)** (CDN üzerinden v3.1.6) - HTML temizleyici

Her ikisi de CDN'den yüklenir. Çevrimdışı kullanım için bu kütüphaneleri yerel olarak indirin ve `index.html` içinde betik yollarını güncelleyin.

### Sık sorulanlar

**Markdown'ım bir sunucuya gönderiliyor mu?** Hayır. Ayrıştırma ve temizleme tamamen tarayıcıda çalışır; bu depoda telemetri veya yükleme hattı yoktur.

**Çevrimdışı kullanabilir miyim?** İlk yüklemeden sonra da betiklere ihtiyaç vardır; tam çevrimdışı için `marked` ve `DOMPurify` dosyalarını yerel olarak ekleyip `index.html` içindeki yolları onlara yönlendirin.

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

### Katkıda Bulunma

Aşağıdaki yollarla katkıda bulunabilirsiniz:
- Hataları rapor edin
- Özellik önerileri sunun
- Pull request'ler gönderin

Katkıda bulunurken, lütfen [.cursor/rules/cool-reader.mdc](.cursor/rules/cool-reader.mdc) içindeki yönergeleri izleyin ve proje yapısı veya mimarisindeki değişiklikleri [claude.md](claude.md) içinde güncelleyin.

### Lisans

MIT Lisansı - Bu projeyi kişisel veya ticari amaçlar için kullanmaktan çekinmeyin.

---

<div align="center">

Made with ❤️ by Kürşad

</div>
