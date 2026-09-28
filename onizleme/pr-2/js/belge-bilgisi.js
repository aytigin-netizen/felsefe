// js/belge-bilgisi.js
// Yazdırılabilir belgelerde (Yıllık Plan, Ünite Planı, Çalışma Kâğıdı, Rubrik)
// ortak kullanılan okul/öğretmen/eğitim yılı üst bilgisi ve imza alanı.
// Tek yerde tutulur; tüm modüller aynı localStorage anahtarından okur/yazar,
// böylece bir modülde girilen okul/öğretmen bilgisi diğerlerinde de görünür.

const BelgeBilgisiModule = (() => {
  const DEPO_ANAHTARI = "preview-pr2-cds-belge-bilgisi:v1";

  const ALANLAR = [
    { anahtar: "okul", etiket: "Okul" },
    { anahtar: "ogretmen", etiket: "Öğretmen" },
    { anahtar: "egitimYili", etiket: "Eğitim Yılı" },
  ];

  function depoyuOku() {
    try {
      return JSON.parse(localStorage.getItem(DEPO_ANAHTARI) || "{}");
    } catch {
      return {};
    }
  }

  function depoyaYaz(veri) {
    try {
      localStorage.setItem(DEPO_ANAHTARI, JSON.stringify(veri));
    } catch {
      /* localStorage kullanılamıyorsa sessizce yoksay */
    }
  }

  // Okul/Öğretmen/Eğitim Yılı alanlarını (düzenlenebilir) ve isteğe bağlı
  // olarak sabit bir sınıf/ders düzeyi etiketini içeren üst bilgi satırı
  // oluşturur. Değerler tüm modüller arasında ortak olarak saklanır.
  function ustBilgiOlustur(seviyeEtiketi) {
    const depo = depoyuOku();
    const kutu = document.createElement("div");
    kutu.className = "belge-ust-bilgi";

    for (const { anahtar, etiket } of ALANLAR) {
      const alan = document.createElement("div");
      alan.className = "belge-alan";

      const label = document.createElement("span");
      label.className = "belge-alan-etiket";
      label.textContent = etiket + ":";
      alan.appendChild(label);

      const deger = document.createElement("span");
      deger.className = "belge-alan-deger";
      deger.contentEditable = "true";
      deger.setAttribute("role", "textbox");
      deger.setAttribute("aria-label", etiket);
      deger.textContent = depo[anahtar] || "";
      deger.addEventListener("input", () => {
        const guncelDepo = depoyuOku();
        guncelDepo[anahtar] = deger.textContent;
        depoyaYaz(guncelDepo);
      });
      alan.appendChild(deger);

      kutu.appendChild(alan);
    }

    if (seviyeEtiketi) {
      const alan = document.createElement("div");
      alan.className = "belge-alan";
      const label = document.createElement("span");
      label.className = "belge-alan-etiket";
      label.textContent = "Sınıf / Ders Düzeyi:";
      alan.appendChild(label);
      const sabit = document.createElement("span");
      sabit.className = "belge-alan-sabit";
      sabit.textContent = seviyeEtiketi;
      alan.appendChild(sabit);
      kutu.appendChild(alan);
    }

    return kutu;
  }

  // Yazdırılan belgenin altına imza satırı/satırları ekler.
  function imzaAlaniOlustur(etiketler) {
    const satir = document.createElement("div");
    satir.className = "imza-alani";
    for (const etiket of etiketler || ["Öğretmen İmza"]) {
      const kutu = document.createElement("div");
      kutu.className = "imza-kutusu";
      const cizgi = document.createElement("div");
      cizgi.className = "yazi-cizgisi";
      kutu.appendChild(cizgi);
      const label = document.createElement("span");
      label.className = "imza-etiket";
      label.textContent = etiket;
      kutu.appendChild(label);
      satir.appendChild(kutu);
    }
    return satir;
  }

  return { ustBilgiOlustur, imzaAlaniOlustur };
})();
