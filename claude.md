# Cool Reader

Statik, tarayıcıda çalışan bir markdown editör ve önizleyicidir: sol panelde ham metin, sağ panelde güvenli HTML önizlemesi.

## Kullanıcı arayüzü dili

- **`index.html` ve `app.js`:** Kullanıcıya dönük tüm metinler (butonlar, `aria-label`, `title`, `placeholder`, `#appAlert` mesajları) **İngilizce** tutulur; belge dili `html lang="en"`.
- **`README.md`:** GitHub için çok dilli (İngilizce + Türkçe) bölümler korunabilir; canlı uygulama kopyası İngilizcedir.

## Mimari kısıt

- **Yalnızca tarayıcı (browser-only):** HTML, CSS ve JavaScript. Uygulama mantığının tamamı istemcidedir.
- **Backend yok:** API sunucusu, veritabanı, sunucu tarafı işleme veya ayrı bir backend kod tabanı yoktur; özellik eklerken bu kısıt korunmalıdır.
- **İstisna (yalnız geliştirme):** `scripts/playwright-serve.mjs`, Playwright testleri için `Accept: text/markdown` ile HTML → markdown anlaşması yapar. Canlı sitede saf Azure SWA `Accept`’e göre içerik seçemez; uzaktan “markdown negotiation” taraması için CDN/kenar katmanında dönüşüm gerekir (ör. Cloudflare [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)).

## Dosya haritası

| Dosya | Açıklama |
|--------|-----------|
| `index.html` | Sayfa iskeleti, araç çubuğu, iki panel, Google Analytics (gtag.js + küçük inline init), jsDelivr üzerinden sabit sürüm + SRI ile `marked`, `DOMPurify` ve `mermaid` |
| `styles.css` | Düzen (yaklaşık 50/50 paneller), sol panel daraltılmış tam genişlik okuma modu, önizleme tipografisi, Mermaid kapsayıcı taşması, editör `:focus-visible` halkası |
| `theme.js` | Okuma teması (sürümlü JSON, `localStorage`), canlı önizleme ve `.html` dışa aktarmada paylaşılan `--cr-*` değişkenleri, dışa aktarma `<style>` üreticisi ve Mermaid betiği + başlatma |
| `app.js` | Debounce ile önizleme, `marked` Mermaid çiti işlemesi, Mermaid `run`, okuma teması (Aa) ve `localStorage`, dosya açma, sürükle-bırak, `.md` / bağımsız `.html` dışa aktarma, sistem yazdırma ile aynı HTML, sol panel aç/kapa, `#appAlert` |
| `schema-ld.json` | JSON-LD (CSP ile uyum için harici dosya; `softwareVersion` burada) |
| `staticwebapp.config.json` | Azure Static Web Apps: CSP ve diğer güvenlik başlıkları |
| `package.json` | Yalnızca geliştirme: ESLint, html-validate, Playwright |
| `scripts/playwright-serve.mjs` | Playwright için yerel sunucu; `staticwebapp.config.json` başlıkları + `.html` için `Accept: text/markdown` anlaşması |
| `scripts/markdown-negotiation.mjs` | `Accept` q-değerleri, Turndown ile gövde → markdown, `x-markdown-tokens` tahmini |
| `.github/workflows/ci.yml` | PR/push kalite kapıları |
| `LICENSE` | MIT lisans metni |
| `SECURITY.md` | Güvenlik açığı bildirimi |
| `CONTRIBUTING.md` | Katkı rehberi |
| `CHANGELOG.md` | Sürüm notları |
| `RELEASING.md` | Etiket ve GitHub Release süreci |

## Kullanıcı akışları

1. **Yazma:** Metin `textarea` içinde düzenlenir; aynı metin kaynağından önizleme üretilir.
2. **Dosya aç:** Araç çubuğundaki dosya seçici ile `.md` / metin dosyası yüklenir; içerik editöre yazılır ve önizleme güncellenir.
3. **Sürükle-bırak:** Dosya sol editör alanına bırakılır; çoklu dosyada öncelik `.md` uzantılı dosyadadır.
4. **Dışa aktarma:** Araç çubuğunda ham metin `.md` olarak; `marked` + DOMPurify çıktısı, seçili okuma temasıyla aynı gömülü stillerle bağımsız `.html` olarak; ` ```mermaid ` çitleri önizlemede ve dışa aktarılan/yazdırılan HTML’de Mermaid ile diyagram olarak çizilir. **Yazdır** düğmesi, indir düğmelerinin yanındadır; aynı HTML dizesiyle açılır, sistem yazdır penceresinde “Save as PDF” (sunucu yok).
5. **Okuma teması:** `Aa` paneli: ön ayar, gövde metin fontu, metin boyutu, satır yüksekliği, **Reset** (`theme.js` + `#preview` üzerinde CSS değişkenleri). Tercihler `localStorage`’da; uygulama kromu varsayılan, özelleşen alan önizleme + dışa aktarma.

## Güvenlik

Markdown’dan üretilen HTML, `innerHTML` ile basılmadan önce **DOMPurify** ile sanitize edilir. Yeni özelliklerde ham HTML enjeksiyonu riskine dikkat edin.

- Üçüncü taraf betiklerde **SRI** (`integrity`) kullanılır; sürüm yükseltirken hash’leri yeniden üretin.
- Üretimde Azure SWA kullanılıyorsa `staticwebapp.config.json` içindeki **CSP** ve başlıklar, uygulamanın izin verdiği kaynaklarla uyumlu tutulmalıdır (`cdn.jsdelivr.net`, `googletagmanager.com`, Google Analytics `connect-src` uçları, inline gtag init için `sha256-…`, Mermaid diyagramları için `style-src` içinde kontrollü `'unsafe-inline'`, gerekirse `worker-src`).
- Güvenlik açığı bildirimi: `SECURITY.md`.

## Nasıl çalıştırılır

- `index.html` dosyasını tarayıcıda açın (`file://`) veya klasörü herhangi bir statik dosya sunucusu ile servis edin.
- Önizleme için jsDelivr üzerinden `marked`, `DOMPurify` ve `mermaid` yüklenir (SRI ile); çevrimdışı kullanım için bu bağımlılıkların yerel kopyalanması ve `index.html` + SRI güncellenmesi gerekir. Google Fonts ayrıca `fonts.googleapis.com` / `fonts.gstatic.com` çağırır. Barındırılan sitede Google Analytics (gtag) da yüklenir; CSP buna göre güncellenir.

## Sürdürülebilirlik ve dokümantasyon

**Yapılacak tüm planlamalar ve geliştirmelerde `claude.md` dosyasının güncellenmesi de düşünülmeli** (proje yapısı, yeni akışlar, güvenlik veya kısıt değişiklikleri). Anlamlı özellik eklerken [.cursor/rules/cool-reader.mdc](.cursor/rules/cool-reader.mdc) ile uyumlu tutun.
