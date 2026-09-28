const {JSDOM}=require('jsdom');
const fs=require('node:fs');
const assert=require('node:assert/strict');
async function run(){
  const dom=new JSDOM('<main id="root"></main>',{url:'http://localhost',runScripts:'outside-only'});
  const w=dom.window;let prints=0;w.print=()=>prints++;
  const read=async path=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path,'utf8'))});
  w.fetch=read;
  for(const [p,n] of [['js/belge-bilgisi.js','BelgeBilgisiModule'],['js/gunluk-plan-data.js','GunlukPlanData'],['js/modules/gunluk-plan.js','GunlukPlanModule']])w.eval(fs.readFileSync(p,'utf8')+`\nwindow.${n}=${n};`);
  const data=JSON.parse(fs.readFileSync('data/felsefe_veri_kaynagi.json','utf8'));
  const root=w.document.getElementById('root');
  const FEL11=data.seviyeler.find(s=>s.etiket==='11. Sınıf'),FEL10=data.seviyeler.find(s=>s.etiket==='10. Sınıf');
  const render=(s=FEL11,d=data)=>w.GunlukPlanModule.render(root,d,s);
  const choose=id=>{const s=root.querySelector('#gp-hafta');s.value=id;s.dispatchEvent(new w.Event('change'));};
  const note=()=>root.querySelector('[aria-label="Ders sonrası öğretmen notu"]');
  const write=text=>{note().textContent=text;note().dispatchEvent(new w.Event('input'));};
  const flow=()=>{
    assert.equal([...root.querySelectorAll('.gp-asama h3')].reduce((sum,h)=>sum+Number(h.textContent.match(/· (\d+)/)[1]),0),80);
    assert.equal(root.querySelectorAll('.gp-asama').length,7);
    assert.match(root.textContent,/Anadolu Lisesi/);
    assert.doesNotMatch(root.textContent,/Fen Lisesi|yıldızlı/);
  };
  // Eski sürümden gelen kayıt aynen açılır; ilk açılış varsayılanı h3'tür.
  const oldKey='cds-gunluk-plan:v1:fel-11-al-2026-h3';
  w.localStorage.setItem(oldKey,JSON.stringify({not:'Eski üçüncü hafta notu','akis-0-ogretmen':'Eski öğretmen akışı'}));
  await render();assert.equal(root.querySelector('#gp-hafta').value,'fel-11-al-2026-h3');
  assert.equal(note().textContent,'Eski üçüncü hafta notu');assert.match(root.textContent,/Eski öğretmen akışı/);
  assert.match(root.textContent,/FEL.11.1.2/);flow();
  assert.deepEqual([...root.querySelectorAll('#gp-hafta option')].map(o=>o.value),['fel-11-al-2026-h1','fel-11-al-2026-h3']);
  write('<img src=x onerror=alert(1)>\nÜçüncü hafta');
  choose('fel-11-al-2026-h1');assert.equal(note().textContent,'');
  assert.match(root.querySelector('article').textContent,/FEL.11.1.1/);assert.match(root.textContent,/felsefi soru ve problemleri açıklar/);flow();
  write('Birinci hafta 11');await render();assert.equal(root.querySelector('#gp-hafta').value,'fel-11-al-2026-h1');assert.equal(note().textContent,'Birinci hafta 11');
  choose('fel-11-al-2026-h3');assert.match(note().textContent,/Üçüncü hafta/);assert.equal(root.querySelectorAll('img').length,0);
  root.querySelector('.gp-print').click();assert.equal(prints,1);
  await render(FEL10);assert.equal(root.querySelectorAll('#gp-hafta option').length,1);assert.match(root.textContent,/FEL.10.1.1/);flow();
  assert.equal(note().textContent,'');write('Birinci hafta 10');await render();choose('fel-11-al-2026-h1');assert.equal(note().textContent,'Birinci hafta 11');
  for(const name of ['mantik','psikoloji','sosyoloji']){const d=JSON.parse(fs.readFileSync(`data/${name}_veri_kaynagi.json`));await render(d.seviyeler[0],d);assert.equal(root.querySelectorAll('.gp-print').length,0);assert.match(root.textContent,/henüz eklenmedi/);}
  const missing=JSON.parse(JSON.stringify(FEL11));missing.uniteler=[];await render(missing);assert.match(root.textContent,/eşleşmiyor/);assert.equal(root.querySelectorAll('.gp-print').length,0);
  const hours=JSON.parse(JSON.stringify(FEL10));hours.uniteler[0].ogrenmeCiktilari[0].haftalikDagilim[0].dersSaati='1';await render(hours);assert.match(root.textContent,/eşleşmiyor/);
  w.localStorage.setItem(oldKey,'null');await render();choose('fel-11-al-2026-h3');assert.ok(root.querySelector('.gp-print'));
  w.localStorage.setItem('cds-gunluk-plan-secim:v1:Felsefe:11. Sınıf','silinmis-paket');await render();assert.equal(root.querySelector('#gp-hafta').value,'fel-11-al-2026-h3');
  for(const fetcher of [async()=>({ok:false}),async()=>{throw Error('offline');},async()=>({ok:true,json:async()=>{throw Error('bad json');}}),async()=>({ok:true,json:async()=>[{}]})]){
    w.fetch=fetcher;await render();assert.match(root.textContent,/yüklenemedi veya geçersiz/);assert.equal(root.querySelectorAll('.gp-print').length,0);
  }
  // Geç kalan önceki sınıf yanıtı yeni sınıf görünümünü değiştiremez.
  let release;w.fetch=path=>path.includes('11')?new Promise(resolve=>release=()=>resolve(read(path))):read(path);
  const stale=render();await render(FEL10);release();await stale;assert.match(root.textContent,/FEL.10.1.1/);assert.doesNotMatch(root.textContent,/FEL.11.1.2/);
  const mantik=JSON.parse(fs.readFileSync('data/mantik_veri_kaynagi.json'));assert.equal(mantik.seviyeler[0].toplamDersSaatiYillik,72);
  dom.window.close();console.log('Günlük Plan: üç paket, 80 dk, hafta seçimi, eski kayıt, sınıf/hafta ayrımı, yükleme hataları ve Mantık 72 saat kontrolleri başarılı.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
