// js/modules/yillik-plan.js
// Yıllık Plan modülü: seçili ders/seviye için kazanım verisinden ve haftalık
// dağılımdan okunabilir bir yıllık plan tablosu üretir. Derse özel mantık
// içermez; tamamen DataLoader'ın döndürdüğü kanonik veriye göre çalışır, bu
// yüzden felsefe/sosyoloji/psikoloji/mantık için değişiklik yapmadan aynen çalışır.

const YillikPlanModule = (() => {
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
    const bosSaatSayisi = satirlar.filter((s) => !s.dersSaati).length;

    const ozet = document.createElement("p");
    ozet.className = "modul-ozet";
    ozet.textContent =
      `Çerçeve plana göre toplam ${seviye.toplamDersSaatiYillik} ders saati, ` +
      `${seviye.toplamOgrenmeCiktisiSayisi} öğrenme çıktısı, ${haftaSayisi} planlı hafta ` +
      `(bazı haftalar birden fazla kazanıma bölündüğü için tabloda ${satirlar.length} satır görünür).`;
    container.appendChild(ozet);

    if (hesaplananSaat !== Number(seviye.toplamDersSaatiYillik) || bosSaatSayisi > 0) {
      const uyari = document.createElement("p");
      uyari.className = "uyari";
      uyari.textContent =
        `Uyuşmazlık uyarısı: tablodaki satırların ders saati toplamı ${hesaplananSaat} ` +
        (bosSaatSayisi
          ? `(${bosSaatSayisi} satırda ders saati boş, 0 sayıldı), `
          : ", ") +
        `üstteki resmî toplam ise ${seviye.toplamDersSaatiYillik}. Aradaki fark, veri ` +
        `kaynağının çerçeve yıllık plan dosyasından çıkarılması sırasında oluşmuş olabilir; ` +
        `resmî çerçeve plan dosyasıyla karşılaştırılıp düzeltilmesi gerekir.`;
      container.appendChild(uyari);
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
        s.dersSaati || "",
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
