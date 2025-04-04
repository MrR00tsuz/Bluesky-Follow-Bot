# Bluesky Follow Bot

Bluesky platformu için geliştirilmiş otomatik takip botu Chrome eklentisi. Bu eklenti, Bluesky'da "Geri Takip Et" ve "Takip Et" butonlarını otomatik olarak bulup tıklayarak takip işlemlerini kolaylaştırır.

## Özellikler

- **İki Farklı Çalışma Modu**:
  - **Geri Takip Et Modu**: Sadece "Geri Takip Et" ve "Follow Back" butonlarını bulup tıklar
  - **Takip Et Modu**: Sadece "Takip Et" ve "Follow" butonlarını bulup tıklar

- **Özelleştirilebilir Ayarlar**:
  - **Takip Aralığı**: Her takip işlemi arasındaki bekleme süresini ayarlayabilirsiniz (saniye)
  - **Yenileme Süresi**: Sayfanın otomatik yenilenme süresini ayarlayabilirsiniz (saniye)
  - **Maksimum Takip Sayısı**: Bir döngüde maksimum kaç kişiyi takip edeceğini belirleyebilirsiniz
  - **Otomatik Sayfa Yenileme**: Açık/Kapalı
  - **Otomatik Kaydırma**: Açık/Kapalı

- **Akıllı Sayfa Tarama**:
  - Hızlı sayfa kaydırma ile tüm butonları bulma
  - Görünmeyen butonları görünür alana kaydırma
  - Sayfa yenileme sonrası otomatik devam etme

## Kurulum

### Manuel Kurulum (Chromium Tabanlı Tarayıcılar)

1. Bu repoyu bilgisayarınıza indirin veya klonlayın
2. Tarayıcınızın eklenti sayfasına gidin:
   - **Chrome**: `chrome://extensions/`
   - **Opera**: `opera://extensions/`
   - **Brave**: `brave://extensions/`
   - **Vivaldi**: `vivaldi://extensions/`
   - **Yandex**: `browser://extensions/`
3. Sağ üst köşedeki "Geliştirici modu" seçeneğini etkinleştirin
4. "Paketlenmemiş öğe yükle" (veya benzer bir buton) tıklayın
5. İndirdiğiniz klasörü seçin ve "Seç" butonuna tıklayın
6. Eklenti başarıyla yüklenecektir

### Firefox Kurulumu

1. Bu repoyu bilgisayarınıza indirin veya klonlayın
2. Firefox tarayıcınızı açın ve `about:debugging#/runtime/this-firefox` adresine gidin
3. "Geçici Eklenti Yükle" butonuna tıklayın
4. İndirdiğiniz klasördeki `manifest.json` dosyasını seçin
5. Eklenti geçici olarak yüklenecektir (Firefox'u kapattığınızda kaldırılır)

## Kullanım

1. Bluesky platformuna giriş yapın (`https://bsky.app`)
2. Takip etmek istediğiniz kullanıcıların bulunduğu bir sayfaya gidin (örn. bildirimler, keşfet sayfası)
3. Chrome araç çubuğundan Bluesky Follow Bot ikonuna tıklayın
4. Açılan pencereden istediğiniz ayarları yapın:
   - Takip Modu seçin (Geri Takip Et / Takip Et)
   - Takip Aralığı belirleyin
   - Yenileme Süresi belirleyin
   - Maksimum Takip Sayısı belirleyin
   - Otomatik Sayfa Yenileme ve Kaydırma seçeneklerini ayarlayın
5. "Botu Başlat" butonuna tıklayın
6. Bot çalışmaya başlayacak ve konsol çıktılarından ilerlemeyi takip edebilirsiniz
7. Durdurmak istediğinizde "Botu Durdur" butonuna tıklayın

## Güvenlik Notları

- Bu bot sadece "Geri Takip Et" veya "Takip Et" butonlarını hedefler, diğer butonlara tıklamaz
- Bluesky'ın spam politikalarına uygun olması için makul takip aralıkları kullanın
- Çok hızlı takip işlemleri hesabınızın kısıtlanmasına neden olabilir

## Geliştirici

[@mrr00tsuz.bsky.social](https://bsky.app/profile/mrr00tsuz.bsky.social)

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Sürüm Geçmişi

- **v1.1.0** - Takip Et modu eklendi, hızlı sayfa tarama ve sayfa yenileme sonrası çalışmama sorunu çözüldü
- **v1.0.0** - İlk sürüm, temel Geri Takip Et fonksiyonalitesi
