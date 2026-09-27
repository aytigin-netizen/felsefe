# Sosyal Bilimler Öğretmen Araçları

Felsefe, Sosyoloji, Psikoloji ve Mantık öğretmenleri için içerik-üretim araçları.
Tek dosya/localStorage mantığıyla çalışan, backend'i olmayan bir statik site —
FOPOS'tan bağımsız, ayrı bir proje.

## Dosya yapısı

```
index.html                Ana sayfa: ders/seviye seçimi + modül menüsü
css/style.css              Tüm stiller (erişilebilirlik, karanlık mod, reduced-motion destekli)
js/data-loader.js          Veri yükleme katmanı: data/*.json dosyalarını fetch eder, önbelleğe alır
js/belge-bilgisi.js        Okul/Öğretmen/Eğitim Yılı üst bilgisi + imza alanı (tüm modüllerde ortak)
js/app.js                  Menü/seçim mantığı, modül grid'i, kazanım önizleme
js/modules/                Çıktı üreticileri: yillik-plan.js, unite-plani.js, calisma-kagidi.js, degerlendirme.js
data/*_veri_kaynagi.json   Her ders için kanonik veri (kazanım + haftalık plan birleşik)
test-run.js                jsdom ile tüm modülleri her ders/seviye kombinasyonunda render edip hata arayan basit regresyon testi (`npm test`)
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
      ozelPlanlamaHaftalari: [ { ay, hafta, tur } ],  // Okul Temelli Planlama / Sosyal Etkinlik — kazanıma bağlı değil
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

**Doğrulanmış veri notu (Felsefe 11. Sınıf ve Psikoloji):** Yüklenen resmî
"taslak" çerçeve yıllık plan xlsx dosyalarıyla satır satır karşılaştırıldı.
Felsefe 11'de 8, Psikoloji'de 7 haftanın `dersSaati` alanı **kaynağın kendisinde
de boş** — aktarım sırasında oluşmuş bir hata değil, taslağın tamamlanmamış
kısımları. Bu yüzden bu iki seviyede `toplamDersSaatiYillik: null` — tek bir
resmî yıllık toplam yok; Yıllık Plan modülü bunun yerine kaynakta sayısı
belirtilmiş haftaların toplamını ve hangi haftaların boş bırakıldığını
gösterir. Felsefe 10. Sınıf'ta tüm haftalar doludur ve doğrulanmış toplam 68
saattir (önceki sürümde hatalı biçimde 72 yazıyordu). Üç dersin üçünde de
(Felsefe 10, Felsefe 11, Psikoloji) çerçeve planda kazanıma bağlı olmayan 3
hafta (2× Okul Temelli Planlama, 1× Sosyal Etkinlik) var; bunlar
`ozelPlanlamaHaftalari` alanında ayrıca tutuluyor ve ders saati toplamlarına
dahil edilmiyor. Sosyoloji ve Mantık için aynı satır satır doğrulama henüz
yapılmadı (kaynak xlsx dosyaları bu depoda yeniden karşılaştırılmadı).

**Sosyoloji Dersi 2 (12. sınıf)** için resmi çerçeve yıllık plan henüz
yayımlanmadığından `cercevePlanMevcut: false` — Yıllık Plan modülü bu seviyede
devre dışı, diğer modüller etkilenmez.

## Veri saklama

Ünite notları, çalışma kâğıdı/rubrik seçenekleri, rubrik seviye açıklamaları ve
okul/öğretmen/eğitim yılı üst bilgisi yalnızca kullanılan tarayıcının
`localStorage`'ında saklanır. Farklı bir tarayıcı veya cihazdan girildiğinde bu
bilgiler görünmez; paylaşılan bir hesap/backend yoktur (proje kararı böyle).

## Şu ana kadar yapılanlar

- [x] Veri katmanı: kazanım + yıllık plan verisi birleştirildi, doğrulandı
- [x] Site iskeleti: dosya yapısı, veri yükleme katmanı, menü, modül grid'i
- [x] Yıllık Plan modülü (`js/modules/yillik-plan.js`) — dersten bağımsız,
      tamamen veri güdümlü; haftalık dağılımı ve tatilleri tablo hâlinde
      gösterir, hafta sayısı/ders saati tutarlılığını kontrol edip uyarır,
      okul/öğretmen/imza alanları içerir, yazdırma/PDF çıktısı destekler
- [x] Ünite Planı modülü (`js/modules/unite-plani.js`) — ünite bazlı öğrenme
      çıktısı kartları, öğretmen notları (localStorage), yazdırma
- [x] Çalışma Kâğıdı modülü (`js/modules/calisma-kagidi.js`) — kavram, içerik
      çerçevesi ve süreç bileşenlerinden seçmeli bölümlerle soru üretir
- [x] Değerlendirme/Rubrik modülü (`js/modules/degerlendirme.js`) — 4 seviyeli,
      düzenlenebilir (localStorage'a kaydedilen) rubrik üretir
- [x] Temel regresyon testi (`test-run.js`, `npm test`) — dört dersin tüm
      seviyelerinde dört modülü de hatasız render ettiğini doğrular
- [ ] Sunum, Zümre Tutanağı — henüz yazılmadı
- [ ] Word/PowerPoint çıktısı — şu an yalnızca tarayıcı üzerinden yazdır/PDF var
- [ ] Çalışma kâğıdı ve rubrik içerikleri hâlâ genel şablon düzeyinde; konuya
      özgü örnek/görev metinleri zamanla eklenecek

## Yayına alma

Statik dosyalardır; Netlify (ya da benzeri) üzerinde ek yapılandırma
gerektirmeden yayınlanabilir. `index.html` giriş noktasıdır. Yayınlamadan önce
`npm install && npm test` ile regresyon testini çalıştırmak, modüllerden
birinde veri şemasıyla uyuşmayan bir hata olup olmadığını hızlıca gösterir.
