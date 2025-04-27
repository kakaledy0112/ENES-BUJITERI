// Ürün Stokları
let baslangicStoklari = {
  "Şık Gümüş Yüzük": 5,
  "Modern Tasarım Yüzük": 7,
  "İnci Kolye": 3,
  "Minimalist Altın Kolye": 4,
  "Klasik Deri Saat": 6,
  "Şık Metal Saat": 2
};

// Başlangıçta stokları localStorage'a kaydet (ilk girişte)
if (!localStorage.getItem('urunStoklari')) {
  localStorage.setItem('urunStoklari', JSON.stringify(baslangicStoklari));
}

// localStorage'dan stokları alıyoruz
let urunStoklari = JSON.parse(localStorage.getItem('urunStoklari'));

// Sepeti localStorage'dan çekiyoruz (yoksa boş dizi)
let sepet = JSON.parse(localStorage.getItem('sepet')) || [];

// Ürün sepete ekle
function sepeteEkle(isim, fiyat, foto) {
  if (urunStoklari[isim] > 0) {
    sepet.push({ isim: isim, fiyat: fiyat, foto: foto });
    localStorage.setItem('sepet', JSON.stringify(sepet));

    // Stoğu azalt
    urunStoklari[isim]--;
    localStorage.setItem('urunStoklari', JSON.stringify(urunStoklari));

    stokGuncelle();

    // Mesaj göster
    const mesaj = document.getElementById('sepet-mesaji');
    if (mesaj) {
      mesaj.style.display = 'block';
    }
  } else {
    alert("Bu ürün tükendi!");
  }
}

// Sepeti göster
function sepetiGoster() {
  window.location.href = "sepet.html";
}

// Sepet sayfasında ürünleri listele
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

// Sepeti ve stokları tamamen sıfırlama
function sepetiBosalt() {
  localStorage.removeItem('sepet');
  localStorage.removeItem('urunStoklari');

  alert("Sepet ve stoklar sıfırlandı!");
  window.location.href = "index.html"; // Ana sayfaya dön
}

// Ürün arama ve fiyat filtreleme
function urunleriFiltrele() {
  const arama = document.getElementById('arama') ? document.getElementById('arama').value.toLowerCase() : "";
  const fiyatFiltre = document.getElementById('fiyat-filtre') ? document.getElementById('fiyat-filtre').value : "";

  const tumUrunler = document.querySelectorAll('.product');

  tumUrunler.forEach(urun => {
    const isim = urun.querySelector('p').textContent.toLowerCase();
    const fiyatMetin = urun.querySelectorAll('p')[1].textContent;
    const fiyat = parseInt(fiyatMetin.replace('TL', '').trim());

    let gorunur = true;

    if (arama && !isim.includes(arama)) {
      gorunur = false;
    }

    if (fiyatFiltre) {
      const [min, max] = fiyatFiltre.split('-').map(Number);
      if (fiyat < min || fiyat > max) {
        gorunur = false;
      }
    }

    urun.style.display = gorunur ? "block" : "none";
  });
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

// Sayfa açıldığında stokları ve sepeti kontrol et
window.onload = function() {
  stokGuncelle();
  if (window.location.pathname.includes('sepet.html')) {
    sepetiListele();
  }
};
