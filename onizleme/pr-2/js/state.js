// js/state.js
// Ders/seviye seçimini localStorage'da tutar; çok sayfalı yapıda tüm sayfalar
// aynı seçimi görsün diye state artık App'in belleğinde değil burada yaşıyor.

const State = (() => {
  const ANAHTAR = "preview-pr2-cds-secim";

  function get() {
    try {
      return JSON.parse(localStorage.getItem(ANAHTAR) || "null");
    } catch {
      return null;
    }
  }

  function set(dersKodu, seviyeIndex, seviyeEtiket) {
    try {
      localStorage.setItem(
        ANAHTAR,
        JSON.stringify({
          dersKodu: dersKodu || null,
          seviyeIndex: seviyeIndex === undefined ? null : seviyeIndex,
          seviyeEtiket: seviyeEtiket || null,
        })
      );
    } catch {
      /* localStorage kullanılamıyorsa sessizce yoksay */
    }
  }

  function clear() {
    try {
      localStorage.removeItem(ANAHTAR);
    } catch {
      /* yoksay */
    }
  }

  return { get, set, clear };
})();
