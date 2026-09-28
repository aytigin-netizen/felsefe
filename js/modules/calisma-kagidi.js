// js/modules/calisma-kagidi.js
// Çalışma Kâğıdı modülü: seçili ders/seviye içinden bir ünite ve o ünitenin bir
// öğrenme çıktısı seçilir; anahtar kavramlar, içerik çerçevesi ve süreç
// bileşenlerinden öğrencinin elle dolduracağı yazdırılabilir bir çalışma kâğıdı
// üretilir. Yıllık Plan / Ünite Planı modüllerinde olduğu gibi derse özel mantık
// içermez; tamamen DataLoader'ın döndürdüğü kanonik veriye göre çalışır.

const CalismaKagidiModule = (() => {
  // Çalışma kâğıdına eklenen bölümler seçime göre sıralandığından başlık
  // harfleri (A, B, C…) sabit değil, dahil edilen bölümlere göre atanır.
  const BOLUM_HARFLERI = "ABCDEFGH";

  function cizgiOlustur(sayi) {
    const parca = document.createDocumentFragment();
    for (let i = 0; i < sayi; i++) {
      const cizgi = document.createElement("div");
      cizgi.className = "yazi-cizgisi";
      parca.appendChild(cizgi);
    }
    return parca;
  }

  function ogrenciBilgiAlaniOlustur() {
    const satir = document.createElement("div");
    satir.className = "cg-ogrenci-bilgi";

    for (const etiket of ["Ad Soyad", "Sınıf / No", "Tarih"]) {
      const alan = document.createElement("div");
      alan.className = "cg-alan";
      const span = document.createElement("span");
      span.className = "cg-alan-etiket";
      span.textContent = etiket;
      alan.appendChild(span);
      alan.appendChild(cizgiOlustur(1));
      satir.appendChild(alan);
    }
    return satir;
  }

  function kavramlarBolumuOlustur(kavramlar, harf) {
    const bolum = document.createElement("div");
    bolum.className = "cg-bolum";

    const baslik = document.createElement("h3");
    baslik.textContent = `${harf}) Kavramlar`;
    bolum.appendChild(baslik);

    const yonerge = document.createElement("p");
    yonerge.className = "cg-yonerge";
    yonerge.textContent = "Aşağıdaki kavramları kendi cümlelerinizle tanımlayınız.";
    bolum.appendChild(yonerge);

    for (const kavram of kavramlar || []) {
      const satir = document.createElement("div");
      satir.className = "cg-kavram-satiri";
      const terim = document.createElement("strong");
      terim.textContent = kavram;
      satir.appendChild(terim);
      satir.
appendChild(cizgiOlustur(1));
      bolum.appendChild(satir);
    }
    return bolum;
  }

  // Aynı kalıbı ("... ile ilgili düşüncelerinizi yazınız") her maddede tekrar
  // etmemek için birkaç farklı görev çerçevesi arasında dönüşümlü geçilir.
  const ICERIK_GOREV_KALIPLARI = [
    (madde) => `"${madde}" kavramını/konusunu kendi cümlelerinizle açıklayınız.`,
    (madde) => `"${madde}" ile ilgili günlük hayattan bir örnek veriniz ve nedenini açıklayınız.`,
    (madde) => `"${madde}" konusuna dair kendi düşüncenizi bir gerekçeyle birlikte savunuşunuz.`,
    (madde) => `"${madde}" konusunu, bu üniteden başka bir kavramla ilişkilendiriniz.`,
  ];

  function icerikBolumuOlustur(icerikMaddeleri, baslangicNo, harf) {
    const bolum = document.createElement("div");
    bolum.className = "cg-bolum";

    const baslik = document.createElement("h3");
    baslik.textContent = `${harf}) Konu Başlıkları`;
    bolum.appendChild(baslik);

    const yonerge = document.createElement("p");
    yonerge.className = "cg-yonerge";
    yonerge.textContent =
      "Aşağıdaki konu başlıklarıyla ilgili görevleri yerine getiriniz.";
    bolum.appendChild(yonerge);

    (icerikMaddeleri || []).forEach((madde, idx) => {
      const soru = document.createElement("div");
      soru.className = "cg-soru";
      const metin = document.createElement("p");
      const kalip = ICERIK_GOREV_KALIPLARI[idx % ICERIK_GOREV_KALIPLARI.length];
      metin.textContent = `${baslangicNo + idx}. ${kalip(madde)}`;
      soru.appendChild(metin);
      soru.appendChild(cizgiOlustur(2));
      bolum.appendChild(soru);
    });
    return bolum;
  }

  function surecBolumuOlustur(surecMaddeleri, baslangicNo, harf) {
    const bolum = document.createElement("div");
    bolum.className = "cg-bolum";

    const baslik = document.createElement("h3");
    baslik.textContent = `${harf}) Açıklama ve Yorumlama`;
    bolum.appendChild(baslik);

    const yonerge = document.createElement("p");
    yonerge.className = "cg-yonerge";
    yonerge.textC
ontent =
      "Aşağıdaki ifadeleri kendi cümlelerinizle açıklayıp birer örnekle destekleyiniz.";
    bolum.appendChild(yonerge);

    (surecMaddeleri || []).forEach((ifade, idx) => {
      const soru = document.createElement("div");
      soru.className = "cg-soru";
      const metin = document.createElement("p");
      const no = document.createTextNode(`${baslangicNo + idx}. `);
      metin.appendChild(no);
      const alinti = document.createElement("q");
      alinti.textContent = ifade;
      metin.appendChild(alinti);
      soru.appendChild(metin);
      soru.appendChild(cizgiOlustur(3));
      bolum.appendChild(soru);
    });
    return bolum;
  }

  function worksheetIcerigiOlustur(subjectData, unite, cikti, secenekler, seviyeEtiketi) {
    const kagit = document.createElement("div");
    kagit.className = "calisma-kagidi-kagit";

    const ustBaslik = document.createElement("h2");
    ustBaslik.textContent = `${subjectData.dersAdi} Çalışma Kâğıdı`;
    kagit.appendChild(ustBaslik);

    const altBaslik = document.createElement("p");
    altBaslik.className = "cg-kazanim-basligi";
    altBaslik.textContent = `${unite.uniteNo}. Ünite: ${unite.uniteAdi} — ${cikti.kod}: ${cikti.baslik}`;
    kagit.appendChild(altBaslik);

    kagit.appendChild(BelgeBilgisiModule.ustBilgiOlustur(seviyeEtiketi));
    kagit.appendChild(ogrenciBilgiAlaniOlustur());

    let sonNo = 1;
    let harfIndex = 0;
    if (secenekler.kavramlar && (cikti.anahtar_kavramlar || []).length) {
      kagit.appendChild(kavramlarBolumuOlustur(cikti.anahtar_kavramlar, BOLUM_HARFLERI[harfIndex++]));
    }
    if (secenekler.icerik && (cikti.icerik_cercevesi || []).length) {
      kagit.appendChild(icerikBolumuOlustur(cikti.icerik_cercevesi, sonNo, BOLUM_HARFLERI[harfIndex++]));
      sonNo += cikti.icerik_cercevesi.length;
    }
    if (secenekler.surec && (cikti.surec_bilesenleri || []).length) {
      kagit.appendChild(surecBolumuOlustur(cikti.surec_bilesenleri, sonNo, BOLUM_HARFLERI[harfIndex++]));
    }

    if (!secenekler.kavramlar && !secenekler.icerik && !secenekler.surec) {
      const uyari = docu
ment.createElement("p");
      uyari.className = "uyari";
      uyari.textContent = "Çalışma kâğıdına eklemek için en az bir bölüm seçin.";
      kagit.appendChild(uyari);
    }

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

    const baslik = document.createElement("h2");
    baslik.textContent = `${subjectData.dersAdi} — ${seviye.etiket} Çalışma Kâğıdı`;
    container.appendChild(baslik);

    const seciciAlani = document.createElement("div");
    seciciAlani.className = "secim-alani cg-secici-alani";

    const uniteSatir = document.createElement("div");
    uniteSatir.className = "secim-satiri";
    const uniteLabel = document.createElement("label");
    uniteLabel.setAttribute("for", "cg-unite-secici");
    uniteLabel.textContent = "Ünite seçin";
    uniteSatir.appendChild(uniteLabel);
    const uniteSelect = document.createElement("select");
    uniteSelect.id = "cg-unite-secici";
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
    ciktiLabel.setAttribute("for", "cg-cikti-secici");
    ciktiLabel.textContent = "Öğrenme çıktısı seçin";
    ciktiSatir.appendChild(ciktiLabel);
    const ciktiSelect = document.createElement("select");
    ciktiSelect.id = "cg-cikti-secici";
    ciktiSatir.appendChild(
ciktiSelect);
    seciciAlani.appendChild(ciktiSatir);

    container.appendChild(seciciAlani);

    const fieldset = document.createElement("fieldset");
    fieldset.className = "cg-secenekler";
    const legend = document.createElement("legend");
    legend.textContent = "Çalışma kâğıdına eklenecek bölümler";
    fieldset.appendChild(legend);

    const secenekTanimlari = [
      { anahtar: "kavramlar", etiket: "Kavramlar" },
      { anahtar: "icerik", etiket: "Konu Başlıkları" },
      { anahtar: "surec", etiket: "Açıklama ve Yorumlama" },
    ];
    const secenekKutulari = {};
    for (const { anahtar, etiket } of secenekTanimlari) {
      const kutuLabel = document.createElement("label");
      kutuLabel.className = "cg-secenek-kutusu";
      const kutu = document.createElement("input");
      kutu.type = "checkbox";
      kutu.checked = true;
      kutu.id = "cg-secenek-" + anahtar;
      secenekKutulari[anahtar] = kutu;
      kutuLabel.setAttribute("for", kutu.id);
      kutuLabel.appendChild(kutu);
      kutuLabel.appendChild(document.createTextNode(" " + etiket));
      fieldset.appendChild(kutuLabel);
    }
    container.appendChild(fieldset);

    const onizleme = document.createElement("div");
    onizleme.id = "calisma-kagidi-onizleme";
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
        icerik: secenekKutulari.icerik.checke
d,
        surec: secenekKutulari.surec.checked,
      };
      onizleme.appendChild(worksheetIcerigiOlustur(subjectData, unite, cikti, secenekler, seviye.etiket));
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
