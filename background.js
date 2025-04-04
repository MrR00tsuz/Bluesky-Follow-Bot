let refreshTimer = null;

// Sayfayı yenile ve botu başlat
async function refreshAndStartBot(tabId, settings) {
  console.log('Sayfa yenileniyor...');
  
  try {
    // Önce sayfayı yenile
    await chrome.tabs.reload(tabId);
    
    // Sayfa yükleme durumunu kontrol et ve botu başlat
    const checkAndStartBot = async (attempt = 1, maxAttempts = 5) => {
      console.log(`Sayfa yükleme kontrolü: Deneme ${attempt}/${maxAttempts}`);
      
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId },
          func: () => ({ 
            ready: document.readyState === 'complete',
            url: window.location.href
          })
        });
        
        if (results && results[0] && results[0].result) {
          const { ready, url } = results[0].result;
          
          if (ready && url.includes('bsky.app')) {
            console.log(`Sayfa tam olarak yüklendi: ${url}`);
            
            // Botu başlat
            setTimeout(() => {
              chrome.tabs.sendMessage(tabId, { 
                action: 'updateSettings',
                settings: settings,
                autoStart: true // Otomatik başlatma bayrağı
              });
            }, 2000);
            
            return true;
          }
        }
        
        // Maksimum deneme sayısına ulaşılmadıysa tekrar dene
        if (attempt < maxAttempts) {
          setTimeout(() => checkAndStartBot(attempt + 1, maxAttempts), 3000);
        } else {
          console.error('Sayfa yükleme zaman aşımına uğradı!');
        }
      } catch (error) {
        console.error('Sayfa yükleme kontrolü sırasında hata:', error);
        
        if (attempt < maxAttempts) {
          setTimeout(() => checkAndStartBot(attempt + 1, maxAttempts), 3000);
        }
      }
    };
    
    // Sayfa yükleme kontrolünü başlat
    setTimeout(() => checkAndStartBot(), 3000);
    
  } catch (error) {
    console.error('Sayfa yenileme sırasında hata:', error);
  }
}

// Aktif Bluesky sekmesini bul
async function findBlueskyTab() {
  const tabs = await chrome.tabs.query({ url: "*://*.bsky.app/*" });
  return tabs[0];
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'startBot') {
    const tab = await findBlueskyTab();
    if (!tab) {
      console.error('Bluesky sekmesi bulunamadı!');
      return;
    }

    // Mevcut zamanlayıcıyı temizle
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }

    // Ayarları al
    const settings = message.settings || {};
    
    // İlk çalıştırma
    refreshAndStartBot(tab.id, settings);
    
    // Otomatik yenileme istenmiyorsa zamanlayıcı kurma
    if (!settings.autoRefresh) {
      console.log('Otomatik sayfa yenileme devre dışı!');
      return;
    }

  } else if (message.action === 'stopBot') {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    
    const tab = await findBlueskyTab();
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: 'stopBot' });
    }
  } else if (message.action === 'refreshPage') {
    // Content script'ten sayfa yenileme isteği geldiğinde
    const tab = await findBlueskyTab();
    if (tab) {
      // Gelen ayarları kullan veya depodan al
      let settings = message.settings || {};
      
      // Ayarlar gönderilmediyse depodan al
      if (!Object.keys(settings).length) {
        try {
          const result = await chrome.storage.local.get(null);
          settings = result;
        } catch (err) {
          console.error('Ayarlar alınırken hata:', err);
        }
      }
      
      // Sayfayı yenile ve botu başlat
      refreshAndStartBot(tab.id, settings);
    }
  }
});
