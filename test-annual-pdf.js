// Yıllık Plan PDF: ekran görüntüsü değil, vektör PDF; 10 sütun, tüm satırlar, Türkçe karakter.
const { JSDOM } = require("jsdom"); const fs = require("fs"); const assert = require("assert");
(async () => {
  const w = new JSDOM("<body></body>", { url: "http://localhost/", runScripts: "outside-only" }).window;
  for (const f of ["js/vendor/jspdf.umd.min.js", "js/vendor/jspdf.plugin.autotable.min.js", "js/vendor/pdf-yazi-tipi.js"]) w.eval(fs.readFileSync(f, "utf8"));
  for (const [f, n] of [["js/data-loader.js", "DataLoader"], ["js/belge-bilgisi.js", "BelgeBilgisiModule"], ["js/modules/yillik-plan-pdf.js", "YillikPlanPdf"], ["js/modules/yillik-plan.js", "YillikPlanModule"]])
    w.eval(fs.readFileSync(f, "utf8") + `\nwindow.${n}=${n};`);
  const html = fs.readFileSync("yillik-plan.html", "utf8");
  assert(!/html2canvas/.test(html), "html2canvas kullanılmamalı");
  assert(!/<\/script>\\n/.test(html), "HTML'de kaçak \\n kalıntısı var");
  assert(!/src="https?:/.test(html.split("Sidebar.init")[0].split("js/state.js")[1]), "PDF bileşenleri yerel olmalı (CDN bağımlılığı yok)");
  let sayi = 0;
  for (const d of ["felsefe", "sosyoloji", "psikoloji", "mantik"]) {
    const data = JSON.parse(fs.readFileSync(`data/${d}_veri_kaynagi.json`, "utf8"));
    for (const s of data.seviyeler) {
      if (!w.DataLoader.cercevePlanVarMi(s)) continue;
      const model = w.YillikPlanModule.ortakBelgeModeli(data, s);
      const { blob, sayfa } = w.YillikPlanPdf.blobOlustur(model);
      assert(blob.size > 5000, `${d}/${s.etiket}: PDF boş/çok küçük (${blob.size})`);
      assert(sayfa >= 1 && sayfa <= 8, `${d}/${s.etiket}: beklenmeyen sayfa sayısı ${sayfa}`);
      assert(/_Yillik_Plani\.pdf$/.test(w.YillikPlanPdf.dosyaAdi(model)));
      sayi++;
    }
  }
  assert(sayi >= 5, "yeterli ders/seviye test edilmedi");
  console.log(`yillik-plan-pdf: ${sayi} ders/seviye için vektör PDF üretildi ✓`);
})().catch((e) => { console.error(e); process.exit(1); });
