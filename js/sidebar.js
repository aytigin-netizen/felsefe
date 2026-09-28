// js/sidebar.js
// Her sayfada #sidebar öğesinin içini dolduran ortak navigasyon.
// app.js'teki MODULES listesiyle aynı sırayı takip eder; yeni bir modül
// eklendiğinde hem burada hem app.js'te bir satır eklenmesi yeterli.

const Sidebar = (() => {
  const NAV = [
    { key: "home", href: "index.html", label: "Ana Sayfa" },
    { key: "yillik-plan", href: "yillik-plan.html", label: "Yıllık Plan", hazir: true },
    { key: "gunluk-plan", href: "gunluk-plan.html", label: "Günlük Plan", hazir: true },
    { key: "unite-plani", href: "unite-plani.html", label: "Ünite Planı", hazir: true },
    { key: "calisma-kagidi", href: "calisma-kagidi.html", label: "Çalışma Kâğıdı", hazir: true },
    { key: "degerlendirme", href: "degerlendirme.html", label: "Değerlendirme / Rubrik", hazir: true },
    { key: "sunum", href: "sunum.html", label: "Sunum", hazir: false },
    { key: "zumre-tutanagi", href: "zumre-tutanagi.html", label: "Zümre Tutanağı", hazir: false },
  ];

  function secimEtiketi() {
    const sel = State.get();
    if (!sel || !sel.dersKodu) return "Ders seçilmedi";
    const meta = (typeof DataLoader !== "undefined" && DataLoader.SUBJECTS[sel.dersKodu]) || null;
    const ad = meta ? meta.label : sel.dersKodu;
    return sel.seviyeEtiket ? `${ad} · ${sel.seviyeEtiket}` : `${ad} · sınıf seçilmedi`;
  }

  function init(aktifAnahtar) {
    const mount = document.getElementById("sidebar");
    if (!mount) return;

    const linkler = NAV.map((n) => {
      const aktif = n.key === aktifAnahtar;
      const yakindaMi = n.hazir === false;
      const siniflar = ["sidebar-link"];
      if (aktif) siniflar.push("active");
      if (yakindaMi) siniflar.push("yakinda");
      const aria = aktif ? ' aria-current="page"' : "";
      if (yakindaMi) {
        const durum = '<span class="sidebar-durum">Yakında</span>';
        return `<span class="${siniflar.join(" ")}" aria-disabled="true">${n.label}${durum}</span>`;
      }
      return `<a href="${n.href}" class="${siniflar.join(" ")}"${aria}>${n.label}</a>`;
    }).join("");

    mount.innerHTML =
      '<div class="sidebar-brand">' +
      '<span class="sidebar-mark" aria-hidden="true">◆</span>' +
      "<div>" +
      '<div class="sidebar-title">Çalışma Masası</div>' +
      '<div class="sidebar-sub">SOSYAL BİLİMLER</div>' +
      "</div>" +
      "</div>" +
      `<nav class="sidebar-nav" aria-label="Modül gezinmesi">${linkler}</nav>` +
      `<a class="sidebar-footer-link" id="sidebar-secim-etiketi" href="index.html">${secimEtiketi()}</a>`;
  }

  function guncelleSecimEtiketi() {
    const node = document.getElementById("sidebar-secim-etiketi");
    if (node) node.textContent = secimEtiketi();
  }

  return { init, guncelleSecimEtiketi };
})();
