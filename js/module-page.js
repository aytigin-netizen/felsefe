// js/module-page.js
// yillik-plan, gunluk-plan, unite-plani, calisma-kagidi, degerlendirme ve sunum
// sayfalarının ortak açılış mantığı: State'ten seçimi okur, ders verisini yükler
// ve ilgili modülün render(container, subjectData, seviye) fonksiyonunu çağırır.
// Her sayfada, içeriğin üstünde ders ve sınıf/ders düzeyi seçici bulunur; seçim
// değişince State güncellenir ve modül yeniden render edilir (ana sayfaya
// dönmek gerekmez).

const ModulePage = (() => {
  let renderFn = null;
  let istekNo = 0; // geç dönen eski yanıtların güncel seçimi ezmesini önler

  const MESAJ_SEÇİM_YOK = "Yukarıdan ders ve sınıf/ders düzeyi seçin.";

  function secimAlaniKur(container) {
    let alan = document.getElementById("sayfa-secim");
    if (alan) return alan;

    alan = document.createElement("div");
    alan.id = "sayfa-secim";
    alan.className = "sayfa-secim";
    alan.innerHTML =
      '<section class="secim-alani" aria-label="Ders ve sınıf düzeyi seçimi">' +
      '<div class="secim-satiri"><label for="sayfa-ders">Ders</label>' +
      '<select id="sayfa-ders" aria-label="Ders seçin"></select></div>' +
      '<div class="secim-satiri"><label for="sayfa-seviye" id="sayfa-seviye-etiket" hidden>Sınıf / Ders Düzeyi</label>' +
      '<select id="sayfa-seviye" aria-label="Sınıf veya ders düzeyi seçin" hidden></select></div>' +
      "</section>";
    container.parentNode.insertBefore(alan, container);

    const dersSelect = alan.querySelector("#sayfa-ders");
    const bos = document.createElement("option");
    bos.value = "";
    bos.textContent = "Ders seçin…";
    dersSelect.appendChild(bos);
    for (const { code, label } of DataLoader.listSubjects()) {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = label;
      dersSelect.appendChild(opt);
    }

    dersSelect.addEventListener("change", () => {
      if (dersSelect.value) State.set(dersSelect.value, null, null);
      else State.clear();
      goster();
    });
    alan.querySelector("#sayfa-seviye").addEventListener("change", (e) => {
      const sel = State.get();
      if (!sel || !sel.dersKodu) return;
      if (e.target.value === "") {
        State.set(sel.dersKodu, null, null);
      } else {
        const idx = Number(e.target.value);
        State.set(sel.dersKodu, idx, e.target.options[e.target.selectedIndex].textContent);
      }
      goster();
    });
    return alan;
  }

  function seviyeMenusu(seviyeler, seciliIndex) {
    const select = document.getElementById("sayfa-seviye");
    const etiket = document.getElementById("sayfa-seviye-etiket");
    if (!select || !etiket) return;
    select.innerHTML = "";
    if (!seviyeler || seviyeler.length <= 1) {
      select.hidden = true;
      etiket.hidden = true;
      return;
    }
    const bos = document.createElement("option");
    bos.value = "";
    bos.textContent = "Sınıf / düzey seçin…";
    select.appendChild(bos);
    seviyeler.forEach((sev, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = sev.etiket;
      select.appendChild(opt);
    });
    select.value =
      seciliIndex !== null && seciliIndex !== undefined && seviyeler[seciliIndex] ? String(seciliIndex) : "";
    select.hidden = false;
    etiket.hidden = false;
  }

  function sidebarEtiketiniGuncelle() {
    if (typeof Sidebar !== "undefined" && Sidebar.guncelleSecimEtiketi) Sidebar.guncelleSecimEtiketi();
  }

  function mesaj(container, metin, sinif) {
    container.innerHTML = "";
    const p = document.createElement("p");
    p.className = sinif || "secim-yok";
    p.textContent = metin;
    container.appendChild(p);
  }

  async function goster() {
    const bu = ++istekNo;
    const container = document.getElementById("sayfa-icerik");
    secimAlaniKur(container);
    const sel = State.get();
    const dersSelect = document.getElementById("sayfa-ders");
    dersSelect.value = sel && sel.dersKodu ? sel.dersKodu : "";

    if (!sel || !sel.dersKodu) {
      seviyeMenusu(null, null);
      mesaj(container, MESAJ_SEÇİM_YOK);
      sidebarEtiketiniGuncelle();
      return;
    }

    mesaj(container, "Veri yükleniyor…", "secim-yok");
    try {
      const subjectData = await DataLoader.loadSubject(sel.dersKodu);
      if (bu !== istekNo) return;
      const seviyeler = DataLoader.getSeviyeler(subjectData);
      let seciliIndex = sel.seviyeIndex;

      if (seviyeler.length === 1 && (seciliIndex === null || seciliIndex === undefined)) {
        // Tek seviyeli ders: seviye otomatik atanır (ana sayfadaki davranışla aynı).
        seciliIndex = 0;
        State.set(sel.dersKodu, 0, seviyeler[0].etiket);
      }
      seviyeMenusu(seviyeler, seciliIndex);
      sidebarEtiketiniGuncelle();

      if (seciliIndex === null || seciliIndex === undefined) {
        mesaj(container, MESAJ_SEÇİM_YOK);
        return;
      }
      const seviye = seviyeler[seciliIndex];
      if (!seviye) {
        mesaj(container, "Seçili sınıf/ders düzeyi bulunamadı. Yukarıdan yeniden seçin.");
        return;
      }
      container.innerHTML = "";
      renderFn(container, subjectData, seviye);
    } catch (err) {
      if (bu !== istekNo) return;
      mesaj(container, err.message, "hata");
    }
  }

  async function baslat(render) {
    renderFn = render;
    await goster();
  }

  return { baslat };
})();
