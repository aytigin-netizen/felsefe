const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const tick = () => new Promise(resolve => setImmediate(resolve));
(async () => {
  const dom = new JSDOM(fs.readFileSync('index.html', 'utf8'), {url:'http://localhost/', runScripts:'outside-only'});
  const w = dom.window;
  await tick();
  const requests = [];
  w.fetch = file => new Promise((resolve, reject) => requests.push({file, resolve, reject}));
  for (const [file, name] of [['state','State'],['data-loader','DataLoader'],['sidebar','Sidebar'],['app','App']]) {
    w.eval(fs.readFileSync(`js/${file}.js`,'utf8') + `\nwindow.${name} = ${name};`);
  }
  w.App.init();
  const select = w.document.getElementById('ders-secim');
  const choose = code => { select.value = code; select.dispatchEvent(new w.Event('change')); };
  const finish = async request => { request.resolve({ok:true,json:async()=>JSON.parse(fs.readFileSync(request.file,'utf8'))}); await tick(); };
  const disabled = () => [...w.document.querySelectorAll('#modul-grid button')].every(b=>b.disabled);
  choose('psikoloji'); await finish(requests.at(-1));
  assert.equal(w.State.get().dersKodu,'psikoloji');
  choose('mantik'); const mantik = requests.at(-1);
  assert.equal(w.State.get(),null); assert.ok(disabled());
  assert.equal(w.document.getElementById('kazanim-onizleme').textContent,'');
  // Sidebar üzerinden doğrudan modül girişi de önceki dersi render etmemeli.
  const container = w.document.createElement('div'); container.id='sayfa-icerik'; w.document.body.appendChild(container);
  w.eval(fs.readFileSync('js/module-page.js','utf8')+'\nwindow.ModulePage=ModulePage;');
  let rendered = false; await w.ModulePage.baslat(()=>{rendered=true;});
  assert.equal(rendered,false); assert.match(container.textContent,/ders ve sınıf/);
  choose('felsefe'); const felsefe = requests.at(-1);
  await finish(mantik); assert.equal(w.State.get(),null); assert.ok(!w.document.getElementById('yukleniyor').hidden);
  await finish(felsefe); assert.equal(w.State.get().dersKodu,'felsefe'); assert.ok(disabled());
  const level=w.document.getElementById('seviye-secim'); level.value='1'; level.dispatchEvent(new w.Event('change'));
  assert.equal(w.State.get().seviyeIndex,1); assert.ok(!disabled());
  choose('sosyoloji'); const old = requests.at(-1); choose('mantik'); await tick();
  assert.equal(w.State.get().dersKodu,'mantik'); old.reject(new Error('eski istek')); await tick();
  assert.equal(w.State.get().dersKodu,'mantik'); assert.ok(w.document.getElementById('hata-alani').hidden);
  choose('sosyoloji'); requests.at(-1).reject(new Error('güncel istek')); await tick();
  assert.equal(w.State.get(),null); assert.ok(disabled()); assert.match(w.document.getElementById('hata-alani').textContent,/güncel istek/);
  choose('sosyoloji'); const cleared = requests.at(-1); choose(''); await finish(cleared);
  assert.equal(w.State.get(),null); assert.ok(disabled()); assert.ok(w.document.getElementById('yukleniyor').hidden);
  dom.window.close(); console.log('Seçim regresyonu başarılı: yükleme, doğrudan giriş, ters yanıt sırası, eski hata, seçim temizleme ve güncel hata.');
})().catch(err=>{console.error(err);process.exitCode=1;});
