// js/app.js
// Ana sayfa (index.html): ders/seviye seçimi, modül ızgarası ve kazanım
// önizlemesi. Seçim artık State (localStorage) üzerinden tutuluyor; modüllere
// tıklamak bu sayfada içerik render etmek yerine ilgili modülün kendi
// sayfasına yönlendiriyor (yillik-plan.html, unite-plani.html, vb.).

const PAGE_HREF = {
  "yillik-plan": "yillik-plan.html",
  "gunluk-plan": "gunluk-plan.html",
  "unite-plani": "unite-plani.html",
  "calisma-kagidi": "calisma-kagidi.html",
  "degerlendirme": "degerlendirme.html",
  sunum: "sunum.html",
  "zumre-tutanagi": "zumre-tutanagi.html",
};

const App = (() => {
  const state = {
    dersKodu: null,
    subjectData: null,
    seviye: null,
    seviyeIndex: null,
  };

  // Sidebar'daki NAV listesiyle aynı sırada tutulur.
  const MODULES = [
    { id: "yillik-plan", label: "Yıllık Plan", hazir: true },
    { id: "gunluk-plan", label: "Günlük Plan", hazir: true },
    { id: "unite-plani", label: "Ünite Planı", hazir: true },
    { id: "calisma-kagidi", label: "Çalışma Kâğıdı", hazir: true },
    { id: "degerlendirme", label: "Değerlendirme / Rubrik", hazir: true },
    { id: "sunum", label: "Sunum", hazir: false },
    { id: "zumre-tutanagi", label: "Zümre Tutanağı", hazir: false },
  ];

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

  // onceki: sayfa açılışında localStorage'dan gelen önceki seviyeIndex (varsa)
  function populateSeviyeMenu(subjectData, onceki) {
    const select = el("seviye-secim");
    select.innerHTML = "";
    const seviyeler = DataLoader.getSeviyeler(subjectData);

    if (seviyeler.length <= 1) {
      select.hidden = true;
      el("seviye-secim-label").hidden = true;
      if (seviyeler.length === 1) {
        state.seviye = seviyeler[0];
        state.seviyeIndex = 0;
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

    if (onceki !== null && onceki !== undefined && seviyeler[onceki]) {
      select.value = String(onceki);
      state.seviye = seviyeler[onceki];
      state.seviyeIndex = onceki;
    }
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
        card.addEventListener("click", () => {
          window.location.href = PAGE_HREF[mod.id];
        });
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

  function stateKaydet() {
    State.set(state.dersKodu, state.seviyeIndex, state.seviye ? state.seviye.etiket : null);
    Sidebar.guncelleSecimEtiketi();
  }

  let yuklemeSirasi = 0;

  async function dersYukleVeUygula(code, seviyeIndex) {
    const istek = ++yuklemeSirasi;
    state.dersKodu = code || null;
    state.subjectData = null;
    state.seviye = null;
    state.seviyeIndex = null;
    el("hata-alani").hidden = true;

    // Yeni veri gelene kadar kartlar ve doğrudan modül girişleri eski
    // ders seçimini kullanmamalı; önce kayıt ve görünümü birlikte temizle.
    State.clear();
    Sidebar.guncelleSecimEtiketi();
    el("seviye-secim").innerHTML = "";
    el("seviye-secim").hidden = true;
    el("seviye-secim-label").hidden = true;
    renderCercevePlanUyarisi();
    renderModuller();
    renderKazanimOnizleme();
    el("yukleniyor").hidden = !code;
    if (!code) return;

    try {
      el("yukleniyor").hidden = false;
      const data = await DataLoader.loadSubject(code);
      if (istek !== yuklemeSirasi) return;
      state.subjectData = data;
      populateSeviyeMenu(data, seviyeIndex);
      stateKaydet();
      renderCercevePlanUyarisi();
      renderModuller();
      renderKazanimOnizleme();
    } catch (err) {
      if (istek !== yuklemeSirasi) return;
      el("hata-alani").hidden = false;
      el("hata-alani").textContent = err.message;
    } finally {
      if (istek === yuklemeSirasi) el("yukleniyor").hidden = true;
    }
  }

  function onDersDegisti(event) {
    dersYukleVeUygula(event.target.value, null);
  }

  function onSeviyeDegisti(event) {
    const idx = event.target.value;
    state.seviye = idx === "" ? null : DataLoader.getSeviyeler(state.subjectData)[Number(idx)];
    state.seviyeIndex = idx === "" ? null : Number(idx);
    stateKaydet();
    renderCercevePlanUyarisi();
    renderModuller();
    renderKazanimOnizleme();
  }

  function init() {
    Sidebar.init("home");
    populateDersMenu();
    el("ders-secim").addEventListener("change", onDersDegisti);
    el("seviye-secim").addEventListener("change", onSeviyeDegisti);

    const kayitli = State.get();
    if (kayitli && kayitli.dersKodu) {
      el("ders-secim").value = kayitli.dersKodu;
      dersYukleVeUygula(kayitli.dersKodu, kayitli.seviyeIndex);
    } else {
      renderModuller();
    }
  }

  return { init, state, MODULES };
})();

document.addEventListener("DOMContentLoaded", App.init);
