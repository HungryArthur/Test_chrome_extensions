let allAnalyses = [];

async function init() {
  const { analyses } = await chrome.storage.local.get('analyses');
  allAnalyses = analyses || [];
  renderChart(allAnalyses);
  renderCalendar(allAnalyses);
}

function renderChart(data) {
  const ctx = document.getElementById('trend-chart').getContext('2d');
  const dates = data.map(a => new Date(a.timestamp).toLocaleDateString());
  const scores = data.map(a => a.stress_score);
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Индекс стресса',
        data: scores,
        borderColor: 'blue',
        fill: false
      }]
    }
  });
}

function renderCalendar(data) {
  // Здесь можно реализовать календарь с цветовой индикацией
  // Например, сгруппировать по дням и вывести div с цветом
  const container = document.getElementById('calendar');
  const daysMap = new Map();
  data.forEach(a => {
    const day = new Date(a.timestamp).toDateString();
    if (!daysMap.has(day) || a.stress_score > daysMap.get(day)) {
      daysMap.set(day, a.stress_score);
    }
  });
  for (let [day, score] of daysMap) {
    const div = document.createElement('div');
    div.textContent = day;
    div.style.backgroundColor = score > 0.7 ? 'red' : score > 0.3 ? 'orange' : 'green';
    container.appendChild(div);
  }
}

document.getElementById('export-csv').addEventListener('click', () => {
  let csv = 'Дата,Запрос,Стресс,Темы\n';
  allAnalyses.forEach(a => {
    const date = new Date(a.timestamp).toISOString();
    csv += `"${date}","${a.query}",${a.stress_score},"${a.topics.join('|')}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: 'stress-data.csv' });
});

init();