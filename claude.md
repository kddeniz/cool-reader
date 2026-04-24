# Cool Reader

Statik, tarayıcıda çalışan bir markdown editör ve önizleyicidir: sol panelde ham metin, sağ panelde güvenli HTML önizlemesi.

## Mimari kısıt

- **Yalnızca tarayıcı (browser-only):** HTML, CSS ve JavaScript. Uygulama mantığının tamamı istemcidedir.
- **Backend yok:** API sunucusu, veritabanı, sunucu tarafı işleme veya ayrı bir backend kod tabanı yoktur; özellik eklerken bu kısıt korunmalıdır.

## Dosya haritası

| Dosya | Açıklama |
|--------|-----------|
| `index.html` | Sayfa iskeleti, araç çubuğu, iki panel, jsDelivr üzerinden sabit sürüm + SRI ile `marked` ve `DOMPurify` |
| `styles.css` | Düzen (yaklaşık 50/50 paneller), sol panel daraltılmış tam genişlik okuma modu, önizleme tipografisi, editör `:focus-visible` halkası |
| `app.js` | Debounce ile önizleme, dosya açma, sol panele sürükle-bırak, `.md` indirme, sol panel aç/kapa; CDN / dosya hataları için `#appAlert` |
| `schema-ld.json` | JSON-LD (CSP ile uyum için harici dosya; `softwareVersion` burada) |
| `staticwebapp.config.json` | Azure Static Web Apps: CSP ve diğer güvenlik başlıkları |
| `package.json` | Yalnızca geliştirme: ESLint, html-validate, Playwright |
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

## Güvenlik

Markdown’dan üretilen HTML, `innerHTML` ile basılmadan önce **DOMPurify** ile sanitize edilir. Yeni özelliklerde ham HTML enjeksiyonu riskine dikkat edin.

- Üçüncü taraf betiklerde **SRI** (`integrity`) kullanılır; sürüm yükseltirken hash’leri yeniden üretin.
- Üretimde Azure SWA kullanılıyorsa `staticwebapp.config.json` içindeki **CSP** ve başlıklar, uygulamanın izin verdiği kaynaklarla uyumlu tutulmalıdır.
- Güvenlik açığı bildirimi: `SECURITY.md`.

## Nasıl çalıştırılır

- `index.html` dosyasını tarayıcıda açın (`file://`) veya klasörü herhangi bir statik dosya sunucusu ile servis edin.
- Önizleme için jsDelivr üzerinden `marked` ve `DOMPurify` yüklenir (SRI ile); çevrimdışı kullanım için bu bağımlılıkların yerel kopyalanması ve `index.html` + SRI güncellenmesi gerekir. Google Fonts ayrıca `fonts.googleapis.com` / `fonts.gstatic.com` çağırır.

## Sürdürülebilirlik ve dokümantasyon

**Yapılacak tüm planlamalar ve geliştirmelerde `claude.md` dosyasının güncellenmesi de düşünülmeli** (proje yapısı, yeni akışlar, güvenlik veya kısıt değişiklikleri). Anlamlı özellik eklerken [.cursor/rules/cool-reader.mdc](.cursor/rules/cool-reader.mdc) ile uyumlu tutun.
