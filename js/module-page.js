// js/module-page.js
// yillik-plan.html, unite-plani.html, calisma-kagidi.html ve degerlendirme.html
// sayfalarının ortak açılış mantığı: State'ten seçimi okur, ders verisini yükler
// ve ilgili modülün render(container, subjectData, seviye) fonksiyonunu çağırır.
// Modüllerin kendisi (js/modules/*.js) değişmedi; sadece artık tek bir
// #modul-icerik yerine kendi sayfalarındaki #sayfa-icerik'e render ediliyorlar.

const ModulePage = (() => {
  async function baslat(renderFn) {
    const container = document.getElementById("sayfa-icerik");
    const sel = State.get();

    if (!sel || !sel.dersKodu) {
      container.innerHTML =
        '<p class="secim-yok">Önce <a href="index.html">ana sayfadan</a> ders ve sınıf/ders düzeyi seçin.</p>';
      return;
    }

    try {
      const subjectData = await DataLoader.loadSubject(sel.dersKodu);
      const seviyeler = DataLoader.getSeviyeler(subjectData);
      const seviye =
        sel.seviyeIndex === null || sel.seviyeIndex === undefined
          ? seviyeler[0]
          : seviyeler[sel.seviyeIndex];

      if (!seviye) {
        container.innerHTML =
          '<p class="secim-yok">Seçili sınıf/ders düzeyi bulunamadı. ' +
          '<a href="index.html">Ana sayfadan</a> yeniden seçin.</p>';
        return;
      }

      renderFn(container, subjectData, seviye);
    } catch (err) {
      container.innerHTML = `<p class="hata">${err.message}</p>`;
    }
  }

  return { baslat };
})();
