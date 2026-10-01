// Modül sayfalarındaki ders / sınıf seçicisi: ana sayfaya dönmeden seçim değiştirilebilmeli.
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const tick = () => new Promise(resolve => setImmediate(resolve));
(async () => {
  const dom = new JSDOM(fs.readFileSync('gunluk-plan.html', 'utf8').replace(/<script[\s\S]*?<\/script>/g, ''), { url: 'http://localhost/gunluk-plan.html', runScripts: 'outside-only' });
  const w = dom.window;
  w.fetch = async file => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(file.split('?')[0], 'utf8')) });
  w.print = () => {};
  for (const [p, n] of [['js/state.js','State'],['js/data-loader.js','DataLoader'],['js/belge-bilgisi.js','BelgeBilgisiModule'],['js/sidebar.js','Sidebar'],['js/module-page.js','ModulePage'],['js/modules/gunluk-plan-verileri.js','FelsefeGunlukPlanlari'],['js/modules/gunluk-plan.js','GunlukPlanModule']])
    w.eval(fs.readFileSync(p, 'utf8') + `\nwindow.${n}=${n};`);
  const doc = w.document, root = doc.getElementById('sayfa-icerik');
  const change = (id, value) => { const s = doc.getElementById(id); s.value = value; s.dispatchEvent(new w.Event('change')); return tick().then(tick); };
  w.Sidebar.init('gunluk-plan');

  // 1) Seçim yokken seçici görünür, yönlendirme mesajı seçiciyi işaret eder.
  await w.ModulePage.baslat(w.GunlukPlanModule.render); await tick();
  assert.ok(doc.getElementById('sayfa-ders'), 'ders seçici yok');
  assert.match(root.textContent, /Yukarıdan ders ve sınıf/);

  // 2) Ders seçilince sınıf menüsü açılır, sınıf seçilene kadar modül render edilmez.
  await change('sayfa-ders', 'felsefe');
  assert.equal(doc.getElementById('sayfa-seviye').hidden, false);
  assert.equal(doc.getElementById('sayfa-seviye').options.length, 3);
  assert.equal(root.querySelectorAll('.gp-asama').length, 0);
  assert.match(doc.getElementById('sidebar-secim-etiketi').textContent, /sınıf seçilmedi/);

  // 3) Sınıf seçilince plan gelir; sınıf değişince plan da değişir (ana sayfaya dönmeden).
  await change('sayfa-seviye', '0');
  assert.equal(w.State.get().seviyeIndex, 0);
  assert.match(root.textContent, /FEL\.10\.1\.1/); assert.equal(root.querySelector('#gp-hafta').options.length, 3);
  assert.match(doc.getElementById('sidebar-secim-etiketi').textContent, /10\. Sınıf/);
  await change('sayfa-seviye', '1');
  assert.equal(w.State.get().seviyeIndex, 1); assert.equal(w.State.get().seviyeEtiket, '11. Sınıf');
  assert.match(root.textContent, /FEL\.11\.1\.1/); assert.equal(root.querySelector('#gp-hafta').options.length, 4);
  assert.match(doc.getElementById('sidebar-secim-etiketi').textContent, /11\. Sınıf/);
  assert.equal(doc.querySelectorAll('#sayfa-secim').length, 1, 'seçici tekrarlanmamalı');

  // 4) Tek seviyeli ders: seviye otomatik atanır, sınıf menüsü gizli kalır.
  await change('sayfa-ders', 'psikoloji');
  assert.equal(doc.getElementById('sayfa-seviye').hidden, true);
  assert.equal(w.State.get().dersKodu, 'psikoloji'); assert.equal(w.State.get().seviyeIndex, 0);

  // 5) Ders temizlenirse seçim silinir ve yönlendirme mesajı döner.
  await change('sayfa-ders', '');
  assert.equal(w.State.get(), null); assert.match(root.textContent, /Yukarıdan ders ve sınıf/);

  // 6) Sayfa yeniden açılınca (kayıtlı seçim) seçici durumu geri yüklenir.
  w.State.set('felsefe', 1, '11. Sınıf');
  await w.ModulePage.baslat(w.GunlukPlanModule.render); await tick();
  assert.equal(doc.getElementById('sayfa-ders').value, 'felsefe'); assert.equal(doc.getElementById('sayfa-seviye').value, '1');
  assert.match(root.textContent, /FEL\.11\.1\.1/);
  dom.window.close();
  console.log('Modül sayfası seçici: ders/sınıf değişimi, otomatik tek seviye, temizleme ve kayıtlı seçimin geri yüklenmesi başarılı.');
})().catch(err => { console.error(err); process.exitCode = 1; });
