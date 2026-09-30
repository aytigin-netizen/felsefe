// js/modules/yillik-plan-docx.js
// Bağımlılıksız, tarayıcıda çalışan minimal DOCX üreticisi.
// Yıllık Plan ortak belge modelini WordprocessingML + ZIP (store) olarak paketler.
const YillikPlanDocx = (() => {
  const enc=new TextEncoder();
  const esc=(s)=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
  const u16=n=>new Uint8Array([n&255,(n>>>8)&255]);
  const u32=n=>new Uint8Array([n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]);
  const cat=(...a)=>{const n=a.reduce((s,x)=>s+x.length,0),o=new Uint8Array(n);let p=0;for(const x of a){o.set(x,p);p+=x.length}return o};
  function zip(files){
    const locals=[],centrals=[];let offset=0;
    for(const [name,text] of files){const nb=enc.encode(name),data=enc.encode(text),crc=crc32(data);
      const local=cat(u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(nb.length),u16(0),nb,data);
      locals.push(local);
      centrals.push(cat(u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(nb.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),nb));
      offset+=local.length;
    }
    const central=cat(...centrals),body=cat(...locals),end=cat(u32(0x06054b50),u16(0),u16(0),u16(files.length),u16(files.length),u32(central.length),u32(body.length),u16(0));
    return new Blob([body,central,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
  }
  const p=(t,b=false,size=12)=>`<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="120" w:lineRule="auto"/></w:pPr><w:r><w:rPr>${b?"<w:b/>":""}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${esc(t)}</w:t></w:r></w:p>`;
  const cell=(t,w,head=false)=>`<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="pct"/><w:tcMar><w:top w:w="20" w:type="dxa"/><w:left w:w="28" w:type="dxa"/><w:bottom w:w="20" w:type="dxa"/><w:right w:w="28" w:type="dxa"/></w:tcMar><w:shd w:fill="${head?"DCE6F1":"FFFFFF"}"/></w:tcPr>${p(t,head,head?14:12)}</w:tc>`;
  function table(rows,widths,header=false){return `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="94A3B8"/><w:left w:val="single" w:sz="4" w:color="94A3B8"/><w:bottom w:val="single" w:sz="4" w:color="94A3B8"/><w:right w:val="single" w:sz="4" w:color="94A3B8"/><w:insideH w:val="single" w:sz="4" w:color="CBD5E1"/><w:insideV w:val="single" w:sz="4" w:color="CBD5E1"/></w:tblBorders></w:tblPr>${rows.map((r,i)=>`<w:tr>${r.map((v,j)=>cell(v,widths[j]||500,i===0&&header)).join("")}</w:tr>`).join("")}</w:tbl>`}
  function xml(model){
    const heads=["Ay / Hafta","Tarih / Saat","Ünite","Konu (İçerik Çerçevesi)","Öğrenme Çıktısı","Süreç Bileşenleri","Sosyal-Duygusal Öğrenme","Değerler","Okuryazarlık Becerileri","Belirli Gün ve Haftalar"];
    const rows=[heads,...model.rows.map(r=>[r.ayHafta,r.tarihSaat,r.unite,r.konu,r.cikti,r.surec,r.sosyal,r.deger,r.okuryazarlik,r.ozelGun])];
    const notes=[["ÖLÇME VE DEĞERLENDİRME","Öğrenme kanıtlarında açık uçlu sorular, çalışma kâğıtları, kavram haritaları, öz ve akran değerlendirme formları, kontrol listeleri, dereceleme ölçekleri, dereceli puanlama anahtarları ve performans görevleri kullanılır."],["FARKLILAŞTIRMA","Zenginleştirme ve destekleme uygulamaları öğrencilerin ilgi, ihtiyaç, öğrenme profili ve hazır bulunuşlukları gözetilerek planlanır."],["OKUL TEMELLİ PLANLAMA","Okul temelli planlama süresi okulun, çevrenin ve öğrencilerin ihtiyaçları doğrultusunda zümre kararıyla planlanır."]];
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${p("TÜRKİYE YÜZYILI MAARİF MODELİ",true)}${p(model.ders+" — "+model.sinif+" Yıllık Planı",true)}${p(model.yil+" Eğitim Öğretim Yılı")}${table([["Ders",model.ders],["Sınıf",model.sinif],["Toplam ders saati",model.toplamSaat?model.toplamSaat+" ders saati":"—"],["Öğrenme çıktısı",model.ciktiSayisi||"—"]],[1200,3800],false)}${p("")}${table(rows,[300,350,500,600,650,900,450,400,450,400],true)}${p("")}${table(notes,[1200,3800],false)}${p("")}${table([["Ders Öğretmeni / İmza","Zümre Başkanı / İmza","Okul Müdürü / Onay"]],[1666,1667,1667],false)}<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="420" w:right="420" w:bottom="420" w:left="420" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  }
  function indir(model){
    const files=[
      ["[Content_Types].xml",`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`],
      ["_rels/.rels",`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`],
      ["word/document.xml",xml(model)]
    ];
    const blob=zip(files),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=[model.ders,model.sinif,model.yil,"Yillik_Plani"].join("_").replace(/\s+/g,"_")+".docx";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  return { indir };
})();