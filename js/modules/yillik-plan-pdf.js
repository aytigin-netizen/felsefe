// js/modules/yillik-plan-pdf.js
// Yıllık Plan önizlemesini gerçek bir PDF Blob'una dönüştürüp indirir.
// Ortak belge modelini veya DOCX üretimini değiştirmez.

const YillikPlanPdf = (() => {
  const A4_LANDSCAPE = { width: 297, height: 210, margin: 5 };

  function dosyaAdi(model) {
    const safe = (v) => String(v || "")
      .replace(/[\\/:*?"<>|]/g, "-")
      .replace(/\s+/g, "_");
    return safe(model.ders) + "_" + safe(model.sinif) + "_" + safe(model.yil) + "_Yillik_Plani.pdf";
  }

  async function blobOlustur(element) {
    if (!element) throw new Error("PDF için yıllık plan belgesi bulunamadı.");
    if (typeof html2canvas !== "function" || !window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("PDF bileşenleri yüklenemedi. İnternet bağlantısını kontrol edip yeniden deneyin.");
    }

    if (document.fonts && document.fonts.ready) await document.fonts.ready;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
    const usableWidth = A4_LANDSCAPE.width - A4_LANDSCAPE.margin * 2;
    const usableHeight = A4_LANDSCAPE.height - A4_LANDSCAPE.margin * 2;
    const pagePixelHeight = Math.max(1, Math.floor(canvas.width * usableHeight / usableWidth));
    let y = 0;
    let page = 0;

    while (y < canvas.height) {
      const sliceHeight = Math.min(pagePixelHeight, canvas.height - y);
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = sliceHeight;
      const ctx = slice.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

      if (page > 0) pdf.addPage("a4", "landscape");
      const renderedHeight = sliceHeight * usableWidth / canvas.width;
      pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG",
        A4_LANDSCAPE.margin, A4_LANDSCAPE.margin, usableWidth, renderedHeight,
        undefined, "FAST");
      y += sliceHeight;
      page += 1;
    }

    const blob = pdf.output("blob");
    if (!blob || blob.size === 0) throw new Error("PDF dosyası boş üretildi.");
    return blob;
  }

  async function indir(element, model) {
    const blob = await blobOlustur(element);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = dosyaAdi(model);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return blob.size;
  }

  return { indir, blobOlustur, dosyaAdi };
})();
