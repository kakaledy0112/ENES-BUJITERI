// Ürün Stokları Başlangıç Değeri
const urunStoklari = {
    "Şık Gümüş Yüzük": 5,
    "Modern Tasarım Yüzük": 7,
    "İnci Kolye": 3,
    "Minimalist Altın Kolye": 4,
    "Klasik Deri Saat": 6,
    "Şık Metal Saat": 2
};

// Geçici Sepet (Sayfa hafızasında)
let sepet = [];

// Ürün sepete ekleme
function sepeteEkle(isim, fiyat, foto) {
    if (urunStoklari[isim] && urunStoklari[isim] > 0) {
        sepet.push({ isim: isim, fiyat: fiyat, foto: foto });
        urunStoklari[isim]--;
        stokGuncelle();

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

// Sepeti Göster (Sepeti URL ile taşıyoruz)
function sepetiGoster() {
    const sepetJSON = encodeURIComponent(JSON.stringify(sepet));
    window.location.href = `sepet.html?veri=${sepetJSON}`;
}

// Sepeti Listele
function sepetiListele() {
    const urlParams = new URLSearchParams(window.location.search);
    const veri = urlParams.get('veri');

    if (!veri) {
        document.getElementById('sepet-icerik').innerHTML = "<p>Sepetiniz boş.</p>";
        return;
    }

    const sepetVerisi = JSON.parse(decodeURIComponent(veri));

    if (sepetVerisi.length === 0) {
        document.getElementById('sepet-icerik').innerHTML = "<p>Sepetiniz boş.</p>";
        return;
    }

    const urunAdetleri = {};
    sepetVerisi.forEach(urun => {
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
    document.getElementById('sepet-icerik').innerHTML = html;
}

// Ürün Arama ve Fiyat Filtreleme
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

// Sayfa açılınca
window.onload = function() {
    stokGuncelle();
    if (window.location.pathname.includes('sepet.html')) {
        sepetiListele();
    }
};
