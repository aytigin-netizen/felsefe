// js/modules/unite-plani.js
// Ünite Planı modülü: seçili ders/seviye içinden bir ünite seçilir ve o ünitenin
// öğrenme çıktıları (süreç bileşenleri, içerik çerçevesi, anahtar kavramlar) ile
// varsa haftalık dağılımı okunabilir bir ünite planı olarak gösterilir.
// Yıllık Plan modülünde olduğu gibi derse özel mantık içermez; yalnızca
// DataLoader'ın döndürdüğü kanonik veriye göre çalışır, bu yüzden felsefe/
// sosyoloji/psikoloji/mantık için değişiklik yapmadan aynen çalışır.

const UnitePlaniModule = (() => {
  const NOT_ANAHTAR_ONEKI = "cds-unite-notu:";

  function notAnahtari(subjectData, seviye, unite) {
    return `${NOT_ANAHTAR_ONEKI}${subjectData.kodPrefix}:${seviye.etiket}:${unite.uniteNo}`;
  }

  function tabloOlustur(baslik, satirlar) {
    const bolum = document.createElement("section");
    bolum.className = "unite-belge-bolumu";

    const h3 = document.createElement("h3");
    h3.textContent = baslik;
    bolum.appendChild(h3);

    const table = document.createElement("table");
    table.className = "unite-bilgi-tablosu";
    const tbody = document.createElement("tbody");
    satirlar.filter(([, deger]) => deger).forEach(([etiket, deger]) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = etiket;
      const td = document.createElement("td");
      td.textContent = deger;
      tr.append(th, td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    bolum.appendChild(table);
    return bolum;
  }

  function listeBolumuOlustur(baslik, maddeler) {
    const bolum = document.createElement("section");
    bolum.className = "unite-belge-bolumu";

    const h3 = document.createElement("h3");
    h3.textContent = baslik;
    bolum.appendChild(h3);

    const ul = document.createElement("ul");
    ul.className = "unite-belge-listesi";
    maddeler.filter(Boolean).forEach((madde) => {
      const li = document.createElement("li");
      li.textContent = madde;
      ul.appendChild(li);
    });
    bolum.appendChild(ul);
    return bolum;
  }

  function uniteKapsamOzeti(unite) {
    const ciktilar = unite.ogrenmeCiktilari || [];
    const kavramlar = new Set();
    const icerikler = new Set();
    const haftalar = [];
    ciktilar.forEach((cikti) => {
      (cikti.anahtar_kavramlar || []).forEach((kavram) => kavramlar.add(kavram));
      (cikti.icerik_cercevesi || []).forEach((icerik) => icerikler.add(icerik));
      (cikti.haftalikDagilim || []).forEach((hafta) => haftalar.push(hafta.hafta));
    });
    return {
      ciktiSayisi: ciktilar.length,
      haftalar: haftalar.join("; "),
      kavramlar: [...kavramlar].join(", "),
      icerikler: [...icerikler].join(", ")
    };
  }

  function etiketGrubuOlustur(baslik, degerler, sinifAdi) {
    const bolum = document.createElement("div");
    bolum.className = "etiket-bolumu";

    const h4 = document.createElement("h4");
    h4.textContent = baslik;
    bolum.appendChild(h4);

    const grup = document.createElement("div");
    grup.className = "etiket-grubu";
    for (const deger of degerler || []) {
      const etiket = document.createElement("span");
      etiket.className = sinifAdi;
      etiket.textContent = deger;
      grup.appendChild(etiket);
    }
    bolum.appendChild(grup);
    return bolum;
  }

  function surecBilesenleriListesiOlustur(surecBilesenleri) {
    const bolum = document.createElement("div");
    bolum.className = "etiket-bolumu";

    const h4 = document.createElement("h4");
    h4.textContent = "Süreç Bileşenleri";
    bolum.appendChild(h4);

    const liste = document.createElement("ul");
    liste.className = "surec-listesi";
    for (const s of surecBilesenleri || []) {
      const li = document.createElement("li");
      li.textContent = s;
      liste.appendChild(li);
    }
    bolum.appendChild(liste);
    return bolum;
  }

  function haftalikMiniListeOlustur(haftalikDagilim) {
    if (!haftalikDagilim || !haftalikDagilim.length) return null;

    const bolum = document.createElement("div");
    bolum.className = "etiket-bolumu";

    const h4 = document.createElement("h4");
    h4.textContent = "Haftalık Dağılım";
    bolum.appendChild(h4);

    const liste = document.createElement("ul");
    liste.className = "haftalik-mini-liste";
    for (const h of haftalikDagilim) {
      const li = document.createElement("li");
      const hafta = document.createElement("strong");
      hafta.textContent = `${h.hafta || ""}${h.dersSaati ? ` (${h.dersSaati} saat)` : ""}: `;
      li.appendChild(hafta);
      li.appendChild(document.createTextNode(h.surecBileseniIsaretlenen || ""));
      if (h.belirliGunHafta) {
        const ozel = document.createElement("span");
        ozel.className = "haftalik-ozel-gun";
        ozel.textContent = ` — ${h.belirliGunHafta}`;
        li.appendChild(ozel);
      }
      liste.appendChild(li);
    }
    bolum.appendChild(liste);
    return bolum;
  }

  function ciktiKartiOlustur(cikti) {
    const kart = document.createElement("article");
    kart.className = "cikti-karti";

    const baslik = document.createElement("h3");
    baslik.className = "cikti-baslik";
    const kod = document.createElement("strong");
    kod.textContent = cikti.kod;
    baslik.appendChild(kod);
    baslik.appendChild(document.createTextNode(" — " + cikti.baslik));
    kart.appendChild(baslik);

    kart.appendChild(surecBilesenleriListesiOlustur(cikti.surec_bilesenleri));
    kart.appendChild(etiketGrubuOlustur("İçerik Çerçevesi", cikti.icerik_cercevesi, "etiket etiket-icerik"));
    kart.appendChild(etiketGrubuOlustur("Anahtar Kavramlar", cikti.anahtar_kavramlar, "etiket etiket-kavram"));

    const haftalik = haftalikMiniListeOlustur(cikti.haftalikDagilim);
    if (haftalik) kart.appendChild(haftalik);

    return kart;
  }

  function notlarAlaniOlustur(subjectData, seviye, unite) {
    const bolum = document.createElement("div");
    bolum.className = "notlar-bolumu";

    const label = document.createElement("label");
    const id = "unite-notlari-" + unite.uniteNo;
    label.setAttribute("for", id);
    label.textContent = "Ünite Notlarım (yalnızca bu tarayıcıda saklanır)";
    bolum.appendChild(label);

    const alan = document.createElement("textarea");
    alan.id = id;
    alan.className = "notlar-alani";
    alan.rows = 4;
    alan.placeholder = "Bu ünite için kendi ders notlarınızı, örnek/etkinlik fikirlerinizi buraya yazabilirsiniz…";

    const anahtar = notAnahtari(subjectData, seviye, unite);
    try {
      alan.value = window.localStorage.getItem(anahtar) || "";
    } catch (err) {
      alan.disabled = true;
      alan.placeholder = "Notlar bu cihazda saklanamıyor (tarayıcı depolaması kullanılamıyor).";
    }

    let zamanlayici = null;
    alan.addEventListener("input", () => {
      clearTimeout(zamanlayici);
      zamanlayici = setTimeout(() => {
        try {
          window.localStorage.setItem(anahtar, alan.value);
        } catch (err) {
          // Depolama kullanılamıyorsa sessizce yok say; kullanıcı yazmaya devam edebilir.
        }
      }, 400);
    });

    bolum.appendChild(alan);
    return bolum;
  }

  function uniteIcerigiRender(container, subjectData, seviye, unite) {
    const eskiIcerik = container.querySelector(".unite-detay");
    if (eskiIcerik) eskiIcerik.remove();

    const detay = document.createElement("div");
    detay.className = "unite-detay";
    detay.setAttribute("aria-live", "polite");

    detay.appendChild(BelgeBilgisiModule.ustBilgiOlustur(seviye.etiket));

    const kapsam = uniteKapsamOzeti(unite);
    detay.appendChild(tabloOlustur("Ünite Bilgileri", [
      ["Ders", subjectData.dersAdi],
      ["Sınıf", seviye.etiket],
      ["Ünite", `${unite.uniteNo}. ${unite.uniteAdi}`],
      ["Ders saati", unite.dersSaati ? `${unite.dersSaati} ders saati` : ""],
      ["Öğrenme çıktısı sayısı", String(kapsam.ciktiSayisi)],
      ["Haftalık kapsam", kapsam.haftalar]
    ]));

    detay.appendChild(listeBolumuOlustur("Program Bağlantısı", [
      kapsam.icerikler ? `İçerik çerçevesi: ${kapsam.icerikler}` : "",
      kapsam.kavramlar ? `Anahtar kavramlar: ${kapsam.kavramlar}` : "",
      "Öğrenme çıktıları, süreç bileşenleri ve haftalık dağılım aşağıdaki kartlarda program verilerine göre gösterilir."
    ]));

    detay.appendChild(listeBolumuOlustur("Ölçme ve Değerlendirme Notu", [
      "Ünite değerlendirmesinde her öğrenme çıktısı için süreç bileşeni, içerik çerçevesi ve öğrencinin ürettiği kanıt birlikte izlenmelidir.",
      "Kartlardaki haftalık dağılım ders sırası için kılavuzdur; ölçme aracı ve etkinlik ayrıntıları okul/zümre kararına göre uyarlanabilir."
    ]));

    const ozet = document.createElement("p");
    ozet.className = "modul-ozet";
    ozet.textContent =
      `${unite.dersSaati || "?"} ders saati, ${(unite.ogrenmeCiktilari || []).length} öğrenme çıktısı.`;
    detay.appendChild(ozet);

    for (const cikti of unite.ogrenmeCiktilari || []) {
      detay.appendChild(ciktiKartiOlustur(cikti));
    }

    detay.appendChild(notlarAlaniOlustur(subjectData, seviye, unite));

    const yazdirBtn = document.createElement("button");
    yazdirBtn.type = "button";
    yazdirBtn.className = "eylem-buton";
    yazdirBtn.textContent = "Yazdır / PDF olarak kaydet";
    yazdirBtn.addEventListener("click", () => window.print());
    detay.appendChild(yazdirBtn);

    container.appendChild(detay);
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
    baslik.textContent = `${subjectData.dersAdi} — ${seviye.etiket} Ünite Planı`;
    container.appendChild(baslik);

    const seciciSatir = document.createElement("div");
    seciciSatir.className = "secim-satiri unite-secici-satiri";

    const label = document.createElement("label");
    label.setAttribute("for", "unite-secici");
    label.textContent = "Ünite seçin";
    seciciSatir.appendChild(label);

    const select = document.createElement("select");
    select.id = "unite-secici";
    uniteler.forEach((unite, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = `${unite.uniteNo}. ${unite.uniteAdi}`;
      select.appendChild(opt);
    });
    seciciSatir.appendChild(select);
    container.appendChild(seciciSatir);

    select.addEventListener("change", () => {
      uniteIcerigiRender(container, subjectData, seviye, uniteler[Number(select.value)]);
    });

    uniteIcerigiRender(container, subjectData, seviye, uniteler[0]);
  }

  return { render };
})();
