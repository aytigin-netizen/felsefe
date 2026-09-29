// Günlük Plan görünümü. İçerik paketleri gunluk-plan-verileri.js dosyasında tutulur.
const GunlukPlanModule = (() => {
  const paketler = typeof FelsefeGunlukPlanlari !== 'undefined' ? FelsefeGunlukPlanlari : [];

  function render(container, subjectData, seviye) {
    container.replaceChildren(); container.classList.add('gp');
    const add=(tag,text,parent=container)=>{const n=document.createElement(tag);n.textContent=text;parent.append(n);return n;};
    add('h1','Günlük Plan');

    const uygun=paketler.filter(p=>p.ders===subjectData.dersAdi && p.seviye===seviye.etiket);
    if(!uygun.length){add('p','Bu ders ve sınıf için günlük plan içeriği henüz eklenmedi.');const a=add('a','Ders ve sınıf seçimine dön');a.href='index.html';return;}

    const secim=add('section','');secim.className='gp-hafta-secim';
    const label=add('label','Hafta seçimi',secim);label.htmlFor='gp-hafta';
    const select=document.createElement('select');select.id='gp-hafta';select.setAttribute('aria-label','Günlük plan haftası');
    uygun.forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.hafta;select.append(o);});secim.append(select);
    const plan=document.createElement('div');container.append(plan);
    const secimKey='cds-gunluk-plan-secim:v1:'+subjectData.dersAdi+':'+seviye.etiket;
    const onceki=localStorage.getItem(secimKey);if(onceki && uygun.some(p=>p.id===onceki))select.value=onceki;

    function planRender(p){
      plan.replaceChildren();
      const unite=seviye.uniteler.find(u=>u.ogrenmeCiktilari.some(c=>c.kod===p.kod));
      const cikti=unite?.ogrenmeCiktilari.find(c=>c.kod===p.kod);
      const hafta=cikti?.haftalikDagilim.find(h=>h.hafta===p.hafta);
      if(!hafta){add('p','Seçili planın öğrenme çıktısı veya haftası mevcut kaynakla eşleşmiyor. Plan oluşturulmadı.',plan);return;}
      add('p',`Anadolu Lisesi • 2026–2027 • ${p.kapsam}`,plan).className='gp-kapsam';
      add('p','Bu ders akışı öğretmen uyarlaması olarak hazırlanmıştır. Metinleri sınıfınıza göre düzenleyebilirsiniz. Değişiklikler yalnız bu tarayıcıda saklanır.',plan).className='gp-yardim';
      plan.append(BelgeBilgisiModule.ustBilgiOlustur(seviye.etiket));
      add('h2',unite.uniteAdi,plan);
      add('p',`${p.hafta} 2026 • ${hafta.dersSaati} ders saati • 2 × 40 dakika`,plan);
      add('p',`${cikti.kod} — ${cikti.baslik}`,plan);
      add('p','Bu haftanın süreç bileşeni: '+hafta.surecBileseniIsaretlenen,plan);
      const key='cds-gunluk-plan:v1:'+p.id;let saved={};
      try{const data=JSON.parse(localStorage.getItem(key)||'{}');if(data&&typeof data==='object'&&!Array.isArray(data))saved=data;}catch{}
      const status=add('p','',plan);status.className='gp-yardim';status.setAttribute('role','status');
      function save(){try{localStorage.setItem(key,JSON.stringify(saved));status.textContent='Değişiklikler bu tarayıcıya kaydedildi.';}catch{status.textContent='Değişiklikler kaydedilemedi. Sayfayı kapatmadan yazdırın.';}}
      function edit(id,label,value,parent){const n=add('div',typeof saved[id]==='string'?saved[id]:value,parent);n.className='gp-edit';n.contentEditable='true';n.setAttribute('role','textbox');n.setAttribute('aria-label',label);n.setAttribute('aria-multiline','true');n.addEventListener('input',()=>{saved[id]=n.innerText??n.textContent;save();});n.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData.getData('text/plain');const selection=window.getSelection();if(!selection.rangeCount)return;const range=selection.getRangeAt(0);if(!n.contains(range.commonAncestorContainer))return;range.deleteContents();const t=document.createTextNode(text);range.insertNode(t);range.setStartAfter(t);range.collapse(true);selection.removeAllRanges();selection.addRange(range);saved[id]=n.innerText??n.textContent;save();});return n;}
      for(const [id,labelText,value] of p.alanlar){const s=add('section','',plan);add('h3',labelText,s);edit(id,labelText,value,s);if(id==='kartlar'){const flow=add('section','',plan);add('h2','Dersin işlenişi — 80 dakika',flow);add('p','1. ders: ilk dört aşama (40 dk). 2. ders: son üç aşama (40 dk). Teneffüs süreye dahil değildir.',flow);p.akis.forEach(([dk,baslik,ogretmen,ogrenci,urun],i)=>{const card=add('section','',flow);card.className='gp-asama';add('h3',`${i+1}. ${baslik} · ${dk} dk`,card);for(const [field,lbl,val] of [['ogretmen','Öğretmen',ogretmen],['ogrenci','Öğrenci',ogrenci],['urun','Beklenen ürün',urun]]){add('strong',lbl,card);edit(`akis-${i}-${field}`,`${baslik} — ${lbl}`,val,card);}});}}
      add('h3','Kaynak ve kapsam',plan);add('p','Öğrenme çıktısı ve haftalık eşleme: MEB 2026–2027 Anadolu Lisesi Felsefe taslak yıllık planı ve uygulamanın felsefe veri kaynağıyla karşılaştırılır. Ders akışı, etkinlikler ve kontrol ölçütleri öğretmen uyarlamasıdır.',plan);
      const a=add('a','TYMM — Felsefe Dersi',plan);a.href='https://tymm.meb.gov.tr/felsefe-dersi';
      const pk=add('a','MEB — 2026–2027 taslak yıllık planlar',plan);pk.href='https://tymm.meb.gov.tr/taslak-cerceve-planlari/ortaogretim';
      plan.append(BelgeBilgisiModule.imzaAlaniOlustur(['Ders Öğretmeni','Uygundur — Okul Müdürü']));
      const print=add('button','Yazdır / PDF olarak kaydet',plan);print.type='button';print.className='gp-print';print.addEventListener('click',()=>window.print());
    }
    select.addEventListener('change',()=>{const p=uygun.find(x=>x.id===select.value);if(!p)return;try{localStorage.setItem(secimKey,p.id);}catch{}planRender(p);});
    planRender(uygun.find(p=>p.id===select.value)||uygun[0]);
  }
  return {render};
})();