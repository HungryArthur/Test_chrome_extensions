// Ключевые слова для оценки стресса
const STRESS_KEYWORDS = [
  'срочно', 'дедлайн', 'проблема', 'кризис', 'авария', 'жопа', 'катастрофа',
  'urgent', 'deadline', 'crash', 'error', 'fail', 'emergency', 'alert'
];

function analyzeTabStress(tab) {
  const text = (tab.title + ' ' + tab.url).toLowerCase();
  let score = 0;
  STRESS_KEYWORDS.forEach(word => {
    if (text.includes(word)) score += 15;
  });
  score += Math.floor(Math.random() * 10);
  return Math.min(score, 100);
}

async function getCurrentStress() {
  const tabs = await chrome.tabs.query({});
  if (tabs.length === 0) return 0;
  let total = 0;
  tabs.forEach(tab => {
    total += analyzeTabStress(tab);
  });
  return Math.round(total / tabs.length);
}

function generateStressDataForPeriod(period) {
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
    let base = 50 + Math.sin(i / 7) * 10 + (i / points) * 5 + Math.random() * 15;
    data.push(Math.min(100, Math.max(0, Math.round(base))));
  }

  const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
  const peak = Math.max(...data);
  const highRiskTabs = Math.floor(Math.random() * 5) + 1;

  return { data, avg, peak, highRiskTabs };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentStress') {
    getCurrentStress().then(level => sendResponse({ level }));
    return true;
  } else if (request.action === 'getStressData') {
    const result = generateStressDataForPeriod(request.period || 'week');
    sendResponse(result);
    return true;
  }
});

// Открываем боковую панель при клике на иконку
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});