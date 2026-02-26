async function loadData() {
  const { analyses } = await chrome.storage.local.get('analyses');
  const last = analyses?.[analyses.length - 1];
  if (!last) {
    document.getElementById('stress-score').textContent = 'Нет данных';
    return;
  }

  document.getElementById('stress-score').textContent = last.stress_score.toFixed(2);
  const indicator = document.getElementById('stress-indicator');
  if (last.stress_score < 0.3) indicator.style.backgroundColor = 'green';
  else if (last.stress_score < 0.7) indicator.style.backgroundColor = 'orange';
  else indicator.style.backgroundColor = 'red';

  const topics = last.topics.join(', ');
  document.getElementById('topics').textContent = `Темы: ${topics}`;

  // Простой график за 7 последних дней
  const last7 = analyses.slice(-7).map(a => a.stress_score);
  drawMiniChart(last7);
}

function drawMiniChart(data) {
  const canvas = document.getElementById('mini-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (data.length === 0) return;
  const w = canvas.width / data.length;
  ctx.fillStyle = '#4caf50';
  data.forEach((val, i) => {
    const h = val * canvas.height;
    ctx.fillRect(i * w, canvas.height - h, w - 2, h);
  });
}

document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('details').addEventListener('click', () => {
  chrome.tabs.create({ url: 'stats/stats.html' });
});