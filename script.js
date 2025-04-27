// Ürün sepete ekleme
function sepeteEkle(isim, fiyat, foto) {
    let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    sepet.push({ isim: isim, fiyat: fiyat, foto: foto });
    localStorage.setItem('sepet', JSON.stringify(sepet));

    // Sepet mesajını göster (eğer varsa)
    const mesajKutusu = document.getElementById('sepet-mesaji');
    if (mesajKutusu) {
        mesajKutusu.textContent = `✓ ${isim} sepete eklendi!`;
        mesajKutusu.style.display = 'block';

        setTimeout(() => {
            mesajKutusu.style.display = 'none';
        }, 3000);
    }
}

// Sepeti göster
function sepetiGoster() {
    window.location.href = "sepet.html";
}

// Sepet Sayfasında ürünleri listele
function sepetiListele() {
    let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    let sepetIcerik = document.getElementById('sepet-icerik');

    if (sepet.length === 0) {
        sepetIcerik.innerHTML = "<p>Sepetiniz boş.</p>";
        return;
    }

    let toplam = 0;
    let html = "";

    sepet.forEach(function(urun, index) {
        toplam += urun.fiyat;
        html += `
            <div class="sepet-urun">
                <img src="${urun.foto}" alt="${urun.isim}" style="width:100px; border-radius:8px;">
                <div class="sepet-bilgi">
                    <p>${urun.isim}</p>
                    <p>${urun.fiyat} TL</p>
                    <button class="sil-button" onclick="urunSil(${index})">Ürünü Sil</button>
                </div>
            </div>
        `;
    });

    html += `<h3>Toplam: ${toplam} TL</h3>`;
    html += `<button onclick="sepetiBosalt()">Sepeti Boşalt</button>`;
    sepetIcerik.innerHTML = html;
}

// Tekli ürün silme
function urunSil(index) {
    let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    sepet.splice(index, 1);
    localStorage.setItem('sepet', JSON.stringify(sepet));
    sepetiListele();
}

// Sepeti boşalt
function sepetiBosalt() {
    localStorage.removeItem('sepet');
    
    const mesajKutusu = document.getElementById('sepet-mesaji');
    if (mesajKutusu) {
        mesajKutusu.textContent = "✓ Sepet boşaltıldı!";
        mesajKutusu.style.display = 'block';

        setTimeout(() => {
            mesajKutusu.style.display = 'none';
            window.location.reload(); // mesajdan sonra sayfa yenile
        }, 2000);
    } else {
        alert("Sepet boşaltıldı!");
        window.location.reload();
    }
        }
