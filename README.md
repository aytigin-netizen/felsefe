# Sosyal Bilimler Öğretmen Araçları

Felsefe, Sosyoloji, Psikoloji ve Mantık öğretmenleri için içerik-üretim araçları.
Tek dosya/localStorage mantığıyla çalışan, backend'i olmayan bir statik site —
FOPOS'tan bağımsız, ayrı bir proje.

## Dosya yapısı

```
index.html              Ana sayfa: ders/seviye seçimi + modül menüsü
css/style.css            Tüm stiller (erişilebilirlik, karanlık mod, reduced-motion destekli)
js/data-loader.js        Veri yükleme katmanı: data/*.json dosyalarını fetch eder, önbelleğe alır
js/app.js                Menü/seçim mantığı, modül grid'i, kazanım önizleme
js/modules/               Çıktı üreticileri buraya eklenecek (henüz boş)
data/*_veri_kaynagi.json  Her ders için kanonik veri (kazanım + haftalık plan birleşik)
docs/                     Ek notlar
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
      toplamDersSaatiYillik, toplamOgrenmeCiktisiSayisi,
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
2026-2027 çerçeve yıllık planları. Kazanım kodları/metinleri iki bağımsız MEB
kaynağından çapraz doğrulanmıştır.

**Henüz dahil edilmedi:** eğilimler, sosyal-duygusal öğrenme becerileri, değerler,
okuryazarlık becerileri, farklılaştırma (zenginleştirme/destekleme) ve örnek
etkinlik metinleri. Bunlar ihtiyaç oldukça aynı şemaya eklenecek.

**Sosyoloji Dersi 2 (12. sınıf)** için resmi çerçeve yıllık plan henüz
yayımlanmadığından `cercevePlanMevcut: false` — Yıllık Plan modülü bu seviyede
devre dışı, diğer modüller etkilenmez.

## Şu ana kadar yapılanlar

- [x] Veri katmanı: kazanım + yıllık plan verisi birleştirildi, doğrulandı
- [x] Site iskeleti: dosya yapısı, veri yükleme katmanı, menü, modül grid'i
- [ ] Modüller: Ünite Planı, Çalışma Kâğıdı, Değerlendirme/Rubrik, Sunum,
      Zümre Tutanağı, Yıllık Plan — henüz yazılmadı

## Yayına alma

Statik dosyalardır; Netlify (ya da benzeri) üzerinde ek yapılandırma
gerektirmeden yayınlanabilir. `index.html` giriş noktasıdır.
