// Başlangıç stoklar
let baslangicStoklari = {
  "Şık Gümüş Renk Yüzük": 5,
  "Modern Tasarım Yüzük": 7,
  "İnci Görünümlü Kolye": 3,
  "Minimalist Altın Renk Kolye": 4,
  "Klasik Deri Saat": 6,
  "Şık Metal Renk Saat": 2
};

if (!localStorage.getItem('urunStoklari')) {
  localStorage.setItem('urunStoklari', JSON.stringify(baslangicStoklari));
}

let urunStoklari = JSON.parse(localStorage.getItem('urunStoklari'));
let sepet = JSON.parse(localStorage.getItem('sepet')) || [];

// Sepete ürün ekle
function sepeteEkle(isim, fiyat, foto) {
  if (urunStoklari[isim] > 0) {
    sepet.push({ isim, fiyat, foto });
    localStorage.setItem('sepet', JSON.stringify(sepet));

    urunStoklari[isim]--;
    localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari));

    stokGuncelle();
    mesajGoster("✓ Ürün sepete eklendi!");
  } else {
    alert("Bu ürün tükendi!");
  }
}

// Sepeti listele
function sepetiListele() {
  let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
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
        <img src="${urun.foto}" alt="${isim}" style="width:100px; border-radius:8px;">
        <div class="sepet-bilgi">
          <p>${isim} - ${urun.adet} Adet</p>
          <p>${urun.fiyat * urun.adet} TL</p>
        </div>
      </div>
    `;
  }

  html += `<h3>Toplam: ${toplam} TL</h3>`;
  html += `<button onclick="sepetiBosalt()">Sepeti Boşalt</button>`;
  sepetIcerik.innerHTML = html;
}

// Sepeti boşalt
function sepetiBosalt() {
  localStorage.removeItem('sepet');
  localStorage.removeItem('urunStoklari');

  mesajGoster("✓ Sepet boşaltıldı!");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2500);
}

// Stokları güncelle
function stokGuncelle() {
  for (const isim in urunStoklari) {
    const stokElement = document.getElementById('stok-' + isim);
    if (stokElement) {
      stokElement.textContent = urunStoklari[isim] > 0 ? `Stok: ${urunStoklari[isim]}` : "Tükendi";
      const button = stokElement.parentElement.querySelector('.sepet-button');
      if (urunStoklari[isim] <= 0) {
        button.disabled = true;
        button.textContent = "Tükendi";
        button.style.backgroundColor = "#ccc";
      }
    }
  }
}

// Fade-in animasyonu
function fadeInUrunler() {
  const urunler = document.querySelectorAll('.product');

  urunler.forEach(urun => {
    const rect = urun.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      urun.classList.add('show');
    }
  });
}

// Mesaj kutusu göster
function mesajGoster(text) {
  const mesajKutusu = document.getElementById('sepet-mesaji');
  const mesajIcerik = document.getElementById('sepet-mesaji-icerik');

  if (mesajKutusu && mesajIcerik) {
    mesajIcerik.innerText = text;
    mesajKutusu.classList.add('fade-in');
    mesajKutusu.classList.remove('fade-out');
    mesajKutusu.style.display = 'block';

    setTimeout(() => {
      mesajKutusu.classList.remove('fade-in');
      mesajKutusu.classList.add('fade-out');
    }, 2000);

    setTimeout(() => {
      mesajKutusu.style.display = 'none';
    }, 2500);
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
      <img src="${foto}" alt="${isim}" style="width:100%; border-radius:10px; margin-bottom:15px;">
      <h2>${isim}</h2>
      <h3>${fiyat} TL</h3>
      <p style="color:#666;">${decodeURIComponent(aciklama)}</p>
      <button class="sepet-button" onclick="sepeteEkle('${isim}', ${fiyat}, '${foto}')">Sepete Ekle</button>
      <br><br>
      <a href="https://wa.me/90XXXXXXXXXX?text=${mesaj}" target="_blank">
        <button class="sepet-button" style="background-color:#25D366;">WhatsApp ile Sipariş Ver</button>
      </a>
    `;
  } else {
    urunDetayDiv.innerHTML = "<p>Ürün bilgileri yüklenemedi.</p>";
  }
}

// Favorilere ürün ekle
function favorilereEkle(isim, fiyat, foto) {
  let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];

  const zatenVar = favoriler.some(fav => fav.isim === isim);

  if (!zatenVar) {
    favoriler.push({ isim, fiyat, foto });
    localStorage.setItem('favoriler', JSON.stringify(favoriler));
    mesajGoster("✓ Ürün favorilere eklendi!");
  } else {
    mesajGoster("Bu ürün zaten favorilerde!");
  }

  const ikonlar = document.querySelectorAll('.favori-icon');
  ikonlar.forEach(ikon => {
    if (ikon.getAttribute('onclick').includes(isim)) {
      ikon.classList.add('aktif');
    }
  });
}

// Favorileri listele
function favorileriListele() {
  let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
  const favorilerIcerik = document.getElementById('favoriler-icerik');

  if (!favorilerIcerik) return;

  if (favoriler.length === 0) {
    favorilerIcerik.innerHTML = "<p>Favorileriniz boş.</p>";
    return;
  }

  let html = '<div class="urunler">';
  favoriler.forEach(urun => {
    html += `
      <div class="product">
        <img src="${urun.foto}" alt="${urun.isim}" style="width:100%; border-radius:10px;">
        <p>${urun.isim}</p>
        <div class="urun-yildiz">⭐⭐⭐⭐⭐</div>
        <p>${urun.fiyat} TL</p>
        <button class="sepet-button" style="margin-top:8px; background-color:#ff6666;" onclick="favoridenCikar('${urun.isim}')">Favoriden Çıkar</button>
      </div>
    `;
  });
  html += '</div>';

  favorilerIcerik.innerHTML = html;
}

// Favoriden çıkar
function favoridenCikar(isim) {
  let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
  favoriler = favoriler.filter(fav => fav.isim !== isim);
  localStorage.setItem('favoriler', JSON.stringify(favoriler));

  mesajGoster("✓ Ürün favorilerden çıkarıldı!");

  favorileriListele();
}

// Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

setInterval(nextSlide, 3000);

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
  stokGuncelle();

  if (window.location.pathname.includes('sepet.html')) {
    sepetiListele();
  }

  if (window.location.pathname.includes('urun-detay.html')) {
    urunDetayGoster();
  }

  if (window.location.pathname.includes('favoriler.html')) {
    favorileriListele();
  }

  fadeInUrunler();
}
