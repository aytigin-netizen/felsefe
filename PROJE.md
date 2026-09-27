# Proje ve ortak çalışma kuralları

Son güncelleme: 27 Eylül 2026 (Europe/Istanbul).

## Amaç ve kapsam

Felsefe, sosyoloji, psikoloji ve mantık öğretmenlerinin ders materyallerini hazırlamasını kolaylaştıran Türkçe web uygulaması.
Önce küçük bir öğretmen grubuyla kullanılacak; ileride daha geniş öğretmen kitlesine ulaşması hedefleniyor.
Kullanıcının öncelikli ürünleri yıllık plan, günlük plan ve sunumdur. Düşük maliyet ve kolay bakım önemlidir.
Bu depo FOPOS/OPUS'tan bağımsızdır; o projelerin süreçleri ve onay protokolleri buraya kendiliğinden taşınmaz.

Depo: https://github.com/aytigin-netizen/felsefe
Mevcut ürün adı: Sosyal Bilimler Öğretmen Araçları; arayüzde Çalışma Masası adı da kullanılıyor.

## Mevcut teknik temel

- HTML, CSS, JavaScript ve JSON kullanan çok sayfalı statik site.
- Her modül ayrı HTML sayfasında; ortak gezinme js/sidebar.js üzerinden.
- Ders/sınıf seçimi js/state.js, veri yükleme js/data-loader.js üzerinden.
- Ders verileri data/*_veri_kaynagi.json dosyalarında; ortak üreticiler js/modules/ altında.
- Tercihler ve notlar localStorage ile aynı tarayıcıda saklanır; cihazlar arası eşitleme yoktur.
- package.json içindeki jsdom geliştirme/test bağımlılığıdır; backend değildir.
- Güncel dağıtım kaydı GitHub Pages kullanıldığını gösterir.

## ChatGPT ve Claude ile çalışma

1. Oturum başında bu dosyayı, DURUM.md ve DEVIR.md dosyalarını oku; uzak dalın güncel koduyla karşılaştır.
2. Aynı anda yalnız bir asistan kod değiştirsin. Diğer asistanın değişikliklerini silme veya eski sürümle değiştirme.
3. Küçük, tamamlanabilir görevlerle ilerle. Kullanıcının güncel talebi çalışma kapsamını belirler.
4. Mevcut yetki kapsamında rutin adımları sürdür; bu belgelerdeki önerileri yeni özellik, yayın veya veri değişikliği için otomatik izin sayma.
5. Her anlamlı iş parçasından sonra durum/devir notlarını güncelle. Değişiklikler yalnız sohbet ya da geçici ortamda kalmasın.
6. Yerel, commit edilmiş, uzak depoya aktarılmış ve yayınlanmış durumları ayrı yaz. Dalı ve ilgili commit'i belirt.
7. Devir belgelerinde gizli anahtar, parola, öğrenci bilgisi veya başka kişisel veri bulundurma.
8. Çakışma varsa güncel kodu ve kullanıcı talebini esas al; çelişkiyi açıkça kaydet. Devir notlarını körü körüne uygulama.

## İçerik ve tasarım ilkeleri

- Güncel öğretim programı ve kullanılan yıllık planın kaynağı açık olsun.
- Resmî program, taslak çerçeve plan, okulun uygulanmış planı ve öğretmen uyarlaması birbirinden ayırt edilsin.
- Öğrenme çıktısı kodlarını/metinlerini ve ders saatlerini tahminle değiştirme; kaynak ve gerekçe belirt.
- Tasarımda okunabilirlik, telefon/tablet kullanımı, açık seçim durumu ve temiz belge çıktıları önceliklidir.
- Mevcut sade yapıyı koru; yeni altyapı veya kapsam genişlemesini ihtiyaç ve kullanıcı kararıyla gerekçelendir.
- Yeni tasarım fikirleri kullanıcı tarafından kabul edilene kadar öneridir.

## Doğrulama ve raporlama

Kod değişikliğinde ilgili davranışı kontrol et; gerektiğinde mevcut npm test komutunu çalıştır.
Bu test modül render hatalarını arar; mobil görünüm, sayfalar arası gezinme, yazdırma ve pedagojik doğruluğun kanıtı değildir.
Görsel değişikliklerde ilgili masaüstü/mobil ekranı ve gerekiyorsa baskıyı kontrol et.
Çalıştırılmayan testleri veya açılmayan ekranları başarılı olarak raporlama.
Dokümantasyon değişikliğinde içerik ve kaydedilen dosyaları kontrol etmek yeterlidir.
