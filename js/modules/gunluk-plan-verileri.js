// Felsefe Günlük Plan içerikleri — Anadolu Lisesi, 2026–2027.
// Müfredat/hafta eşlemesi data/felsefe_veri_kaynagi.json üzerinden çalışma zamanında doğrulanır.
const FelsefeGunlukPlanlari = [
  {
    id:'fel-10-al-2026-h1', ders:'Felsefe', seviye:'10. Sınıf', kod:'FEL.10.1.1',
    hafta:'1. Hafta: 14-18 Eylül', kapsam:'1. hafta',
    dersHedefi:'Öğrenci, felsefenin anlamına ilişkin farklı tanımları karşılaştırır; ortak bir felsefe tanımının imkânını gerekçeleriyle sorgular ve ilk tanımını bu sorgulama doğrultusunda gözden geçirir.',
    pedagojikBaglantilar:{
      akis:[0,1,2,3,4,5,6],
      kanit:'kanit',
      farklilastirma:['destek','zengin']
    },
    alanlar:[
      ['tarih','Ders tarihi','14.09.2026'],
      ['sinif','Sınıf / şube','10. Sınıf'],
      ['konu','Konu','Felsefenin anlamı ve ortak bir felsefe tanımının mümkün olup olmadığı'],
      ['materyal','Materyaller ve yöntemler','Tahta, kavram kartları ve kısa durum örnekleri. Soru-cevap, düşün-eşleş-paylaş, kavram çözümleme ve sorgulama.'],
      ['kabul','Temel kabuller','Öğrencilerin günlük dilde “felsefe” sözcüğüyle karşılaştığı; ancak felsefi etkinlik ile kişisel kanaati henüz sistemli biçimde ayırmayabileceği kabul edilir.'],
      ['on','Ön değerlendirme','“Felsefe nedir?” sorusuna öğrencilerden tek cümlelik cevaplar alınır. Cevaplar doğrulanmadan tahtada yan yana tutulur; ortak ve ayrışan yönler işaretlenir.'],
      ['kopru','Köprü kurma','“Herkes aynı felsefe tanımını yapmak zorunda mıdır?” sorusuyla gündelik kullanımdan kavramsal sorgulamaya geçilir.'],
      ['bilesen','Bu derste ilişkilendirilen beceri ve değerler','Felsefi merak, soru sorma, kavramları ayırt etme, gerekçe isteme ve farklı görüşleri dinleme. Bu liste ders uyarlamasıdır.'],
      ['kartlar','Sorgulama kartları — öğretmen uyarlaması','A — Felsefe, insanın kendisi ve dünya üzerine soru sormasıdır.\n\nB — Felsefe, kavramları ve kabulleri gerekçeleriyle sorgulama etkinliğidir.\n\nC — Felsefe, tek bir tanıma sığmayacak kadar farklı problem ve yöntemlere sahiptir.\n\nHer kart için: Bu ifade felsefenin hangi yönünü öne çıkarıyor? Neyi dışarıda bırakıyor olabilir? Üç ifade tek bir tanımda birleştirilebilir mi?'],
      ['kanit','Öğrenme kanıtları ve değerlendirme','Ürün: “Felsefe nedir?” sorusuna ilk cevabını ve ders sonundaki gözden geçirilmiş cevabını yan yana yazma.\nÇıkış sorusu: “Felsefenin herkesçe kabul edilen tek bir tanımının yapılması neden güç olabilir?” sorusuna bir gerekçeyle cevap verin.'],
      ['destek','Destekleme','“Felsefe … demektir; çünkü …” cümle başlangıcını verin. Kavram kartlarını sesli okutun ve öğrencinin gerekçesini sözlü ifade etmesine izin verin.'],
      ['zengin','Zenginleştirme','Erken tamamlayan öğrenciler iki farklı felsefe tanımı tasarlasın ve her tanımın hangi yönü öne çıkardığını karşılaştırsın.'],
      ['sonraki','Sonraki derse hazırlık','Günlük yaşamda “felsefe” sözcüğünün kullanıldığı bir örnek bulun. Bu kullanımın derste ele alınan felsefi etkinlikle benzer ve farklı yönünü düşünün.'],
      ['not','Ders sonrası öğretmen notu','']
    ],
    akis:[
      [5,'Merak uyandırma','“Felsefe nedir?” sorusunu yöneltir; cevapları yorumlamadan toplar.','Tek cümlelik ilk tanımını yazar.','İlk tanım'],
      [10,'Cevapları görünür kılma','Cevaplardaki ortak sözcükleri ve farklılıkları işaretler.','Benzerlik ve farklılıkları belirler.','Tahta kavram haritası'],
      [10,'Kavram kartlarını inceleme','Üç kartı dağıtır; her birinin vurgusunu buldurur.','Kartların öne çıkardığı felsefe yönünü belirler.','Kart notları'],
      [15,'Ortak tanım problemi','“Tek tanım mümkün mü?” sorusunu küçük gruplara verir.','Bir görüş ve en az bir gerekçe oluşturur.','Grup gerekçesi'],
      [15,'Görüşleri karşılaştırma','İkinci ders başında gerekçeleri sınıflandırır; tanım ile gerekçeyi ayırır.','Grupların gerekçelerini karşılaştırır.','Karşılaştırma notu'],
      [15,'Tanımı yeniden kurma','İlk tanıma dönülmesini ve gerekçeyle geliştirilmesini ister.','Akran ve öğretmen geri bildirimini dikkate alarak ilk cevabını gerekçesiyle yeniden yazar.','İlk tanım ile geri bildirim sonrası gözden geçirilmiş tanım arasındaki görünür revizyon'],
      [10,'Bireysel değerlendirme','Çıkış sorusunu uygular ve gerekçenin açıklığını kontrol eder.','Tek tanım güçlüğünü bir gerekçeyle açıklar; yanıtını ders hedefi bakımından kısaca kontrol eder.','Gerekçeli bağımsız çıkış yanıtı ve öz-kontrol kaydı']
    ]
  },
  {
    id:'fel-10-al-2026-h2', ders:'Felsefe', seviye:'10. Sınıf', kod:'FEL.10.1.1',
    hafta:'2. Hafta: 21-25 Eylül', kapsam:'2. hafta',
    dersHedefi:'Öğrenci, felsefi düşüncenin sorgulayıcı, refleksif ve tarihsel birikime dayalı özelliklerini örneklerle açıklar; bu özellikleri gündelik düşünmeden ayırarak felsefe tanımını geliştirir.',
    pedagojikBaglantilar:{
      akis:[0,1,2,3,4,5,6],
      kanit:'kanit',
      farklilastirma:['destek','zengin']
    },
    alanlar:[
      ['tarih','Ders tarihi','21.09.2026'],
      ['sinif','Sınıf / şube','10. Sınıf'],
      ['konu','Konu','Felsefi düşüncenin özellikleri, ortaya çıkışı ve tarihsel gelişimi'],
      ['materyal','Materyaller ve yöntemler','Tahta, özellik kartları, kısa düşünce örnekleri ve zaman çizgisi şablonu. Soru-cevap, örnek karşılaştırma, küçük grup çalışması ve tarihsel bağlamlandırma.'],
      ['kabul','Temel kabuller','Öğrencilerin felsefenin ortak tanımı üzerine ilk sorgulamayı yaptığı; ancak felsefi düşüncenin sistemli, eleştirel ve refleksif yapısını gündelik düşünmeden ayırmakta desteğe ihtiyaç duyabileceği kabul edilir.'],
      ['on','Ön değerlendirme','“Her soru felsefi midir?” sorusuna verilen cevaplardan hareketle felsefi düşünceyi gündelik merak, bilimsel açıklama ve kişisel kanaatten ayıran işaretler toplanır.'],
      ['kopru','Köprü kurma','Bir önceki derste yazılan felsefe tanımlarına dönülür. Bu tanımlarda sorgulama, gerekçelendirme, tutarlılık ve bütüncül bakış bulunup bulunmadığı kontrol edilir.'],
      ['bilesen','Bu derste ilişkilendirilen beceri ve değerler','Eleştirel düşünme, kavramsal ayırt etme, tarihsel bağlam kurma, gerekçe arama, tutarlılık ve merak. Bu liste ders uyarlamasıdır.'],
      ['kartlar','Özellik ve tarihsel bağlam kartları — öğretmen uyarlaması','A — Felsefi düşünce sorgulayıcıdır: Verilen cevapla yetinmez, cevabın dayandığı kabulü de sorar.\n\nB — Felsefi düşünce refleksiftir: İnsan yalnız nesneleri değil, kendi düşünmesini de konu edinir.\n\nC — Felsefi düşünce tarihsel birikimle gelişir: Aynı temel sorular farklı dönemlerde farklı kavramlarla yeniden ele alınır.\n\nHer kart için: Bu özellik felsefeyi gündelik düşünmeden nasıl ayırır? Bir önceki haftadaki felsefe tanımlarından hangisi bu özelliği içeriyor? Tarihsel gelişim neden yalnız “eski fikirler listesi” değildir?'],
      ['kanit','Öğrenme kanıtları ve değerlendirme','Ürün: Felsefi düşüncenin en az üç özelliğini kısa açıklama ve her özellik için bir örnek verme.\nÇıkış sorusu: “Felsefi düşünce neden kendi düşünmesini de sorgular?” sorusuna bir örnekle cevap verin.'],
      ['destek','Destekleme','“Felsefi düşünce … özelliğine sahiptir; çünkü …” cümle başlangıcını verin. Özellik kartlarındaki anahtar sözcükleri işaretletin ve öğrencinin örneğini sözlü ifade etmesine izin verin.'],
      ['zengin','Zenginleştirme','Erken tamamlayan öğrenciler aynı sorunun iki farklı dönemde neden farklı cevaplanabileceğini kısa bir örnekle açıklasın. Amaç ayrıntılı felsefe tarihi anlatımı değil, tarihsel bağlam fikrini fark ettirmektir.'],
      ['sonraki','Sonraki derse hazırlık','Günlük hayattan felsefi soru olabilecek bir soru seçin. Bu sorunun hangi felsefi düşünce özelliğini taşıdığını bir cümleyle açıklayın.'],
      ['not','Ders sonrası öğretmen notu','']
    ],
    akis:[
      [5,'Hatırlama ve odaklanma','Önceki haftanın felsefe tanımlarından iki örnek seçer; “Bu tanım felsefi düşüncenin hangi yönünü gösteriyor?” sorusunu yöneltir.','Tanımlardaki sorgulama ve gerekçe izlerini belirler.','Hatırlama notları'],
      [10,'Gündelik ve felsefi düşünce ayrımı','Gündelik kanaat, bilimsel açıklama ve felsefi sorgulama örneklerini karşılaştırır.','Örneklerdeki soru türünü ve gerekçe biçimini ayırır.','Karşılaştırma tablosu'],
      [10,'Özellik kartlarını inceleme','Sorgulayıcı, refleksif ve tarihsel birikime dayalı düşünme kartlarını dağıtır.','Kartların ana fikrini kendi cümlesiyle açıklar.','Kart açıklamaları'],
      [15,'Örnek eşleştirme','Kısa düşünce örneklerini hangi özelliklerle ilişkili olduklarına göre sınıflandırır.','Örnekleri özelliklerle eşleştirir ve gerekçesini yazar.','Eşleştirme gerekçesi'],
      [15,'Tarihsel gelişim bağlantısı','İkinci ders başında aynı temel sorunun farklı dönemlerde yeniden sorulabileceğini zaman çizgisiyle gösterir.','Soru, dönem ve kavram ilişkisini işaretler.','Mini zaman çizgisi'],
      [15,'Özelliklerden tanıma dönüş','Felsefe tanımının bu özelliklerle nasıl zenginleşeceğini tartıştırır.','Akran ve öğretmen geri bildirimini kullanarak ilk tanımını en az iki felsefi düşünce özelliğiyle geliştirir.','İlk tanım ile geri bildirim sonrası geliştirilmiş tanım arasındaki görünür revizyon'],
      [10,'Bireysel değerlendirme','Çıkış sorusunu uygular ve örnek-gerekçe uyumunu kontrol eder.','Refleksif düşünmeyi bir örnekle açıklar; örnek-gerekçe uyumunu kısaca kontrol eder.','Örnekle gerekçelendirilmiş bağımsız çıkış yanıtı ve öz-kontrol kaydı']
    ]
  },
  {
    id:'fel-11-al-2026-h1', ders:'Felsefe', seviye:'11. Sınıf', kod:'FEL.11.1.1',
    hafta:'1. Hafta: 14-18 Eylül', kapsam:'1. hafta',
    dersHedefi:'Öğrenci, bir çevre durumundaki olgusal ve değer boyutlarını ayırır; durumdan felsefi bir soru üretir ve sorunun neden felsefi olduğunu gerekçelendirir.',
    pedagojikBaglantilar:{
      akis:[0,1,2,3,4,5,6],
      kanit:'kanit',
      farklilastirma:['destek','zengin']
    },
    alanlar:[
      ['tarih','Ders tarihi','14.09.2026'],['sinif','Sınıf / şube','11. Sınıf'],
      ['konu','Konu','Çevre ile ilgili felsefi soru ve problemlerin açıklanması'],
      ['materyal','Materyaller ve yöntemler','Çevre durum kartları, tahta ve soru sınıflandırma tablosu. Soru-cevap, örnek olay, küçük grup çalışması ve felsefi soru oluşturma.'],
      ['kabul','Temel kabuller','Öğrencilerin çevre sorunlarına ilişkin temel örnekler verebildiği; ancak olgusal soru ile felsefi soruyu her zaman ayırmayabileceği kabul edilir.'],
      ['on','Ön değerlendirme','“Bir ormanın ekonomik değeri mi, kendi başına değeri mi önemlidir?” sorusu üzerinden ilk görüşler alınır; cevaplardan çok sorunun yapısına dikkat çekilir.'],
      ['kopru','Köprü kurma','Bir çevre sorununun yalnız “ne oldu?” sorusuyla değil “ne yapmalıyız, neden?” sorularıyla da ele alınabileceği gösterilir.'],
      ['bilesen','Bu derste ilişkilendirilen beceri ve değerler','Felsefi problem fark etme, soru oluşturma, kavramsal ayrım yapma, gerekçelendirme ve çevreye duyarlılık. Bu liste ders uyarlamasıdır.'],
      ['kartlar','Çevre durum kartları — öğretmen uyarlaması','A — Bir gölün çevresine yeni tesisler kurulması bölge ekonomisini büyütecek ancak doğal yaşam alanını daraltacaktır.\n\nB — İnsanların kullanmadığı bir canlı türünün yaşam alanı korunmalı mıdır?\n\nC — Gelecek kuşakların bugün alınan çevre kararlarında hakkı var mıdır?\n\nHer kart için: Buradaki olgusal soru nedir? Değer sorusu nedir? Hangi soru felsefi bir probleme dönüşebilir?'],
      ['kanit','Öğrenme kanıtları ve değerlendirme','Ürün: Bir çevre durumundan en az bir felsefi soru çıkarma ve sorunun neden felsefi olduğunu açıklama.\nÇıkış sorusu: “Doğanın yalnız insan yararı için korunması yeterli midir?” sorusunun neden felsefi olduğunu iki özellikle açıklayın.'],
      ['destek','Destekleme','“Ne oldu?” ile “Ne yapmalıyız / neden?” soru kalıplarını yan yana verin. Öğrencinin önce sözlü soru kurmasına izin verin.'],
      ['zengin','Zenginleştirme','Erken tamamlayanlar aynı çevre durumundan iki farklı felsefi problem üretsin ve problemlerin hangi değer çatışmasına dayandığını açıklasın.'],
      ['sonraki','Sonraki derse hazırlık','Yakın çevreden bir çevre sorunu seçin; sorun hakkında bir olgusal, bir de felsefi soru yazın.'],
      ['not','Ders sonrası öğretmen notu','']
    ],
    akis:[
      [5,'Başlangıç sorusu','Orman örneğini sunar ve ilk görüşleri toplar.','İlk görüşünü kısa gerekçeyle söyler.','Başlangıç görüşleri'],
      [10,'Soru türlerini ayırma','Olgusal ve felsefi soru örneklerini karşılaştırır.','Soruların cevaplanma biçimlerindeki farkı belirler.','Soru ayrımı'],
      [10,'Durum kartı inceleme','A kartında olgu, değer ve karar boyutlarını modelleyerek gösterir.','Karttaki farklı soru alanlarını işaretler.','İşaretlenmiş A kartı'],
      [15,'Grup çalışması','B ve C kartlarından felsefi sorular üretmeleri için grupları yönlendirir.','En az bir felsefi soru ve gerekçe oluşturur.','Grup soruları'],
      [15,'Soruları sınama','İkinci ders başında üretilen soruları felsefi soru ölçütleriyle tartıştırır.','Soruları karşılaştırır ve gerekirse yeniden yazar.','Düzeltilmiş sorular'],
      [15,'Problem açıklama','Bir felsefi sorunun arkasındaki değer çatışmasını görünür kılar.','Akran ve öğretmen geri bildirimini dikkate alarak seçtiği sorunun neden felsefi problem oluşturduğunu açıklar ve açıklamasını geliştirir.','İlk problem açıklaması ile geri bildirim sonrası geliştirilmiş açıklama arasındaki görünür revizyon'],
      [10,'Bireysel değerlendirme','Çıkış sorusunu uygular.','Sorunun felsefi niteliğini iki özellikle açıklar; açıklamasını ders hedefi bakımından kontrol eder.','İki ölçütle gerekçelendirilmiş bağımsız çıkış yanıtı ve öz-kontrol kaydı']
    ]
  },
  {
    id:'fel-11-al-2026-h2', ders:'Felsefe', seviye:'11. Sınıf', kod:'FEL.11.1.1',
    hafta:'2. Hafta: 21-25 Eylül', kapsam:'2. hafta',
    dersHedefi:'Öğrenci, bir çevre vakasını felsefi problem, değer çatışması, sorumluluk ve günlük yaşam kararı bakımından değerlendirir; değerlendirmesini gerekçeyle açıklar.',
    pedagojikBaglantilar:{
      akis:[0,1,2,3,4,5,6],
      kanit:'kanit',
      farklilastirma:['destek','zengin']
    },
    alanlar:[
      ['tarih','Ders tarihi','21.09.2026'],['sinif','Sınıf / şube','11. Sınıf'],
      ['konu','Konu','Çevre ile ilgili felsefi soru ve problemlerin hayatla ilişkilendirilerek değerlendirilmesi'],
      ['materyal','Materyaller ve yöntemler','Yakın çevre vaka kartları, değerlendirme ölçüt tablosu ve tahta. Örnek olay, küçük grup tartışması, ölçütle değerlendirme ve bireysel yazma.'],
      ['kabul','Temel kabuller','Öğrencilerin çevreyle ilgili felsefi soru kurma deneyimi edindiği; ancak bu soruları günlük yaşam kararlarıyla ilişkilendirirken olgusal bilgi, değer ve sorumluluk boyutlarını karıştırabileceği kabul edilir.'],
      ['on','Ön değerlendirme','Öğrencilerden yakın çevrede gözledikleri bir çevre sorununu söylemeleri istenir. Her örnek için “Bu olayda kimin sorumluluğu, hangi değer ve hangi karar tartışılıyor?” soruları yöneltilir.'],
      ['kopru','Köprü kurma','Bir önceki hafta üretilen felsefi sorulara dönülür. Bu soruların günlük yaşamda alınan kararları nasıl etkileyebileceği tartışmaya açılır.'],
      ['bilesen','Bu derste ilişkilendirilen beceri ve değerler','Felsefi problemi hayatla ilişkilendirme, değerleri ayırt etme, sorumluluk üzerine düşünme, gerekçeli değerlendirme ve çevreye duyarlılık. Bu liste ders uyarlamasıdır.'],
      ['kartlar','Yakın çevre vaka kartları — öğretmen uyarlaması','A — Okul kantininde tek kullanımlık plastikler ucuz ve pratiktir; ancak atık miktarını artırmaktadır.\n\nB — Bir parkın otoparka dönüştürülmesi ulaşımı kolaylaştıracak; fakat mahalledeki yeşil alanı azaltacaktır.\n\nC — Evde enerji tasarrufu yapmak bazı alışkanlıkları değiştirmeyi gerektirir; herkesin katkısı küçük görünse de toplam etki büyüyebilir.\n\nHer kart için: Buradaki felsefi problem nedir? Hangi değerler çatışıyor? Günlük yaşamda hangi karar bu problemle ilişkilidir? Değerlendirmeniz hangi gerekçeye dayanıyor?'],
      ['kanit','Öğrenme kanıtları ve değerlendirme','Ürün: Bir çevre vakasını felsefi problem, değer çatışması, günlük yaşam kararı ve gerekçe bakımından değerlendiren kısa tablo.\nÇıkış sorusu: “Çevre sorunları yalnız uzmanların çözmesi gereken teknik sorunlar mıdır?” sorusunu günlük yaşamdan bir örnekle değerlendirin.'],
      ['destek','Destekleme','Değerlendirme tablosuna hazır başlıklar verin: olay, felsefi soru, değer, karar, gerekçe. Öğrencinin önce tek bir vaka üzerinde sözlü değerlendirme yapmasına izin verin.'],
      ['zengin','Zenginleştirme','Erken tamamlayanlar aynı vakayı iki farklı değer önceliğiyle değerlendirsin ve sonuç kararın nasıl değiştiğini açıklasın.'],
      ['sonraki','Sonraki derse hazırlık','Bir çevre konusunda duyduğunuz bir görüşü not edin. Görüşün iddiasını, gerekçesini ve hangi değeri merkeze aldığını belirlemeye çalışın.'],
      ['not','Ders sonrası öğretmen notu','']
    ],
    akis:[
      [5,'Yaşamdan örnek toplama','Yakın çevreden çevre sorunu örnekleri ister; örnekleri yargılamadan tahtada toplar.','Gözlediği bir çevre sorununu kısa biçimde söyler.','Örnek havuzu'],
      [10,'Problem boyutlarını ayırma','Seçilen bir örnekte olgu, değer, sorumluluk ve karar boyutlarını modelleyerek ayırır.','Olayda neyin olgu, neyin değer tartışması olduğunu işaretler.','Boyut ayrımı'],
      [10,'Vaka kartı inceleme','A kartını sınıfla birlikte çözümler; felsefi problem ile pratik kararı ilişkilendirir.','Karttaki değer çatışmasını ve karar noktasını belirler.','İşaretlenmiş A kartı'],
      [15,'Grup değerlendirmesi','B ve C kartlarını gruplara verir; değerlendirme tablosunu doldurmalarını ister.','Vaka için felsefi problem, değer ve gerekçe yazar.','Grup değerlendirme tablosu'],
      [15,'Gerekçeleri karşılaştırma','İkinci ders başında grupların gerekçelerini karşılaştırır; teknik çözüm ile felsefi değerlendirme farkını vurgular.','Farklı gerekçelerin kararları nasıl etkilediğini açıklar.','Karşılaştırma notu'],
      [15,'Günlük yaşam bağlantısı','Öğrencilerden kendi yaşamlarında uygulanabilir bir karar seçmelerini ve gerekçelendirmelerini ister.','Akran ve öğretmen geri bildirimine göre seçtiği kararın felsefi problem, değer ve gerekçe bağlantısından en az birini geliştirir.','İlk değerlendirme ile geri bildirim sonrası gerekçeli karar arasındaki görünür revizyon'],
      [10,'Bireysel değerlendirme','Çıkış sorusunu uygular; örnek ve değerlendirme ilişkisini kontrol eder.','Teknik sorun-felsefi problem ayrımını günlük örnekle değerlendirir; yanıtını problem-değer-gerekçe ilişkisi bakımından kontrol eder.','Günlük örnekle gerekçelendirilmiş bağımsız çıkış yanıtı ve öz-kontrol kaydı']
    ]
  },
  {
    id:'fel-11-al-2026-h3', ders:'Felsefe', seviye:'11. Sınıf', kod:'FEL.11.1.2',
    hafta:'3. Hafta: 28 Eylül-2 Ekim', kapsam:'3. hafta',
    dersHedefi:'Öğrenci, çevre etiğine ilişkin insan merkezci, canlı merkezci ve çevre merkezci argümanları; sonuç, gerekçe, değer odağı ve örtük varsayımları bakımından çözümler ve karşılaştırır.',
    pedagojikBaglantilar:{
      akis:[0,1,2,3,4,5,6],
      kanit:'kanit',
      farklilastirma:['destek','zengin']
    },
    alanlar:[
      ['tarih','Ders tarihi','28.09.2026'],['sinif','Sınıf / şube','11. Sınıf'],
      ['konu','Konu','Çevre etiğinde insan, canlı ve çevre merkezli argümanların çözümlenmesi'],
      ['materyal','Materyaller ve yöntemler','Aşağıdaki üç argüman kartı, tahta, karşılaştırma tablosu. Soru-cevap, eşli çalışma, argüman çözümleme ve karşılaştırma.'],
      ['kabul','Temel kabuller','Öğrencilerin çevre sorunlarını örneklendirebildiği varsayılır. İddia ve gerekçe ayrımı başlangıçta kontrol edilir.'],
      ['on','Ön değerlendirme','“Bir akarsuyu neden korumalıyız?” sorusuna birer gerekçe alınır. Öğrenciden gerekçenin kimi veya neyi koruduğunu belirtmesi istenir.'],
      ['kopru','Köprü kurma','Yakın çevredeki bir su kaynağını düşünün. İnsanların su ihtiyacı, balıkların yaşamı ve ekosistemin dengesi aynı kararı farklı gerekçelerle destekleyebilir mi?'],
      ['bilesen','Bu derste ilişkilendirilen beceri ve değerler','SBAB14: Felsefi muhakeme; KB2.4: Çözümleme; KB2.7: Karşılaştırma. SDB2.1: İletişim; SDB2.2: İş birliği. OB1: Bilgi okuryazarlığı. D5: Duyarlılık. E3.6: Analitiklik. Bu liste ders uyarlamasıdır; ünitenin bütün bileşenlerinin her derste işlendiği anlamına gelmez.'],
      ['kartlar','Argüman kartları — öğretmen uyarlaması','A — Akarsudaki kirlilik insanların sağlığını ve geçim kaynaklarını tehdit eder. İnsanların sağlığını ve geçimini korumalıyız. Bu nedenle akarsuyu kirletmemeliyiz.\n\nB — Akarsudaki canlıların yaşamı, insanlara yararlı olup olmamalarından bağımsız olarak değerlidir. Değerli olan canlı yaşamını korumalıyız. Bu nedenle akarsuyu kirletmemeliyiz.\n\nC — Akarsu, canlı ve cansız unsurlarıyla birbirine bağlı bir ekosistemdir. Ekosistemin bütünlüğünü korumalıyız. Bu nedenle akarsuyu kirletmemeliyiz.\n\nHer kart için: Sonuç nedir? Hangi gerekçelere dayanır? Değerin merkezinde ne vardır? Gerekçenin güçlü yanı ve tartışmaya açık varsayımı nedir?'],
      ['kanit','Öğrenme kanıtları ve değerlendirme','Ürün: Üç yaklaşımı sonuç, gerekçe, değer odağı ve tartışmaya açık varsayım bakımından karşılaştıran tablo.\nÇıkış sorusu: “Bir orman, insanların dinlenmesini sağladığı için korunmalıdır.” argümanının sonucunu, gerekçesini ve etik yaklaşımını belirtin; bir örtük varsayımını açıklayın.\nKontrol: (1) Sonucu ayırır. (2) Gerekçeyi belirler. (3) Yaklaşımı gerekçesiyle eşleştirir. (4) Bir varsayımı veya sınırlılığı açıklar. Her ölçüt: bağımsız yaptı / destekle yaptı / henüz yapamadı.'],
      ['destek','Destekleme','İddia ve gerekçeleri iki renkle işaretletin. “Bu görüş … için korumayı savunuyor; çünkü …” cümle başlangıcını verin. Metni eşli okutun; gerekirse aynı çözümlemeyi sözlü kabul edin.'],
      ['zengin','Zenginleştirme','Erken tamamlayanlar “İnsanlara hiçbir yararı olmayan bir türü korumalı mıyız?” örneğinde A ve B kartlarının varsayımlarını karşılaştırsın. Yeni bir metin yazmak yerine verilen argümanların hangi durumda ayrıştığını açıklasın. Bu etkinlik, öğrencinin ihtiyacına göre kullanılabilecek bir öğretmen uyarlamasıdır.'],
      ['sonraki','Sonraki derse hazırlık','Günlük hayattan bir çevre görüşü bulun; iddiasını ve gerekçesini işaretleyin. Görüş ve argüman oluşturma sonraki haftanın, kapsamlı felsefi metin yazma ise sonraki süreç bileşenlerinin konusudur.'],
      ['not','Ders sonrası öğretmen notu','']
    ],
    akis:[
      [5,'Ön değerlendirme','Akarsuyu koruma sorusunu yöneltir; iddia ve gerekçeyi ayırt etmeyi yoklar.','Kısa cevap verir; gerekçesini belirtir.','Başlangıç yanıtında iddia–gerekçe ayrımı'],
      [5,'Köprü kurma','Aynı çevre kararının farklı değer kabullerine dayanabileceğini örnekler.','İnsan, canlı ve ekosistem odağını ayırır.','Üç değer odağını ayıran tahta kaydı'],
      [10,'Model çözümleme','A kartında sonuç, gerekçe ve örtük varsayımı sesli düşünerek gösterir.','İddia ve gerekçeyi farklı işaretlerle ayırır.','A kartında sonuç–gerekçe–örtük varsayım işaretlemesi'],
      [20,'Eşli çözümleme','B ve C kartlarını dağıtır; doğrudan cevap vermeden yönlendirici sorular sorar.','Kartların sonucunu, gerekçesini ve değer odağını eşli belirler.','B ve C kartlarında sonuç–gerekçe–değer odağı çözümlemesi'],
      [15,'Karşılaştırma','İkinci ders başında üç yaklaşımı karşılaştıracak tabloyu kurar.','Üç kartı karşılaştırır; bir güçlü yan ve bir sınırlılık yazar.','Üç yaklaşımın gerekçe, değer odağı, güçlü yan ve sınırlılığını gösteren karşılaştırma tablosu'],
      [15,'Paylaşım ve geri bildirim','Etik yaklaşımı yalnız sonuca bakarak belirleme yanılgısını tartışmaya açar; akran gerekçesine dayalı düzeltme için kısa geri bildirim verir.','Çözümlemesini açıklar; akran ve öğretmen geri bildirimine göre gerekçe, değer odağı veya sınırlılık açıklamasından en az birini görünür biçimde düzeltir.','İlk tablo ile geri bildirim sonrası düzeltilmiş tablo arasındaki görünür revizyon'],
      [10,'Bireysel değerlendirme','Çıkış sorusunu uygular; dört ölçütle öğrenme kanıtını inceler ve öğrencinin hangi ölçütte desteğe ihtiyaç duyduğunu belirlemesini ister.','Argümanı bağımsız çözümler; dört ölçüte göre yanıtını gözden geçirir ve ihtiyaç duyduğu desteği belirtir.','Dört ölçüte göre bağımsız çıkış yanıtı ve öğrencinin destek ihtiyacı kaydı']
    ]
  },
  {
    id:'fel-10-al-2026-h3', ders:'Felsefe', seviye:'10. Sınıf', kod:'FEL.10.1.1',
    hafta:'3. Hafta: 28 Eylül-2 Ekim', kapsam:'3. hafta',
    dersHedefi:'Öğrenci, felsefi soruyu diğer soru türlerinden ayıran özellikleri belirler; gündelik bir soruyu bu ölçütlere göre felsefi soruya dönüştürür ve dönüşümünü gerekçelendirir.',
    pedagojikBaglantilar:{
      akis:[0,1,2,3,4,5,6],
      kanit:'kanit',
      farklilastirma:['destek','zengin']
    },
    alanlar:[
      ['tarih','Ders tarihi','28.09.2026'],
      ['sinif','Sınıf / şube','10. Sınıf'],
      ['konu','Konu','Felsefi sorunun temel özellikleri ve felsefi soru sorma'],
      ['materyal','Materyaller ve yöntemler','Tahta, soru kartları ve soru dönüştürme tablosu. Soru-cevap, sınıflandırma, küçük grup çalışması ve soru üretme.'],
      ['kabul','Temel kabuller','Öğrencilerin gündelik, bilimsel ve felsefi nitelikte sorular sorabildiği varsayılır; felsefi soruyu diğerlerinden ayıran ölçütleri henüz açıkça ifade edemeyebilecekleri kabul edilir.'],
      ['on','Ön değerlendirme','“Bugün kaçta çıkıyoruz?”, “Su kaç derecede kaynar?” ve “İyi bir yaşam nedir?” soruları tahtaya yazılır. Öğrencilerden bu üç sorunun neden aynı türden olmadığını tek cümleyle belirtmesi istenir.'],
      ['kopru','Köprü kurma','Önceki derste felsefi düşüncenin özellikleri ve tarihsel gelişimi ele alındı. Bu düşünce, kendine özgü hangi tür sorularla işler?'],
      ['bilesen','Bu derste ilişkilendirilen beceri ve değerler','Soru sorma, kavramları ayırt etme, gerekçe isteme ve farklı görüşleri dinleme. Bu liste ders uyarlamasıdır.'],
      ['kartlar','Soru kartları — öğretmen uyarlaması','A — Su kaç derecede kaynar?\n\nB — Bir eylemi doğru yapan nedir?\n\nC — Okul kaçta başlıyor?\n\nD — Özgür olmak ne demektir?\n\nHer kart için: Bu soru tek bir doğru cevapla kapanıyor mu? Cevap için gözlem veya ölçüm yeterli mi? Sorunun içindeki hangi kavram tartışmaya açık? Aynı soru farklı gerekçelerle farklı cevaplanabilir mi?'],
      ['kanit','Öğrenme kanıtları ve değerlendirme','Ürün: Bir gündelik sorunun felsefi soruya dönüştürülmüş hâli ve bu sorunun felsefi sayılma gerekçesi.\nÇıkış sorusu: “Bir sorunun felsefi sayılmasını sağlayan özelliklerden birini kendi sorunuzla açıklayın.”\nKontrol: (1) Soruyu açıkça yazar. (2) Bir özelliği belirtir. (3) Özelliği kendi sorusuyla ilişkilendirir. Her ölçüt: bağımsız yaptı / destekle yaptı / henüz yapamadı.'],
      ['destek','Destekleme','“Bu soru felsefidir; çünkü …” ve “Bu soru felsefi değildir; çünkü …” cümle başlangıçlarını verin. Kartları eşli okutun; gerekçeyi önce sözlü aldırın.'],
      ['zengin','Zenginleştirme','Erken tamamlayanlar felsefi olmadığını düşündükleri bir soruyu, içindeki bir kavramı tartışmaya açarak felsefi soruya dönüştürsün ve dönüşümün neyi değiştirdiğini açıklasın.'],
      ['sonraki','Sonraki derse hazırlık','Bir hafta içinde karşılaştığınız bir soruyu seçin; felsefenin bilim, din ve sanatla ilişkisi bakımından hangi alana daha yakın durduğunu düşünün. Bu ilişki sonraki haftanın konusudur.'],
      ['not','Ders sonrası öğretmen notu','']
    ],
    akis:[
      [5,'Merak uyandırma','Üç soruyu tahtaya yazar; aralarındaki farkı sezdirmeden cevapları toplar.','Sorular arasındaki farkı tek cümleyle yazar.','Başlangıç cümlesi'],
      [10,'Soruları ayırma','Cevap türlerini (bilgi, ölçüm, gerekçelendirme) tahtada görünür kılar.','Soruları cevap türüne göre gruplar.','Gruplama notu'],
      [15,'Soru kartlarını inceleme','Kartları dağıtır; yönlendirici sorularla özellikleri buldurur.','Kartları ölçütlerle inceler.','Kart notları'],
      [15,'Özellikleri ifade etme','Öğrencilerin bulduğu ölçütleri toplar; kavramsal netlik, gerekçelendirme ve tek cevapla kapanmama özelliklerine dikkat çeker.','Felsefi sorunun özelliklerini kendi cümleleriyle yazar.','Özellik listesi'],
      [15,'Soru dönüştürme','İkinci ders başında gündelik bir soruyu felsefi soruya dönüştürmeyi ister.','Gündelik bir soruyu felsefi soruya dönüştürür.','Dönüştürülmüş soru'],
      [10,'Paylaşım ve geri bildirim','Birkaç dönüşümü sınıfta tartıştırır; ölçütleri sorular üzerinde sınatır.','Arkadaşının sorusunu ölçütlerle değerlendirir; aldığı geri bildirime göre kendi sorusunun en az bir bölümünü görünür biçimde düzeltir.','İlk soru ile geri bildirim sonrası düzeltilmiş soru arasındaki görünür revizyon'],
      [10,'Bireysel değerlendirme','Çıkış sorusunu uygular; üç ölçütle öğrenme kanıtını inceler.','Bir özelliği kendi sorusuyla açıklar; üç ölçüte göre yanıtını kontrol eder ve ihtiyaç duyduğu desteği belirtir.','Üç ölçüte göre bağımsız çıkış yanıtı ve destek ihtiyacı kaydı']
    ]
  },
  {
    id:'fel-11-al-2026-h4', ders:'Felsefe', seviye:'11. Sınıf', kod:'FEL.11.1.2',
    hafta:'4. Hafta: 5-9 Ekim', kapsam:'4. hafta',
    dersHedefi:'Öğrenci, bir çevre sorunu hakkında açık bir görüş, gerekçe ve değer odağı içeren argüman kurar; karşı görüş ve geri bildirim doğrultusunda argümanını gözden geçirir.',
    pedagojikBaglantilar:{
      akis:[0,1,2,3,4,5,6],
      kanit:'kanit',
      farklilastirma:['destek','zengin']
    },
    alanlar:[
      ['tarih','Ders tarihi','05.10.2026'],['sinif','Sınıf / şube','11. Sınıf'],
      ['konu','Konu','Çevre sorunlarında görüş ve argüman oluşturma'],
      ['materyal','Materyaller ve yöntemler','Tahta, durum kartları ve argüman iskeleti şablonu. Soru-cevap, eşli çalışma, argüman kurma ve karşılıklı eleştiri.'],
      ['kabul','Temel kabuller','Önceki derste argümanları çözümlediği, ancak kendi görüşünü gerekçelendirerek kurmakta ve karşı görüşü hesaba katmakta desteğe ihtiyaç duyabileceği kabul edilir.'],
      ['on','Ön değerlendirme','“Şehir içindeki bir yeşil alanın yerine otopark yapılmalı mı?” sorusuna birer görüş alınır. Görüşün yanında bir gerekçe belirtilip belirtilmediği yoklanır.'],
      ['kopru','Köprü kurma','Önceki derste verilmiş argümanların sonucunu, gerekçesini ve değer odağını ayırdık. Şimdi aynı parçalarla kendi görüşünüzü kuracaksınız.'],
      ['bilesen','Bu derste ilişkilendirilen beceri ve değerler','Gerekçelendirme, argüman kurma, karşı görüşü değerlendirme, iş birliği ve duyarlılık. Bu liste ders uyarlamasıdır; ünitenin bütün bileşenlerinin her derste işlendiği anlamına gelmez.'],
      ['kartlar','Durum kartları ve argüman iskeleti — öğretmen uyarlaması','A — Şehir merkezindeki yeşil alanın yerine otopark yapılması öneriliyor.\n\nB — Bir derenin kenarına fabrika kurulması öneriliyor.\n\nC — Okul bahçesindeki ağaçların kesilip yerine spor alanı yapılması öneriliyor.\n\nİskelet: Görüşüm … Çünkü … Bu gerekçe … değere dayanıyor (insan, canlı veya ekosistem odaklı). Karşı görüş … diyebilir; buna şöyle cevap veririm: …'],
      ['kanit','Öğrenme kanıtları ve değerlendirme','Ürün: Seçilen durum kartı için iskelete uygun yazılmış kısa argüman.\nÇıkış sorusu: “Seçtiğiniz durumda görüşünüzü, gerekçenizi ve gerekçenin dayandığı değeri yazın; olası bir karşı görüşe cevap verin.”\nKontrol: (1) Görüşü açıkça belirtir. (2) Gerekçe verir. (3) Gerekçenin dayandığı değer odağını belirtir. (4) Bir karşı görüşü ele alır. Her ölçüt: bağımsız yaptı / destekle yaptı / henüz yapamadı.'],
      ['destek','Destekleme','İskeletin cümle başlangıçlarını verin. Önce görüşü ve gerekçeyi sözlü aldırın; karşı görüş bölümünü eşli hazırlatın.'],
      ['zengin','Zenginleştirme','Erken tamamlayanlar aynı durum için farklı bir değer odağına dayanan ikinci bir argüman kursun ve iki argümanın hangi noktada ayrıştığını açıklasın. Bu etkinlik, öğrencinin ihtiyacına göre kullanılabilecek bir öğretmen uyarlamasıdır.'],
      ['sonraki','Sonraki derse hazırlık','Bir çevre sorunu seçin ve bu soruna dair kendi görüşünüzü bir iki cümleyle yazın. Felsefi metin yazmak sonraki haftanın süreç bileşenidir; bu hafta yalnız görüş ve argüman kurulur.'],
      ['not','Ders sonrası öğretmen notu','']
    ],
    akis:[
      [5,'Ön değerlendirme','Otopark sorusunu yöneltir; görüşün yanında gerekçe verilip verilmediğini yoklar.','Görüşünü ve bir gerekçe söyler.','Başlangıç cevapları'],
      [5,'Köprü kurma','Önceki dersteki çözümleme parçalarını (sonuç, gerekçe, değer odağı) hatırlatır.','Parçaları kendi görüşüne uygulayacağını fark eder.','Tahtadaki parça listesi'],
      [10,'Model argüman','A kartı için iskeleti sesli düşünerek doldurur.','İskeletin bölümlerini izler; model argümanı işaretler.','İşaretli model argüman'],
      [20,'Eşli argüman kurma','B ve C kartlarından birini seçtirir; doğrudan cevap vermeden yönlendirici sorular sorar.','Seçtiği durum için iskelete uygun argüman yazar.','Taslak argüman'],
      [15,'Karşılıklı eleştiri','İkinci ders başında eşlerin argümanlarını değiş tokuş ettirir.','Arkadaşının argümanında gerekçeyi ve değer odağını belirler; bir karşı görüş önerir.','Eleştiri notu'],
      [15,'Gözden geçirme ve paylaşım','Birkaç argümanı sınıfta paylaştırır; gerekçenin görüşü gerçekten destekleyip desteklemediğini tartışmaya açar.','Akran ve öğretmen geri bildirimini dikkate alarak görüş, gerekçe, değer odağı veya karşı görüşten en az birini görünür biçimde düzeltir.','Taslak argüman ile geri bildirim sonrası düzeltilmiş argüman arasındaki görünür revizyon'],
      [10,'Bireysel değerlendirme','Çıkış sorusunu uygular; dört ölçütle öğrenme kanıtını inceler.','Görüş, gerekçe, değer odağı ve karşı görüşü yazar; dört ölçüte göre yanıtını kontrol eder ve ihtiyaç duyduğu desteği belirtir.','Dört ölçüte göre bağımsız çıkış yanıtı ve destek ihtiyacı kaydı']
    ]
  }
];
