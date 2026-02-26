const fs = require('fs');
const path = require('path');

// Загрузка
const anxietyWords = JSON.parse(fs.readFileSync(path.join(__dirname, 'dictionaries/anxiety.json'), 'utf8'));
const fatigueWords = JSON.parse(fs.readFileSync(path.join(__dirname, 'dictionaries/fatigue.json'), 'utf8'));
const topicsDict = JSON.parse(fs.readFileSync(path.join(__dirname, 'dictionaries/topics.json'), 'utf8'));

// Функция для приведения к нижнему регистру
function normalize(text) {
  return text.toLowerCase().split(/\W+/);
}

// Основная функция анализа
function analyze(query) {
  const words = normalize(query);
  
  // Оценка стресса на основе ключевых слов
  let stressScore = 0;
  let emotionalTags = [];
  
  // Считаем количество тревожных и усталостных слов
  const anxietyCount = words.filter(w => anxietyWords.includes(w)).length;
  const fatigueCount = words.filter(w => fatigueWords.includes(w)).length;
  
  // формула: (кол-во негативных слов) / (общее кол-во слов) с ограничением
  if (words.length > 0) {
    stressScore = Math.min((anxietyCount + fatigueCount) / words.length, 1);
  }
  
  // Добавляем эмоциональные теги
  if (anxietyCount > 0) emotionalTags.push('anxiety');
  if (fatigueCount > 0) emotionalTags.push('fatigue');
  
  // Определение тематики
  let topics = [];
  for (const [topic, keywords] of Object.entries(topicsDict)) {
    if (keywords.some(kw => words.includes(kw))) {
      topics.push(topic);
    }
  }
  
  // Если тематика не определена, добавить "other"
  if (topics.length === 0) topics.push('other');
  
  // Нормализация
  return {
    stress_score: stressScore,
    emotional_tags: emotionalTags,
    topics
  };
}

module.exports = analyze;