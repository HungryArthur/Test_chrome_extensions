// utils/storage.js
export async function saveAnalysis(query, result) {
  const key = 'analyses';
  const data = await chrome.storage.local.get(key);
  const list = data[key] || [];
  list.push({
    query,
    timestamp: Date.now(),
    ...result
  });
  // Ограничим историю, например, последние 1000 записей
  if (list.length > 1000) list.shift();
  await chrome.storage.local.set({ [key]: list });
  // После сохранения можно обновить popup, если он открыт
  // или проверить триггеры для подсказок
  checkTriggers(list);
}

function checkTriggers(analyses) {
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

  // Другие триггеры: ключевые слова, пики по времени и т.д.
}