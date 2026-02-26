async function loadSettings() {
  const settings = await chrome.storage.sync.get({
    notificationsEnabled: true,
    quietStart: '22:00',
    quietEnd: '08:00'
  });
  document.getElementById('notifications-enabled').checked = settings.notificationsEnabled;
  document.getElementById('quiet-start').value = settings.quietStart;
  document.getElementById('quiet-end').value = settings.quietEnd;
}

async function saveSettings(e) {
  e.preventDefault();
  await chrome.storage.sync.set({
    notificationsEnabled: document.getElementById('notifications-enabled').checked,
    quietStart: document.getElementById('quiet-start').value,
    quietEnd: document.getElementById('quiet-end').value
  });
  alert('Настройки сохранены');
}

document.getElementById('settings-form').addEventListener('submit', saveSettings);
document.getElementById('clear-data').addEventListener('click', async () => {
  if (confirm('Удалить все данные анализа?')) {
    await chrome.storage.local.remove('analyses');
    alert('Данные очищены');
  }
});

loadSettings();