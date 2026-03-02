// Переключение вкладок
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

let currentPeriod = 'week';
let chartInstance = null;

const periodButtons = document.querySelectorAll('.period-btn');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');

    if (tabId === 'stress') {
      updateCurrentStress();
    } else if (tabId === 'graphs') {
      updateGraphData(currentPeriod);
    }
  });
});

periodButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    periodButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPeriod = btn.dataset.period;
    updateGraphData(currentPeriod);
  });
});

async function updateCurrentStress() {
  // Здесь будет реальный запрос к background:
  // const response = await chrome.runtime.sendMessage({ action: 'getCurrentStress' });
  // const level = response.level;
  
  // Демо-данные:
  setTimeout(() => {
    const level = Math.floor(Math.random() * 60) + 20;
    document.getElementById('currentStressValue').textContent = level + '%';

    let rec = '';
    if (level < 40) rec = '🌿 Низкий стресс. Отличное время для работы!';
    else if (level < 65) rec = '😐 Средний стресс. Сделайте паузу, глубоко вдохните.';
    else rec = '🔥 Высокий стресс! Рекомендуем отдохнуть или выйти на прогулку.';
    document.getElementById('currentStressRecommendation').textContent = rec;
  }, 300);
}

async function updateGraphData(period) {
  // Здесь будет запрос к background:
  // const response = await chrome.runtime.sendMessage({ action: 'getStressData', period });
  
  // Демо-данные:
  setTimeout(() => {
    let points;
    switch (period) {
      case 'today': points = 1; break;
      case '3days': points = 3; break;
      case 'week': points = 7; break;
      case 'month': points = 30; break;
      case 'halfyear': points = 180; break;
      default: points = 7;
    }

    const data = [];
    for (let i = 0; i < points; i++) {
      let base = 50 + Math.sin(i / 5) * 10 + Math.random() * 15;
      data.push(Math.min(100, Math.max(0, Math.round(base))));
    }

    const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
    const peak = Math.max(...data);
    const highRisk = Math.floor(Math.random() * 5) + 1;

    document.getElementById('avgStress').textContent = avg + '%';
    document.getElementById('peakStress').textContent = peak + '%';
    document.getElementById('highRiskTabs').textContent = highRisk;

    const recBox = document.getElementById('stressRecommendation');
    if (avg < 40) recBox.textContent = '🌿 Низкий стресс в среднем. Так держать!';
    else if (avg < 65) recBox.textContent = '😐 Средний стресс. Обратите внимание на триггеры.';
    else recBox.textContent = '🔥 Высокий стресс! Попробуйте техники релаксации.';

    renderChart(data, period);
  }, 300);
}

function renderChart(data, period) {
  const ctx = document.getElementById('stressChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  let labels = [];
  if (period === 'today') labels = ['Сейчас'];
  else if (period === '3days') labels = ['День 1', 'День 2', 'День 3'];
  else if (period === 'week') labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  else if (period === 'month') {
    labels = [];
    for (let i = 1; i <= data.length; i++) labels.push(i.toString());
  } else if (period === 'halfyear') {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    labels = months.slice(0, data.length);
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Уровень стресса (%)',
        data: data,
        borderColor: '#6c5ce7',
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#6c5ce7',
        pointBorderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: '#3a3a4a' },
          ticks: { color: '#a0a0b0' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#a0a0b0', maxRotation: 45, minRotation: 30 }
        }
      }
    }
  });
}

// Инициализация
if (document.querySelector('.tab-button.active')?.dataset.tab === 'stress') {
  updateCurrentStress();
} else {
  updateGraphData(currentPeriod);
}