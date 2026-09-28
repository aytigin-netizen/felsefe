// Ders akışından bağımsız görünüm; içerikler GunlukPlanData ile yüklenir.
const GunlukPlanModule = (() => {
  const istekler = new WeakMap();
  const add = (parent, tag, text) => {
    const node = document.createElement(tag);
    node.textContent = text;
    parent.append(node);
    return node;
  };
  async function render(container, subjectData, seviye) {
    const istek = {};
    istekler.set(container, istek);
    container.replaceChildren();
    container.classList.add('gp');
    add(container, 'h1', 'Günlük Plan');
    const status = add(container, 'p', 'Günlük planlar yükleniyor…');
    status.setAttribute('role', 'status');
    let data;
    try {
      data = await GunlukPlanData.yukle(subjectData.dersAdi, seviye.etiket);
    } catch {
      if (istekler.get(container) !== istek) return;
      status.textContent = 'Günlük plan içerikleri yüklenemedi veya geçersiz. Sayfayı yenileyerek tekrar deneyin.';
      return;
    }
    if (istekler.get(container) !== istek) return;
    const {paketler, varsayilan} = data;
    if (!paketler.length) {
      status.textContent = 'Bu ders ve sınıf için günlük plan içerikleri henüz eklenmedi. Felsefe 10. sınıf 1. hafta; 11. sınıf 1. ve 3. hafta planları hazırdır.';
      add(container, 'a', 'Ders ve sınıf seçimine dön').href = 'index.html';
      return;
    }
    status.remove();
    const controls = add(container, 'div', '');
    controls.className = 'gp-secim';
    const label = add(controls, 'label', 'Hazır günlük plan haftası');
    label.htmlFor = 'gp-hafta';
    const select = add(controls, 'select', '');
    select.id = 'gp-hafta';
    [...paketler].sort((a,b) => a.haftaNo-b.haftaNo).forEach(p => {
      const option = add(select, 'option', `${p.hafta} — ${p.kod}`);
      option.value = p.id;
    });
    add(controls, 'p', 'Listede yalnız içeriği hazırlanmış haftalar bulunur. Her haftanın düzenlemeleri ayrı saklanır.').className = 'gp-yardim';
    const selectionKey = `cds-gunluk-plan-secim:v1:${subjectData.dersAdi}:${seviye.etiket}`;
    let previous;
    try { previous = localStorage.getItem(selectionKey); } catch {}
    select.value = paketler.some(p => p.id === previous) ? previous : varsayilan;
    if (!select.value) select.value = paketler[0].id;
    const body = add(container, 'article', '');
    const draw = () => {
      body.replaceChildren();
      planCiz(body, subjectData, seviye, paketler.find(p => p.id === select.value));
    };
    select.addEventListener('change', () => {
      try { localStorage.setItem(selectionKey, select.value); } catch {}
      draw();
    });
    draw();
  }
  function planCiz(container, subjectData, seviye, p) {
    const add = (tag,text,parent=container) => {const n=document.createElement(tag); n.textContent=text; parent.append(n); return n;};
    const unite=seviye.uniteler.find(u=>u.ogrenmeCiktilari.some(c=>c.kod===p.kod));
    const cikti=unite?.ogrenmeCiktilari.find(c=>c.kod===p.kod);
    const hafta=cikti?.haftalikDagilim.find(h=>h.hafta===p.hafta);
    if(!hafta || Number(hafta.dersSaati)!==p.dersSayisi){add('p','Örnek planın öğrenme çıktısı veya haftası mevcut kaynakla eşleşmiyor. Plan oluşturulmadı.');return;}
    add('p',`${p.okulTuru} • ${p.egitimYili} • ${p.haftaNo}. hafta`).className='gp-kapsam';
    add('p','Bu ders akışı öğretmen uyarlaması olarak hazırlanmıştır. Metinleri sınıfınıza göre düzenleyebilirsiniz. Değişiklikler yalnız bu tarayıcıda saklanır.').className='gp-yardim';
    container.append(BelgeBilgisiModule.ustBilgiOlustur(seviye.etiket));
    add('h2',unite.uniteAdi);
    add('p',`${p.hafta} ${p.yil} • ${hafta.dersSaati} ders saati • ${p.dersSayisi} × ${p.dersDakika} dakika`);
    add('p',`${cikti.kod} — ${cikti.baslik}`);
    add('p','Bu haftanın süreç bileşeni: '+hafta.surecBileseniIsaretlenen);
    const key='cds-gunluk-plan:v1:'+p.id;
    let saved={}; try { const data=JSON.parse(localStorage.getItem(key)||'{}'); if(data && typeof data==='object' && !Array.isArray(data))saved=data; }catch{}
    const status=add('p','');status.className='gp-yardim';status.setAttribute('role','status');
    function save(){try{localStorage.setItem(key,JSON.stringify(saved));status.textContent='Değişiklikler bu tarayıcıya kaydedildi.';}catch{status.textContent='Değişiklikler kaydedilemedi. Sayfayı kapatmadan yazdırın.';}}
    function edit(id,label,value,parent){
      const n=add('div',typeof saved[id]==='string'?saved[id]:value,parent);
      n.className='gp-edit';n.contentEditable='true';n.setAttribute('role','textbox');n.setAttribute('aria-label',label);n.setAttribute('aria-multiline','true');
      n.addEventListener('input',()=>{saved[id]=n.innerText ?? n.textContent;save();});
      n.addEventListener('paste',e=>{e.preventDefault(); const text=e.clipboardData.getData('text/plain'); const selection=window.getSelection();if(!selection.rangeCount)return;const range=selection.getRangeAt(0);if(!n.contains(range.commonAncestorContainer))return;range.deleteContents();const t=document.createTextNode(text);range.insertNode(t);range.setStartAfter(t);range.collapse(true);selection.removeAllRanges();selection.addRange(range);saved[id]=n.innerText ?? n.textContent;save();});
      return n;
    }
    for(const [id,label,value] of p.alanlar){
      const s=add('section','');add('h3',label,s);edit(id,label,value,s);
      if(id==='kartlar'){
        const flow=add('section','');add('h2',`Dersin işlenişi — ${p.dersSayisi*p.dersDakika} dakika`,flow);
        add('p',p.akisAciklama,flow);
        p.akis.forEach(([dk,baslik,ogretmen,ogrenci,urun],i)=>{
          const card=add('section','',flow);card.className='gp-asama';add('h3',`${i+1}. ${baslik} · ${dk} dk`,card);
          for(const [field,label,val] of [['ogretmen','Öğretmen',ogretmen],['ogrenci','Öğrenci',ogrenci],['urun','Beklenen ürün',urun]]){add('strong',label,card);edit(`akis-${i}-${field}`,`${baslik} — ${label}`,val,card);}
        });
      }
    }
    add('h3','Kaynak ve kapsam');
    add('p',p.kaynakAciklama);
    for(const [label,url] of p.kaynaklar){const a=add('a',label);a.href=url; a.className='gp-kaynak';}
    container.append(BelgeBilgisiModule.imzaAlaniOlustur(['Ders Öğretmeni','Uygundur — Okul Müdürü']));
    const print=add('button','Yazdır / PDF olarak kaydet');print.type='button';print.className='gp-print';print.addEventListener('click',()=>window.print());
  }
  return {render};
})();
