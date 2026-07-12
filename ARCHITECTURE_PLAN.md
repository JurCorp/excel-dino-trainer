# 🏗️ План архитектуры для масштабирования Jurassic Excel

## Текущая проблема ❌

Сейчас все в одном файле `main.js` - это плохо для больших проектов!

## Правильная архитектура ✅

### Структура папок:
```
jurassic-excel/
├── index.html
├── styles/
│   ├── main.css
│   ├── components.css
│   └── themes.css
├── js/
│   ├── app.js              # Главный файл приложения
│   ├── auth.js             # Аутентификация
│   ├── database.js         # Работа с базой данных
│   ├── exercises/
│   │   ├── level1.js       # Уровень 1: Сумма
│   │   ├── level2.js       # Уровень 2: Среднее
│   │   ├── level3.js       # Уровень 3: Максимум
│   │   └── level4.js       # Уровень 4: Условия
│   ├── utils/
│   │   ├── formula-translator.js
│   │   ├── progress-manager.js
│   │   └── ui-helpers.js
│   └── config/
│       ├── supabase.js     # Только конфигурация!
│       └── app-config.js
├── exercises/
│   ├── data/
│   │   ├── level1.json     # Данные для уровня 1
│   │   ├── level2.json     # Данные для уровня 2
│   │   └── level3.json     # Данные для уровня 3
│   └── templates/
│       ├── sum-exercises.js    # Шаблоны для SUM
│       ├── average-exercises.js # Шаблоны для AVERAGE
│       └── if-exercises.js     # Шаблоны для IF
└── .env                     # Секретные ключи (НЕ в коде!)
```

## Пример правильной структуры файлов

### 1. `js/config/supabase.js` - Только конфигурация!
```javascript
// НЕ ХРАНИМ КЛЮЧИ В КОДЕ!
const SUPABASE_URL = process.env.SUPABASE_URL || 'fallback-url'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'fallback-key'

export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
}
```

### 2. `exercises/data/level1.json` - Данные для уровня
```json
{
  "level": 1,
  "title": {
    "ru": "Уровень 1: Сумма",
    "en": "Level 1: Sum"
  },
  "exercises": [
    {
      "id": "sum-basic",
      "task": {
        "ru": "Посчитай сумму продаж столбца B",
        "en": "Calculate the sum of sales in column B"
      },
      "data": [
        ["Товар", "Стоимость", "", "ОжидаемаяФормула"],
        ["A", 10, "", "=SUM(B2:B4)"],
        ["B", 20, "", ""],
        ["C", 30, "", ""]
      ],
      "expectedFormula": "=SUM(B2:B4)",
      "hint": {
        "ru": "Используй функцию СУММ",
        "en": "Use the SUM function"
      }
    },
    {
      "id": "sum-advanced",
      "task": {
        "ru": "Посчитай сумму с условием",
        "en": "Calculate conditional sum"
      },
      "data": [
        ["Товар", "Цена", "Количество", "ОжидаемаяФормула"],
        ["Яблоки", 50, 3, "=SUM(B2:C2)"],
        ["Бананы", 30, 5, ""],
        ["Апельсины", 40, 2, ""]
      ],
      "expectedFormula": "=SUM(B2:C2)",
      "hint": {
        "ru": "Сложи цену и количество",
        "en": "Add price and quantity"
      }
    }
  ]
}
```

### 3. `js/exercises/level1.js` - Логика уровня
```javascript
import { loadExerciseData } from '../utils/exercise-loader.js'
import { validateFormula } from '../utils/formula-validator.js'

export class Level1 {
  constructor() {
    this.exercises = []
    this.currentExercise = 0
  }

  async load() {
    const data = await loadExerciseData('level1')
    this.exercises = data.exercises
  }

  getCurrentExercise() {
    return this.exercises[this.currentExercise]
  }

  nextExercise() {
    if (this.currentExercise < this.exercises.length - 1) {
      this.currentExercise++
      return true
    }
    return false // Уровень завершен
  }

  checkAnswer(userFormula) {
    const exercise = this.getCurrentExercise()
    return validateFormula(userFormula, exercise.expectedFormula)
  }
}
```

## Как добавить новый уровень? 🆕

### Шаг 1: Создай данные
Создай файл `exercises/data/level5.json`:
```json
{
  "level": 5,
  "title": {
    "ru": "Уровень 5: Сложные условия",
    "en": "Level 5: Complex Conditions"
  },
  "exercises": [
    {
      "id": "nested-if",
      "task": {
        "ru": "Создай вложенное условие",
        "en": "Create nested condition"
      },
      "data": [
        ["Студент", "Оценка", "Статус", "ОжидаемаяФормула"],
        ["Иван", 85, "Отлично", "=IF(B2>=90,\"A\",IF(B2>=80,\"B\",\"C\"))"],
        ["Мария", 92, "", ""],
        ["Петр", 78, "", ""]
      ],
      "expectedFormula": "=IF(B2>=90,\"A\",IF(B2>=80,\"B\",\"C\"))"
    }
  ]
}
```

### Шаг 2: Создай класс уровня
Создай файл `js/exercises/level5.js`:
```javascript
import { Level1 } from './level1.js'

export class Level5 extends Level1 {
  // Наследуем всю логику от Level1
  // Можно переопределить специфичные методы
}
```

### Шаг 3: Добавь в главное приложение
В `js/app.js`:
```javascript
import { Level1 } from './exercises/level1.js'
import { Level5 } from './exercises/level5.js'

const levels = {
  1: Level1,
  5: Level5
  // Добавляй новые уровни здесь
}
```

## Преимущества такой архитектуры 🎯

1. **Легко добавлять уровни** - просто создай новый файл
2. **Легко добавлять упражнения** - просто добавь в JSON
3. **Безопасность** - ключи не в коде
4. **Читаемость** - каждый файл отвечает за свою задачу
5. **Тестируемость** - можно тестировать каждый уровень отдельно

## Миграция с текущей структуры 🔄

### Шаг 1: Создай новую структуру папок
### Шаг 2: Разбей `main.js` на части:
- Аутентификация → `js/auth.js`
- Работа с БД → `js/database.js`
- Логика упражнений → `js/exercises/`
- Утилиты → `js/utils/`

### Шаг 3: Создай `.env` файл для ключей
### Шаг 4: Обнови импорты в `index.html`

## Готовые шаблоны для быстрого старта 🚀

Хочешь, чтобы я создал эту структуру для тебя? Я могу:
1. Разбить текущий код на правильные файлы
2. Создать систему загрузки упражнений
3. Настроить безопасное хранение ключей
4. Создать шаблоны для новых уровней

Скажи, и я сделаю это! 😊
