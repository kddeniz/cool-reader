# Kool Reader

Statik, tarayıcıda çalışan bir markdown editör ve önizleyicidir: sol panelde ham metin, sağ panelde güvenli HTML önizlemesi.

## Mimari kısıt

- **Yalnızca tarayıcı (browser-only):** HTML, CSS ve JavaScript. Uygulama mantığının tamamı istemcidedir.
- **Backend yok:** API sunucusu, veritabanı, sunucu tarafı işleme veya ayrı bir backend kod tabanı yoktur; özellik eklerken bu kısıt korunmalıdır.

## Dosya haritası

| Dosya | Açıklama |
|--------|-----------|
| `index.html` | Sayfa iskeleti, araç çubuğu, iki panel, CDN ile `marked` ve `DOMPurify` |
| `styles.css` | Düzen (yaklaşık 50/50 paneller), sol panel daraltılmış tam genişlik okuma modu, önizleme tipografisi |
| `app.js` | Debounce ile önizleme, dosya açma, sol panele sürükle-bırak, `.md` indirme, sol panel aç/kapa |

## Kullanıcı akışları

1. **Yazma:** Metin `textarea` içinde düzenlenir; aynı metin kaynağından önizleme üretilir.
2. **Dosya aç:** Araç çubuğundaki dosya seçici ile `.md` / metin dosyası yüklenir; içerik editöre yazılır ve önizleme güncellenir.
3. **Sürükle-bırak:** Dosya sol editör alanına bırakılır; çoklu dosyada öncelik `.md` uzantılı dosyadadır.

## Güvenlik

Markdown’dan üretilen HTML, `innerHTML` ile basılmadan önce **DOMPurify** ile sanitize edilir. Yeni özelliklerde ham HTML enjeksiyonu riskine dikkat edin.

## Nasıl çalıştırılır

- `index.html` dosyasını tarayıcıda açın (`file://`) veya klasörü herhangi bir statik dosya sunucusu ile servis edin.
- Önizleme için CDN üzerinden `marked` ve `DOMPurify` yüklenir; çevrimdışı kullanım için bu bağımlılıkların yerel kopyalanması gerekir.

## Sürdürülebilirlik ve dokümantasyon

**Yapılacak tüm planlamalar ve geliştirmelerde `claude.md` dosyasının güncellenmesi de düşünülmeli** (proje yapısı, yeni akışlar, güvenlik veya kısıt değişiklikleri). Anlamlı özellik eklerken [.cursor/rules/kool-reader.mdc](.cursor/rules/kool-reader.mdc) ile uyumlu tutun.
