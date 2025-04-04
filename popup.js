document.addEventListener('DOMContentLoaded', () => {
  // UI Elementleri
  const startButton = document.getElementById('startBot');
  const stopButton = document.getElementById('stopBot');
  const refreshInput = document.getElementById('refreshInterval');
  const followDelayInput = document.getElementById('followDelay');
  const maxFollowsInput = document.getElementById('maxFollows');
  const autoRefreshCheckbox = document.getElementById('autoRefresh');
  const autoScrollCheckbox = document.getElementById('autoScroll');
  const followModeSelect = document.getElementById('followMode');
  const statusDiv = document.getElementById('status');

  // Varsayılan ayarlar
  const defaultSettings = {
    refreshInterval: 120,  // saniye
    followDelay: 5,       // saniye
    maxFollows: 30,       // maksimum takip sayısı
    autoRefresh: true,    // otomatik sayfa yenileme
    autoScroll: true,     // otomatik kaydırma
    mode: 'followBack',   // takip modu: 'followBack' veya 'follow'
    isRunning: false      // bot çalışıyor mu?
  };

  // Kayıtlı ayarları yükle
  chrome.storage.local.get(Object.keys(defaultSettings), (result) => {
    // Eksik ayarları varsayılanlarla doldur
    const settings = { ...defaultSettings, ...result };
    
    // UI'a ayarları yansıt
    refreshInput.value = settings.refreshInterval;
    followDelayInput.value = settings.followDelay;
    maxFollowsInput.value = settings.maxFollows;
    autoRefreshCheckbox.checked = settings.autoRefresh;
    autoScrollCheckbox.checked = settings.autoScroll;
    followModeSelect.value = settings.mode || 'followBack';
    
    // Bot durumunu güncelle
    updateStatus(settings.isRunning);
  });

  // Bot başlatma
  startButton.addEventListener('click', () => {
    // Ayarları doğrula
    const refreshInterval = parseInt(refreshInput.value);
    const followDelay = parseInt(followDelayInput.value);
    const maxFollows = parseInt(maxFollowsInput.value);
    
    if (refreshInterval < 30) {
      alert('Yenileme süresi en az 30 saniye olmalıdır!');
      return;
    }
    
    if (followDelay < 1) {
      alert('Takip aralığı en az 1 saniye olmalıdır!');
      return;
    }

    // Ayarları kaydet
    const settings = {
      refreshInterval,
      followDelay,
      maxFollows,
      autoRefresh: autoRefreshCheckbox.checked,
      autoScroll: autoScrollCheckbox.checked,
      mode: followModeSelect.value,
      isRunning: true
    };
    
    chrome.storage.local.set(settings, () => {
      chrome.runtime.sendMessage({ 
        action: 'startBot', 
        settings: settings
      });
      updateStatus(true);
    });
  });

  // Bot durdurma
  stopButton.addEventListener('click', () => {
    chrome.storage.local.set({ isRunning: false }, () => {
      chrome.runtime.sendMessage({ action: 'stopBot' });
      updateStatus(false);
    });
  });

  // Durum güncelleme
  function updateStatus(isRunning) {
    if (isRunning) {
      statusDiv.textContent = 'Bot Çalışıyor ▶️';
      statusDiv.className = 'running';
    } else {
      statusDiv.textContent = 'Bot Durdu ⏹️';
      statusDiv.className = 'stopped';
    }
    
    startButton.disabled = isRunning;
    stopButton.disabled = !isRunning;
    
    // Bot çalışırken ayarları devre dışı bırak
    refreshInput.disabled = isRunning;
    followDelayInput.disabled = isRunning;
    maxFollowsInput.disabled = isRunning;
    autoRefreshCheckbox.disabled = isRunning;
    autoScrollCheckbox.disabled = isRunning;
    followModeSelect.disabled = isRunning;
  }
});
