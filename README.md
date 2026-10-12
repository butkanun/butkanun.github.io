# Kişisel site

HTML, CSS ve biraz JavaScript ile yazılmış statik tanıtım sitesi. Derleme veya kurulum gerekmez.

## Dosyalar

- `index.html`: içerik (ad, hakkımda, deneyim, projeler, yetenekler, eğitim, iletişim)
- `style.css`: tasarım. Renkler ve yazı tipleri en üstteki `:root` bölümünde
- `script.js`: mobil menü, menüde aktif bölüm işareti, e-posta kopyalama düğmesi, altbilgideki yıl
- `images/`: profil fotoğrafı ve diğer görseller için klasör
- `cv.pdf` (isteğe bağlı): CV'nin PDF hali, sitede "CV'yi indir" bağlantısı için

## Fotoğraf ve CV eklemek

1. Fotoğrafını `images/profil.jpg` adıyla kaydet. Kare ve en az 400×400 piksel olsun.
   `index.html` içinde `FOTOĞRAF` yazan yorumun altındaki satırın yorumunu kaldır.
2. CV'ni `cv.pdf` adıyla bu klasöre koy. `index.html` içinde `CV'yi indir` satırının yorumunu kaldır.

## Bilgisayarında açmak

`index.html` dosyasına çift tıklaman yeterli.

## Yazdırma

Tarayıcıda Cmd+P (Windows'ta Ctrl+P) ile yazdırınca menü ve düğmeler gizlenir, sayfa sade bir CV gibi çıkar. PDF olarak da kaydedebilirsin.

## Yayınlamak

### Claude'da

Claude siteyi claude.ai'de kendi linki olan bir sayfa olarak yayınlar. Sayfa başta yalnızca sana açıktır, paylaş düğmesiyle istediğin kişilere ya da herkese açabilirsin. İçeriği değiştirdikten sonra Claude'a "siteyi güncelle" demen yeterli, link aynı kalır.

### GitHub Pages (https://butkanun.github.io)

Repo: `butkanun/butkanun.github.io` (herkese açık olmalı).

**Tarayıcıdan yüklemek (en kolay):**

1. Repo sayfasında **Add file → Upload files**'a tıkla (boş repoda "uploading an existing file" bağlantısı).
2. Bu klasörden yalnızca `index.html`, `style.css`, `script.js` dosyalarını ve `images` klasörünü sürükleyip bırak. CV PDF'ini yükleme, içinde telefon numaran var.
3. Sayfanın altındaki **Commit changes** düğmesine bas.
4. **Settings → Pages** bölümünde **Source** `Deploy from a branch`, branch `main`, klasör `/ (root)` olsun, kaydet.
5. Birkaç dakika sonra site https://butkanun.github.io adresinde açılır.

Sonraki değişikliklerde değişen dosyaları aynı şekilde tekrar yüklemen yeterli, eskilerinin üzerine yazılır.

**Terminalden (git ile):**

```
git init
git add .
git commit -m "İlk sürüm"
git branch -M main
git remote add origin https://github.com/butkanun/butkanun.github.io.git
git push -u origin main
```

`.gitignore` CV PDF'lerini ve sistem dosyalarını dışarıda tutar.
