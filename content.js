let isRunning = false;
let botSettings = {
  refreshInterval: 120,  // saniye
  followDelay: 5,        // saniye
  maxFollows: 30,        // maksimum takip sayısı
  autoRefresh: true,     // otomatik sayfa yenileme
  autoScroll: true,      // otomatik kaydırma
  mode: 'followBack'     // takip modu: 'followBack' veya 'follow'
};

// Hızlı sayfa kaydırma fonksiyonu - sayfanın sonuna kadar hızlıca iner
async function fastScrollToBottom() {
  if (!isRunning || !botSettings.autoScroll) return false;
  
  console.log("🚀 Hızlı kaydırma başlatılıyor...");
  
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const totalHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  let currentPosition = window.scrollY;
  const scrollStep = viewportHeight * 0.8; // Viewport'un %80'i kadar adımlarla kaydır
  
  while (isRunning && currentPosition < totalHeight - viewportHeight && botSettings.autoScroll) {
    window.scrollBy(0, scrollStep);
    currentPosition = window.scrollY;
    console.log(`📜 Sayfa kaydırılıyor: ${Math.round((currentPosition / totalHeight) * 100)}%`);
    await delay(100); // Hızlı kaydırma için kısa bekleme
    
    // Sayfanın sonuna ulaşıldı mı kontrol et
    if (currentPosition + viewportHeight >= totalHeight - 100) {
      console.log("🏁 Sayfanın sonuna ulaşıldı!");
      return true;
    }
  }
  
  return currentPosition + viewportHeight >= totalHeight - 100;
}

// Buton bulma fonksiyonu
function findFollowButtons() {
  const buttons = document.querySelectorAll('button');
  let filteredButtons = [];
  
  // Mod'a göre butonları filtrele
  if (botSettings.mode === 'followBack') {
    // SADECE "Geri Takip Et" butonlarını filtrele
    filteredButtons = Array.from(buttons).filter(btn => {
      if (!btn || !btn.innerText) return false;
      const text = btn.innerText.trim().toLowerCase();
      return text === "geri takip et" || text === "follow back";
    });
    
    console.log(`🔍 ${filteredButtons.length} geri takip butonu bulundu`);
  } 
  else if (botSettings.mode === 'follow') {
    // SADECE "Takip Et" butonlarını filtrele
    filteredButtons = Array.from(buttons).filter(btn => {
      if (!btn || !btn.innerText) return false;
      const text = btn.innerText.trim().toLowerCase();
      return (text === "takip et" || text === "follow") && 
             !(text === "geri takip et" || text === "follow back");
    });
    
    console.log(`🔍 ${filteredButtons.length} takip et butonu bulundu`);
  }
  
  if (filteredButtons.length > 0) {
    console.log("Bulunan butonlar:", filteredButtons.map(btn => btn.innerText.trim()));
  }
  
  return filteredButtons;
}

// Ana bot fonksiyonu
async function followBackBot() {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  let lastRefreshTime = Date.now();
  let scanCount = 0;

  while (isRunning) {
    scanCount++;
    console.log(`🔄 #${scanCount} Yeni tarama başlıyor... Mod: ${botSettings.mode === 'followBack' ? 'Geri Takip Et' : 'Takip Et'}`);
    
    // Önce hızlı kaydırma yap ve tüm butonları bul
    if (botSettings.autoScroll) {
      console.log("📜 Tüm butonları bulmak için sayfayı hızlıca tarıyorum...");
      await fastScrollToBottom();
      // Sayfanın başına dön
      window.scrollTo(0, 0);
      await delay(1000);
    }
    
    // Tüm butonları bul
    const followButtons = findFollowButtons();
    console.log(`🎯 Toplam ${followButtons.length} ${botSettings.mode === 'followBack' ? 'geri takip' : 'takip'} butonu bulundu`);

    // Takip işlemi
    let count = 0;
    for (let btn of followButtons) {
      if (!isRunning) break;
      if (count >= botSettings.maxFollows) {
        console.log(`✅ Maksimum takip sayısına (${botSettings.maxFollows}) ulaşıldı.`);
        break;
      }

      try {
        // Butonun görünür olduğundan emin ol
        const rect = btn.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          // Butonu görünür alana kaydır
          btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await delay(500);
        }
        
        // Butona tıkla
        btn.click();
        console.log(`🔁 ${count + 1}. kişi ${botSettings.mode === 'followBack' ? 'geri takip' : 'takip'} edildi.`);
        count++;
      } catch (e) {
        console.warn(`⚠️ Takip butonuna tıklanamadı:`, e);
      }

      // Ayarlanan süre kadar bekle (saniye)
      const randomFactor = Math.random() * 2 - 1; // -1 ile 1 arası rastgele değer
      const waitTime = botSettings.followDelay * 1000 * (1 + randomFactor * 0.3); // %30 sapma
      await delay(waitTime);
    }

    console.log(`📊 Bu taramada ${count} kişi takip edildi.`);

    // Sayfa yenileme kontrolü
    const currentTime = Date.now();
    const timeElapsed = (currentTime - lastRefreshTime) / 1000; // saniye
    
    // Tüm işlemler bitti, yenileme zamanı geldi mi kontrol et
    if (botSettings.autoRefresh && timeElapsed >= botSettings.refreshInterval) {
      console.log(`🔄 ${botSettings.refreshInterval} saniye geçti, sayfa yenileniyor...`);
      lastRefreshTime = currentTime;
      // Sayfa yenileme mesajı gönder
      chrome.runtime.sendMessage({ 
        action: 'refreshPage',
        settings: botSettings // Ayarları da gönder
      });
      await delay(8000); // Yenileme için daha uzun bekle
    } else {
      // Yenileme zamanı gelmediğinde kısa bir bekleme
      const remainingTime = botSettings.refreshInterval - timeElapsed;
      if (remainingTime > 0 && botSettings.autoRefresh) {
        console.log(`⏳ Sonraki yenilemeye ${Math.round(remainingTime)} saniye kaldı...`);
      }
      
      await delay(5000); // 5 saniye bekle ve tekrar tara
    }
  }
}

// Background'dan gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startBot') {
    // Ayarları güncelle
    if (message.settings) {
      botSettings = message.settings;
      console.log('📝 Bot ayarları güncellendi:', botSettings);
    }
    
    // Botu başlat
    if (!isRunning) {
      isRunning = true;
      console.log('🟢 Bot başlatıldı!');
      followBackBot().catch(err => console.error('Bot çalışırken hata:', err));
    }
  } else if (message.action === 'stopBot') {
    isRunning = false;
    console.log('🔴 Bot durduruldu!');
  } else if (message.action === 'updateSettings') {
    // Ayarları güncelle
    if (message.settings) {
      botSettings = message.settings;
      console.log('📝 Bot ayarları güncellendi:', botSettings);
      
      // Bot durdurulmuşsa ve otomatik olarak yeniden başlatılması isteniyorsa
      if (!isRunning && message.autoStart) {
        isRunning = true;
        console.log('🔄 Bot yeniden başlatılıyor...');
        followBackBot().catch(err => console.error('Bot çalışırken hata:', err));
      }
    }
  }
  
  // Her zaman yanıt ver
  if (sendResponse) {
    sendResponse({ success: true });
  }
  return true; // Asenkron yanıt için true döndür
});
