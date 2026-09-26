// app.js
// Menü/seçim mantığı ve modül alanının iskeleti.
// Modüllerin kendisi (Ünite Planı, Sunum vb.) js/modules/ altında ayrı dosyalar olarak
// eklenecek; bu dosya yalnızca hangi modülün aktif olduğunu yönetir ve ortak state'i tutar.

const App = (() => {
  const state = {
    dersKodu: null,
    subjectData: null,
    seviyeEtiket: null,
    seviye: null,
  };

  const MODULES = [
    { id: "yillik-plan", label: "Yıllık Plan", hazir: true },
    { id: "unite-plani", label: "Ünite Planı", hazir: true },
    { id: "calisma-kagidi", label: "Çalışma Kâğıdı", hazir: true },
    { id: "degerlendirme", label: "Değerlendirme / Rubrik", hazir: false },
    { id: "sunum", label: "Sunum", hazir: false },
    { id: "zumre-tutanagi", label: "Zümre Tutanağı", hazir: false },
  ];

  // Modül id'sinden render fonksiyonuna kayıt defteri. Yeni bir modül
  // js/modules/ altına eklendiğinde sadece burada bir satır eklenmesi yeterli.
  const MODULE_RENDERERS = {
    "yillik-plan": (container) => YillikPlanModule.render(container, state.subjectData, state.seviye),
    "unite-plani": (container) => UnitePlaniModule.render(container, state.subjectData, state.seviye),
    "calisma-kagidi": (container) => CalismaKagidiModule.render(container, state.subjectData, state.seviye),
  };

  function el(id) {
    return document.getElementById(id);
  }

  function populateDersMenu() {
    const select = el("ders-secim");
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Ders seçin…";
    select.appendChild(placeholder);
    for (const { code, label } of DataLoader.listSubjects()) {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = label;
      select.appendChild(opt);
    }
  }

  function populateSeviyeMenu(subjectData) {
    const select = el("seviye-secim");
    select.innerHTML = "";
    const seviyeler = DataLoader.getSeviyeler(subjectData);
    if (seviyeler.length <= 1) {
      select.hidden = true;
      el("seviye-secim-label").hidden = true;
      if (seviyeler.length === 1) {
        state.seviye = seviyeler[0];
        state.seviyeEtiket = seviyeler[0].etiket;
      }
      return;
    }
    select.hidden = false;
    el("seviye-secim-label").hidden = false;
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Sınıf/ders düzeyi seçin…";
    select.appendChild(placeholder);
    seviyeler.forEach((sev, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = sev.etiket;
      select.appendChild(opt);
    });
  }

  function renderCercevePlanUyarisi() {
    const box = el("cerceve-plan-uyari");
    if (!state.seviye) {
      box.hidden = true;
      return;
    }
    if (DataLoader.cercevePlanVarMi(state.seviye)) {
      box.hidden = true;
    } else {
      box.hidden = false;
      box.textContent =
        "Bu ders/sınıf düzeyi için resmi çerçeve yıllık plan henüz yayımlanmadı. " +
        "Kazanım verisiyle plan hazırlayabilirsiniz, ancak haftalık tarih eşlemesi bulunmuyor; " +
        "Yıllık Plan modülü bu seviye için devre dışıdır.";
    }
  }

  function renderModuller() {
    const grid = el("modul-grid");
    grid.innerHTML = "";
    const yillikPlanEngelli = state.seviye && !DataLoader.cercevePlanVarMi(state.seviye);

    for (const mod of MODULES) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "modul-karti";
      const engelli =
        !state.seviye || !mod.hazir || (mod.id === "yillik-plan" && yillikPlanEngelli);
      card.disabled = engelli;
      card.setAttribute("aria-disabled", String(engelli));
      if (!engelli) {
        card.addEventListener("click", () => renderModulIcerik(mod.id));
      }

      const baslik = document.createElement("span");
      baslik.className = "modul-baslik";
      baslik.textContent = mod.label;
      card.appendChild(baslik);

      const durum = document.createElement("span");
      durum.className = "modul-durum";
      durum.textContent = !mod.hazir
        ? "Yakında"
        : mod.id === "yillik-plan" && yillikPlanEngelli
        ? "Çerçeve plan yok"
        : "";
      if (durum.textContent) card.appendChild(durum);

      grid.appendChild(card);
    }
  }

  function renderModulIcerik(modulId) {
    const container = el("modul-icerik");
    const renderer = MODULE_RENDERERS[modulId];
    if (!renderer) {
      container.innerHTML = "";
      return;
    }
    renderer(container);
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function temizleModulIcerik() {
    el("modul-icerik").innerHTML = "";
  }

  function renderKazanimOnizleme() {
    const container = el("kazanim-onizleme");
    container.innerHTML = "";
    if (!state.seviye) return;

    const ciktilar = DataLoader.tumOgrenmeCiktilari(state.seviye);
    const baslik = document.createElement("h2");
    baslik.textContent = `${state.subjectData.dersAdi} — ${state.seviye.etiket} (${ciktilar.length} öğrenme çıktısı)`;
    container.appendChild(baslik);

    const liste = document.createElement("ul");
    liste.className = "kazanim-listesi";
    for (const c of ciktilar) {
      const li = document.createElement("li");
      const kod = document.createElement("strong");
      kod.textContent = c.kod + " — ";
      li.appendChild(kod);
      li.appendChild(document.createTextNode(c.baslik));
      li.appendChild(document.createTextNode(` (${c.uniteAdi})`));
      liste.appendChild(li);
    }
    container.appendChild(liste);
  }

  async function onDersDegisti(event) {
    const code = event.target.value;
    state.dersKodu = code || null;
    state.subjectData = null;
    state.seviye = null;
    el("hata-alani").hidden = true;
    temizleModulIcerik();

    if (!code) {
      el("seviye-secim").hidden = true;
      el("seviye-secim-label").hidden = true;
      renderCercevePlanUyarisi();
      renderModuller();
      renderKazanimOnizleme();
      return;
    }

    try {
      el("yukleniyor").hidden = false;
      const data = await DataLoader.loadSubject(code);
      state.subjectData = data;
      populateSeviyeMenu(data);
      renderCercevePlanUyarisi();
      renderModuller();
      renderKazanimOnizleme();
    } catch (err) {
      el("hata-alani").hidden = false;
      el("hata-alani").textContent = err.message;
    } finally {
      el("yukleniyor").hidden = true;
    }
  }

  function onSeviyeDegisti(event) {
    const idx = event.target.value;
    state.seviye = idx === "" ? null : DataLoader.getSeviyeler(state.subjectData)[Number(idx)];
    state.seviyeEtiket = state.seviye ? state.seviye.etiket : null;
    temizleModulIcerik();
    renderCercevePlanUyarisi();
    renderModuller();
    renderKazanimOnizleme();
  }

  function init() {
    populateDersMenu();
    el("ders-secim").addEventListener("change", onDersDegisti);
    el("seviye-secim").addEventListener("change", onSeviyeDegisti);
    renderModuller();
  }

  return { init, state, MODULES };
})();

document.addEventListener("DOMContentLoaded", App.init);
