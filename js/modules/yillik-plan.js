// js/modules/yillik-plan.js
// FOPOS belge standardına dayalı Yıllık Plan önizleme ve baskı modeli.
// Kaynak veri DataLoader üzerinden kanonik MEB/TYMM veri setidir.

const YillikPlanModule = (() => {
  const ACADEMIC_YEAR = "2026-2027";

  const METINLER = {
    olcme: "Öğrenme kanıtlarında açık uçlu sorular, çalışma kâğıtları, kavram haritaları, öz ve akran değerlendirme formları, kontrol listeleri, dereceleme ölçekleri, dereceli puanlama anahtarları ve performans görevleri; öğrenme çıktısına ve sınıf bağlamına uygun biçimde kullanılır.",
    farklilastirma: "Zenginleştirme ve destekleme uygulamaları öğrencilerin ilgi, ihtiyaç, öğrenme profili, öğrenme hızı ve hazır bulunuşlukları gözetilerek öğretmen tarafından planlanır.",
    otp: "Okul temelli planlama süresi; okulun, çevrenin ve öğrencilerin ihtiyaçları doğrultusunda araştırma, gözlem, proje, sosyal etkinlik, okuma, geri bildirim veya tamamlayıcı öğrenme çalışmaları için zümre kararıyla planlanır."
  };

  function ayHafta(s) {
    return [s.ay || "", s.hafta || ""].filter(Boolean).join("\n");
  }

  function icerikCercevesi(s) {
    return s.icerikCercevesi || s.icerik_cercevesi || s.konu || "";
  }

  function ortakBelgeModeli(subjectData, seviye) {
    const satirlar = DataLoader.tumHaftalikSatirlar(seviye);
    const ozel = DataLoader.getOzelPlanlamaHaftalari(seviye);
    const haftaNo = (v) => parseInt(String(v || ""), 10) || 0;
    const rows = satirlar.map((s) => ({
      tip: "ders",
      no: haftaNo(s.hafta),
      ayHafta: ayHafta(s),
      tarihSaat: (s.dersSaati ? s.dersSaati + " ders saati" : "—"),
      unite: s.uniteNo + ". " + s.uniteAdi,
      konu: icerikCercevesi(s),
      cikti: [s.kazanimKodu, s.kazanimBaslik].filter(Boolean).join(" — "),
      surec: s.surecBileseniIsaretlenen || "",
      sosyal: s.sosyalDuygusalOgrenme || "—",
      deger: s.degerler || "—",
      okuryazarlik: s.okuryazarlikBecerileri || "—",
      ozelGun: s.belirliGunHafta || ""
    }));
    for (const h of ozel) {
      rows.push({
        tip: "ozel", no: haftaNo(h.hafta), ayHafta: [h.ay || "", h.hafta || ""].filter(Boolean).join("\n"),
        tarihSaat: Number.isFinite(h.dersSaati) ? h.dersSaati + " ders saati" : "—",
        unite: String(h.tur || "Özel planlama").toLocaleUpperCase("tr-TR"),
        konu: h.aciklama || h.tur || "", cikti: h.aciklama || h.tur || "", surec: "—",
        sosyal: "—", deger: "—", okuryazarlik: "—", ozelGun: ""
      });
    }
    rows.sort((a,b) => a.no-b.no);
    return {
      ders: subjectData.dersAdi, sinif: seviye.etiket, yil: ACADEMIC_YEAR,
      toplamSaat: seviye.toplamDersSaatiYillik, ciktiSayisi: seviye.toplamOgrenmeCiktisiSayisi,
      haftaSayisi: DataLoader.planliHaftaSayisi(seviye), rows
    };
  }

  function bilgiBolumu(model) {
    const section=document.createElement("section"); section.className="yillik-belge-bolumu yillik-ozet-kart";
    const h=document.createElement("h3"); h.textContent="Yıllık Plan Bilgileri"; section.append(h);
    const grid=document.createElement("div"); grid.className="yillik-ozet-grid";
    [["Ders",model.ders],["Sınıf",model.sinif],["Eğitim öğretim yılı",model.yil],
     ["Toplam ders saati",model.toplamSaat ? model.toplamSaat+" ders saati":"—"],
     ["Öğrenme çıktısı",model.ciktiSayisi || "—"],["Planlı hafta",model.haftaSayisi || "—"]].forEach(([k,v])=>{
      const d=document.createElement("div"); d.className="yillik-ozet-hucre";
      const s=document.createElement("span");s.textContent=k;const b=document.createElement("strong");b.textContent=v;d.append(s,b);grid.append(d);
    }); section.append(grid); return section;
  }

  function anaTablo(model) {
    const wrap=document.createElement("div"); wrap.className="yillik-tablo-kaydirma";
    const table=document.createElement("table"); table.className="yillik-plan-tablosu yillik-fopos-tablosu";
    const heads=["Ay / Hafta","Tarih / Saat","Ünite","Konu (İçerik Çerçevesi)","Öğrenme Çıktısı","Süreç Bileşenleri","Sosyal-Duygusal Öğrenme","Değerler","Okuryazarlık Becerileri","Belirli Gün ve Haftalar"];
    const thead=document.createElement("thead"), tr=document.createElement("tr");
    heads.forEach(x=>{const th=document.createElement("th");th.textContent=x;tr.append(th)});thead.append(tr);table.append(thead);
    const tbody=document.createElement("tbody");
    model.rows.forEach(r=>{const row=document.createElement("tr"); if(r.tip==="ozel") row.className="yillik-ozel-satir";
      [r.ayHafta,r.tarihSaat,r.unite,r.konu,r.cikti,r.surec,r.sosyal,r.deger,r.okuryazarlik,r.ozelGun].forEach(v=>{const td=document.createElement("td");td.textContent=v;row.append(td)});tbody.append(row);
    }); table.append(tbody);wrap.append(table);return wrap;
  }

  function aciklamaBolumleri() {
    const box=document.createElement("section"); box.className="yillik-aciklama-grid";
    [["ÖLÇME VE DEĞERLENDİRME",METINLER.olcme],["FARKLILAŞTIRMA",METINLER.farklilastirma],["OKUL TEMELLİ PLANLAMA",METINLER.otp]].forEach(([h,t])=>{
      const d=document.createElement("article");const title=document.createElement("h3");title.textContent=h;const p=document.createElement("p");p.textContent=t;d.append(title,p);box.append(d);
    }); return box;
  }

  function render(container, subjectData, seviye) {
    container.innerHTML="";
    if(!DataLoader.cercevePlanVarMi(seviye)){const p=document.createElement("p");p.className="uyari";p.textContent="Bu ders/sınıf düzeyi için resmî çerçeve yıllık plan bulunmadığından Yıllık Plan üretilemiyor.";container.append(p);return;}
    const model=ortakBelgeModeli(subjectData,seviye);
    const doc=document.createElement("article");doc.className="yillik-resmi-belge";
    const eyebrow=document.createElement("p");eyebrow.className="yillik-kicker";eyebrow.textContent="TÜRKİYE YÜZYILI MAARİF MODELİ";
    const h=document.createElement("h2");h.textContent=model.ders+" — "+model.sinif+" Yıllık Planı";
    const sub=document.createElement("p");sub.className="yillik-altbaslik";sub.textContent=model.yil+" Eğitim Öğretim Yılı";
    doc.append(eyebrow,h,sub,BelgeBilgisiModule.ustBilgiOlustur(model.sinif),bilgiBolumu(model));
    const kaynak=document.createElement("section");kaynak.className="yillik-belge-bolumu yillik-kaynak-notu";
    const kh=document.createElement("h3");kh.textContent="Program ve Kaynak Notu";kaynak.append(kh);
    const kul=document.createElement("ul");kul.className="yillik-belge-listesi";
    ["Haftalık dağılım, MEB 2026-2027 çerçeve yıllık planı ve Türkiye Yüzyılı Maarif Modeli verilerine dayanır.",
     "Öğrenme çıktıları, içerik çerçevesi ve süreç bileşenleri ilgili program verilerinden yıllık plana aktarılır."].forEach(t=>{const li=document.createElement("li");li.textContent=t;kul.append(li)});
    if(DataLoader.getOzelPlanlamaHaftalari(seviye).length || (seviye.tatiller||[]).length){const li=document.createElement("li");li.textContent="Okul temelli planlama, sosyal etkinlik ve tatil bilgileri bu planda ayrıca gösterilir.";kul.append(li)}
    kaynak.append(kul);doc.append(kaynak,anaTablo(model),aciklamaBolumleri());
    const note=document.createElement("p");note.className="yillik-dipnot";note.textContent="Müfredat dağılımı MEB/TYMM program ve çerçeve plan verilerinden üretilmiştir. Belge, okul ve zümre kararları ile öğretmen kontrolü sonrasında resmî kullanım için tamamlanır.";doc.append(note);
    doc.append(BelgeBilgisiModule.imzaAlaniOlustur(["Ders Öğretmeni / İmza","Zümre Başkanı / İmza","Okul Müdürü / Onay"]));
    container.append(doc);
    const actions=document.createElement("div");actions.className="yillik-eylemler no-print";
    const print=document.createElement("button");print.type="button";print.className="eylem-buton secondary";print.textContent="Yazdır";print.addEventListener("click",()=>window.print());actions.append(print);
    const pdf=document.createElement("button");pdf.type="button";pdf.className="eylem-buton";pdf.textContent="PDF indir";pdf.addEventListener("click",async()=>{
      const onceki=pdf.textContent;pdf.disabled=true;pdf.textContent="PDF hazırlanıyor…";
      try{await YillikPlanPdf.indir(doc,model)}catch(err){window.alert("PDF oluşturulamadı: "+err.message)}finally{pdf.disabled=false;pdf.textContent=onceki}
    });actions.append(pdf);
    const word=document.createElement("button");word.type="button";word.className="eylem-buton secondary";word.textContent="Word (DOCX) indir";word.addEventListener("click",()=>YillikPlanDocx.indir(model));actions.append(word);
    const hint=document.createElement("p");hint.className="baski-ipucu";hint.textContent="Baskı çıktısı A4 yatay sayfa düzenine sabitlenmiştir.";actions.append(hint);container.append(actions);
  }

  return { render, ortakBelgeModeli };
})();