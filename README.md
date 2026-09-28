# Sosyal Bilimler Öğretmen Araçları

Felsefe, Sosyoloji, Psikoloji ve Mantık öğretmenleri için içerik-üretim araçları.
Ortak menülü, çok sayfalı ve localStorage kullanan, backend'i olmayan bir statik site —
FOPOS'tan bağımsız, ayrı bir proje.

Canlı site: <https://aytigin-netizen.github.io/felsefe/>

## Modüller

| Modül | Durum | Ne yapar |
| --- | --- | --- |
| Yıllık Plan | ✅ | Seçili ders/seviye için haftalık dağılımlı, yazdırılabilir yıllık plan |
| Günlük Plan | ✅ (ilk örnek) | Felsefe 11. sınıf, Anadolu Lisesi, 3. hafta örneği; düzenlenebilir akış |
| Ünite Planı | ✅ | Ünite bazlı öğrenme çıktısı kartları + öğretmen notları |
| Çalışma Kâğıdı | ✅ | Kazanımdan seçmeli bölümlü, yazdırılabilir çalışma kâğıdı |
| Değerlendirme / Rubrik | ✅ | 4 seviyeli, düzenlenebilir rubrik |
| Sunum | 🚧 | Geliştirme aşamasında |
| Zümre Tutanağı | 🚧 | Geliştirme aşamasında |

## Dosya yapısı

```
index.html                Ana sayfa: ders/seviye seçimi + modül menüsü
yillik-plan.html          Yıllık Plan modülü
gunluk-plan.html          Günlük Plan modülü
unite-plani.html          Ünite Planı modülü
calisma-kagidi.html       Çalışma Kâğıdı modülü
degerlendirme.html        Değerlendirme / Rubrik modülü
sunum.html                Sunum (yakında)
zumre-tutanagi.html       Zümre Tutanağı (yakında)
favicon.svg               Site simgesi
css/style.css             Tüm stiller (erişilebilirlik, karanlık mod, reduced-motion destekli)
js/state.js               Ders/seviye seçiminin localStorage tabanlı durumu
js/data-loader.js         Veri yükleme katmanı: data/*.json dosyalarını fetch eder, önbelleğe alır
js/sidebar.js             Her sayfada ortak yan menü
js/belge-bilgisi.js       Okul/Öğretmen/Eğitim Yılı üst bilgisi + imza alanı
js/app.js                 Ana sayfa: menü/seçim mantığı, modül grid'i, kazanım önizleme
js/module-page.js         Modül sayfalarının ortak yükleme mantığı
js/modules/               Çıktı üreticileri: yillik-plan.js, gunluk-plan.js, unite-plani.js,
                          calisma-kagidi.js, degerlendirme.js
data/*_veri_kaynagi.json  Her ders için kanonik veri (kazanım + haftalık plan birleşik)
test-selection.js         Ders/seviye seçim davranışı regresyon testi
test-daily-plan.js        Günlük plan davranış testi
test-run.js               jsdom ile tüm modülleri her ders/seviye kombinasyonunda render edip
                          hata arayan basit regresyon testi (npm test)
```

## Veri şeması

Her `data/<ders>_veri_kaynagi.json` dosyası şu yapıdadır:

```
{
  dersAdi, kodPrefix, surumTarihi,
  seviyeler: [
    {
      etiket,                     // "10. Sınıf", "Sosyoloji Dersi 1 (11. Sınıf)" vb.
      cercevePlanMevcut,          // false ise Yıllık Plan modülü bu seviye için kapalı
      tatiller: [...],
      toplamDersSaatiYillik,      // sayı, veya kaynak taslakta net toplam yoksa null
      toplamOgrenmeCiktisiSayisi,
      ozelPlanlamaHaftalari: [ { ay, hafta, tur } ],  // Okul Temelli Planlama / Sosyal Etkinlik
      uniteler: [
        {
          uniteNo, uniteAdi, dersSaati,
          ogrenmeCiktilari: [
            {
              kod, baslik, surec_bilesenleri: [...],
              icerik_cercevesi: [...], anahtar_kavramlar: [...],
              haftalikDagilim: [ { ay, hafta, dersSaati, surecBileseniIsaretlenen, belirliGunHafta } ]
            }
          ]
        }
      ]
    }
  ]
}
```

Kaynak: MEB Türkiye Yüzyılı Maarif Modeli 2026 resmi öğretim programları +
2026-2027 çerçeve yıllık planları (taslak). Kazanım kodları/metinleri iki
bağımsız MEB kaynağından çapraz doğrulanmıştır.

**Henüz dahil edilmedi:** eğilimler, sosyal-duygusal öğrenme becerileri, değerler,
okuryazarlık becerileri, farklılaştırma (zenginleştirme/destekleme) ve örnek
etkinlik metinleri. Bunlar ihtiyaç oldukça aynı şemaya eklenecek.

## Veri doğrulama durumu ve bilinen uyumsuzluklar

- **Felsefe 10/11 ve Psikoloji:** kaynak taslak planda gerçekten boş olan haftalar,
  Ankara Kız Anadolu İmam Hatip Lisesi'nin 2026-2027 uygulanmış ünitelendirilmiş
  yıllık planlarıyla satır satır karşılaştırılarak **2 ders saati** olarak dolduruldu.
  Üç seviye de artık net ve tutarlı bir yıllık toplama sahip: **68 ders saati**
  (34 hafta × 2 saat).
- **Sosyoloji Dersi 2 (12. sınıf):** resmi çerçeve yıllık plan henüz yayımlanmadığından
  `cercevePlanMevcut: false` — Yıllık Plan modülü bu seviyede devre dışı, diğer
  modüller etkilenmez.
- **⚠️ Mantık — bilinen 72/68 uyumsuzluğu:** `mantik_veri_kaynagi.json` dosyasında
  `toplamDersSaatiYillik: 72` yazılıdır; ancak ünitelerin `dersSaati` alanları toplamı
  **68**'dir (10 + 16 + 16 + 26). Bu 4 saatlik fark henüz çözülmedi: kaynak taslak
  plandaki toplam mı, ünite dağılımı mı doğru bilinmiyor. Mantık verisi için de
  Felsefe/Psikoloji'deki gibi satır satır kaynak karşılaştırması henüz yapılmadı.
  Yıllık plan modülü bu uyumsuzluk nedeniyle Mantık'ta hafta/saat tutarlılık uyarısı
  gösterebilir; veri düzeltilene kadar bilinen bir durumdur.

## Veri saklama

Ünite notları, çalışma kâğıdı/rubrik seçenekleri, rubrik seviye açıklamaları ve
okul/öğretmen/eğitim yılı üst bilgisi yalnızca kullanılan tarayıcının
`localStorage`'ında saklanır. Farklı bir tarayıcı veya cihazdan girildiğinde bu
bilgiler görünmez; paylaşılan bir hesap/backend yoktur (proje kararı böyle).

## Test ve yayına alma

```bash
npm install && npm test
```

Statik dosyalardır; GitHub Pages ya da Netlify gibi herhangi bir statik yayın
ortamında ek yapılandırma gerektirmeden çalışır. `index.html` giriş noktasıdır.
Yayınlamadan önce `npm test` ile regresyon testini çalıştırmak önerilir.

## Geliştirme durumu

- [x] Veri katmanı: kazanım + yıllık plan verisi birleştirildi, doğrulandı
- [x] Yıllık Plan, Ünite Planı, Çalışma Kâğıdı, Değerlendirme/Rubrik modülleri
- [x] Günlük Plan ilk örneği (Felsefe 11 — Anadolu Lisesi, 3. hafta)
- [x] Temel regresyon testleri (`npm test`)
- [ ] Sunum, Zümre Tutanağı modülleri
- [ ] Word/PowerPoint çıktısı — şu an yalnızca tarayıcı üzerinden yazdır/PDF var
- [ ] Çalışma kâğıdı ve rubrik içerikleri genel şablon düzeyinde; konuya özgü
      örnek/görev metinleri zamanla eklenecek
- [ ] Mantık 72/68 ders saati uyumsuzluğunun kaynakla çözülmesi
- [ ] Sosyoloji ve Mantık verilerinin satır satır kaynak karşılaştırması

## Lisans

[ISC](LICENSE) © 2026 Aytekin YILMAZ
