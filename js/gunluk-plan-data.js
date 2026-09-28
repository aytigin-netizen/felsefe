// İçerik paketleri ders/sınıf bazında yüklenir; metinler JSON dosyalarındadır.
const GunlukPlanData = (() => {
  const katalog = [
    { ders: 'Felsefe', seviye: '10. Sınıf', dosya: 'data/gunluk-plan/felsefe-10.json', varsayilan: 'fel-10-al-2026-h1' },
    // Önceki kullanıcıların üçüncü hafta görünümü ve kayıt anahtarı korunur.
    { ders: 'Felsefe', seviye: '11. Sınıf', dosya: 'data/gunluk-plan/felsefe-11.json', varsayilan: 'fel-11-al-2026-h3' },
  ];
  async function yukle(ders, seviye) {
    const kayit = katalog.find(k => k.ders === ders && k.seviye === seviye);
    if (!kayit) return { paketler: [], varsayilan: null };
    const response = await fetch(kayit.dosya);
    if (!response.ok) throw new Error('Günlük plan içerikleri yüklenemedi. Sayfayı yenileyerek tekrar deneyin.');
    const paketler = await response.json();
    if (!Array.isArray(paketler) || !paketler.length || new Set(paketler.map(p => p?.id)).size !== paketler.length || paketler.some(p =>
      !p || typeof p.id !== 'string' || p.ders !== ders || p.seviye !== seviye ||
      typeof p.kod !== 'string' || typeof p.hafta !== 'string' ||
      !Array.isArray(p.alanlar) || !Array.isArray(p.akis) || !p.akis.length ||
      !Array.isArray(p.kaynaklar) || !Number.isInteger(p.haftaNo) ||
      !Number.isInteger(p.dersSayisi) || p.dersSayisi <= 0 || !Number.isInteger(p.dersDakika) || p.dersDakika <= 0 ||
      p.alanlar.some(a => !Array.isArray(a) || a.length !== 3 || a.some(v => typeof v !== 'string')) ||
      p.akis.some(a => !Array.isArray(a) || a.length !== 5 || !Number.isFinite(a[0]) || a[0] <= 0 || a.slice(1).some(v => typeof v !== 'string')) ||
      p.akis.reduce((sum, a) => sum + a[0], 0) !== p.dersSayisi * p.dersDakika
    )) throw new Error('Günlük plan içerik dosyası geçersiz. Plan gösterilemedi.');
    return { paketler, varsayilan: kayit.varsayilan };
  }
  return { yukle };
})();
