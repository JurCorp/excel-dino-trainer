# 🎮 Руководство по созданию уровней в Jurassic Excel

## 🏗️ Архитектура уровней

### Текущая структура:
```
main.js - все в одном файле (плохо для масштабирования)
```

### Правильная структура:
```
js/
├── levels/
│   ├── level1.js    # Уровень 1: Сумма
│   ├── level2.js    # Уровень 2: Среднее
│   ├── level3.js    # Уровень 3: Максимум
│   └── level4.js    # Уровень 4: Условия
├── data/
│   ├── level1.json  # Данные для уровня 1
│   ├── level2.json  # Данные для уровня 2
│   └── level3.json  # Данные для уровня 3
└── level-manager.js # Управление уровнями
```

## 📝 Создание нового уровня

### Шаг 1: Создай данные уровня

**Файл: `data/level2.json`**
```json
{
  "id": 2,
  "title": {
    "ru": "Уровень 2: Среднее значение",
    "en": "Level 2: Average"
  },
  "description": {
    "ru": "Научись находить среднее значение",
    "en": "Learn to find average values"
  },
  "exercises": [
    {
      "id": "average-basic",
      "task": {
        "ru": "Найди среднее значение оценок в столбце B (ячейки B2..B5)",
        "en": "Find the average of grades in column B (cells B2..B5)"
      },
      "data": [
        ["Студент", "Оценка", "", "ОжидаемаяФормула"],
        ["Иван", 85, "", "=AVERAGE(B2:B5)"],
        ["Мария", 92, "", ""],
        ["Петр", 78, "", ""],
        ["Анна", 88, "", ""]
      ],
      "expectedFormula": "=AVERAGE(B2:B5)",
      "hint": {
        "ru": "Используй функцию СРЗНАЧ",
        "en": "Use the AVERAGE function"
      },
      "points": 100
    },
    {
      "id": "average-advanced",
      "task": {
        "ru": "Найди среднее значение с условием (только оценки выше 80)",
        "en": "Find average with condition (only grades above 80)"
      },
      "data": [
        ["Студент", "Оценка", "Статус", "ОжидаемаяФормула"],
        ["Иван", 85, "Хорошо", "=AVERAGEIF(B2:B5,\">80\")"],
        ["Мария", 92, "", ""],
        ["Петр", 78, "", ""],
        ["Анна", 88, "", ""]
      ],
      "expectedFormula": "=AVERAGEIF(B2:B5,\">80\")",
      "hint": {
        "ru": "Используй функцию СРЗНАЧЕСЛИ",
        "en": "Use the AVERAGEIF function"
      },
      "points": 150
    }
  ],
  "unlockCondition": {
    "type": "level_completed",
    "value": 1
  },
  "rewards": {
    "points": 250,
    "badge": "average_master"
  }
}
```

### Шаг 2: Создай класс уровня

**Файл: `js/levels/level2.js`**
```javascript
class Level2 {
  constructor() {
    this.id = 2;
    this.title = {
      ru: "Уровень 2: Среднее значение",
      en: "Level 2: Average"
    };
    this.exercises = [];
    this.currentExercise = 0;
    this.completed = false;
  }

  async load() {
    try {
      // Загружаем данные из JSON
      const response = await fetch('data/level2.json');
      const data = await response.json();
      
      this.exercises = data.exercises;
      this.title = data.title;
      
      console.log('Уровень 2 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 2:', error);
    }
  }

  getCurrentExercise() {
    return this.exercises[this.currentExercise];
  }

  nextExercise() {
    if (this.currentExercise < this.exercises.length - 1) {
      this.currentExercise++;
      return true; // Есть еще упражнения
    } else {
      this.completed = true;
      return false; // Уровень завершен
    }
  }

  checkAnswer(userFormula) {
    const exercise = this.getCurrentExercise();
    const translatedFormula = translateFormulaToEnglish(userFormula);
    
    return translatedFormula.toUpperCase() === exercise.expectedFormula.toUpperCase();
  }

  getProgress() {
    return {
      current: this.currentExercise + 1,
      total: this.exercises.length,
      completed: this.completed
    };
  }

  getScore() {
    let score = 0;
    this.exercises.forEach((exercise, index) => {
      if (index <= this.currentExercise) {
        score += exercise.points;
      }
    });
    return score;
  }
}

// Делаем класс доступным глобально
window.Level2 = Level2;
```

### Шаг 3: Создай менеджер уровней

**Файл: `js/level-manager.js`**
```javascript
class LevelManager {
  constructor() {
    this.levels = new Map();
    this.currentLevel = 1;
    this.unlockedLevels = [1]; // Начинаем с первого уровня
  }

  // Регистрируем уровень
  registerLevel(levelClass) {
    const level = new levelClass();
    this.levels.set(level.id, level);
    console.log(`Уровень ${level.id} зарегистрирован`);
  }

  // Загружаем уровень
  async loadLevel(levelId) {
    const level = this.levels.get(levelId);
    if (level) {
      await level.load();
      this.currentLevel = levelId;
      return level;
    }
    throw new Error(`Уровень ${levelId} не найден`);
  }

  // Получаем текущий уровень
  getCurrentLevel() {
    return this.levels.get(this.currentLevel);
  }

  // Переходим к следующему уровню
  async nextLevel() {
    const nextLevelId = this.currentLevel + 1;
    if (this.levels.has(nextLevelId)) {
      await this.loadLevel(nextLevelId);
      this.unlockedLevels.push(nextLevelId);
      return true;
    }
    return false; // Больше уровней нет
  }

  // Проверяем, разблокирован ли уровень
  isLevelUnlocked(levelId) {
    return this.unlockedLevels.includes(levelId);
  }

  // Получаем список всех уровней
  getAllLevels() {
    return Array.from(this.levels.values()).map(level => ({
      id: level.id,
      title: level.title,
      unlocked: this.isLevelUnlocked(level.id),
      completed: level.completed
    }));
  }

  // Сохраняем прогресс
  async saveProgress() {
    if (window.saveUserProgress && currentUser) {
      const level = this.getCurrentLevel();
      await window.saveUserProgress(
        currentUser.id,
        this.currentLevel,
        level.completed,
        level.getScore()
      );
    }
  }
}

// Создаем глобальный менеджер
window.levelManager = new LevelManager();
```

### Шаг 4: Обнови HTML для выбора уровней

**Добавь в `index.html`:**
```html
<!-- Экран выбора уровня -->
<div id="level-selection" class="level-screen" style="display:none">
  <div class="level-card">
    <h2>Выберите уровень</h2>
    <div class="levels-grid" id="levels-grid">
      <!-- Уровни будут добавлены динамически -->
    </div>
    <button id="back-to-auth" class="back-btn">← Назад к входу</button>
  </div>
</div>
```

### Шаг 5: Добавь стили для уровней

**Добавь в `styles.css`:**
```css
/* Стили для выбора уровней */
.level-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.level-card {
  background: var(--card);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.level-item {
  background: white;
  border: 2px solid var(--accent);
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.level-item:hover {
  background: var(--accent);
  transform: translateY(-2px);
}

.level-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.level-item.completed {
  border-color: var(--success);
  background: #e8f5e8;
}

.level-number {
  font-size: 2em;
  font-weight: bold;
  color: var(--primary);
}

.level-title {
  font-size: 1.1em;
  margin: 10px 0;
}

.level-status {
  font-size: 0.9em;
  color: var(--muted);
}

.back-btn {
  background: var(--muted);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
}
```

### Шаг 6: Обнови JavaScript

**Добавь в `main.js`:**
```javascript
// Функция показа экрана выбора уровней
function showLevelSelection() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('level-selection').style.display = 'flex';
  
  // Загружаем список уровней
  loadLevelsList();
}

// Функция загрузки списка уровней
function loadLevelsList() {
  const levelsGrid = document.getElementById('levels-grid');
  levelsGrid.innerHTML = '';
  
  const levels = window.levelManager.getAllLevels();
  
  levels.forEach(level => {
    const levelItem = document.createElement('div');
    levelItem.className = 'level-item';
    levelItem.innerHTML = `
      <div class="level-number">${level.id}</div>
      <div class="level-title">${level.title[currentLanguage]}</div>
      <div class="level-status">
        ${level.completed ? '✅ Завершен' : 
          level.unlocked ? '🔓 Доступен' : '🔒 Заблокирован'}
      </div>
    `;
    
    if (level.unlocked) {
      levelItem.addEventListener('click', () => startLevel(level.id));
    } else {
      levelItem.classList.add('locked');
    }
    
    if (level.completed) {
      levelItem.classList.add('completed');
    }
    
    levelsGrid.appendChild(levelItem);
  });
}

// Функция начала уровня
async function startLevel(levelId) {
  try {
    await window.levelManager.loadLevel(levelId);
    document.getElementById('level-selection').style.display = 'none';
    document.querySelector('.wrap').style.display = 'block';
    
    // Обновляем интерфейс для нового уровня
    updateLevelInterface();
  } catch (error) {
    console.error('Ошибка загрузки уровня:', error);
    alert('Ошибка загрузки уровня');
  }
}

// Функция обновления интерфейса уровня
function updateLevelInterface() {
  const level = window.levelManager.getCurrentLevel();
  const exercise = level.getCurrentExercise();
  
  // Обновляем заголовок
  document.querySelector('h1').textContent = 
    `${level.title[currentLanguage]} - Упражнение ${level.getProgress().current}`;
  
  // Обновляем задачу
  document.querySelector('#task div').textContent = exercise.task[currentLanguage];
  
  // Обновляем данные таблицы
  renderLevelTable(exercise.data);
  
  // Обновляем подсказку
  if (exercise.hint) {
    document.querySelector('#userFormula').placeholder = 
      `${exercise.hint[currentLanguage]} (${exercise.expectedFormula})`;
  }
}

// Функция рендера таблицы уровня
function renderLevelTable(data) {
  const wrap = document.getElementById('tableWrap');
  wrap.innerHTML = '';
  
  const tbl = document.createElement('table');
  
  data.forEach((row, r) => {
    const tr = document.createElement('tr');
    row.forEach((cell, c) => {
      if (r === 0) {
        const th = document.createElement('th');
        th.textContent = cell;
        tr.appendChild(th);
      } else {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      }
    });
    tbl.appendChild(tr);
  });
  
  wrap.appendChild(tbl);
}
```

## 🚀 Как использовать:

### 1. **Создай файлы:**
- `data/level2.json` - данные уровня
- `js/levels/level2.js` - логика уровня
- `js/level-manager.js` - управление уровнями

### 2. **Обнови HTML:**
- Добавь экран выбора уровней
- Подключи новые скрипты

### 3. **Обнови CSS:**
- Добавь стили для уровней

### 4. **Обнови main.js:**
- Добавь функции управления уровнями

### 5. **Зарегистрируй уровень:**
```javascript
// В main.js после загрузки
window.levelManager.registerLevel(Level2);
```

## 🎯 Результат:

- ✅ **Выбор уровней** - красивый экран с сеткой
- ✅ **Прогресс** - видно какие уровни завершены
- ✅ **Блокировка** - недоступные уровни заблокированы
- ✅ **Сохранение** - прогресс сохраняется в Supabase
- ✅ **Масштабируемость** - легко добавлять новые уровни

Хочешь, чтобы я создал эти файлы для тебя? 😊
