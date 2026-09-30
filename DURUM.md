## 30 Eylül 2026 — Yıllık Plan: önbellek, üst bilgi paritesi ve veri düzeltmeleri

- Gözlem: kullanıcının indirdiği PDF (jsPDF, 14 sayfa JPEG) ve Yazdır çıktısındaki kaçak `\n` metinleri PR #28 öncesi koddan geliyordu. GitHub Pages dosyaları ~10 dk önbelleğe aldığından tarayıcı eski sürümü çalıştırdı. Yeni PDF yolu bu yüzden cihazda henüz doğrulanamadı.
- Önlem: `yillik-plan.html` script etiketlerine ve `data-loader.js` veri isteğine `?v=20260930b` eklendi. Sonraki değişikliklerde bu sürüm etiketi değiştirilmeli.
- Parite: Okul/Öğretmen üst bilgisi yalnız Yazdır çıktısında vardı; PDF ve DOCX'e de eklendi (indirme anındaki değer `BelgeBilgisiModule.bilgiOku()` ile okunur).
- Veri (4 ders dosyası): `28 Aralık -1Ocak` → `28 Aralık-1 Ocak`; 8. hafta (Kasım 2-6) ve Sosyoloji 1'in 34. haftası için boş `ay` dolduruldu; Felsefe 10.8.1 kesik öğrenme çıktısı başlığı `muhakeme edebil` → `muhakeme edebilme`; Din Felsefesi içerik çerçevesindeki satır sonu tire kırığı (`Yöne-` / `lik argüman`) tek öğede `Yönelik argüman` olarak birleştirildi. Resmî kaynakla karşılaştırılmadı; yalnız açık kesme/bozulma düzeltildi.
- Bilerek dokunulmadı: 1. hafta satırındaki "15 Temmuz Demokrasi ve Millî Birlik Günü" (mevcut test bunu bekliyor; kaynaktan doğrulanmış kabul edildi).
- Doğrulama: `npm test` başarılı (PDF testine bozuk metin, eksik ay etiketi ve kesik çıktı kontrolleri eklendi); PDF pdftotext ile, DOCX LibreOffice ile açılıp üst bilgi doğrulandı.

---

## 30 Eylül 2026 — Yıllık Plan PDF: ekran görüntüsünden vektör PDF'e geçiş

- Sorun: "PDF indir" 0 bayt iniyordu; ayrıca eski yöntem (html2canvas → JPEG → jsPDF) ekranın 1500 px'lik tablosunu görüntüye çevirip A4'e dilimliyordu (10 sütun yerine yalnız sol kısım, 24 sayfa). html2canvas `@media print` kurallarını uygulamaz.
- Değişiklik: `js/modules/yillik-plan-pdf.js` artık `model.rows` verisinden jsPDF + autoTable ile gerçek vektör PDF çizer (A4 yatay, DOCX ile aynı 10 sütun oranı, her sayfada tekrar eden başlık, sayfa numarası, imza alanı). Türkçe karakterler için DejaVu Sans Condensed alt kümesi gömülür. Kütüphaneler `js/vendor/` altına alındı; CDN bağımlılığı kalmadı. Nesne URL'si 1 sn yerine 120 sn açık tutulur.
- `yillik-plan.html`: script etiketleri arasındaki kaçak `\n` metinleri temizlendi.
- Dokunulmadı: DOCX üreticisi, ortak belge modeli, Yazdır düğmesi ve baskı CSS'i (katman sadeleştirmesi ayrı iş).
- Doğrulama: `npm test` başarılı (yeni `test-annual-pdf.js`). Node/jsdom'da 5 ders/seviye için PDF üretildi; Felsefe 10 → 3 sayfa, ~31 KB, pdftotext ile 10 sütun ve Türkçe karakterler, görsel olarak 1. sayfa incelendi.
- Açık: 0 bayt hatası gerçek Android cihazında yeniden üretilemedi; nedeni kesin ayrılamadı (olası: çok büyük canvas veya eşzamansız indirme). Yeni yol canvas kullanmadığı ve indirme eşzamanlı olduğu için bu iki riski kaldırıyor, ama cihazda kabul kontrolü gerekir.

---

## 30 Eylül 2026 — Sunum modülü (PR açıldı)

- Dal: `feat/sunum-modulu` (başlangıç `main` güncel). Sunum artık sidebar'da ve ana sayfada etkin; `sunum.html` diğer modüllerle aynı `ModulePage` kalıbını kullanır.
- `js/modules/sunum.js`: ünite + öğrenme çıktısı seçilir; bölümler işaretlenir (konu başlıkları, anahtar kavramlar, süreç bileşenleri, tartışma soruları, ders sonu değerlendirme). `slaytlariHazirla()` saf fonksiyondur (kapak + kazanım her zaman; 6/9/3 maddelik sayfalama); `pptxOlustur()` PptxGenJS sınıfını parametre alır. İçerik yalnız veriden gelir. Tartışma soruları veri maddelerine uygulanan kalıplardır, öneri niteliğindedir; kapanış soruları sabit metindir. Öğretmen/okul bilgisi sunuya eklenmedi.
- Kütüphane: `js/vendor/pptxgen.bundle.js` (PptxGenJS 4.0.1, ~460 KB, MIT; JSZip dahil) değiştirilmeden repoya alındı, CDN bağımlılığı yok; yalnız "indir" tıklanınca yüklenir. Lisans notu `js/vendor/LISANS-NOTU.txt`.
- Görsel dil: FOPOS renkleri (koyu #182120, altın #BC9C5F, zemin #F6F7FB); 16:9; yazı tipleri Georgia + Calibri (PowerPoint'te hazır bulunur, gömülmez). Ekranda slayt önizlemesi kartlarla; yazdırmada gizli.
- Doğrulama: `npm test` başarılı (Sunum render + tüm ders/seviye/çıktılar için slayt modeli kontrolü eklendi). Gerçek Chromium'da ders/sınıf seçimi → Sunum → indirme akışı çalıştırıldı; `Sunum_FEL.10.1.1.pptx` indi, 8 slayt, konsol hatası yok. Örnek dosya LibreOffice ile PDF'e çevrilip 8 slayt görsel incelendi. PowerPoint'in kendisinde açılış ve Türkçe karakter/yazı tipi görünümü doğrulanmadı; metin kutuları otomatik sığdırma kullanmaz, en uzun süreç bileşeni (155 karakter) 18 pt'de sığıyor.
- Açık: Sosyoloji/Psikoloji/Mantık için örnek dosyalar tek tek görsel incelenmedi (yalnız Felsefe 10.1.1). Slayt düzenleme önizlemede yok; düzenleme PowerPoint'te yapılır. Zümre Tutanağı hâlâ "Yakında".

---

## 30 Eylül 2026 — PR #4 kapatıldı

- `feat/daily-plan-weeks` (PR #4) main'in 30 commit gerisindeydi; birleştirilirse main'deki sonraki işleri silecekti (+776 / −1940). İçeriği PR #5/#6 ile zaten main'de (`js/modules/gunluk-plan-verileri.js`, hafta seçimi). Birleştirilmeden kapatıldı, gerekçe PR'a yorum olarak yazıldı. Bu, 30 Eylül tarihli önceki notlardaki "kapatılmalı" bulgusunu çözer.
- Hâlâ açık: birleşmiş dallar silinmedi (uzak depoda 21 dal). Silme ayrı bir karar; bu oturumda yapılmadı.

---

## 30 Eylül 2026 — Ana sayfa FOPOS v47 görünümüne yaklaştırıldı (PR #20, yayında)

- Dal: `feat/fopos-ana-sayfa-tasarimi` (başlangıç `main` / `78cbb8a`). PR #20 kullanıcı tarafından 30 Eylül 2026 07:43 UTC'de birleştirildi (`43dfadd`); CI (`test`, `build`, `deploy`, `report-build-status`) ve Pages yayını başarılı. Kullanıcı canlı sitede tasarımın düzeldiğini kendi tarayıcısında doğruladı; yazı tipleri de o kontrolle görüldü.
- Kaynak: kullanıcının 27 ve 30 Eylül tarihli FOPOS v47 ekran görüntüleri; renkler piksel örneklemesiyle ölçüldü (kenar çubuğu #182120, zemin #f6f7fb, hero #1b2a25 → #293a34 → #3b4135, altın #bc9c5f, metin altını #816b44, kart kenarı #e1ded9, ikon zemini #eff1ec).
- Değişiklik: tarih + selamlama satırı (saate göre), geniş hero (büyük serif başlık, altın ikinci satır, yörünge halkaları, altın "Yıllık plan hazırla" düğmesi), "Modüller" başlığı yanında etkin modül sayısı, beyaz/yuvarlak modül kartları (sans başlık, altın-kahve "Başlat →"), kenar çubuğunda pusula simgeli marka, "Çalışma alanı" bölüm etiketi, yuvarlak seçim hapı. `css/style.css` :root renkleri yerinde güncellendi; koyu tema bloğu korundu.
- Dokunulmayanlar: modül mantığı, veri, yazdırma çıktıları. FOPOS'taki bildirim zili, kenar çubuğu daraltma ve tema/avatar düğmeleri bilerek eklenmedi (işlevleri yok).
- Doğrulama: `npm test` başarılı; Chromium'da 1190 px açık/koyu tema ve 390 px (yatay taşma yok) ekranları incelendi. Google Fonts sandbox'ta yüklenmedi, yedek yazı tipleriyle bakıldı; gerçek tarayıcıda Source Serif 4 / Public Sans ile kontrol gerekir.

---

## 30 Eylül 2026 — Yıllık Plan sayfa genişliği ve FOPOS görsel aktarımı

- Başlangıç: `main` / `c0c6e5c` (PR #18 squash merge). PR #18 CI ve Pages yayını başarılı; hafta seçim alanını gizleme kuralı canlı CSS'te doğrulandı.
- Çalışma dalı: `fix/annual-landscape-fopos-visuals`. Kullanıcı 30 Eylül 2026 tarihinde değişikliklerin GitHub’a aktarılmasını istedi; bu kayıt paketle birlikte commit edilir. CI sonucu ve yayın henüz doğrulanmadı.
- Yıllık Plan: dinamik `@page` ekleme kaldırılıp statik, sayfaya özel `@page yillik-plan` A4 yatay kuralı eklendi. Yalnız Yıllık Plan bu kâğıdı kullanır. Ekran/baskı içerik genişliği sınırı kaldırıldı; baskıda kabuk blok düzenine alınır, içerik kenar boşlukları sıfırlanır. Sütunlar metin uzunluklarına göre paylaştırılır; kâğıt kenar boşluğu 10 mm.
- Önemli ayrım: önceki sürüm Chrome'da zaten A4 yatay PDF üretebiliyordu; doğrulanan sorun içerikte kalan 1100 px genişlik sınırı ve 32/40/64 px padding. Kullanıcının cihazındaki dikey baskı gözlemi aynı ortamda yeniden üretilemedi; bu cihazda baskı yönü kabul kontrolü gereklidir.
- Görsel kaynak: `aytigin-netizen/FOPOS` deposunun `app/globals.css`, `Dashboard.tsx` ve gezinme bileşeni. Yeşil-altın karşılama paneli, kitap simgesi, simgeli/açıklamalı modül kartları, görünür Modüller başlığı ve simgeli gezinme aktarıldı. Koyu temada eski mavi palet yerine yeşil-altın kullanılır. Mevcut modüller ve kullanılabilirlik durumları korunur; yeni modül işlevi eklenmedi.
- Doğrulama: `npm test` başarılı. Eski dinamik style öğesini arayan test kaldırıldı; sayfa yönü gerçek tarayıcı PDF'i üzerinden doğrulandı. Chrome 154 ile açık/koyu tema ekranları ve 390 px genişlikte sekiz sayfa incelendi; yatay sayfa taşması yok. Günlük Plan hafta seçimi ekranda görünür, baskıda gizli; PDF'i dikey kaldı.
- Yıllık Plan PDF doğrulaması: Felsefe 10/11, Sosyoloji Dersi 1, Psikoloji ve Mantık; bütün sayfalar 841.9 × 595.0 pt (A4 yatay). Metinler baskı kenar boşlukları içinde; tablo sayfaları görsel incelendi. Bu tarayıcı kontrolü gerçek mobil yazdırma penceresini/yazıcıyı doğrulamaz.

---

## 30 Eylül 2026 — Günlük Plan hafta seçimini baskıda gizleme

- Dal: `fix/daily-plan-print-week-selector`; yerel doğrulama tamamlandı; bu kayıt düzeltmeyle birlikte commit edilir. Uzak dal/PR ve yayın durumu henüz doğrulanmadı.
- `css/style.css`: mevcut Günlük Plan `@media print` gizleme kuralına `.gp-hafta-secim` eklendi. Etiket ve açılır liste birlikte gizlenir; ekran stilleri ve seçilen haftanın belge içeriği değişmez. Tarayıcının yazdır/PDF kaydet akışı aynı baskı kuralını kullanır.
- Doğrulama: `npm test` başarılı (seçim, Günlük Plan ve tüm ders/seviye render kontrolleri); `git diff --check` başarılı. Bu testler baskı görünümünü kanıtlamaz. Yerel Playwright baskı kontrolü tarayıcı yürütülebilir dosyası bulunmadığı için çalıştırılamadı; görsel baskı/PDF doğrulaması yapılmadı.
- Önceki “Hafta seçimi baskıda görünüyor” gözlemi canlı sürüm için geçerlidir; yerel düzeltme yayınlanana kadar kapanmış sayılmaz.

---

## 30 Eylül 2026 — PR #14 yayınlandı; canlı erişim düzeltmesi ve ortam notu

- PR #14 (PR #12/#13 kaydı + görsel doğrulama) squash merge ile `main`'e alındı: `63eebd8`. İki commit: `3999dff` (kayıt) ve `77ca01b` (palet onayının kayda geçirilmesi). CI dördü de yeşil: `test`, `build`, `deploy`, `report-build-status`. GitHub Pages deployment başarılı.
- Düzeltme: bir önceki kayıtta "canlı site" doğrulanamayanlar arasında sayılmıştı. Bu ortam `github.io`'ya **erişebiliyor**; 28 ve 29 Eylül tarihli eski kayıtlardaki "ortam `github.io`'ya erişemiyor (`host_not_allowed`)" notu artık geçerli değil. Yayın sonrası canlı kontrol yapıldı: `DURUM.md`, `DEVIR.md` ve `index.html` doğru içerikle HTTP 200 döndü. **Yalnız statik dosya sunumu doğrulandı; canlı tarayıcı etkileşimi (ders/seviye seçimi, modül akışı) yapılmadı.** O kapsam hâlâ açıktır.
- Ortam notu (bu oturumda keşfedildi, sonraki oturumlar için): bu sandbox'ta `git clone`/`push` "server certificate verification failed" hatası veriyor ve `GIT_SSL_CAINFO` **olmadan** çalışmıyor. Çözüm: `GIT_SSL_CAINFO=/etc/ssl/certs/agent-identity/sandbox-gateway-ca.crt`. Bu CA `CURL_CA_BUNDLE` ile `curl`'a zaten veriliyor, yalnız git kendi ortam değişkenini okumuyor. Doğru CA verildiğinde klon, push ve PR/merge API çağrıları sorunsuz çalıştı.
- Token kullanımı: push ve API çağrıları `http.extraheader` üzerinden geçici yetkilendirmeyle yapıldı; token `.git/config`'e, remote URL'ye veya commit geçmişine yazılmadı (kontrol edildi). Depoda veya belgelerde gizli anahtar yok.
- Hâlâ açık: PR #4 (`feat/daily-plan-week-expansion`) 28 Eylül'den beri açık, main'den 19 commit geride; içeriği PR #5/#6 ile zaten girmiş olduğu için birleştirilmemeli, kapatılmalı. Ayrıca birleşmiş 13 dal silinmemiş durumda. Bu ikisi henüz belgelenmedi ve değiştirilmedi.
- Sıradaki iş: `degerlendirme.html` rubrik tablosunun mobil taşması (PR #10'daki `.yillik-tablo-kaydirma` deseni), sonra `js/modules/unite-plani.js:233` metni. Kullanıcının yeni talebi bu önerilerin önüne geçer.

---

## 29 Eylül 2026 — PR #12 ve PR #13 kayıt boşluğu kapatıldı; görsel doğrulama

- Kayıt boşluğu: PR #12 (72 saat + yatay baskı) ve PR #13 (FOPOS esinli görsel temel) `main`'e birleşmişti ama hiçbiri belgelenmemişti. PR #12 merge commit'i `354f1c7`, PR #13 kod commit'i `8b0eed6` (29 Eylül 2026 13:30 UTC). Bu kayıt ikisini de kapatır; kod değiştirilmemiştir.
- PR #13 ne yaptı: yalnız `css/style.css` (+71/−26). Renk paleti mavi-lacivertten yeşil-altına (`--accent` #2e5c9a → #b58a45, `--forest` #294f43, `--sidebar` #15211f), zemin krem (#f7f4ee), köşe yuvarlaklığı 6/8px → 10/14px, kartlara gölge, sidebar 240 → 264px, serif başlıklar, buton gradient'i, baskıda gölge kaldırma.
- Görsel doğrulama (yerel klon, `python3 -m http.server`, headless Chromium + puppeteer-core, 1280px ve 390px): sekiz sayfanın tamamı masaüstünde yatay taşma olmadan açıldı; konsolda gerçek JS hatası yok. Yeni görsel kimliğin bütün modüllerde tutarlı uygulandığı, seçim alanı, modül kartları, sidebar ve belge başlıklarının okunabilir kaldığı ekran görüntüleriyle doğrulandı.
- Bulgu (PR #13'ün eseri değil, önceden beri var): `degerlendirme.html` mobilde yatay taşıyor. 390px ekranda sayfa 659px'e genişliyor (+269px). Neden `js/modules/degerlendirme.js`'in ürettiği `.dg-rubrik-tablosu` (618px) — sarmalayıcısı `div.rubrik-kagit` (358px) ve `overflow-x: visible`; Yıllık Plan tablosu PR #10'da `.yillik-tablo-kaydirma` sarmalayıcısına alındığı hâlde burada alınmamış. Aynı commit aralığında ölçüldü: `354f1c7` (PR #13 öncesi) ile `8b0eed6` birebir aynı değer. Yani PR #13 taşmayı ne getirmiş ne de fark etmiş.
- Baskı: `page.emulateMediaType('print')` ile doğrulandı — sidebar tüm modül sayfalarında gizli, Yıllık Plan'da `@page { size: A4 landscape }` etkin, diğer modüllerde yok. Üretilen PDF'lerde Yıllık Plan 842×596 pt (A4 yatay), Günlük Plan ve Ünite Plan 596×842 pt (A4 dikey).
- Açık gözlem (daha önce de not edilmişti, hâlâ geçerli): Günlük Plan'da "Hafta seçimi" açılır listesi baskıda gizlenmiyor (`#gp-hafta` print medyasında `display: inline-block`); öğretmen çıktısında kontrol listesi basılıyor.
- Doğrulanamayan: gerçek mobil cihaz, gerçek yazıcı, Firefox/Safari ve canlı tarayıcı etkileşimi. Headless Chromium ortamında Google Fonts CDN'i `ERR_CERT_AUTHORITY_INVALID` verdi (ortamın MITM proxy sertifikası); bu yüzden ekran görüntülerinde Source Serif 4 yerine yedek serif görünüyor. Gerçek kullanıcıyı etkilemesi beklenmiyor ama bu oturumda kanıtlanmadı. (Bu madde ilk yazıldığında "canlı site" de doğrulanamayanlar arasındaydı; 30 Eylül 2026'da düzeltildi, aşağıdaki yeni kayda bak.)
- Sıradaki iş: `degerlendirme.html` rubrik tablosuna kaydırma sarmalayıcısı (PR #10'daki desenle); ardından `js/modules/unite-plani.js:233` öğretmen çıktısındaki "kanonik veri kaynağı" ifadesi. Kullanıcının yeni talebi bu önerilerin önüne geçer.

---

## 29 Eylül 2026 — Yıllık plan: 72 saat ve yatay baskı

- İstek: tüm derslerde yıllık 72 saat; Yıllık Plan baskısı yatay. Kullanıcı okulun uygulanmış Felsefe 10/11 planlarını (PDF) örnek verdi.
- Kaynak: Felsefe öğretim programı süre tablosu (mufredat.meb.gov.tr) 10 ve 11. sınıf için 68 saat ünite + 4 saat okul temelli planlama = 72 gösteriyor. MEB'in 2026-2027 ortaöğretim taslak çerçeve planı sayfası (tymm.meb.gov.tr/taslak-cerceve-planlari/ortaogretim) 29 Eylül itibarıyla yalnızca Felsefe'yi içeriyor; Sosyoloji, Psikoloji ve Mantık orada listelenmiyor (OGM duyurusu "diğer derslerin planları güncelleniyor" diyor). Bu üç ders için mevcut veri kullanıcının daha önce yüklediği xlsx dosyalarından; yeniden karşılaştırılmadı.
- Değişiklik: dört dersin çerçeve planı olan tüm seviyelerinde `toplamDersSaatiYillik` = 72; `ozelPlanlamaHaftalari` her birine `dersSaati` aldı (okul temelli planlama 2+2, sosyal etkinlik toplama girmez). Sosyoloji Dersi 1 ve Mantık'a bu haftalar eklendi (varsayım: Felsefe/Psikoloji takvimiyle aynı; kaynak xlsx ile doğrulanmadı). Yıllık plan tablosu okul temelli planlama ve sosyal etkinlik satırlarını hafta sırasında gösteriyor, dipnot ekli; bilgi tablosunda "72 ders saati (68 ünite + 4 okul temelli planlama)". Eski "toplama dahil değildir" notu ve Mantık uyuşmazlık uyarısı kalktı.
- Yatay baskı: Yıllık Plan modülü `@page { size: A4 landscape }` stilini (yalnızca yazdırmada) sayfaya ekliyor; diğer modüller etkilenmedi. Chromium PDF çıktısı A4 yatay (842×595 pt) doğrulandı; Firefox/Safari sayfa yönünü uygulamazsa sayfada ipucu var.
- Okulun uygulanmış planıyla karşılaştırma: Felsefe 10 ve 11 için 34 ünite haftasının hepsinde kazanım kodları veriyle eşleşti; PDF'te 4 tatil, 2 okul temelli planlama ve 1 sosyal etkinlik satırı var. Fark: PDF hafta numarası tatilleri de sayıyor (1-41), veride tatil haftaları numarasız (OTP 18/36, SE 37; PDF'te 19/40/41). Yıllık Plan tablosunda okulun formundaki Konu, Ölçme ve Değerlendirme, SDB, Değerler ve Okuryazarlık sütunları yok.
- Test: `test-run.js` her seviyede 72 toplamı, ünite + OTP = toplam, uyuşmazlık uyarısı yok, özel satırların tabloda olması ve yatay baskı stilini denetliyor; Mantık toplamı 68'e ve stil `screen`'e çevrilerek testin düştüğü görüldü, geri alındı.
- Doğrulanamayan: canlı site, gerçek yazıcı, Firefox/Safari yön davranışı.

---

## 29 Eylül 2026 — PR #7–#9 kayıt boşluğu; yerel tarayıcı doğrulaması; yıllık plan/README düzeltmeleri

- Kayıt boşluğu: PR #7 (Günlük plan), #8 (Ünite planı), #9 (Yıllık plan) "belge omurgası" değişiklikleri main'e birleşmişti (son main: `0e03886`) ama DURUM/DEVIR/PROJE'de kaydı yoktu. Bu kayıt onu kapatır. Kapsam: `gunluk-plan.js`, `unite-plani.js`, `yillik-plan.js`, `css/style.css` (+~95 satır), `test-run.js`, `test-daily-plan.js`.
- Doğrulanan (yerel klon, headless Chromium, yerel HTTP sunucusu): masaüstü 1280px ve mobil 390px'de Günlük Plan (Felsefe 10/11), Ünite Planı (Felsefe 11) ve Yıllık Plan (Felsefe, Sosyoloji, Psikoloji, Mantık) açıldı; sayfa/konsol JS hatası yok. Baskı ortamında yan menü gizleniyor; Günlük/Ünite/Yıllık Plan için A4 PDF üretildi ve Günlük Plan ile Yıllık Plan'ın ilk sayfaları görsel incelendi. Ünite Planı PDF'i (2 sayfa) görsel incelenmedi.
- Bulgu 1 (#9 kaynaklı değil): Yıllık Plan ana tablosu mobilde sayfayı yatay taşırıyordu (Felsefe 11: 663px; Sosyoloji 759, Mantık 787, Psikoloji 718). #7'den önceki `d50d68c`'de de aynıydı. Tablo `.yillik-tablo-kaydirma` sarmalayıcısına alındı; sayfa artık taşmıyor, tablo kendi içinde yatay kaydırılıyor. Baskıda sarmalayıcı `overflow: visible`.
- Bulgu 2: "Program ve Kaynak Notu" yalnız `cercevePlanMevcut` olan seviyelerde render edilir (modül aksi hâlde uyarıyla erken çıkar); yani Sosyoloji 12'de not görünmüyordu, koşulsuz ekleniyor sanılmıştı — bu çıkarım yanlıştı. Gerçek sorun metindi: "kanonik veri kaynağı" gibi geliştirici dili çıktıda basılıyordu ve üçüncü madde (okul temelli planlama/tatil) veriden bağımsız yazılıyordu. Metin öğretmene dönük yazıldı; üçüncü madde yalnız özel planlama haftası ya da tatil varsa ekleniyor.
- Test: `test-run.js` yıllık plan için üç kontrol ekledi (koşullu madde veriyle tutarlı, "kanonik" yok, tablo sarmalayıcıda). Sarmalayıcı sınıfı geçici bozularak testin düştüğü görüldü, sonra geri alındı. `npm test` üç aşamasıyla geçiyor (font/CSS yükleme uyarıları ortam kaynaklı).
- README: Günlük Plan durumu (5 hafta), belge bölümleri, `gunluk-plan-verileri.js`, CI ve Pages, testin sınırı, açık işler eşitlendi.
- CI/Pages (sonradan doğrulandı): #7–#9 main commit'leri `051645c`, `ab21d02`, `0e03886` için CI ve Pages build/deployment başarılı; PR #10 birleşmesi `4473127` için de CI (run `36541502581`) ve Pages (run `36541502002`) başarılı.
- Doğrulanamayan: (1) Canlı site — bu ortam `github.io`'ya erişemiyor (`host_not_allowed`); canlıda bu üç PR'ın kabulü ve düzeltmenin canlı etkisi yapılmadı. (3) Gerçek mobil cihaz ve gerçek yazıcı/PDF sayfalaması.
- Açık gözlemler (değiştirilmedi): Felsefe 10/1 haftasında (14-18 Eylül) veri dosyasında "15 Temmuz Demokrasi ve Millî Birlik Günü" yazıyor; kaynak taslakla karşılaştırılmadı. Günlük Plan'ın "Beceri, Değer ve Okuryazarlık" ve "Ölçme ve Değerlendirme" bölümlerindeki iki sabit cümle her haftada aynı; içerik değil şablon. Günlük Plan yazdırmada "Hafta seçimi" açılır listesi basılıyor. Felsefe 10/11 ve Psikoloji'de boş saatler okulun uygulanmış planından dolduruldu (README); belgede bu kaynak ayrımı görünmüyor.
- Durum: değişiklikler `fix/yillik-plan-mobil-kaynak-notu` dalında commit'lendi (`1ad58bf`), kullanıcı PR #10'u açıp birleştirdi (main: `4473127`) ve GitHub Pages'e yayınlandı. Bu paket kapatıldı; canlıda mobil Yıllık Plan kabulü yapılmadı.

---

## 29 Eylül 2026 — PR #6 canlı kabul ve paket kapanışı

- PR #6 squash merge ile ana dala alındı. Main commit: `b910adde19b920536123e691bd419254b8546276`.
- Main CI başarılı: run #8 / `36533666159`.
- GitHub Pages build/deployment başarılı: run #19 / `36533665315`.
- Canlı GitHub Pages üzerinde gerçek tarayıcıyla yalnız 2. hafta Günlük Plan akışları doğrulandı.
- Felsefe → 10. Sınıf → Günlük Plan → 2. hafta: `FEL.10.1.1` görünüyor; süreç bileşeni `b) Felsefi düşüncenin genel özellikleri, ortaya çıkışı ve tarihsel gelişimi üzerine derinlemesine düşünür.` görünür; plan 80 dakika / 7 aşama.
- Felsefe → 11. Sınıf → Günlük Plan → 2. hafta: `FEL.11.1.1` görünüyor; süreç bileşeni `b) Çevre ile ilgili felsefi soru ve problemleri hayatla ilişkilendirerek değerlendirir.` görünür; plan 80 dakika / 7 aşama.
- Sonuç: **CANLI KABUL BAŞARILI**. PR #6 paketi kapatıldı.

---

## 29 Eylül 2026 — Felsefe 10/11 Günlük Plan 2. hafta hazırlığı başladı

- Kullanıcı GitHub eklentisiyle yeni dalda Felsefe 10/11 için 2. hafta Günlük Plan kapsamını hazırlamayı istedi.
- GitHub üzerinde ve yerelde yeni dal açıldı: `feat/daily-plan-week-2`.
- 10. sınıf 2. hafta paketi eklendi: `fel-10-al-2026-h2`, `FEL.10.1.1`, `2. Hafta: 21-25 Eylül`, süreç bileşeni `b) Felsefi düşüncenin genel özellikleri, ortaya çıkışı ve tarihsel gelişimi üzerine derinlemesine düşünür.`
- 11. sınıf 2. hafta paketi eklendi: `fel-11-al-2026-h2`, `FEL.11.1.1`, `2. Hafta: 21-25 Eylül`, süreç bileşeni `b) Çevre ile ilgili felsefi soru ve problemleri hayatla ilişkilendirerek değerlendirir.`
- Her iki yeni plan 80 dakika / 7 aşama düzeninde hazırlandı; 10. sınıfta felsefi düşüncenin özellikleri ve tarihsel bağlam, 11. sınıfta çevre problemlerini günlük yaşam kararlarıyla ilişkilendirme işlendi.
- `test-daily-plan.js` 10/2 ve 11/2 haftalarını da kontrol edecek şekilde güncellendi.
- Doğrulama: `npm test` başarılı. Çıktı: seçim regresyonu geçti; Günlük Plan 10/1, 10/2, 11/1, 11/2, 11/3 hafta seçimi, 80 dk, kayıt, güvenli metin, yazdırma ve kapsam kontrolleri geçti; tüm modüller tüm ders/seviye kombinasyonlarında render edildi. Test ortamı yine font ve yerel CSS linklerini yükleyemediğini uyarı olarak yazdı; test çıkış kodu 0.
- Bu kayıt sırasında canlı yayın yapılmadı; PR açılmadı; canlı tarayıcı doğrulaması henüz yapılmadı.

---

## 29 Eylül 2026 — Günlük Plan genişletmesi canlı kabulü

- Canlı GitHub Pages sürümü gerçek tarayıcıyla açıldı: `https://aytigin-netizen.github.io/felsefe/`.
- Kapsam yalnız Günlük Plan canlı kullanıcı akışıydı; kod değiştirilmedi, commit/push yapılmadı, PR açılmadı ve yeni test/inceleme katmanı oluşturulmadı.
- Kontrol 1: Felsefe → 10. Sınıf → Günlük Plan. 1. hafta seçilebiliyor; `FEL.10.1.1 — Felsefenin anlamını, gelişim sürecini ve işlevini sorgulayabilme` görünüyor; plan `Dersin işlenişi — 80 dakika` başlığı altında 7 aşama gösteriyor.
- Kontrol 2: Felsefe → 11. Sınıf → Günlük Plan. 1. hafta seçilebiliyor; `FEL.11.1.1 — Çevre ile ilgili felsefi soru ve problemleri anlayabilme` görünüyor; plan 80 dakika / 7 aşama.
- Kontrol 3: Aynı 11. sınıf ekranında 3. haftaya geçildi. `FEL.11.1.2 — Çevre sorunlarıyla ilgili felsefi düşünce ortaya koyabilme` görünüyor; mevcut 3. hafta planı çalışıyor; plan 80 dakika / 7 aşama.
- Sonuç: **CANLI KABUL BAŞARILI**. Günlük Plan genişletme paketi kapatılabilir.
- Sıradaki ürün işi için önerilen dar kapsam: Günlük Plan içeriklerini Felsefe dışındaki derslere yaymadan önce Felsefe içinde 2. hafta kapsamını ya da mevcut 1/3. hafta içerik kalitesini kullanıcı örnekleriyle gözden geçirmek. Mantık ders saati kararı **72 saat** olarak korunur.

---

## 28 Eylül 2026 — PR #3 birleştirme ve canlı yayın tamamlandı

- Kullanıcı ana dala birleştirmeyi ve canlı yayını onayladı. PR #3, doğrulanan `61f4f267b5cd2b3384442ee2767601f3e7f8aae1` başına sabitlenerek squash birleştirildi. main kod commit'i: `f310b392322cb8be3fe47e9046229d30bb279125`.
- GitHub Pages build/deploy başarılı: https://github.com/aytigin-netizen/felsefe/actions/runs/36431686717 .
- Canlı HTTP kontrolünde index.html, js/modules/calisma-kagidi.js, js/modules/degerlendirme.js, js/sidebar.js ve data/mantik_veri_kaynagi.json dosyaları test edilen yerel dosyalarla bayt düzeyinde eşleşti. Mantık yıllık toplamı 72 saat olarak korundu.
- Bu kontrol gerçek tarayıcı etkileşimi veya mobil/baskı görsel kabulü değildir. Önceki oturumun npm test ve hedefli jsdom sonuçları geçerlidir; merge ağacı test edilen ağaçla aynıdır.
- Bu belge güncellemesi yalnız yayın/devir kaydıdır; uygulama kodunu değiştirmez. PR #3 kapanmıştır. Sıradaki ürün işi: Günlük Plan'ı yeni haftalara genişletmek; Mantık ünite dağılımındaki 4 saatin kaynakla eşlenmesi ayrı açık içerik işidir.

---

## 28 Eylül 2026 — PR #3 bölünmüş kod/metin onarımı

- Kullanıcı PR #3 düzeltmesini ve mevcut testlerle doğrulamayı istedi. Mantık yıllık ders saati kararı: **72 saat**; toplam 68'e indirilmeyecek. Ünitelerdeki 68 saat toplamının kalan 4 saati kaynak planla ayrıca eşlenecek; bu pakette veri dağılımı değiştirilmedi.
- Başlangıç: `fix/inceleme-duzeltmeleri` / `1438d0916f2813daadbfe5823c8cd04b98909b1c`. PR #3 üzerinde devam edildi.
- Çalışma kâğıdı, rubrik ve sidebar dosyalarındaki bölünmüş ifadeler, index.html kapanış etiketi ve DURUM.md içindeki bölünmüş tarihsel metinler onarıldı. PR'ın erişilebilirlik, tablo ve dinamik bölüm harfi değişiklikleri korundu. README'ye 72 saat kararı eklendi.
- Doğrulama: 14 JavaScript dosyasının sözdizimi kontrolü; npm test'in seçim regresyonu, günlük plan ve tüm ders/seviye modül render aşamaları geçti. Ek geçici jsdom kontrolünde 8 çalışma kâğıdı bölüm seçimi, yönerge, rubrik thead/tbody, boş ünite mesajı ve HTML kapanışı doğrulandı. git diff --check temiz.
- Test-run.js yerel HTTP sunucusu olmadan css/style.css yükleme uyarısı verdi; test çıkış kodu 0. Gerçek tarayıcı, mobil görünüm ve baskı sayfalaması bu oturumda kontrol edilmedi.
- Mantık JSON'u başlangıç commit'iyle birebir aynı; toplamDersSaatiYillik = 72 doğrulandı.
- Bu kayıt, onarım commit'iyle PR #3 dalına aktarılacak paketin parçasıdır; main birleştirmesi ve canlı yayın yapılmadı. Aktarım sonucu commit kaydından doğrulanmalıdır.
- Sıradaki iş: PR #3'ün düzeltilmiş paketini değerlendirmek; ardından Günlük Plan'ı yeni haftalara genişletmek. Henüz yeni hafta eklenmedi.

---

## 28 Eylül 2026 — İnceleme düzeltmeleri dalı (fix/inceleme-duzeltmeleri)

- GitHub App'e yazma yetkisi verildi; `fix/inceleme-duzeltmeleri` dalı `main` üzerinden açıldı. Bu dal, önceki oturumda yerelde hazırlanan ancak yazma yetkisi eksikliği nedeniyle push edilemeyen inceleme düzeltmelerini içerir.
- Rubrik tablosu thead/tbody yapısına çevrildi (js/modules/degerlendirme.js); başlık satırı `thead` içinde, ölçüt satırları `tbody` içinde.
- Sidebar "Yakında" öğeleri erişilemez `<a href="#">` yerine `<span class="sidebar-link yakinda" aria-disabled="true">` olarak render ediliyor (js/sidebar.js).
- Çalışma kâğıdı bölüm harfleri (A/B/C) sabitten çıkarıldı: dahil edilen bölümlere göre dinamik atanıyor; bölüm onay kutuları sabit harf etiketi içermiyor (js/modules/calisma-kagidi.js).
- Tüm 8 HTML sayfasına favicon (favicon.svg) ve sayfaya özgü meta description eklendi.
- README tamamen yeniden yazıldı: çok sayfalı yapı, modül tablosu, veri şeması ve doğrulama durumu eklendi; Mantık'taki bilinen 72/68 ders saati uyumsuzluğu notlandı.
- LICENSE (ISC) eklendi; package.json keywords ve author dolduruldu.
- npm test bu oturumda çalıştırılmadı; birleştirme öncesi yerelde çalıştırılması önerilir. Mobil/baskı görsel kontrolü de yapılmadı.

---

## 28 Eylül 2026 — PR #2 birleştirildi, önizleme temizlendi

- PR #2 squash merge ile `main`'e alındı: `3852bae` ("Günlük Plan: Anadolu Lisesi Felsefe 11 üçüncü hafta (#2)"). Merge, incelenen son commit `867ba17`'ye sabitlenerek yapıldı; PR merge öncesi taslaktan çıkarıldı.
- GitHub Pages `3852bae` için "built" durumuna geçti (hata yok). Canlı sayfaların içeriği bu kayıtta bağımsız olarak doğrulanmadı; ortam `github.io`'ya erişemiyor. Canlı kontrol: gunluk-plan.html, Felsefe → 11. Sınıf → Günlük Plan.
- Temizlik: `onizleme/pr-2/` (25 dosya, tam site kopyası) kaldırıldı. Kodda `onizleme` geçen diğer yerler (`kazanim-onizleme`, `rubrik-onizleme`, `calisma-kagidi-onizleme`) ayrı arayüz öğeleridir, dokunulmadı.
- Kalan: uzak dal `feat/daily-plan-pilot` silinmedi. Mobil/yazdırma incelemesi kullanıcı tarafından yapıldı; sonucu bu kayıtta yok.
- Sıradaki iş: Günlük Plan ikinci hafta; içeriğin `PILOT` nesnesinden veri dosyasına taşınması (öneri, karar değil). README hâlâ çok sayfalı yapıyı yansıtmıyor.

---

## 28 Eylül 2026 — PR #2 birleştirme öncesi inceleme ve test düzeltmesi

- Dal: feat/daily-plan-pilot (başlangıç `3d37ec6`). main o sırada `d6de318` idi (yalnız `onizleme/pr-2/` eklemişti); yerel deneme birleştirmesinde çakışma çıkmadı ve `npm test` üç aşamasıyla geçti.
- Değişiklik: `test-daily-plan.js` seviyeyi `data.seviyeler[1]` indeksiyle değil `etiket` ('10. Sınıf' / '11. Sınıf') ile buluyor; bulunamazsa test açıkça düşer. Seviye sırası ters çevrilmiş Felsefe verisiyle test yeniden çalıştırıldı, geçti. Uygulama kodu değişmedi.
- Yapılmadı: PR birleştirilmedi, yayın yapılmadı. Mobil görünüm ve yazdırma sayfalaması hâlâ gerçek ekranda kontrol edilmedi. MEB çalışma kitabındaki B6:G6 eşlemesi ve pedagojik içerik bu oturumda bağımsız doğrulanmadı; önceki kayda dayanır.
- Birleştirme sonrası yapılacaklar: `onizleme/pr-2/` klasörünün kaldırılması (tam site kopyası; Pages'te yayında kalır), yayın/deploy kaydının eklenmesi, canlı kontrol.
- Bekleyen tasarım borcu: günlük plan içeriği `gunluk-plan.js` içindeki `PILOT` nesnesinde; ikinci hafta/ders eklenmeden önce veri dosyasına taşınması değerlendirilmeli (öneri, karar değil).

---

## 28 Eylül 2026 — Anadolu Lisesi kapsam düzeltmesi

- Kullanıcı başlangıcın Anadolu Lisesi olmasını istedi. PR #2 / feat/daily-plan-pilot üzerinde uygulandı; önceki Fen Lisesi kapsamı geçersizdir.
- Görünür okul türü, açıklamalar, README ve yerel kayıt anahtarı AL olarak güncellendi. FL yıldızlı zenginleştirme uyarıları çıkarıldı; eski FL taslak kayıtları AL planına otomatik taşınmaz.
- Resmî kaynak: https://tymm.meb.gov.tr/assets/file/felsefe-dersi-taslak-yillik-planlar_20260827_123428_620.zip içindeki ANADOLU LİSESİ FELSEFE 10,11. SINIF TASLAK YILLIK PLAN çalışma kitabı.
- 11. SINIF, B6:G6: 3. hafta 28 Eylül–2 Ekim, 2 saat, Çevre Sorunları ve Felsefe, FEL.11.1.2 ve (a) argüman çözümleme. Uygulamadaki eşleme bu satırla örtüşüyor; çıktı ve süreyi değiştirmek gerekmedi. Kontrol yalnız bu haftayla sınırlıdır.
- Günlük plan davranış testi AL etiketi ve FL ifadelerinin yokluğunu da kontrol eder. Mevcut ekran/baskı görsel kontrolü eksikliği sürüyor.
- Ana dal ve canlı yayın değiştirilmedi. Bu not ve kod aynı PR güncellemesine dahildir.

---

## 28 Eylül 2026 — Günlük Plan ilk örneği

- Kullanıcı öneriyi onayladı ve devam edilmesini istedi. Başlangıç: main `5b57e4ca1c597b7c17819bf32d750179f9e5bfa3`.
- Dal: feat/daily-plan-pilot. Yeni sayfa/modül, ana sayfa kartı, yan menü, baskı stilleri ve davranış testi eklendi.
- Kapsam: Felsefe 11 / Fen Lisesi / 3. hafta / FEL.11.1.2(a). 2 × 40 dakika, düzenlenebilir öğretmen-öğrenci akışı, argüman kartları, değerlendirme, farklılaştırma, notlar ve imzalar. Diğer ders/sınıflarda örnek gösterilmez.
- Kaynak: kullanıcının felsefe-fl-11-3-hafta-gunluk-plan.docx örneği; https://tymm.meb.gov.tr/felsefe-dersi/unite/66 ve mevcut ders JSON'u. Etkinlikler öğretmen uyarlaması olarak etiketlendi; SDB ve OB karışıklığı taşınmadı.
- Sınır: FL yıldızlı zenginleştirme eşlemesi henüz tamamlanmadı. Bu paket bütün haftalar/dersler için üretici veya tam FL uyum onayı değildir.
- npm test: seçim regresyonu, günlük plan davranışları ve mevcut modül render testleri başarı çıktısı verdi. git diff --check temiz.
- Gerçek ekran kontrolü denendi; cloud browser yerel http://127.0.0.1:8765 adresini ERR_BLOCKED_BY_CLIENT ile açmadı. Mobil ekran ve baskı sayfalaması doğrulanmadı. Yazdırma düğmesinin çağrısı test edildi; görsel çıktı testi yapılmış sayılmaz.
- Kod inceleme dalına/taslak PR'a aktarılmak üzere hazırlandı; main ve canlı site bu geliştirmeyle değiştirilmedi. Uzak commit/PR sonucu oturum kapanışında bildirilir.
- Sıradaki iş: ilk örneğin içerik incelemesi ve erişilebilir önizlemede masaüstü/mobil/baskı kontrolü. Yeni dağıtım onayı verilmedi.

---

## 28 Eylül 2026 — Yayın tamamlandı

- Kullanıcı canlıya almayı onayladı. PR #1 squash merge edildi: `ed7e9a21ac2ef3a9f754fb4068e797ea8f376228`.
- GitHub Pages build/deploy başarılı: https://github.com/aytigin-netizen/felsefe/actions/runs/36350546852
- Canlı js/app.js SHA-256, test edilen dosyayla birebir eşleşti: `849ca7342db40724bf1ae0d59257c0e5fd75d22d2199dd315ce705a163cf13ae`.
- Gerçek canlı tarayıcı kontrolü: Psikoloji → Mantık seçimi sonrası Mantık yıllık planı açıldı. Felsefe sınıfsız seçiminde kartlar kapalı ve yan menüden girişte sınıf seçimi uyarısı korundu.
- Canlı ağ hızlı olduğundan yükleme aralığı zorlanmadı; gecikmiş/ters sıralı yanıt kontrollerinin kanıtı test-selection.js yerel regresyonudur.
- Kod canlıda; bu kayıt yalnız yayın/devir bilgisini günceller. Önceki 'henüz yayınlanmadı' ifadeleri tarihsel kayıttır.
- Yeni özellik başlatılmadı. Bekleyen ürün işleri: README eşitleme, Sosyoloji/Mantık kaynak karşılaştırması, Günlük Plan ve Sunum kapsamı.

---

## 28 Eylül 2026 — ChatGPT güncel kayıt

- Başlangıç: uzak main `ddd79824df04fb779921124a3e9b02e3983d720d`.
- Önceki kayıttaki `5298f7a push edilmedi` bilgisi artık geçersiz: commit main geçmişinde ve sınıfsız giriş düzeltmesi canlıda doğrulandı.
- Canlı kontrol: Felsefe/Sosyoloji için dört modülde sınıf seçimi uyarısı; yenilemede korunması; Psikoloji/Mantık otomatik seviye açılışı doğrulandı.
- Yeni sorun: ders değişiminde yükleme bitmeden modüle tıklanınca önceki ders açılabiliyordu.
- Düzeltme: js/app.js yükleme başında kayıtlı seçimi, eski sınıf seçeneklerini ve önizlemeyi temizler; kartları kapatır. İstek sırası kontrolü, gecikmiş yanıt/hataların güncel seçimi değiştirmesini önler.
- test-selection.js: kontrollü gecikmeyle kart kilidi, doğrudan modül girişi, ters yanıt sırası, eski hata, güncel hata ve seçim temizleme senaryoları geçti. npm test yeni testi ve mevcut dört modül render testini çalıştırır; ikisi de başarı çıktısı verdi.
- Yeni düzeltmenin gerçek tarayıcı/canlı testi henüz yapılmadı. Önceki canlı kontrol yeni düzeltmenin testi değildir.
- Çalışma dalı: fix/subject-loading-race. Bu kayıt, kod ve test aynı inceleme paketindedir; main birleştirmesi ve yayın henüz yapılmadı. Uzak aktarım/PR sonucu oturum sonunda ayrıca bildirilir.
- Sıradaki iş: bu paketin incelenmesi ve yayın sonrası ders değiştirme senaryosunun canlı doğrulanması.

---

## Önceki oturum kaydı (tarihsel)

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
