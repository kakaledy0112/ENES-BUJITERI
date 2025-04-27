// Sepete Ürün Ekleme
function sepeteEkle(isim, fiyat, foto) {
  let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  sepet.push({ isim, fiyat, foto });
  localStorage.setItem('sepet', JSON.stringify(sepet));
  alert('Ürün sepete eklendi!');
}

// Favorilere Ürün Ekleme
function favorilereEkle(isim, fiyat, foto) {
  let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
  favoriler.push({ isim, fiyat, foto });
  localStorage.setItem('favoriler', JSON.stringify(favoriler));
  alert('Ürün favorilere eklendi!');
}

// Sepet Sayfası Yüklenince Sepeti Göster
window.addEventListener('load', function() {
  if (document.getElementById('sepet-icerik')) {
    sepetiGoster();
  }
  if (document.getElementById('favoriler-icerik')) {
    favorileriGoster();
  }
});

// Sepeti Listele
function sepetiGoster() {
  let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  let icerik = '';
  let toplam = 0;

  sepet.forEach((urun, index) => {
    icerik += `
      <div class="sepet-urun">
        <img src="${urun.foto}" alt="${urun.isim}" class="sepet-urun-img">
        <div class="sepet-urun-bilgi">
          <p>${urun.isim}</p>
          <p>${urun.fiyat} TL</p>
        </div>
      </div>
    `;
    toplam += parseFloat(urun.fiyat);
  });

  document.getElementById('sepet-icerik').innerHTML = icerik;
  document.getElementById('sepet-toplam').textContent = 'Toplam: ' + toplam + ' TL';
}

// Sepeti Temizle
function sepetiTemizle() {
  localStorage.removeItem('sepet');
  location.reload();
}

// Favorileri Listele
function favorileriGoster() {
  let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
  let icerik = '';

  favoriler.forEach((urun, index) => {
    icerik += `
      <div class="favori-urun">
        <img src="${urun.foto}" alt="${urun.isim}" class="favori-urun-img">
        <div class="favori-urun-bilgi">
          <p>${urun.isim}</p>
          <p>${urun.fiyat} TL</p>
        </div>
      </div>
    `;
  });

  document.getElementById('favoriler-icerik').innerHTML = icerik;
}

// Ürün Detay Sayfasında Sepete Ekleme
function detaydanSepeteEkle() {
  const urlParams = new URLSearchParams(window.location.search);
  const isim = urlParams.get('isim');
  const fiyat = urlParams.get('fiyat');
  const foto = urlParams.get('foto');

  sepeteEkle(isim, fiyat, foto);
}

// Yukarı Çık Butonu
const yukariBtn = document.getElementById("yukari-btn");

window.onscroll = function() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    yukariBtn.style.display = "block";
  } else {
    yukariBtn.style.display = "none";
  }
};

yukariBtn.onclick = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Slider Otomatik Geçiş
let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.getElementsByClassName("slide");
  
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1; }    
  
  slides[slideIndex-1].style.display = "block";  
  setTimeout(showSlides, 4000); // Her 4 saniyede değiştir
    }
