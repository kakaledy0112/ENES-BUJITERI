let sepet = [];

function sepeteEkle(urunIsmi, urunFiyati) {
    sepet.push({ isim: urunIsmi, fiyat: urunFiyati });
    alert(urunIsmi + " sepete eklendi!");
}

function sepetiGoster() {
    if (sepet.length === 0) {
        alert("Sepetiniz boş.");
        return;
    }

    let mesaj = "Sepetinizdeki Ürünler:\n";
    sepet.forEach(function(urun, index) {
        mesaj += (index + 1) + ". " + urun.isim + " - " + urun.fiyat + " TL\n";
    });
    alert(mesaj);
}
