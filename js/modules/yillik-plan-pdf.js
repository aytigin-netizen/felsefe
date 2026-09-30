// js/modules/yillik-plan-pdf.js
// Yıllık Plan için gerçek (vektör) PDF üretir.
// Ekran görüntüsü (html2canvas → JPEG) KULLANMAZ: PDF doğrudan ortak belge modelinden
// (model.rows) çizilir; böylece 10 sütun, tekrar eden başlık satırı ve sayfalama
// DOCX ile aynı veriden, tarayıcı/ekran geometrisinden bağımsız üretilir.
// Gerekli: js/vendor/jspdf.umd.min.js, jspdf.plugin.autotable.min.js, pdf-yazi-tipi.js

const YillikPlanPdf = (() => {
  const SAYFA = { en: 297, boy: 210, kenar: 7 };
  // DOCX ile aynı sütun oranları (yillik-plan-docx.js)
  const ORANLAR = [300, 350, 500, 600, 650, 900, 450, 400, 450, 400];
  const BASLIKLAR = ["Ay / Hafta", "Tarih / Saat", "Ünite", "Konu (İçerik Çerçevesi)", "Öğrenme Çıktısı",
    "Süreç Bileşenleri", "Sosyal-Duygusal Öğrenme", "Değerler", "Okuryazarlık Becerileri", "Belirli Gün ve Haftalar"];
  const FONT = "DejaVuCond";

  function dosyaAdi(model) {
    const temiz = (v) => String(v || "").replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "_");
    return temiz(model.ders) + "_" + temiz(model.sinif) + "_" + temiz(model.yil) + "_Yillik_Plani.pdf";
  }

  function kutuphaneKontrol() {
    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF || !window.PDF_YAZI_TIPI) throw new Error("PDF bileşenleri yüklenemedi. Sayfayı yenileyip tekrar deneyin.");
    return jsPDF;
  }

  function blobOlustur(model) {
    const jsPDF = kutuphaneKontrol();
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
    if (typeof pdf.autoTable !== "function") throw new Error("PDF tablo bileşeni yüklenemedi.");
    pdf.addFileToVFS("dv.ttf", window.PDF_YAZI_TIPI.normal);
    pdf.addFileToVFS("dv-b.ttf", window.PDF_YAZI_TIPI.bold);
    pdf.addFont("dv.ttf", FONT, "normal");
    pdf.addFont("dv-b.ttf", FONT, "bold");
    pdf.setProperties({ title: model.sinif + " " + model.ders + " Yıllık Planı", creator: "Sosyal Bilimler Öğretmen Araçları" });

    const k = SAYFA.kenar;
    const icGenislik = SAYFA.en - 2 * k;
    let y = k + 3;

    pdf.setFont(FONT, "bold"); pdf.setFontSize(7); pdf.setTextColor(138, 104, 52);
    pdf.text("TÜRKİYE YÜZYILI MAARİF MODELİ", SAYFA.en / 2, y, { align: "center" });
    y += 4.5;
    pdf.setFontSize(11); pdf.setTextColor(23, 60, 52);
    pdf.text(model.ders + " — " + model.sinif + " Yıllık Planı", SAYFA.en / 2, y, { align: "center" });
    y += 4;
    pdf.setFont(FONT, "normal"); pdf.setFontSize(8); pdf.setTextColor(60, 70, 66);
    const bilgi = [model.yil + " Eğitim Öğretim Yılı",
      model.toplamSaat ? "Toplam " + model.toplamSaat + " ders saati" : "",
      model.ciktiSayisi ? model.ciktiSayisi + " öğrenme çıktısı" : ""].filter(Boolean).join("   •   ");
    pdf.text(bilgi, SAYFA.en / 2, y, { align: "center" });
    y += 3;
    const kurum = [model.okul ? "Okul: " + model.okul : "", model.ogretmen ? "Öğretmen: " + model.ogretmen : ""].filter(Boolean).join("   •   ");
    if (kurum) { pdf.text(kurum, SAYFA.en / 2, y + 1.5, { align: "center" }); y += 4.5; }

    const toplam = ORANLAR.reduce((a, b) => a + b, 0);
    const sutunlar = {};
    ORANLAR.forEach((o, i) => { sutunlar[i] = { cellWidth: icGenislik * o / toplam }; });

    const govde = model.rows.map((r) => [r.ayHafta, r.tarihSaat, r.unite, r.konu, r.cikti, r.surec,
      r.sosyal, r.deger, r.okuryazarlik, r.ozelGun].map((v) => String(v == null ? "" : v)));

    pdf.autoTable({
      startY: y,
      head: [BASLIKLAR],
      body: govde,
      margin: { top: k + 2, right: k, bottom: k + 6, left: k },
      tableWidth: icGenislik,
      theme: "grid",
      showHead: "everyPage",
      rowPageBreak: "auto",
      styles: { font: FONT, fontSize: 5.6, cellPadding: 0.9, lineColor: [148, 163, 184], lineWidth: 0.1,
        textColor: [23, 33, 31], overflow: "linebreak", valign: "top" },
      headStyles: { fillColor: [220, 230, 241], textColor: [11, 37, 69], fontStyle: "bold", fontSize: 6 },
      columnStyles: sutunlar,
      didParseCell: (d) => {
        if (d.section === "body" && model.rows[d.row.index] && model.rows[d.row.index].tip === "ozel") {
          d.cell.styles.fillColor = [246, 242, 232];
          d.cell.styles.fontStyle = "bold";
        }
      },
    });

    let sy = pdf.lastAutoTable.finalY + 4;
    if (sy + 22 > SAYFA.boy - k) { pdf.addPage("a4", "landscape"); sy = k + 4; }
    pdf.setFont(FONT, "normal"); pdf.setFontSize(6.5); pdf.setTextColor(23, 33, 31);
    const imzalar = ["Ders Öğretmeni / İmza", "Zümre Başkanı / İmza", "Okul Müdürü / Onay"];
    const w = icGenislik / 3;
    imzalar.forEach((t, i) => {
      const x = k + i * w + w / 2;
      pdf.text(t, x, sy, { align: "center" });
      pdf.line(x - w / 4, sy + 11, x + w / 4, sy + 11);
    });

    const n = pdf.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      pdf.setPage(i); pdf.setFontSize(6); pdf.setTextColor(102, 115, 111);
      pdf.text(i + " / " + n, SAYFA.en - k, SAYFA.boy - 3, { align: "right" });
    }

    const blob = pdf.output("blob");
    if (!blob || blob.size < 1000) throw new Error("PDF dosyası boş üretildi.");
    return { blob, sayfa: n };
  }

  // Not: üretim eşzamanlıdır; indirme kullanıcı dokunuşunun içinde başlar. Nesne URL'si
  // mobil tarayıcıların indirmeyi okuması için uzun süre açık tutulur (eskiden 1 sn idi).
  function indir(modelVeyaEski, model2) {
    const model = model2 || modelVeyaEski;
    const { blob } = blobOlustur(model);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = dosyaAdi(model); a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 120000);
    return blob.size;
  }

  return { indir, blobOlustur, dosyaAdi };
})();
