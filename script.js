// Başlangıç stoklar
let baslangicStoklari = {
  "Şık Gümüş Renk Yüzük": 5,
  "Modern Tasarım Yüzük": 7,
  "İnci Görünümlü Kolye": 3,
  "Minimalist Altın Renk Kolye": 4,
  "Klasik Deri Saat": 6,
  "Şık Metal Renk Saat": 2
};

// localStorage'dan stokları al veya başlangıç stoklarını ayarla
let urunStoklari = JSON.parse(localStorage.getItem('urunStoklari'));
if (!urunStoklari) {
  urunStoklari = baslangicStoklari;
  localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari));
} else {
    // Eğer localStorage'da stoklar varsa, yeni eklenen ürünlerin stoğunu ekle
    let stoklarGuncellendi = false;
    for (const isim in baslangicStoklari) {
        if (!urunStoklari.hasOwnProperty(isim)) {
            urunStoklari[isim] = baslangicStoklari[isim];
            stoklarGuncellendi = true;
        }
    }
    if (stoklarGuncellendi) {
         localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari));
    }
}


// localStorage'dan sepeti al
let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
// localStorage'dan favorileri al
let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];


// Sepete ürün ekle
function sepeteEkle(isim, fiyat, foto) {
  // Stok kontrolü
  if (urunStoklari[isim] > 0) {
    sepet.push({ isim, fiyat, foto });
    localStorage.setItem('sepet', JSON.stringify(sepet));

    urunStoklari[isim]--;
    localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari));

    stokGuncelle();
    mesajGoster("✓ Ürün sepete eklendi!");
  } else {
    // alert yerine mesajGoster kullanıldı
    mesajGoster("Bu ürün tükendi!");
  }
}

// Sepeti listele
function sepetiListele() {
  let sepetIcerik = document.getElementById('sepet-icerik');

  if (!sepetIcerik) return;

  if (sepet.length === 0) {
    sepetIcerik.innerHTML = "<p>Sepetiniz boş.</p>";
    return;
  }

  const urunAdetleri = {};
  sepet.forEach(urun => {
    if (urunAdetleri[urun.isim]) {
      urunAdetleri[urun.isim].adet++;
    } else {
      urunAdetleri[urun.isim] = { fiyat: urun.fiyat, foto: urun.foto, adet: 1 };
    }
  });

  let toplam = 0;
  let html = "";

  for (const isim in urunAdetleri) {
    const urun = urunAdetleri[isim];
    toplam += urun.fiyat * urun.adet;
    html += `
      <div class="sepet-urun">
        <img src="${urun.foto}" alt="${isim}" style="width:80px; border-radius:8px;">
        <div class="sepet-bilgi">
          <p>${isim} - ${urun.adet} Adet</p>
          <p>${(urun.fiyat * urun.adet).toFixed(2)} TL</p> </div>
         <button class="sepet-urun-cikar" onclick="sepettenCikar('${isim}')">X</button> </div>
    `;
  }

  html += `<h3>Toplam: ${toplam.toFixed(2)} TL</h3>`; // Toplam fiyat formatı düzeltildi
  html += `<button class="sepet-bosalt-button" onclick="sepetiBosalt()">Sepeti Boşalt</button>`; // Buton class'ı eklendi
  sepetIcerik.innerHTML = html;
}

// Sepetten belirli bir ürünü çıkar
function sepettenCikar(isim) {
    let yeniSepet = sepet.filter(urun => urun.isim !== isim);
    // Stokları geri ekle (Çıkarılan ürün adedi kadar)
    const cikarilanUrunler = sepet.filter(urun => urun.isim === isim);
    cikarilanUrunler.forEach(() => {
        if (baslangicStoklari.hasOwnProperty(isim)) { // Başlangıç stoklarında varsa stoğu artır
             if (urunStoklari.hasOwnProperty(isim)) {
                 urunStoklari[isim]++;
             } else {
                 urunStoklari[isim] = 1; // Daha önce stokta olmayan bir ürün favorilere eklenip çıkarılırsa
             }
        }
    });


    sepet = yeniSepet;
    localStorage.setItem('sepet', JSON.stringify(sepet));
    localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari)); // Güncellenmiş stoğu kaydet

    mesajGoster(`✓ "${isim}" sepetten çıkarıldı!`);
    sepetiListele(); // Sepeti yeniden listele
    stokGuncelle(); // Stok durumunu güncelle
}


// Sepeti boşalt
function sepetiBosalt() {
  sepet = []; // Sepeti boşalt
  localStorage.removeItem('sepet');

   // Tüm stokları başlangıç değerlerine döndür
  urunStoklari = JSON.parse(JSON.stringify(baslangicStoklari)); // Deep copy
  localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari));


  mesajGoster("✓ Sepet boşaltıldı!");

  // Eğer sepet sayfasındaysak 2.5 saniye sonra anasayfaya yönlendir
  if (window.location.pathname.includes('sepet.html')) {
     setTimeout(() => {
        window.location.href = "index.html";
     }, 2500);
  } else {
      sepetiListele(); // Başka sayfadaysak sepeti güncelle (boş görünür)
      stokGuncelle(); // Stok durumunu güncelle
  }
}

// Stokları güncelle
function stokGuncelle() {
  const stokElementleri = document.querySelectorAll('.stok-bilgi'); // Tüm stok bilgi elementlerini seç

  stokElementleri.forEach(stokElement => {
      const urunElementi = stokElement.closest('.product'); // En yakın product elementini bul
      const isim = urunElementi?.querySelector('p')?.innerText; // Ürün adını al

      if (isim && urunStoklari.hasOwnProperty(isim)) {
           const stok = urunStoklari[isim];
           stokElement.textContent = stok > 0 ? `Stok: ${stok}` : "Tükendi";
           const button = urunElementi.querySelector('.sepet-button');
           if (button) {
                if (stok <= 0) {
                  button.disabled = true;
                  button.textContent = "Tükendi";
                  button.style.backgroundColor = "#ccc";
                  button.style.cursor = "not-allowed"; // Cursor stilini ayarla
                } else {
                   button.disabled = false;
                   button.textContent = "Sepete Ekle";
                   button.style.backgroundColor = ""; // Stili sıfırla
                    button.style.cursor = "pointer"; // Cursor stilini ayarla
                }
           }
      }
  });
}

// Fade-in animasyonu
function fadeInUrunler() {
  const urunler = document.querySelectorAll('.product');

  urunler.forEach(urun => {
    const rect = urun.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100 && rect.bottom > 0) { // Görünürlük kontrolü iyileştirildi
      urun.classList.add('show');
    }
  });
}

// Mesaj kutusu göster
function mesajGoster(text) {
  // Mesaj kutusu HTML'de tanımlı değilse ekle
  let mesajKutusu = document.getElementById('sepet-mesaji');
  if (!mesajKutusu) {
      mesajKutusu = document.createElement('div');
      mesajKutusu.id = 'sepet-mesaji';
      mesajKutusu.style.position = 'fixed';
      mesajKutusu.style.bottom = '20px';
      mesajKutusu.style.left = '50%';
      mesajKutusu.style.transform = 'translateX(-50%)';
      mesajKutusu.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      mesajKutusu.style.color = 'white';
      mesajKutusu.style.padding = '10px 20px';
      mesajKutusu.style.borderRadius = '5px';
      mesajKutusu.style.zIndex = '10000';
      mesajKutusu.style.opacity = '0';
      mesajKutusu.style.transition = 'opacity 0.5s ease-in-out';
      mesajKutusu.style.pointerEvents = 'none'; // Tıklamayı engelle
      document.body.appendChild(mesajKutusu);

      let mesajIcerik = document.createElement('div');
      mesajIcerik.id = 'sepet-mesaji-icerik';
      mesajKutusu.appendChild(mesajIcerik);
  }

  const mesajIcerik = document.getElementById('sepet-mesaji-icerik');

  if (mesajKutusu && mesajIcerik) {
    mesajIcerik.innerText = text;
    mesajKutusu.style.opacity = '1';


    setTimeout(() => {
      mesajKutusu.style.opacity = '0';
    }, 2000);

    // Transition süresi kadar sonra display none yap
    setTimeout(() => {
       mesajKutusu.style.display = 'none';
    }, 2500); // Transition süresi + biraz gecikme
     mesajKutusu.style.display = 'block'; // Göstermeden önce display block yap
  }
}

// Ürün detayını göster
function urunDetayGoster() {
  const urlParams = new URLSearchParams(window.location.search);
  const isim = urlParams.get('isim');
  const fiyat = urlParams.get('fiyat');
  const foto = urlParams.get('foto');
  const aciklama = urlParams.get('aciklama');

  const urunDetayDiv = document.getElementById('urun-detay');

  if (isim && fiyat && foto && aciklama && urunDetayDiv) {
    const mesaj = encodeURIComponent(`Merhaba, "${isim}" ürününüz ile ilgileniyorum. Fiyat: ${fiyat} TL`);
    urunDetayDiv.innerHTML = `
      <img src="${foto}" alt="${isim}" style="width:100%; max-width: 300px; border-radius:10px; margin-bottom:15px;"> <h2>${isim}</h2>
      <h3>${fiyat} TL</h3>
      <p style="color:#666; margin-bottom: 15px;">${decodeURIComponent(aciklama)}</p> <button class="sepet-button" onclick="sepeteEkle('${isim.replace(/'/g, "\\'")}', ${fiyat}, '${foto}')">Sepete Ekle</button> <br><br>
      <a href="https://wa.me/90XXXXXXXXXX?text=${mesaj}" target="_blank" style="text-decoration: none;"> <button class="sepet-button" style="background-color:#25D366; margin-top: 0;">WhatsApp ile Sipariş Ver</button> </a>
    `;
  } else if(urunDetayDiv) { // urunDetayDiv varsa ama bilgiler eksikse
    urunDetayDiv.innerHTML = "<p>Ürün bilgileri yüklenemedi.</p>";
  }
}

// Favorilere ürün ekle/çıkar (Toggle fonksiyonu)
function favoriToggle(ikonElement, isim, fiyat, foto) {
  let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
  const zatenVar = favoriler.some(fav => fav.isim === isim);

  if (zatenVar) {
    // Favoriden çıkar
    favoriler = favoriler.filter(fav => fav.isim !== isim);
    localStorage.setItem('favoriler', JSON.stringify(favoriler));
    mesajGoster(`✓ "${isim}" favorilerden çıkarıldı!`);
    ikonElement.classList.remove('aktif'); // İkonu deaktif yap
     // Eğer favoriler sayfasındaysak listeyi güncelle
    if (window.location.pathname.includes('favoriler.html')) {
       favorileriListele();
    }
  } else {
    // Favoriye ekle
    favoriler.push({ isim, fiyat, foto });
    localStorage.setItem('favoriler', JSON.stringify(favoriler));
    mesajGoster(`✓ "${isim}" favorilere eklendi!`);
    ikonElement.classList.add('aktif'); // İkonu aktif yap
  }
}


// Favorileri listele
function favorileriListele() {
  let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
  const favorilerIcerik = document.getElementById('favoriler-icerik');

  if (!favorilerIcerik) return;

   // Yükleniyor mesajını kaldır
  favorilerIcerik.innerHTML = '';

  if (favoriler.length === 0) {
    favorilerIcerik.innerHTML = "<p>Favorileriniz boş.</p>";
    return;
  }

  let html = '<div class="urunler">';
  favoriler.forEach(urun => {
    // Favoriden çıkar butonu ve sepete ekle butonu eklendi
    html += `
      <div class="product">
         <div class="favori-icon aktif" onclick="favoriToggle(this, '${urun.isim.replace(/'/g, "\\'")}', ${urun.fiyat}, '${urun.foto}')">❤</div> <img src="${urun.foto}" alt="${urun.isim}" style="width:100%; border-radius:10px;">
        <p>${urun.isim}</p>
        <div class="urun-yildiz">⭐⭐⭐⭐⭐</div>
        <p>${urun.fiyat} TL</p>
        <button class="sepet-button" onclick="sepeteEkle('${urun.isim.replace(/'/g, "\\'")}', ${urun.fiyat}, '${urun.foto}')">Sepete Ekle</button> </div>
    `;
  });
  html += '</div>';

  favorilerIcerik.innerHTML = html;
   stokGuncelle(); // Stok durumunu güncelle
    urunlereFavoriIkonDurumunuGuncelle(); // İkon durumlarını güncelle
}


// Ürünlere favori ikonu ekle ve durumunu ayarla
function urunlereFavoriIkonEkle() {
  const urunler = document.querySelectorAll('.product:not(.favoriler-sayfasi .product)'); // Favoriler sayfasındaki ürünleri hariç tut

  urunler.forEach(urun => {
    const isim = urun.querySelector('p')?.innerText;
    // Fiyat bilgisi HTML'de farklı bir p etiketinde olduğu varsayıldı
    const fiyatTextElement = urun.querySelector('p:nth-of-type(2)'); // Fiyatın ikinci p etiketinde olduğunu varsayalım
    const fiyat = fiyatTextElement ? parseFloat(fiyatTextElement.innerText.replace(' TL', '').replace(',', '.')) : 0;
    const foto = urun.querySelector('img')?.src;

    if (isim && fiyat && foto) {
      // Daha önce eklenmemişse ikonu ekle
      if (!urun.querySelector('.favori-icon')) {
         let favoriIcon = document.createElement('span');
         favoriIcon.innerHTML = '❤';
         favoriIcon.classList.add('favori-icon');
         // İkon tıklandığında favoriToggle fonksiyonunu çağır
         favoriIcon.setAttribute('onclick', `favoriToggle(this, '${isim.replace(/'/g, "\\'")}', ${fiyat}, '${foto}')`);

         // Ürün elementinin içine ekle (genellikle resmin altına veya başlığın yanına uygun bir yere)
         // Burada ürün elementinin başına ekleniyor, isteğe göre yeri değiştirilebilir.
         urun.insertBefore(favoriIcon, urun.firstChild);
      }
    }
  });
  urunlereFavoriIkonDurumunuGuncelle(); // İkon durumlarını ekledikten sonra güncelle
}

// Ürünlerin üzerindeki favori ikonlarının aktif/deaktif durumunu güncelle
function urunlereFavoriIkonDurumunuGuncelle() {
     let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
     const ikonlar = document.querySelectorAll('.favori-icon');

     ikonlar.forEach(ikon => {
        const onclickAttribute = ikon.getAttribute('onclick');
        if (onclickAttribute) {
             // onclick stringinden ürün adını çıkarmaya çalış
            const match = onclickAttribute.match(/favoriToggle\(this,\s*'(.*?)'/);
            if (match && match[1]) {
                const isim = match[1].replace(/\\'/g, "'"); // Kaçırılmış tek tırnakları geri al
                 // Bu ürün favorilerde var mı kontrol et
                const favorilerdeVar = favoriler.some(fav => fav.isim === isim);
                if (favorilerdeVar) {
                    ikon.classList.add('aktif');
                } else {
                    ikon.classList.remove('aktif');
                }
            }
        }
     });
}


// Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let slideInterval;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  if (slides[index]) { // Slaytın varlığını kontrol et
      slides[index].classList.add('active');
  }
}

function nextSlide() {
   if (slides.length > 0) { // Slayt varsa devam et
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
   }
}

function startSlider() {
    if (slides.length > 1) { // Birden fazla slayt varsa interval başlat
        showSlide(currentSlide); // İlk slaytı göster
        slideInterval = setInterval(nextSlide, 3000);
    } else if (slides.length === 1) { // Tek slayt varsa sadece onu göster
        showSlide(0);
    }
     // Slayt yoksa bir şey yapma
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Yukarı Çık Butonu
const yukariBtn = document.getElementById("yukari-btn");

window.onscroll = function() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    yukariBtn.style.display = "block";
  } else {
    yukariBtn.style.display = "none";
  }

  fadeInUrunler();
};

yukariBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Menü Aç Kapa
function menuAcKapa() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("acik");
}

// Sayfa yüklenince çalışacaklar
window.onload = function() {
  stokGuncelle(); // Sayfa yüklendiğinde stok durumlarını güncelle

  // Hangi sayfada olduğumuzu kontrol et ve ilgili fonksiyonu çalıştır
  if (window.location.pathname.includes('sepet.html')) {
    sepetiListele();
  } else if (window.location.pathname.includes('urun-detay.html')) {
    urunDetayGoster();
  } else if (window.location.pathname.includes('favoriler.html')) {
    favorileriListele();
     // Favoriler sayfasında da ürün ikonlarını ekle ve durumunu güncelle
    urunlereFavoriIkonEkle();
    urunlereFavoriIkonDurumunuGuncelle();
  } else {
     // Anasayfa veya diğer sayfalar
    urunlereFavoriIkonEkle(); // Ürün ikonlarını ekle
    urunlereFavoriIkonDurumunuGuncelle(); // İkon durumlarını güncelle
    fadeInUrunler(); // Fade-in animasyonunu başlat
    startSlider(); // Slider'ı başlat
  }

};

// Sayfa kapatılırken slider intervalini temizle (isteğe bağlı)
window.onbeforeunload = function() {
    stopSlider();
};

// Scroll olayını dinle (Fade-in animasyonu için)
window.addEventListener('scroll', fadeInUrunler);

// DOMContentLoaded fired before window.onload
document.addEventListener('DOMContentLoaded', (event) => {
    // HTML yüklendikten hemen sonra stokları ve ikonları güncellemek için çağırılabilir
    // window.onload içinde de çağrıldığı için burada tekrar çağırmaya gerek yok ama sayfa yapısına göre değerlendirilebilir.
    // stokGuncelle();
    // urunlereFavoriIkonEkle();
    // urunlereFavoriIkonDurumunuGuncelle();
});
