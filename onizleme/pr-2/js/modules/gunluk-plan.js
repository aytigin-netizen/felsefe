// İlk içerik paketi: Felsefe 11 / Anadolu Lisesi / 3. hafta.
// Yeni dersler aynı render yapısına bağımsız içerik paketleriyle eklenebilir.
const GunlukPlanModule = (() => {
  const PILOT = {
    id: 'fel-11-al-2026-h3', ders: 'Felsefe', seviye: '11. Sınıf',
    kod: 'FEL.11.1.2', hafta: '3. Hafta: 28 Eylül-2 Ekim',
    alanlar: [
      ['tarih', 'Ders tarihi', '28.09.2026'],
      ['sinif', 'Sınıf / şube', '11. Sınıf'],
      ['konu', 'Konu', 'Çevre etiğinde insan, canlı ve çevre merkezli argümanların çözümlenmesi'],
      ['materyal', 'Materyaller ve yöntemler', 'Aşağıdaki üç argüman kartı, tahta, karşılaştırma tablosu. Soru-cevap, eşli çalışma, argüman çözümleme ve karşılaştırma.'],
      ['kabul', 'Temel kabuller', 'Öğrencilerin çevre sorunlarını örneklendirebildiği varsayılır. İddia ve gerekçe ayrımı başlangıçta kontrol edilir.'],
      ['on', 'Ön değerlendirme', '“Bir akarsuyu neden korumalıyız?” sorusuna birer gerekçe alınır. Öğrenciden gerekçenin kimi veya neyi koruduğunu belirtmesi istenir.'],
      ['kopru', 'Köprü kurma', 'Yakın çevredeki bir su kaynağını düşünün. İnsanların su ihtiyacı, balıkların yaşamı ve ekosistemin dengesi aynı kararı farklı gerekçelerle destekleyebilir mi?'],
      ['bilesen', 'Bu derste ilişkilendirilen beceri ve değerler', 'SBAB14: Felsefi muhakeme; KB2.4: Çözümleme; KB2.7: Karşılaştırma. SDB2.1: İletişim; SDB2.2: İş birliği. OB1: Bilgi okuryazarlığı. D5: Duyarlılık. E3.6: Analitiklik. Bu liste ders uyarlamasıdır; ünitenin bütün bileşenlerinin her derste işlendiği anlamına gelmez.'],
      ['kartlar', 'Argüman kartları — öğretmen uyarlaması', 'A — Akarsudaki kirlilik insanların sağlığını ve geçim kaynaklarını tehdit eder. İnsanların sağlığını ve geçimini korumalıyız. Bu nedenle akarsuyu kirletmemeliyiz.\n\nB — Akarsudaki canlıların yaşamı, insanlara yararlı olup olmamalarından bağımsız olarak değerlidir. Değerli olan canlı yaşamını korumalıyız. Bu nedenle akarsuyu kirletmemeliyiz.\n\nC — Akarsu, canlı ve cansız unsurlarıyla birbirine bağlı bir ekosistemdir. Ekosistemin bütünlüğünü korumalıyız. Bu nedenle akarsuyu kirletmemeliyiz.\n\nHer kart için: Sonuç nedir? Hangi gerekçelere dayanır? Değerin merkezinde ne vardır? Gerekçenin güçlü yanı ve tartışmaya açık varsayımı nedir?'],
      ['kanit', 'Öğrenme kanıtları ve değerlendirme', 'Ürün: Üç yaklaşımı sonuç, gerekçe, değer odağı ve tartışmaya açık varsayım bakımından karşılaştıran tablo.\nÇıkış sorusu: “Bir orman, insanların dinlenmesini sağladığı için korunmalıdır.” argümanının sonucunu, gerekçesini ve etik yaklaşımını belirtin; bir örtük varsayımını açıklayın.\nKontrol: (1) Sonucu ayırır. (2) Gerekçeyi belirler. (3) Yaklaşımı gerekçesiyle eşleştirir. (4) Bir varsayımı veya sınırlılığı açıklar. Her ölçüt: bağımsız yaptı / destekle yaptı / henüz yapamadı.'],
      ['destek', 'Destekleme', 'İddia ve gerekçeleri iki renkle işaretletin. “Bu görüş … için korumayı savunuyor; çünkü …” cümle başlangıcını verin. Metni eşli okutun; gerekirse aynı çözümlemeyi sözlü kabul edin.'],
      ['zengin', 'Zenginleştirme', 'Erken tamamlayanlar “İnsanlara hiçbir yararı olmayan bir türü korumalı mıyız?” örneğinde A ve B kartlarının varsayımlarını karşılaştırsın. Yeni bir metin yazmak yerine verilen argümanların hangi durumda ayrıştığını açıklasın. Bu etkinlik, öğrencinin ihtiyacına göre kullanılabilecek bir öğretmen uyarlamasıdır.'],
      ['sonraki', 'Sonraki derse hazırlık', 'Günlük hayattan bir çevre görüşü bulun; iddiasını ve gerekçesini işaretleyin. Görüş ve argüman oluşturma sonraki haftanın, kapsamlı felsefi metin yazma ise sonraki süreç bileşenlerinin konusudur.'],
      ['not', 'Ders sonrası öğretmen notu', ''],
    ],
    akis: [
      [5,'Ön değerlendirme','Akarsuyu koruma sorusunu yöneltir; iddia ve gerekçeyi ayırt etmeyi yoklar.','Kısa cevap verir; gerekçesini belirtir.','Başlangıç cevapları'],
      [5,'Köprü kurma','Aynı çevre kararının farklı değer kabullerine dayanabileceğini örnekler.','İnsan, canlı ve ekosistem odağını ayırır.','Üç odaklı tahta notu'],
      [10,'Model çözümleme','A kartında sonuç, gerekçe ve örtük varsayımı sesli düşünerek gösterir.','İddia ve gerekçeyi farklı işaretlerle ayırır.','İşaretlenmiş A kartı'],
      [20,'Eşli çözümleme','B ve C kartlarını dağıtır; doğrudan cevap vermeden yönlendirici sorular sorar.','Kartların sonucunu, gerekçesini ve değer odağını eşli belirler.','İki argüman çözümlemesi'],
      [15,'Karşılaştırma','İkinci ders başında üç yaklaşımı karşılaştıracak tabloyu kurar.','Üç kartı karşılaştırır; bir güçlü yan ve bir sınırlılık yazar.','Karşılaştırma tablosu'],
      [15,'Paylaşım ve geri bildirim','Etik yaklaşımı yalnız sonuca bakarak belirleme yanılgısını tartışmaya açar.','Çözümlemesini açıklar; arkadaşının gerekçesine göre tablosunu düzeltir.','Düzeltilmiş tablo'],
      [10,'Bireysel değerlendirme','Çıkış sorusunu uygular; dört ölçütle öğrenme kanıtını inceler.','Argümanı bağımsız çözümler ve ihtiyaç duyduğu desteği belirtir.','Çıkış yanıtı'],
    ]
  };
  const paketler = [PILOT];
  function render(container, subjectData, seviye) {
    container.replaceChildren(); container.classList.add('gp');
    const add = (tag,text,parent=container) => {const n=document.createElement(tag); n.textContent=text; parent.append(n); return n;};
    add('h1','Günlük Plan');
    const p=paketler.find(p=>p.ders===subjectData.dersAdi && p.seviye===seviye.etiket);
    if(!p){add('p','İlk örnek Felsefe 11. sınıf, Anadolu Lisesi, 3. hafta için hazırlandı. Diğer ders ve sınıfların içerikleri henüz eklenmedi.'); const a=add('a','Ders ve sınıf seçimine dön');a.href='index.html';return;}
    const unite=seviye.uniteler.find(u=>u.ogrenmeCiktilari.some(c=>c.kod===p.kod));
    const cikti=unite?.ogrenmeCiktilari.find(c=>c.kod===p.kod);
    const hafta=cikti?.haftalikDagilim.find(h=>h.hafta===p.hafta);
    if(!hafta){add('p','Örnek planın öğrenme çıktısı veya haftası mevcut kaynakla eşleşmiyor. Plan oluşturulmadı.');return;}
    add('p','İlk örnek • Anadolu Lisesi • 2026–2027 • 3. hafta').className='gp-kapsam';
    add('p','Bu ders akışı öğretmen uyarlaması olarak hazırlanmıştır. Metinleri sınıfınıza göre düzenleyebilirsiniz. Değişiklikler yalnız bu tarayıcıda saklanır.').className='gp-yardim';
    container.append(BelgeBilgisiModule.ustBilgiOlustur(seviye.etiket));
    add('h2',unite.uniteAdi);
    add('p',`${p.hafta} 2026 • ${hafta.dersSaati} ders saati • 2 × 40 dakika`);
    add('p',`${cikti.kod} — ${cikti.baslik}`);
    add('p','Bu haftanın süreç bileşeni: '+hafta.surecBileseniIsaretlenen);
    const key='preview-pr2-cds-gunluk-plan:v1:'+p.id;
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
        const flow=add('section','');add('h2','Dersin işlenişi — 80 dakika',flow);
        add('p','1. ders: ilk dört aşama (40 dk). 2. ders: son üç aşama (40 dk). Teneffüs süreye dahil değildir.',flow);
        p.akis.forEach(([dk,baslik,ogretmen,ogrenci,urun],i)=>{
          const card=add('section','',flow);card.className='gp-asama';add('h3',`${i+1}. ${baslik} · ${dk} dk`,card);
          for(const [field,label,val] of [['ogretmen','Öğretmen',ogretmen],['ogrenci','Öğrenci',ogrenci],['urun','Beklenen ürün',urun]]){add('strong',label,card);edit(`akis-${i}-${field}`,`${baslik} — ${label}`,val,card);}
        });
      }
    }
    add('h3','Kaynak ve kapsam');
    add('p','Öğrenme çıktısı ve haftalık eşleme: MEB 2026–2027 Anadolu Lisesi Felsefe taslak yıllık planı, 11. SINIF sayfası, B6:G6; uygulamanın felsefe veri kaynağıyla karşılaştırıldı. Biçim örneği: öğretmenin sağladığı günlük plan dosyası. Okul türü: Anadolu Lisesi. Ders akışı, argüman kartları ve kontrol ölçütleri: bu örnek için hazırlanmış uyarlama.');
    const a=add('a','TYMM — Çevre Sorunları ve Felsefe');a.href='https://tymm.meb.gov.tr/felsefe-dersi/unite/66';
    const planKaynak=add('a','MEB — 2026–2027 taslak yıllık planlar');planKaynak.href='https://tymm.meb.gov.tr/taslak-cerceve-planlari/ortaogretim';
    container.append(BelgeBilgisiModule.imzaAlaniOlustur(['Ders Öğretmeni','Uygundur — Okul Müdürü']));
    const print=add('button','Yazdır / PDF olarak kaydet');print.type='button';print.className='gp-print';print.addEventListener('click',()=>window.print());
  }
  return {render};
})();
