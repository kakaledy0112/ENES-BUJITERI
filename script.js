// (Zaten daha önce aşağıdaki fonksiyonlar vardı)  
// sepeteEkle, stokGuncelle, urunleriFiltrele, sepetiBosalt, sepetiListele vs...

// Yeni: Ürün Detayı Sayfası Bilgilerini Göster
function urunDetayGoster() {
  const urlParams = new URLSearchParams(window.location.search);
  const isim = urlParams.get('isim');
  const fiyat = urlParams.get('fiyat');
  const foto = urlParams.get('foto');
  const aciklama = urlParams.get('aciklama');

  const urunDetayDiv = document.getElementById('urun-detay');

  if (isim && fiyat && foto && aciklama && urunDetayDiv) {
    urunDetayDiv.innerHTML = `
      <img src="${foto}" alt="${isim}" style="width:100%; border-radius:10px; margin-bottom:15px;">
      <h2>${isim}</h2>
      <h3>${fiyat} TL</h3>
      <p style="color:#666;">${decodeURIComponent(aciklama)}</p>
      <button class="sepet-button" onclick="sepeteEkle('${isim}', ${fiyat}, '${foto}')">Sepete Ekle</button>
    `;
  } else {
    urunDetayDiv.innerHTML = "<p>Ürün bilgileri yüklenemedi.</p>";
  }
}

// Sayfa açıldığında çalışacaklar
window.onload = function() {
  stokGuncelle();

  if (window.location.pathname.includes('sepet.html')) {
    sepetiListele();
  }

  if (window.location.pathname.includes('urun-detay.html')) {
    urunDetayGoster();
  }
};
