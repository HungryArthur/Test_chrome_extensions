// background.js

importScripts('utils/storage.js', 'utils/parsers.js'); // если используете модули, то потребуется сборка; для простоты можно всё в одном файле

const SEARCH_ENGINES = {
  'google.com': 'q',
  'yandex.ru': 'text',
  'duckduckgo.com': 'q'
};

// Извлечение поискового запроса из URL
function extractQuery(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    for (const [domain, param] of Object.entries(SEARCH_ENGINES)) {
      if (hostname.includes(domain)) {
        return urlObj.searchParams.get(param);
      }
    }
  } catch (e) {
    console.error('Error parsing URL', e);
  }
  return null;
}

// Отправка запроса на анализ
async function analyzeQuery(query) {
  const backendUrl = 'http://localhost:3000/api/analyze'; // позже заменить на продакшн

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!response.ok) throw new Error('Backend error');
    const result = await response.json();
    await saveAnalysis(query, result);
    await checkTriggers(); // проверяем условия для уведомлений после добавления новой записи
  } catch (error) {
    console.error('Failed to analyze:', error);
  }
}

// Сохранение результата в chrome.storage.local
async function saveAnalysis(query, result) {
  const key = 'analyses';
  const data = await chrome.storage.local.get(key);
  const list = data[key] || [];
  list.push({
    query,
    timestamp: Date.now(),
    stress_score: result.stress_score,
    emotional_tags: result.emotional_tags,
    topics: result.topics
  });
  // Ограничим историю (например, последние 1000 записей)
  if (list.length > 1000) list.shift();
  await chrome.storage.local.set({ [key]: list });
}

// Проверка триггеров для уведомлений
async function checkTriggers() {
  const { analyses } = await chrome.storage.local.get('analyses');
  if (!analyses || analyses.length === 0) return;

  // Пример: высокий стресс 3 дня подряд
  const now = Date.now();
  const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
  const lastThreeDays = analyses.filter(a => a.timestamp >= threeDaysAgo);
  const highStressDays = new Set();
  lastThreeDays.forEach(a => {
    const day = new Date(a.timestamp).toDateString();
    if (a.stress_score > 0.7) highStressDays.add(day);
  });
  if (highStressDays.size >= 3) {
    showNotification(
      'Напряжённые дни',
      'Последние дни были напряжёнными. Хотите упражнение на расслабление?'
    );
  }

  // Дополнительные триггеры можно добавить здесь
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title,
    message,
    priority: 2
  });
}

// Слушаем обновления вкладок
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.active) {
    const query = extractQuery(tab.url);
    if (query) {
      analyzeQuery(query);
    }
  }
});

// Также можно использовать alarms для периодической проверки (например, раз в день)
chrome.alarms.create('dailyCheck', { periodInMinutes: 1440 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyCheck') {
    checkTriggers(); // или другие действия
  }
});