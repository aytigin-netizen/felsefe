// js/modules/yillik-plan.js
// Yıllık Plan modülü: seçili ders/seviye için kazanım verisinden ve haftalık
// dağılımdan okunabilir bir yıllık plan tablosu üretir. Derse özel mantık
// içermez; tamamen DataLoader'ın döndürdüğü kanonik veriye göre çalışır, bu
// yüzden felsefe/sosyoloji/psikoloji/mantık için değişiklik yapmadan aynen çalışır.

const YillikPlanModule = (() => {
  function tabloOlustur(baslik, satirlar) {
    const bolum = document.createElement("section");
    bolum.className = "yillik-belge-bolumu";

    const h3 = document.createElement("h3");
    h3.textContent = baslik;
    bolum.appendChild(h3);

    const table = document.createElement("table");
    table.className = "yillik-bilgi-tablosu";
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
    bolum.className = "yillik-belge-bolumu";

    const h3 = document.createElement("h3");
    h3.textContent = baslik;
    bolum.appendChild(h3);

    const ul = document.createElement("ul");
    ul.className = "yillik-belge-listesi";
    maddeler.filter(Boolean).forEach((madde) => {
      const li = document.createElement("li");
      li.textContent = madde;
      ul.appendChild(li);
    });
    bolum.appendChild(ul);
    return bolum;
  }

  function render(container, subjectData, seviye) {
    container.innerHTML = "";

    if (!DataLoader.cercevePlanVarMi(seviye)) {
      const uyari = document.createElement("p");
      uyari.className = "uyari";
      uyari.textContent =
        "Bu ders/sınıf düzeyi için resmi çerçeve yıllık plan yayımlanmadığından " +
        "Yıllık Plan modülü kullanılamıyor.";
      container.appendChild(uyari);
      return;
    }

    const satirlar = DataLoader.tumHaftalikSatirlar(seviye);
    const haftaSayisi = DataLoader.planliHaftaSayisi(seviye);

    const baslik = document.createElement("h2");
    baslik.textContent = `${subjectData.dersAdi} — ${seviye.etiket} Yıllık Planı`;
    container.appendChild(baslik);

    container.appendChild(BelgeBilgisiModule.ustBilgiOlustur(seviye.etiket));

    const hesaplananSaat = satirlar.reduce(
      (toplam, s) => toplam + (parseInt(s.dersSaati, 10) || 0),
      0
    );
    const bosSaatliHaftalar = satirlar.filter((s) => !s.dersSaati);
    const ozelHaftalar = DataLoader.getOzelPlanlamaHaftalari(seviye);
    const resmiToplamVarMi =
      seviye.toplamDersSaatiYillik !== null && seviye.toplamDersSaatiYillik !== undefined;

    container.appendChild(tabloOlustur("Yıllık Plan Bilgileri", [
      ["Ders", subjectData.dersAdi],
      ["Sınıf", seviye.etiket],
      ["Eğitim öğretim yılı", "2026-2027"],
      ["Toplam ders saati", resmiToplamVarMi ? `${seviye.toplamDersSaatiYillik} ders saati` : ""],
      ["Öğrenme çıktısı sayısı", String(seviye.toplamOgrenmeCiktisiSayisi || "")],
      ["Planlı hafta sayısı", String(haftaSayisi)],
      ["Tabloda görünen satır sayısı", String(satirlar.length)]
    ]));

    container.appendChild(listeBolumuOlustur("Program ve Kaynak Notu", [
      "Haftalık dağılım, uygulamadaki kanonik veri kaynağından ve MEB 2026-2027 çerçeve yıllık plan eşlemesinden okunur.",
      "Öğrenme çıktısı kodları, başlıkları ve süreç bileşenleri tablo satırlarında görünür tutulur.",
      "Okul temelli planlama, sosyal etkinlik, tatil ve özel gün/hafta bilgileri ayrı notlarla izlenir."
    ]));

    const ozet = document.createElement("p");
    ozet.className = "modul-ozet";
    ozet.textContent = resmiToplamVarMi
      ? `Çerçeve plana göre toplam ${seviye.toplamDersSaatiYillik} ders saati, ` +
        `${seviye.toplamOgrenmeCiktisiSayisi} öğrenme çıktısı, ${haftaSayisi} planlı hafta ` +
        `(bazı haftalar birden fazla kazanıma bölündüğü için tabloda ${satirlar.length} satır görünür).`
      : `${seviye.toplamOgrenmeCiktisiSayisi} öğrenme çıktısı, ${haftaSayisi} planlı hafta ` +
        `(bazı haftalar birden fazla kazanıma bölündüğü için tabloda ${satirlar.length} satır görünür). ` +
        `Kaynak çerçeve yıllık plan (taslak) bazı haftalarda ders saatini belirtmediği için ` +
        `tek bir resmî yıllık toplam verilemiyor; aşağıdaki ${hesaplananSaat} saat yalnızca ` +
        `kaynakta sayısı belirtilmiş haftaların toplamıdır.`;
    container.appendChild(ozet);

    if (resmiToplamVarMi && hesaplananSaat !== Number(seviye.toplamDersSaatiYillik)) {
      const uyari = document.createElement("p");
      uyari.className = "uyari";
      uyari.textContent =
        `Uyuşmazlık uyarısı: tablodaki satırların ders saati toplamı ${hesaplananSaat}, ` +
        `üstteki resmî toplam ise ${seviye.toplamDersSaatiYillik}. Kaynak çerçeve plan dosyasıyla ` +
        `yeniden karşılaştırılıp düzeltilmesi gerekir.`;
      container.appendChild(uyari);
    }

    if (bosSaatliHaftalar.length) {
      const uyari = document.createElement("p");
      uyari.className = "uyari";
      uyari.textContent =
        `Kaynak çerçeve yıllık plan (taslak), ${bosSaatliHaftalar.length} haftada ders saatini ` +
        `boş bırakmış — bu bir aktarım hatası değil, taslağın kendisinde eksik: ` +
        bosSaatliHaftalar.map((s) => s.hafta).join("; ") +
        `. Ders saati bu haftalar için zümre/okul kararıyla belirlenmeli.`;
      container.appendChild(uyari);
    }

    if (ozelHaftalar.length) {
      const notu = document.createElement("p");
      notu.className = "modul-ozet";
      notu.textContent =
        `Ayrıca ${ozelHaftalar.length} hafta (Okul Temelli Planlama / Sosyal Etkinlik) çerçeve ` +
        `planda ayrılmıştır; bu haftaların saati ve içeriği okul/zümre kararıyla belirlenir, ` +
        `yukarıdaki toplamlara dahil değildir: ` +
        ozelHaftalar.map((h) => `${h.hafta} (${h.tur})`).join("; ") +
        ".";
      container.appendChild(notu);
    }

    if ((seviye.tatiller || []).length) {
      const tatilBaslik = document.createElement("h3");
      tatilBaslik.textContent = "Tatiller";
      container.appendChild(tatilBaslik);

      const tatilListe = document.createElement("ul");
      for (const t of seviye.tatiller) {
        const li = document.createElement("li");
        li.textContent = t;
        tatilListe.appendChild(li);
      }
      container.appendChild(tatilListe);
    }

    const table = document.createElement("table");
    table.className = "yillik-plan-tablosu";

    const thead = document.createElement("thead");
    thead.innerHTML =
      "<tr><th>Hafta</th><th>Ay</th><th>Saat</th><th>Ünite</th>" +
      "<th>Kazanım</th><th>Süreç Bileşeni</th><th>Özel Gün/Hafta</th></tr>";
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const s of satirlar) {
      const tr = document.createElement("tr");

      const hucreler = [
        s.hafta || "",
        s.ay || "",
        s.dersSaati || "—",
        `${s.uniteNo}. ${s.uniteAdi}`,
      ];
      for (const metin of hucreler) {
        const td = document.createElement("td");
        td.textContent = metin;
        tr.appendChild(td);
      }

      const tdKazanim = document.createElement("td");
      const kod = document.createElement("strong");
      kod.textContent = s.kazanimKodu;
      tdKazanim.appendChild(kod);
      if (s.kazanimBaslik) {
        tdKazanim.appendChild(document.createElement("br"));
        tdKazanim.appendChild(document.createTextNode(s.kazanimBaslik));
      }
      tr.appendChild(tdKazanim);

      const tdSurec = document.createElement("td");
      tdSurec.textContent = s.surecBileseniIsaretlenen || "";
      tr.appendChild(tdSurec);

      const tdOzel = document.createElement("td");
      tdOzel.textContent = s.belirliGunHafta || "";
      tr.appendChild(tdOzel);

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);

    container.appendChild(BelgeBilgisiModule.imzaAlaniOlustur(["Öğretmen İmza", "Zümre Başkanı İmza"]));

    const yazdirBtn = document.createElement("button");
    yazdirBtn.type = "button";
    yazdirBtn.className = "eylem-buton";
    yazdirBtn.textContent = "Yazdır / PDF olarak kaydet";
    yazdirBtn.addEventListener("click", () => window.print());
    container.appendChild(yazdirBtn);
  }

  return { render };
})();
