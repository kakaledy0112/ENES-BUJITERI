// Ürün Stokları
let urunStoklari = {
  "Şık Gümüş Yüzük": 5,
  "Modern Tasarım Yüzük": 7,
  "İnci Kolye": 3,
  "Minimalist Altın Kolye": 4,
  "Klasik Deri Saat": 6,
  "Şık Metal Saat": 2
};

// Başlangıçta stokları kaydet
if (!localStorage.getItem('urunStoklari')) {
  localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari));
} else {
  urunStoklari = JSON.parse(localStorage.getItem('urunStoklari'));
}

// Sepeti çek
let sepet = JSON.parse(localStorage.getItem('sepet')) || [];

// Ürün ekleme
function sepeteEkle(isim, fiyat, foto) {
  sepet.push({ isim: isim, fiyat: fiyat, foto: foto });
  localStorage.setItem('sepet', JSON.stringify(sepet));

  // Stoktan düş
  urunStoklari[isim]--;
  localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari));

  stokGuncelle();

  // Mesajı göster
  const mesaj = document.getElementById('sepet-mesaji');
  mesaj.style.display = 'block';
}

// Sepeti görüntüle
function sepetiGoster() {
  window.location.href = "sepet.html";
}

// Sepeti listele (sepet.html için)
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
  alert("Sepet boşaltıldı!");
  window.location.reload();
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

// Sayfa yüklenince stokları güncelle
window.onload = function() {
  stokGuncelle();
  if (window.location.pathname.includes('sepet.html')) {
    sepetiListele();
  }
};
