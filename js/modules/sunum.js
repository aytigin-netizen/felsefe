// js/modules/sunum.js
// Sunum modülü: seçili ünite + öğrenme çıktısından PowerPoint (.pptx) üretir.
// İçerik yalnızca kanonik veriden gelir (kazanım, içerik çerçevesi, anahtar
// kavramlar, süreç bileşenleri); tartışma soruları veri maddelerine uygulanan
// kalıplardır ve öğretmenin düzenlemesi için öneri niteliğindedir.
// slaytlariHazirla() saf bir fonksiyondur (DOM/pptxgenjs gerektirmez); pptxOlustur()
// ise PptxGenJS sınıfını parametre olarak alır. Böylece ikisi de testlenebilir.

const SunumModule = (() => {
  const RENK = {
    koyu: "182120", altin: "BC9C5F", altinAcik: "D7BD8A", altinYazi: "816B44",
    zemin: "F6F7FB", yazi: "29342E", soluk: "737975", kart: "FFFFFF",
    cizgi: "E1DED9", ikonZemin: "EFF1EC", koyuYazi: "B1BDB9",
  };
  const BASLIK_FONT = "Georgia";
  const GOVDE_FONT = "Calibri";

  const TARTISMA_KALIPLARI = [
    (m) => `"${m}" hakkında bir arkadaşınıza ne söylerdiniz? Gerekçenizi belirtin.`,
    (m) => `"${m}" ile ilgili günlük hayattan bir örnek verin.`,
    (m) => `"${m}" sizce ne kadar önemlidir? Gerekçelendirin.`,
  ];
  const KAPANIS_SORULARI = (kod) => [
    "Bugün ele aldığımız temel kavramları kendi cümlelerinizle açıklayın.",
    "Bu konuda hâlâ merak ettiğiniz ya da ikna olmadığınız bir nokta var mı?",
    `Öğrenme çıktısına (${kod}) ne ölçüde ulaştığınızı düşünüyorsunuz?`,
  ];

  function parcala(dizi, boyut) {
    const sonuc = [];
    for (let i = 0; i < dizi.length; i += boyut) sonuc.push(dizi.slice(i, i + boyut));
    return sonuc;
  }

  function baslikEkle(baslik, i, n) {
    return n > 1 ? `${baslik} (${i + 1}/${n})` : baslik;
  }

  // Eşit aralıklı en çok `adet` madde seç (ilk, orta, son gibi).
  function dagit(dizi, adet) {
    if (dizi.length <= adet) return dizi.slice();
    const secilen = [];
    for (let i = 0; i < adet; i++) secilen.push(dizi[Math.round((i * (dizi.length - 1)) / (adet - 1))]);
    return secilen;
  }

  function slaytlariHazirla(subjectData, seviye, unite, cikti, secenekler) {
    const slaytlar = [];
    const ctx = { ders: subjectData.dersAdi, seviye: seviye.etiket, unite: `${unite.uniteNo}. Ünite: ${unite.uniteAdi}`, kod: cikti.kod };

    slaytlar.push({ tip: "kapak", ...ctx, baslik: cikti.baslik, uniteSaati: unite.dersSaati });
    slaytlar.push({ tip: "kazanim", ...ctx, baslik: "Öğrenme çıktısı", kazanim: cikti.baslik, uniteSaati: unite.dersSaati });

    const ekleListe = (tip, baslik, maddeler, boyut) => {
      const gruplar = parcala(maddeler, boyut);
      gruplar.forEach((g, i) => slaytlar.push({ tip, ...ctx, baslik: baslikEkle(baslik, i, gruplar.length), maddeler: g }));
    };

    const icerik = cikti.icerik_cercevesi || [];
    const kavramlar = cikti.anahtar_kavramlar || [];
    const surec = cikti.surec_bilesenleri || [];

    if (secenekler.icerik && icerik.length) ekleListe("konu", "Konu başlıkları", icerik, 6);
    if (secenekler.kavramlar && kavramlar.length) ekleListe("kavram", "Anahtar kavramlar", kavramlar, 9);
    if (secenekler.surec && surec.length) ekleListe("surec", "Süreç bileşenleri", surec, 3);
    if (secenekler.tartisma && (icerik.length || kavramlar.length)) {
      const kaynak = dagit(icerik.length ? icerik : kavramlar, 3);
      const sorular = kaynak.map((m, i) => TARTISMA_KALIPLARI[i % TARTISMA_KALIPLARI.length](m));
      if (icerik.length && kavramlar.length >= 2 && sorular.length < 3) {
        sorular.push(`"${kavramlar[0]}" ile "${kavramlar[kavramlar.length - 1]}" arasında nasıl bir ilişki kurulabilir?`);
      }
      slaytlar.push({ tip: "tartisma", ...ctx, baslik: "Tartışalım", maddeler: sorular });
    }
    if (secenekler.kapanis) slaytlar.push({ tip: "tartisma", ...ctx, baslik: "Ders sonu değerlendirme", maddeler: KAPANIS_SORULARI(cikti.kod) });
    return slaytlar;
  }

  function dosyaAdi(cikti) {
    return `Sunum_${String(cikti.kod).replace(/[^A-Za-z0-9._-]/g, "_")}.pptx`;
  }

  // ---- pptx çizimi ----
  function cerceve(pres, slide, s, koyu) {
    slide.background = { color: koyu ? RENK.koyu : RENK.zemin };
    slide.addText(`${s.ders} · ${s.seviye}`.toLocaleUpperCase("tr-TR"), {
      x: 0.7, y: 0.42, w: 9, h: 0.3, fontFace: GOVDE_FONT, fontSize: 11, bold: true, charSpacing: 3,
      color: koyu ? RENK.altinAcik : RENK.altinYazi, margin: 0,
    });
    slide.addText(s.baslik, {
      x: 0.7, y: 0.78, w: 11.9, h: 0.85, fontFace: BASLIK_FONT, fontSize: 32, bold: true,
      color: koyu ? "FFFFFF" : RENK.yazi, margin: 0, valign: "middle",
    });
    slide.addShape(pres.ShapeType.rect, { x: 0.7, y: 1.72, w: 0.9, h: 0.05, fill: { color: RENK.altin }, line: { color: RENK.altin, width: 0 } });
    slide.addText(`${s.kod} · ${s.unite}`, {
      x: 0.7, y: 6.95, w: 10, h: 0.3, fontFace: GOVDE_FONT, fontSize: 10, color: koyu ? RENK.koyuYazi : RENK.soluk, margin: 0,
    });
    slide.slideNumber = { x: 12.1, y: 6.95, w: 0.55, h: 0.3, fontFace: GOVDE_FONT, fontSize: 10, color: koyu ? RENK.koyuYazi : RENK.soluk, align: "right" };
  }

  function kartIzgara(pres, slide, maddeler, { kolon, satirMax, numara, fontSize, font }) {
    const X0 = 0.7, W = 11.93, ARA = 0.25, Y0 = 2.1, YUK = 4.6, SARA = 0.2;
    const kw = (W - (kolon - 1) * ARA) / kolon;
    const satir = Math.ceil(maddeler.length / kolon);
    const kh = Math.min(satirMax, (YUK - (satir - 1) * SARA) / satir);
    maddeler.forEach((m, i) => {
      const x = X0 + (i % kolon) * (kw + ARA);
      const y = Y0 + Math.floor(i / kolon) * (kh + SARA);
      slide.addShape(pres.ShapeType.roundRect, { x, y, w: kw, h: kh, rectRadius: 0.12, fill: { color: RENK.kart }, line: { color: RENK.cizgi, width: 1 } });
      if (numara === "sol-serit") {
        slide.addShape(pres.ShapeType.rect, { x, y: y + 0.12, w: 0.08, h: kh - 0.24, fill: { color: RENK.altin }, line: { color: RENK.altin, width: 0 } });
      }
      if (numara === "chip") {
        slide.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + kh / 2 - 0.22, w: 0.44, h: 0.44, fill: { color: RENK.ikonZemin }, line: { color: RENK.ikonZemin, width: 0 } });
        slide.addText(String(i + 1), { x: x + 0.25, y: y + kh / 2 - 0.22, w: 0.44, h: 0.44, align: "center", valign: "middle", fontFace: BASLIK_FONT, fontSize: 14, bold: true, color: RENK.altinYazi, margin: 0 });
      }
      const tx = numara === "chip" ? x + 0.9 : x + 0.35;
      slide.addText(m, {
        x: tx, y, w: kw - (tx - x) - 0.25, h: kh, fontFace: font, fontSize, color: RENK.yazi, valign: "middle",
        align: numara === "ortala" ? "center" : "left", margin: 0,
      });
    });
  }

  function pptxOlustur(PptxGenJS, slaytlar, cikti) {
    const pres = new PptxGenJS();
    pres.layout = "LAYOUT_WIDE";
    pres.title = `${slaytlar[0].ders} — ${cikti.kod}`;
    pres.subject = slaytlar[0].unite;
    for (const s of slaytlar) {
      const slide = pres.addSlide();
      if (s.tip === "kapak") {
        slide.background = { color: RENK.koyu };
        for (const [x, y, w, h] of [[8.4, 0.9, 4.6, 4.6], [9.3, 0.4, 3.4, 5.6]]) {
          slide.addShape(pres.ShapeType.ellipse, { x, y, w, h, fill: { color: RENK.koyu, transparency: 100 }, line: { color: RENK.altinAcik, width: 1, transparency: 75 } });
        }
        slide.addText("φ", { x: 10.2, y: 2.4, w: 1.6, h: 1.6, align: "center", valign: "middle", fontFace: BASLIK_FONT, fontSize: 80, color: RENK.altinAcik, margin: 0 });
        slide.addText(`${s.ders} · ${s.seviye}`.toLocaleUpperCase("tr-TR"), { x: 0.9, y: 1.5, w: 8, h: 0.35, fontFace: GOVDE_FONT, fontSize: 13, bold: true, charSpacing: 4, color: RENK.altinAcik, margin: 0 });
        slide.addText(s.baslik, { x: 0.9, y: 2.0, w: 7.0, h: 2.6, fontFace: BASLIK_FONT, fontSize: 36, bold: true, color: "FFFFFF", valign: "top", margin: 0 });
        slide.addShape(pres.ShapeType.rect, { x: 0.9, y: 4.85, w: 1.1, h: 0.06, fill: { color: RENK.altin }, line: { color: RENK.altin, width: 0 } });
        slide.addText(s.unite, { x: 0.9, y: 5.1, w: 7.6, h: 0.45, fontFace: GOVDE_FONT, fontSize: 18, color: RENK.koyuYazi, margin: 0 });
        slide.addText(s.kod, { x: 0.9, y: 5.6, w: 7.6, h: 0.35, fontFace: GOVDE_FONT, fontSize: 13, color: RENK.altinAcik, margin: 0 });
      } else if (s.tip === "kazanim") {
        cerceve(pres, slide, s, false);
        slide.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 2.1, w: 11.93, h: 3.3, rectRadius: 0.15, fill: { color: RENK.kart }, line: { color: RENK.cizgi, width: 1 } });
        slide.addText(s.kod, { x: 1.1, y: 2.4, w: 3, h: 0.4, fontFace: GOVDE_FONT, fontSize: 14, bold: true, color: RENK.altinYazi, margin: 0 });
        slide.addText(s.kazanim, { x: 1.1, y: 2.9, w: 11.1, h: 1.9, fontFace: BASLIK_FONT, fontSize: 30, color: RENK.yazi, valign: "top", margin: 0 });
        slide.addText(`${s.unite}${s.uniteSaati ? " · " + s.uniteSaati + " ders saati" : ""}`, { x: 1.1, y: 4.85, w: 11.1, h: 0.35, fontFace: GOVDE_FONT, fontSize: 14, color: RENK.soluk, margin: 0 });
      } else if (s.tip === "konu") {
        cerceve(pres, slide, s, false);
        kartIzgara(pres, slide, s.maddeler, { kolon: 2, satirMax: 1.25, numara: "chip", fontSize: 20, font: GOVDE_FONT });
      } else if (s.tip === "kavram") {
        cerceve(pres, slide, s, false);
        kartIzgara(pres, slide, s.maddeler, { kolon: 3, satirMax: 1.1, numara: "ortala", fontSize: 22, font: BASLIK_FONT });
      } else if (s.tip === "surec") {
        cerceve(pres, slide, s, false);
        kartIzgara(pres, slide, s.maddeler, { kolon: 1, satirMax: 1.4, numara: "sol-serit", fontSize: 18, font: GOVDE_FONT });
      } else if (s.tip === "tartisma") {
        cerceve(pres, slide, s, true);
        s.maddeler.forEach((m, i) => {
          const y = 2.1 + i * 1.55;
          slide.addText(String(i + 1), { x: 0.7, y, w: 0.9, h: 1.3, fontFace: BASLIK_FONT, fontSize: 44, color: RENK.altin, valign: "middle", margin: 0 });
          slide.addText(m, { x: 1.7, y, w: 10.9, h: 1.3, fontFace: GOVDE_FONT, fontSize: 24, color: "FFFFFF", valign: "middle", margin: 0 });
          if (i < s.maddeler.length - 1) slide.addShape(pres.ShapeType.line, { x: 1.7, y: y + 1.42, w: 10.9, h: 0, line: { color: RENK.altinAcik, width: 0.75, transparency: 70 } });
        });
      }
    }
    return pres;
  }

  // ---- tarayıcı arayüzü ----
  function kutuphaneYukle() {
    if (typeof window.PptxGenJS === "function") return Promise.resolve(window.PptxGenJS);
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = "js/vendor/pptxgen.bundle.js";
      el.onload = () => (typeof window.PptxGenJS === "function" ? resolve(window.PptxGenJS) : reject(new Error("PptxGenJS bulunamadı.")));
      el.onerror = () => reject(new Error("PowerPoint kütüphanesi yüklenemedi (js/vendor/pptxgen.bundle.js)."));
      document.head.appendChild(el);
    });
  }

  function onizlemeCiz(kap, slaytlar) {
    kap.innerHTML = "";
    slaytlar.forEach((s, i) => {
      const kart = document.createElement("div");
      kart.className = "sunum-slayt" + (s.tip === "kapak" || s.tip === "tartisma" ? " koyu" : "");
      const no = document.createElement("span");
      no.className = "sunum-slayt-no";
      no.textContent = String(i + 1);
      const b = document.createElement("strong");
      b.textContent = s.tip === "kapak" ? "Kapak" : s.baslik;
      kart.append(no, b);
      const alt = s.tip === "kapak" ? [s.baslik] : s.tip === "kazanim" ? [s.kazanim] : s.maddeler || [];
      if (alt.length) {
        const p = document.createElement("p");
        p.textContent = alt.join(" · ");
        kart.appendChild(p);
      }
      kap.appendChild(kart);
    });
  }

  function render(container, subjectData, seviye) {
    container.innerHTML = "";
    const uniteler = DataLoader.getUniteler(seviye);
    if (!uniteler.length) {
      container.innerHTML = '<p class="uyari">Bu ders/sınıf düzeyi için tanımlı ünite bulunamadı.</p>';
      return;
    }
    const h = document.createElement("h2");
    h.textContent = `${subjectData.dersAdi} — ${seviye.etiket} Sunum`;
    container.appendChild(h);

    const ozet = document.createElement("p");
    ozet.className = "modul-ozet";
    ozet.textContent = "Seçtiğiniz öğrenme çıktısından PowerPoint sunusu üretilir. Tartışma soruları öneridir; indirdikten sonra PowerPoint'te düzenleyebilirsiniz.";
    container.appendChild(ozet);

    const alan = document.createElement("div");
    alan.className = "secim-alani cg-secici-alani";
    const mk = (id, etiket) => {
      const satir = document.createElement("div");
      satir.className = "secim-satiri";
      const l = document.createElement("label");
      l.setAttribute("for", id);
      l.textContent = etiket;
      const sel = document.createElement("select");
      sel.id = id;
      satir.append(l, sel);
      alan.appendChild(satir);
      return sel;
    };
    const uniteSel = mk("sn-unite", "Ünite seçin");
    const ciktiSel = mk("sn-cikti", "Öğrenme çıktısı seçin");
    uniteler.forEach((u, i) => uniteSel.appendChild(new Option(`${u.uniteNo}. ${u.uniteAdi}`, String(i))));
    container.appendChild(alan);

    const fs = document.createElement("fieldset");
    fs.className = "cg-secenekler";
    fs.innerHTML = "<legend>Sunuma eklenecek bölümler</legend>";
    const kutular = {};
    for (const [k, e] of [["icerik", "Konu başlıkları"], ["kavramlar", "Anahtar kavramlar"], ["surec", "Süreç bileşenleri"], ["tartisma", "Tartışma soruları"], ["kapanis", "Ders sonu değerlendirme"]]) {
      const l = document.createElement("label");
      l.className = "cg-secenek-kutusu";
      const c = document.createElement("input");
      c.type = "checkbox";
      c.checked = true;
      c.id = "sn-secenek-" + k;
      l.setAttribute("for", c.id);
      l.append(c, document.createTextNode(" " + e));
      fs.appendChild(l);
      kutular[k] = c;
    }
    container.appendChild(fs);

    const onizleme = document.createElement("div");
    onizleme.className = "sunum-onizleme";
    onizleme.setAttribute("aria-live", "polite");
    container.appendChild(onizleme);

    const durum = document.createElement("p");
    durum.className = "modul-ozet";
    durum.setAttribute("role", "status");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "eylem-buton";
    btn.textContent = "PowerPoint (.pptx) olarak indir";
    container.append(btn, durum);

    let guncel = null;
    function guncelle() {
      const unite = uniteler[Number(uniteSel.value)];
      const cikti = (unite.ogrenmeCiktilari || [])[Number(ciktiSel.value)];
      guncel = null;
      if (!cikti) { onizleme.innerHTML = ""; return; }
      const sec = {};
      for (const k of Object.keys(kutular)) sec[k] = kutular[k].checked;
      const slaytlar = slaytlariHazirla(subjectData, seviye, unite, cikti, sec);
      guncel = { slaytlar, cikti };
      onizlemeCiz(onizleme, slaytlar);
    }
    function ciktiDoldur() {
      const unite = uniteler[Number(uniteSel.value)];
      ciktiSel.innerHTML = "";
      (unite.ogrenmeCiktilari || []).forEach((c, i) => ciktiSel.appendChild(new Option(`${c.kod} — ${c.baslik}`, String(i))));
    }
    uniteSel.addEventListener("change", () => { ciktiDoldur(); guncelle(); });
    ciktiSel.addEventListener("change", guncelle);
    Object.values(kutular).forEach((c) => c.addEventListener("change", guncelle));

    btn.addEventListener("click", async () => {
      if (!guncel) return;
      btn.disabled = true;
      durum.textContent = "Sunum hazırlanıyor…";
      try {
        const Pptx = await kutuphaneYukle();
        const pres = pptxOlustur(Pptx, guncel.slaytlar, guncel.cikti);
        await pres.writeFile({ fileName: dosyaAdi(guncel.cikti) });
        durum.textContent = `${guncel.slaytlar.length} slaytlık sunum indirildi.`;
      } catch (err) {
        durum.textContent = "Sunum oluşturulamadı: " + err.message;
      } finally {
        btn.disabled = false;
      }
    });

    ciktiDoldur();
    guncelle();
  }

  return { render, slaytlariHazirla, pptxOlustur, dosyaAdi };
})();
