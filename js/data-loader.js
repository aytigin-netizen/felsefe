// data-loader.js
// Dört dersin kanonik veri kaynağını (data/*.json) yükler ve önbellekte tutar.
// Backend yok: her şey statik JSON dosyalarından fetch ile okunur.

const DataLoader = (() => {
  const cache = {};

  const SUBJECTS = {
    felsefe: { label: "Felsefe", file: "data/felsefe_veri_kaynagi.json" },
    sosyoloji: { label: "Sosyoloji", file: "data/sosyoloji_veri_kaynagi.json" },
    psikoloji: { label: "Psikoloji", file: "data/psikoloji_veri_kaynagi.json" },
    mantik: { label: "Mantık", file: "data/mantik_veri_kaynagi.json" },
  };

  function listSubjects() {
    return Object.entries(SUBJECTS).map(([code, meta]) => ({
      code,
      label: meta.label,
    }));
  }

  async function loadSubject(code) {
    if (cache[code]) return cache[code];

    const meta = SUBJECTS[code];
    if (!meta) {
      throw new Error(`Bilinmeyen ders kodu: "${code}"`);
    }

    let response;
    try {
      response = await fetch(meta.file);
    } catch (err) {
      throw new Error(
        `${meta.label} verisi yüklenirken ağ hatası oluştu: ${err.message}`
      );
    }
    if (!response.ok) {
      throw new Error(
        `${meta.label} verisi yüklenemedi (HTTP ${response.status}). ` +
          `"${meta.file}" dosyasının index.html ile aynı klasör yapısında olduğundan emin olun.`
      );
    }

    const data = await response.json();
    cache[code] = data;
    return data;
  }

  // Bir ders içindeki tüm seviyeleri (10.sınıf, 11.sınıf, Ders 1/Ders 2 vb.) döner.
  function getSeviyeler(subjectData) {
    return subjectData.seviyeler || [];
  }

  // Belirli bir seviyenin çerçeve plan durumunu döner (true/false).
  function cercevePlanVarMi(seviye) {
    return Boolean(seviye && seviye.cercevePlanMevcut);
  }

  // Bir seviye içindeki tüm öğrenme çıktılarını (ünite bilgisiyle birlikte) düz bir listeye çevirir.
  function tumOgrenmeCiktilari(seviye) {
    const sonuc = [];
    for (const unite of seviye.uniteler || []) {
      for (const cikti of unite.ogrenmeCiktilari || []) {
        sonuc.push({ ...cikti, uniteAdi: unite.uniteAdi, uniteNo: unite.uniteNo });
      }
    }
    return sonuc;
  }

  // Bir seviyenin tüm haftalık plan satırlarını (ünite ve kazanım bilgisiyle) düz bir
  // listeye çevirir. Veri kaynağında satırlar zaten kronolojik sırada olduğu için
  // burada yeniden sıralama yapılmaz.
  function tumHaftalikSatirlar(seviye) {
    const sonuc = [];
    for (const unite of seviye.uniteler || []) {
      for (const cikti of unite.ogrenmeCiktilari || []) {
        for (const hafta of cikti.haftalikDagilim || []) {
          sonuc.push({
            ...hafta,
            kazanimKodu: cikti.kod,
            kazanimBaslik: cikti.baslik,
            uniteNo: unite.uniteNo,
            uniteAdi: unite.uniteAdi,
          });
        }
      }
    }
    return sonuc;
  }

  // Bir seviyenin üniteler listesini döner (Ünite Planı gibi ünite bazlı
  // çalışan modüller için).
  function getUniteler(seviye) {
    return (seviye && seviye.uniteler) || [];
  }

  // Bir seviyedeki GERÇEK planlı hafta sayısını döner. tumHaftalikSatirlar()
  // bazı haftalarda (aynı haftaya iki öğrenme çıktısı bölündüğünde) birden
  // fazla satır üretir; bu yüzden satır sayısı hafta sayısına eşit değildir.
  // Burada "hafta" alanı tekilleştirilerek gerçek hafta sayısı hesaplanır.
  function planliHaftaSayisi(seviye) {
    const haftalar = new Set();
    for (const unite of seviye.uniteler || []) {
      for (const cikti of unite.ogrenmeCiktilari || []) {
        for (const hafta of cikti.haftalikDagilim || []) {
          if (hafta.hafta) haftalar.add(hafta.hafta);
        }
      }
    }
    return haftalar.size;
  }

  function clearCache() {
    Object.keys(cache).forEach((k) => delete cache[k]);
  }

  return {
    SUBJECTS,
    listSubjects,
    loadSubject,
    getSeviyeler,
    cercevePlanVarMi,
    tumOgrenmeCiktilari,
    tumHaftalikSatirlar,
    getUniteler,
    planliHaftaSayisi,
    clearCache,
  };
})();
