const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

async function run() {
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "outside-only",
    resources: "usable",
  });
  const { window } = dom;

  // localStorage polyfill (basit, bellek-içi)
  const store = {};
  window.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
  window.print = () => {};

  const errors = [];
  window.addEventListener("error", (e) => errors.push(e.error || e.message));

  const scripts = [
    ["js/data-loader.js", "DataLoader"],
    ["js/belge-bilgisi.js", "BelgeBilgisiModule"],
    ["js/modules/yillik-plan.js", "YillikPlanModule"],
    ["js/modules/unite-plani.js", "UnitePlaniModule"],
    ["js/modules/calisma-kagidi.js", "CalismaKagidiModule"],
    ["js/modules/degerlendirme.js", "DegerlendirmeModule"],
  ];
  for (const [s, globalName] of scripts) {
    const code = fs.readFileSync(path.join(__dirname, s), "utf8");
    // Modüller `const X = (() => {...})();` şeklinde tanımlanıyor; window.eval
    // içinde const/let window'a otomatik property olarak eklenmediği için
    // (tarayıcıda script tag'iyle yüklendiğinde eklenir), testte elle atıyoruz.
    window.eval(code + `\nwindow.${globalName} = ${globalName};`);
  }

  // DataLoader.loadSubject fetch kullanıyor; jsdom'da fetch yok, o yüzden
  // veri dosyalarını doğrudan okuyup DataLoader'ın iç önbelleğini taklit
  // etmek yerine, dosyaları okuyup JSON parse ederek modülleri doğrudan
  // çağırıyoruz (DataLoader.loadSubject'i bypass ediyoruz).
  const dersler = ["felsefe", "sosyoloji", "psikoloji", "mantik"];
  for (const ders of dersler) {
    const dosya = {
      felsefe: "data/felsefe_veri_kaynagi.json",
      sosyoloji: "data/sosyoloji_veri_kaynagi.json",
      psikoloji: "data/psikoloji_veri_kaynagi.json",
      mantik: "data/mantik_veri_kaynagi.json",
    }[ders];
    const subjectData = JSON.parse(fs.readFileSync(path.join(__dirname, dosya), "utf8"));

    for (const seviye of subjectData.seviyeler) {
      const container = window.document.createElement("div");
      window.document.body.appendChild(container);

      try {
        window.YillikPlanModule.render(container, subjectData, seviye);
        if (window.DataLoader.cercevePlanVarMi(seviye) &&
            (!container.textContent.includes("Yıllık Plan Bilgileri") ||
             !container.textContent.includes("Program ve Kaynak Notu"))) {
          errors.push(`[${ders} / ${seviye.etiket}] YillikPlanModule: belge omurgası eksik`);
        }
      } catch (e) {
        errors.push(`[${ders} / ${seviye.etiket}] YillikPlanModule: ${e.stack}`);
      }

      try {
        const c2 = window.document.createElement("div");
        window.UnitePlaniModule.render(c2, subjectData, seviye);
        if (!c2.textContent.includes("Ünite Bilgileri") ||
            !c2.textContent.includes("Program Bağlantısı") ||
            !c2.textContent.includes("Ölçme ve Değerlendirme Notu")) {
          errors.push(`[${ders} / ${seviye.etiket}] UnitePlaniModule: belge omurgası eksik`);
        }
      } catch (e) {
        errors.push(`[${ders} / ${seviye.etiket}] UnitePlaniModule: ${e.stack}`);
      }

      try {
        const c3 = window.document.createElement("div");
        window.CalismaKagidiModule.render(c3, subjectData, seviye);
      } catch (e) {
        errors.push(`[${ders} / ${seviye.etiket}] CalismaKagidiModule: ${e.stack}`);
      }

      try {
        const c4 = window.document.createElement("div");
        window.DegerlendirmeModule.render(c4, subjectData, seviye);
      } catch (e) {
        errors.push(`[${ders} / ${seviye.etiket}] DegerlendirmeModule: ${e.stack}`);
      }
    }
  }

  if (errors.length) {
    console.log("HATALAR BULUNDU:");
    for (const e of errors) console.log(" -", e);
    process.exit(1);
  } else {
    console.log("Tüm modüller hatasız render edildi (tüm ders/seviye kombinasyonları).");
  }
}

run();
