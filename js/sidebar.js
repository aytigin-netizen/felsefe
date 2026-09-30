// js/sidebar.js
// Her sayfada #sidebar öğesinin içini dolduran ortak navigasyon.
// app.js'teki MODULES listesiyle aynı sırayı takip eder; yeni bir modül
// eklendiğinde hem burada hem app.js'te bir satır eklenmesi yeterli.

const Sidebar = (() => {
  // Küçük, ortak SVG simgeleri: gezinme ve ana sayfa kartlarında aynı görsel dil.
  const IKONLAR = {
    home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
    "yillik-plan": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18M7 15h2m4 0h2m-8 3h2"/>',
    "gunluk-plan": '<path d="M14 2H5v20h14V7zM14 2v5h5M8 12h8m-8 4h8"/>',
    "unite-plani": '<path d="M12 5v16M3 4c4-1 6 0 9 1 3-1 5-2 9-1v15c-4-1-6 0-9 2-3-2-5-3-9-2z"/>',
    "calisma-kagidi": '<rect x="4" y="3" width="16" height="19" rx="2"/><path d="m7 9 1 1 2-2m3 1h4M7 14h10M7 18h7"/>',
    degerlendirme: '<path d="M4 3v18h17M8 17v-5m5 5V7m5 10v-8"/>',
    sunum: '<path d="M3 3h18M4 3v13h16V3M12 16v5m-5 0 5-5 5 5M8 8h8m-8 4h5"/>',
    "zumre-tutanagi": '<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2"/>',
  };

  function ikon(anahtar) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${IKONLAR[anahtar] || IKONLAR.home}</svg>`;
  }

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
      const icerik = `<span class="sidebar-ikon">${ikon(n.key)}</span><span class="sidebar-link-baslik">${n.label}</span>`;
      if (yakindaMi) {
        const durum = '<span class="sidebar-durum">Yakında</span>';
        return `<span class="${siniflar.join(" ")}" aria-disabled="true">${icerik}${durum}</span>`;
      }
      return `<a href="${n.href}" class="${siniflar.join(" ")}"${aria}>${icerik}</a>`;
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

  return { init, guncelleSecimEtiketi, ikon };
})();
