# Güncel durum

Kayıt tarihi: 27 Eylül 2026 (Europe/Istanbul).
Bu kaydın kod referansı: main / 6bbbe4b512... (uzak, push edilmiş) + yerel commit 5298f7a (henüz push edilmedi).
Hazırlayan: Claude. Sonraki oturumda uzak dal yeniden okunmalı, yerel 5298f7a'nın push durumu kontrol edilmelidir.

## Bu oturumda yapılan gerçek ekran doğrulaması

- Yöntem: repo yerel olarak klonlandı, `python3 -m http.server` ile yerelde sunuldu; @sparticuz/chromium + puppeteer-core (npm registry üzerinden inen, harici bir CDN indirmesi gerektirmeyen Chromium ikili paketi) ile headless Chromium başlatıldı. Not: standart `npx playwright install` bu ortamın ağ izin listesinde olmayan `cdn.playwright.dev`'den indirme yapmaya çalıştığı için başarısız oldu; bu yöntem bunun yerine kullanıldı. Bu araçlar (`@sparticuz/chromium`, `puppeteer-core`, test scriptleri) yalnızca doğrulama sırasında geçici olarak kuruldu, repoya eklenmedi.
- Kontrol edilenler: ana sayfa yüklenmesi (konsolda gerçek JS hatası yok — font CDN'inin 403 vermesi bu test ortamına özgüdür, gerçek kullanıcıyı etkilemez), ders/seviye seçim akışı, localStorage'a kayıt, modül kartlarının etkin/devre dışı durumu, dört modülün (Yıllık Plan, Ünite Planı, Çalışma Kâğıdı, Değerlendirme) render'ı, sayfa yenilemede seçimin korunması, sidebar aktif link işaretlemesi, seçimsiz doğrudan modül girişi, mobil (390px) görünüm ve yatay taşma, yazdırma medyası (sidebar/menü gizlenmesi).
- `npm test` da bu oturumda ayrıca çalıştırıldı: tüm modüller ders/seviye kombinasyonlarında hatasız render edildi.
- Sonuç: yukarıdakilerin tamamı, aşağıdaki tek istisna dışında, beklendiği gibi çalıştı.

## Bu oturumda bulunan ve düzeltilen sorun

- `js/module-page.js`: localStorage'da ders seçili ama (birden fazla seviyesi olan bir ders için, örn. Felsefe/Sosyoloji) sınıf/seviye seçili değilken, sayfa sessizce ilk seviyeyi (`seviyeler[0]`) varsayılan gösteriyordu; bu sırada sidebar alt köşesindeki etiket hâlâ "sınıf seçilmedi" yazıyordu — içerik ile etiket birbiriyle çelişiyordu. Tek seviyeli dersler (Psikoloji, Mantık) bu durumdan etkilenmiyordu, çünkü app.js zaten onlar için seviyeyi otomatik atıyor.
- Düzeltme: `seviyeler.length > 1` iken `seviyeIndex` boşsa artık ana sayfadaki "seçim zorunlu" davranışıyla aynı uyarı ("Önce ana sayfadan sınıf/ders düzeyi seçin.") gösteriliyor; tek seviyeli derslerdeki otomatik seçim davranışı aynen korunuyor.
- Yerel commit: `5298f7a` — "module-page.js: birden fazla seviyeli derste sınıf seçilmeden sessizce ilk seviyeye düşme; ana sayfadaki seçim-zorunlu davranışıyla tutarlı hale getir". `main`/`6bbbe4b` üzerine. **Bu commit henüz GitHub'a push edilmedi** (push için daha önceki oturumlardaki gibi tek seferlik bir fine-grained personal access token gerekiyor; bu oturumda verilmedi).
- Regresyon: düzeltmeden önce ve sonra aynı 16 otomatik tarayıcı kontrolü tekrar çalıştırıldı, hepsi geçti; tek seviyeli derslerde (Psikoloji) otomatik davranışın bozulmadığı ayrıca ayrı bir senaryoyla doğrulandı.

## Kod ve GitHub kayıtlarından görülenler

- Dört ders için JSON veri dosyaları var.
- Yıllık Plan, Ünite Planı, Çalışma Kâğıdı ve Değerlendirme/Rubrik üreticileri mevcut.
- Site çok sayfalı yapıda: ortak sidebar (js/sidebar.js), localStorage tabanlı ders/sınıf seçimi (js/state.js), modül sayfalarının ortak yükleme mantığı (js/module-page.js — bu oturumda düzeltildi).
- js/belge-bilgisi.js ortak okul/öğretmen/eğitim yılı ve imza alanlarını sağlıyor.
- Yıllık plan kodu farklı hafta sayısını satır sayısından ayırıyor; öğrenme çıktısının açıklamasını da gösteriyor.
- Sunum ve Zümre Tutanağı menüde hazır değil; ayrı sayfa bulunması üreticinin tamamlandığı anlamına gelmez.
- Günlük Plan modülü henüz yok.
- Çıktı yolu tarayıcıdan yazdırma/PDF; Word/PowerPoint üreticileri henüz yok.
- package.json ve test-run.js mevcut; npm test dört modülü ders/seviye kombinasyonlarında render ederek hata arıyor (bu oturumda çalıştırıldı, geçti).
- İnceleme anında açık PR yoktu.

## Kaynak doğrulaması hakkında sınır

README ve ff66c130b30b27298c43dd34e07f7747bc71cca5 commit açıklaması, Felsefe 11 ve Psikoloji'deki boş saatlerin okulun uygulanmış planlarıyla karşılaştırılıp doldurulduğunu belirtiyor.
README, Felsefe 10/11 ve Psikoloji için 68 saati bildiriyor; Sosyoloji ve Mantık için aynı satır satır doğrulamanın yapılmadığını söylüyor.
Bu oturumda kaynak PDF/Word/XLSX dosyaları yeniden karşılaştırılmadı; bu, önceki oturumların beyanının bağımsız doğrulaması değildir.
Sosyoloji 12 için uygulama çerçeve planı mevcut değil olarak işaretliyor; bu, güncel MEB yayın durumunun bu oturumda kontrol edildiği anlamına gelmez.

## Açık işler ve doğrulama ihtiyaçları

- **Öncelikli:** yerel commit `5298f7a` push edilmeli (token bekleniyor) ve push sonrası GitHub Pages'e yansıması kontrol edilmelidir.
- README hâlâ tek dosya yaklaşımından söz ediyor; çok sayfalı yapı ve yeni ortak dosyalarla eşitlenmeli.
- Çalışma kâğıdı ve rubrik içerikleri genel şablon düzeyinde; bu oturumda Değerlendirme/Rubrik ekranı gerçek ekranda tekrar incelendi ve aynı şablon tekrarı (farklı ölçütlerin aynı seviye açıklamasını neredeyse birebir paylaşması) gözlemle yeniden doğrulandı — konuya özgü görev ve başarı ölçütleri hâlâ geliştirilebilir, bu oturumda değiştirilmedi.
- Sosyoloji/Mantık saatlerinin kaynak karşılaştırması ayrı bir içerik işi olarak bekliyor; bu oturumda dokunulmadı.
- Günlük plan, sunum ve Word/PowerPoint çıktıları ürün hedefleri arasında; uygulama kapsamı henüz kararlaştırılmadı.
- Bu oturumun doğrulama scriptleri (headless Chromium + puppeteer-core tabanlı) repoya eklenmedi, kalıcı bir test altyapısı önerisi değildir; kullanıcı isterse ayrı bir kararla eklenebilir.

## Son doğrulama

Bu oturumda: repo yerel olarak klonlandı, gerçek headless tarayıcıda masaüstü + mobil + yazdırma ekranları uçtan uca test edildi (16 kontrol), npm test çalıştırıldı, bulunan bir tutarsızlık düzeltilip aynı kontrollerle regresyona sokuldu.
Kod değişikliği yapıldı ve yerel olarak commit'lendi (5298f7a), ancak **push edilmedi**. Canlı GitHub Pages sitesi bu oturumda açılmadı/test edilmedi (yalnızca yerel klon test edildi).

## Önerilen sonraki görev — uygulama onayı değildir

5298f7a push edildikten sonra canlı Pages üzerinde aynı senaryoların (özellikle düzeltilen seviye-seçim uyarısının) kısaca doğrulanması. Kullanıcının yeni talebi bu önerinin önüne geçer.
