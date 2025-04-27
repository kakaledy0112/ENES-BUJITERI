// Ürün Stokları
const urunStoklari = {
    "Şık Gümüş Yüzük": 5,
    "Modern Tasarım Yüzük": 7,
    "İnci Kolye": 3,
    "Minimalist Altın Kolye": 4,
    "Klasik Deri Saat": 6,
    "Şık Metal Saat": 2
};

// Ürün sepete ekleme
function sepeteEkle(isim, fiyat, foto) {
    if (urunStoklari[isim] && urunStoklari[isim] > 0) {
        let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
        sepet.push({ isim: isim, fiyat: fiyat, foto: foto });
        localStorage.setItem('sepet', JSON.stringify(sepet));

        // Stoktan düş
        urunStoklari[isim]--;
        stokGuncelle();

        // Sepet mesajı
        const mesajKutusu = document.getElementById('sepet-mesaji');
        if (mesajKutusu) {
            mesajKutusu.textContent = `✓ ${isim} sepete eklendi!`;
            mesajKutusu.style.display = 'block';

            setTimeout(() => {
                mesajKutusu.style.display = 'none';
            }, 3000);
        }
    } else {
        alert("Bu ürün tükendi!");
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
            window.location.reload();
        }, 2000);
    } else {
        alert("Sepet boşaltıldı!");
        window.location.reload();
    }
}

// Ürün Arama ve Fiyat Filtreleme
function urunleriFiltrele() {
    const arama = document.getElementById('arama').value.toLowerCase();
    const fiyatFiltre = document.getElementById('fiyat-filtre').value;

    const tumUrunler = document.querySelectorAll('.product');

    tumUrunler.forEach(urun => {
        const isim = urun.querySelector('p').textContent.toLowerCase();
        const fiyatMetin = urun.querySelectorAll('p')[1].textContent;
        const fiyat = parseInt(fiyatMetin.replace('TL', '').trim());

        let gorunur = true;

        // Arama filtresi
        if (arama && !isim.includes(arama)) {
            gorunur = false;
        }

        // Fiyat filtresi
        if (fiyatFiltre) {
            const [min, max] = fiyatFiltre.split('-').map(Number);
            if (fiyat < min || fiyat > max) {
                gorunur = false;
            }
        }

        if (gorunur) {
            urun.style.display = "block";
        } else {
            urun.style.display = "none";
        }
    });
}

// Stokları Güncelle
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
