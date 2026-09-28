// js/modules/degerlendirme.js
// Değerlendirme / Rubrik modülü: seçili ders/seviye içinden bir ünite ve o ünitenin
// bir öğrenme çıktısı seçilir; anahtar kavramlar, içerik çerçevesi ve süreç
// bileşenlerinden ölçüt satırları türetilip 4 seviyeli (Başlangıç / Gelişmekte /
// Yeterli / İleri Düzey) yazdırılabilir bir rubrik üretilir. Diğer modüllerde
// olduğu gibi derse özel mantık içermez; tamamen DataLoader'ın döndürdüğü
// kanonik veriye göre çalışır. Seviye açıklamaları öğretmen tarafından
// düzenlenebilir (contenteditable) ve localStorage'a kaydedilir.
const DegerlendirmeModule = (() => {
  const DEPO_ANAHTARI = "preview-pr2-felsefe-site:rubrik-notlari:v1";

  const SEVIYELER = [
    { anahtar: "1", etiket: "Başlangıç Düzeyi" },
    { anahtar: "2", etiket: "Gelişmekte" },
    { anahtar: "3", etiket: "Yeterli" },
    { anahtar: "4", etiket: "İleri Düzey" },
  ];

  // Ölçüt kaynağına (kavram / içerik / süreç) göre biraz farklılaşan
  // varsayılan seviye açıklamaları; her satır aynı dört cümleyi tekrar etmek
  // yerine ölçütün türüne uygun bir ifadeyle başlar. Öğretmen yine de her
  // hücreyi doğrudan düzenleyebilir.
  const VARSAYILAN_ACIKLAMA = {
    kavramlar: {
      1: "Kavramı tanımlayamaz veya tanımında temel bir hata vardır.",
      2: "Kavramı kısmen doğru ama eksik ya da yüzeysel tanımlar.",
      3: "Kavramı doğru ve tutarlı tanımlar, bir örnekle destekler.",
      4: "Kavramı özgün örneklerle açıklar, ilişkili diğer kavramlarla bağlantı kurar.",
    },
    icerik: {
      1: "Konuyla ilgili görüş bildirmez veya temel düzeyde hata içeren bir görüş bildirir.",
      2: "Konuyla ilgili kısmen doğru ama eksik ya da yüzeysel bir görüş bildirir.",
      3: "Konuyla ilgili doğru ve tutarlı bir görüş bildirir, gerekçelendirir.",
      4: "Konuyu derinlemesine değerlendirir, farklı bakış açılarını karşılaştırarak özgün bir görüş oluşturur.",
    },
    surec: {
      1: "İfadeyi açıklayamaz veya temel düzeyde hata içeren biçimde açıklar.",
      2: "İfadeyi kısmen doğru ama eksik ya da yüzeysel biçimde açıklar.",
      3: "İfadeyi doğru ve tutarlı biçimde açıklar, bir örnekle destekler.",
      4: "İfadeyi derinlemesine analiz eder, farklı bakış açılarıyla ilişkilendirir ve özgün örneklerle destekler.",
    },
  };
  const GENEL_VARSAYILAN_ACIKLAMA = VARSAYILAN_ACIKLAMA.surec;

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

  function olcutAnahtari(subjectData, seviye, cikti, kaynak, index) {
    return [subjectData.dersAdi, seviye.etiket, cikti.kod, kaynak, index].join("|");
  }

  function hucreMetniOku(depo, hucreKey, seviyeNo, kaynak) {
    const kayit = depo[hucreKey];
    if (kayit && typeof kayit[seviyeNo] === "string") return kayit[seviyeNo];
    const acaklamaSeti = VARSAYILAN_ACIKLAMA[kaynak] || GENEL_VARSAYILAN_ACIKLAMA;
    return acaklamaSeti[seviyeNo];
  }

  function ogrenciBilgiAlaniOlustur() {
    const satir = document.createElement("div");
    satir.className = "dg-ogrenci-bilgi";
    for (const etiket of ["Ad Soyad", "Sınıf / No", "Tarih", "Toplam Puan"]) {
      const alan = document.createElement("div");
      alan.className = "dg-alan";
      const span = document.createElement("span");
      span.className = "dg-alan-etiket";
      span.textContent = etiket;
      alan.appendChild(span);
      const cizgi = document.createElement("div");
      cizgi.className = "yazi-cizgisi";
      alan.appendChild(cizgi);
      satir.appendChild(alan);
    }
    return satir;
  }

  function olcutSatiriOlustur(depo, subjectData, seviye, cikti, kaynak, baslikMetni, index) {
    const satir = document.createElement("tr");

    const baslikHucre = document.createElement("th");
    baslikHucre.scope = "row";
    baslikHucre.className = "dg-olcut-baslik";
    baslikHucre.textContent = baslikMetni;
    satir.appendChild(baslikHucre);

    for (const sv of SEVIYELER) {
      const hucre = document.createElement("td");
      hucre.className = "dg-seviye-hucre";
      const icerik = document.createElement("div");
      icerik.className = "dg-seviye-icerik";
      icerik.contentEditable = "true";
      icerik.setAttribute("role", "textbox");
      icerik.setAttribute("aria-label", `${baslikMetni} — ${sv.etiket} açıklaması`);
      const hucreKey = olcutAnahtari(subjectData, seviye, cikti, kaynak, index);
      icerik.textContent = hucreMetniOku(depo, hucreKey, sv.anahtar, kaynak);
      icerik.addEventListener("input", () => {
        const guncelDepo = depoyuOku();
        if (!guncelDepo[hucreKey]) guncelDepo[hucreKey] = {};
        guncelDepo[hucreKey][sv.anahtar] = icerik.textContent;
        depoyaYaz(guncelDepo);
      });
      hucre.appendChild(icerik);
      satir.appendChild(hucre);
    }
    return satir;
  }

  function rubrikTablosuOlustur(subjectData, seviye, cikti, secenekler) {
    const depo = depoyuOku();
    const tablo = document.createElement("table");
    tablo.className = "dg-rubrik-tablosu";

    const baslikSatiri = document.createElement("tr");
    const bosBaslik = document.createElement("th");
    bosBaslik.textContent = "Ölçüt";
    baslikSatiri.appendChild(bosBaslik);
    for (const sv of SEVIYELER) {
      const th = document.createElement("th");
      th.textContent = `${sv.etiket} (${sv.anahtar})`;
      baslikSatiri.appendChild(th);
    }
    tablo.appendChild(baslikSatiri);

    let satirVarMi = false;

    if (secenekler.kavramlar && (cikti.anahtar_kavramlar || []).length) {
      const baslik = `Kavram Hâkimiyeti: ${cikti.anahtar_kavramlar.join(", ")}`;
      tablo.appendChild(olcutSatiriOlustur(depo, subjectData, seviye, cikti, "kavramlar", baslik, 0));
      satirVarMi = true;
    }

    if (secenekler.icerik) {
      (cikti.icerik_cercevesi || []).forEach((madde, idx) => {
        tablo.appendChild(olcutSatiriOlustur(depo, subjectData, seviye, cikti, "icerik", madde, idx));
        satirVarMi = true;
      });
    }

    if (secenekler.surec) {
      (cikti.surec_bilesenleri || []).forEach((ifade, idx) => {
        tablo.appendChild(olcutSatiriOlustur(depo, subjectData, seviye, cikti, "surec", ifade, idx));
        satirVarMi = true;
      });
    }

    return { tablo, satirVarMi };
  }

  function rubrikIcerigiOlustur(subjectData, unite, cikti, secenekler) {
    const kagit = document.createElement("div");
    kagit.className = "rubrik-kagit";

    const ustBaslik = document.createElement("h2");
    ustBaslik.textContent = `${subjectData.dersAdi} Değerlendirme Rubriği`;
    kagit.appendChild(ustBaslik);

    const altBaslik = document.createElement("p");
    altBaslik.className = "dg-kazanim-basligi";
    altBaslik.textContent = `${unite.uniteNo}. Ünite: ${unite.uniteAdi} — ${cikti.kod}: ${cikti.baslik}`;
    kagit.appendChild(altBaslik);

    kagit.appendChild(BelgeBilgisiModule.ustBilgiOlustur(unite.__seviyeRef && unite.__seviyeRef.etiket));
    kagit.appendChild(ogrenciBilgiAlaniOlustur());

    const { tablo, satirVarMi } = rubrikTablosuOlustur(subjectData, unite.__seviyeRef, cikti, secenekler);

    if (!satirVarMi) {
      const uyari = document.createElement("p");
      uyari.className = "uyari";
      uyari.textContent = "Rubriğe eklemek için en az bir ölçüt kaynağı seçin.";
      kagit.appendChild(uyari);
      return kagit;
    }

    kagit.appendChild(tablo);

    const not = document.createElement("p");
    not.className = "dg-duzenleme-notu";
    not.textContent =
      "Seviye açıklamaları düzenlenebilir; yaptığınız değişiklikler bu tarayıcıda otomatik kaydedilir.";
    kagit.appendChild(not);

    return kagit;
  }

  function render(container, subjectData, seviye) {
    container.innerHTML = "";
    const uniteler = DataLoader.getUniteler(seviye);
    if (!uniteler.length) {
      const uyari = document.createElement("p");
      uyari.className = "uyari";
      uyari.textContent = "Bu ders/sınıf düzeyi için tanımlı ünite bulunamadı.";
      container.appendChild(uyari);
      return;
    }
    // olcutAnahtari için seviye referansını üniteye iliştiriyoruz (DataLoader
    // veri şemasını değiştirmeden depolama anahtarını tutarlı üretebilmek için).
    uniteler.forEach((u) => (u.__seviyeRef = seviye));

    const baslik = document.createElement("h2");
    baslik.textContent = `${subjectData.dersAdi} — ${seviye.etiket} Değerlendirme / Rubrik`;
    container.appendChild(baslik);

    const seciciAlani = document.createElement("div");
    seciciAlani.className = "secim-alani dg-secici-alani";

    const uniteSatir = document.createElement("div");
    uniteSatir.className = "secim-satiri";
    const uniteLabel = document.createElement("label");
    uniteLabel.setAttribute("for", "dg-unite-secici");
    uniteLabel.textContent = "Ünite seçin";
    uniteSatir.appendChild(uniteLabel);
    const uniteSelect = document.createElement("select");
    uniteSelect.id = "dg-unite-secici";
    uniteler.forEach((unite, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = `${unite.uniteNo}. ${unite.uniteAdi}`;
      uniteSelect.appendChild(opt);
    });
    uniteSatir.appendChild(uniteSelect);
    seciciAlani.appendChild(uniteSatir);

    const ciktiSatir = document.createElement("div");
    ciktiSatir.className = "secim-satiri";
    const ciktiLabel = document.createElement("label");
    ciktiLabel.setAttribute("for", "dg-cikti-secici");
    ciktiLabel.textContent = "Öğrenme çıktısı seçin";
    ciktiSatir.appendChild(ciktiLabel);
    const ciktiSelect = document.createElement("select");
    ciktiSelect.id = "dg-cikti-secici";
    ciktiSatir.appendChild(ciktiSelect);
    seciciAlani.appendChild(ciktiSatir);

    container.appendChild(seciciAlani);

    const fieldset = document.createElement("fieldset");
    fieldset.className = "dg-secenekler";
    const legend = document.createElement("legend");
    legend.textContent = "Rubriğe eklenecek ölçüt kaynakları";
    fieldset.appendChild(legend);

    const secenekTanimlari = [
      { anahtar: "kavramlar", etiket: "Kavram Hâkimiyeti" },
      { anahtar: "icerik", etiket: "İçerik Çerçevesi ölçütleri" },
      { anahtar: "surec", etiket: "Süreç Bileşenleri ölçütleri" },
    ];
    const secenekKutulari = {};
    for (const { anahtar, etiket } of secenekTanimlari) {
      const kutuLabel = document.createElement("label");
      kutuLabel.className = "dg-secenek-kutusu";
      const kutu = document.createElement("input");
      kutu.type = "checkbox";
      kutu.checked = anahtar !== "kavramlar"; // varsayılan: süreç+içerik ölçütlü rubrik
      kutu.id = "dg-secenek-" + anahtar;
      secenekKutulari[anahtar] = kutu;
      kutuLabel.setAttribute("for", kutu.id);
      kutuLabel.appendChild(kutu);
      kutuLabel.appendChild(document.createTextNode(" " + etiket));
      fieldset.appendChild(kutuLabel);
    }
    container.appendChild(fieldset);

    const onizleme = document.createElement("div");
    onizleme.id = "rubrik-onizleme";
    onizleme.setAttribute("aria-live", "polite");
    container.appendChild(onizleme);

    const yazdirBtn = document.createElement("button");
    yazdirBtn.type = "button";
    yazdirBtn.className = "eylem-buton";
    yazdirBtn.textContent = "Yazdır / PDF olarak kaydet";
    yazdirBtn.addEventListener("click", () => window.print());
    container.appendChild(yazdirBtn);

    function guncelle() {
      const unite = uniteler[Number(uniteSelect.value)];
      const cikti = (unite.ogrenmeCiktilari || [])[Number(ciktiSelect.value)];
      onizleme.innerHTML = "";
      if (!cikti) return;
      const secenekler = {
        kavramlar: secenekKutulari.kavramlar.checked,
        icerik: secenekKutulari.icerik.checked,
        surec: secenekKutulari.surec.checked,
      };
      onizleme.appendChild(rubrikIcerigiOlustur(subjectData, unite, cikti, secenekler));
    }

    function ciktiSeciciDoldur() {
      const unite = uniteler[Number(uniteSelect.value)];
      ciktiSelect.innerHTML = "";
      (unite.ogrenmeCiktilari || []).forEach((cikti, idx) => {
        const opt = document.createElement("option");
        opt.value = String(idx);
        opt.textContent = `${cikti.kod} — ${cikti.baslik}`;
        ciktiSelect.appendChild(opt);
      });
    }

    uniteSelect.addEventListener("change", () => {
      ciktiSeciciDoldur();
      guncelle();
    });
    ciktiSelect.addEventListener("change", guncelle);
    for (const kutu of Object.values(secenekKutulari)) {
      kutu.addEventListener("change", guncelle);
    }

    ciktiSeciciDoldur();
    guncelle();
  }

  return { render };
})();
