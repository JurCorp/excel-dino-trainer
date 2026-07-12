# 🐛 Руководство по отладке Jurassic Excel

## Проблема: Кнопки выбора языка не работают

### Шаг 1: Проверь базовую функциональность 🧪

1. **Открой файл `test.html`** в браузере
2. **Нажми на кнопки** "🇷🇺 Русский" и "🇺🇸 English"
3. **Проверь, что появляются сообщения** ✅

**Если test.html работает, а main.js нет - проблема в основном коде!**

### Шаг 2: Проверь консоль браузера 🔍

1. **Открой `index.html`** в браузере
2. **Нажми F12** (открыть инструменты разработчика)
3. **Перейди на вкладку "Console"**
4. **Обнови страницу** (F5)
5. **Посмотри на сообщения:**

#### ✅ Хорошие сообщения:
```
DOM загружен, начинаем инициализацию
Кнопка русский: <button id="select-russian" class="language-btn">...</button>
Кнопка английский: <button id="select-english" class="language-btn">...</button>
```

#### ❌ Плохие сообщения:
```
Кнопка select-russian не найдена!
Кнопка select-english не найдена!
```

### Шаг 3: Проверь ошибки JavaScript 🚨

В консоли могут быть ошибки типа:
- `Uncaught SyntaxError` - синтаксическая ошибка
- `Uncaught ReferenceError` - не найдена переменная
- `Failed to load module` - проблема с импортами

### Шаг 4: Проверь загрузку файлов 📁

1. **Перейди на вкладку "Network"** в инструментах разработчика
2. **Обнови страницу**
3. **Проверь, что все файлы загружены:**
   - ✅ `index.html`
   - ✅ `main.js`
   - ✅ `styles.css`
   - ✅ `logic.js`

### Шаг 5: Простые решения 🔧

#### Решение 1: Очисти кэш браузера
1. **Нажми Ctrl+Shift+R** (жесткое обновление)
2. **Или Ctrl+F5**

#### Решение 2: Проверь локальный сервер
Если открываешь файл напрямую (file://), попробуй через сервер:

**Python:**
```bash
python -m http.server 8000
```
Затем открой: `http://localhost:8000`

**Node.js:**
```bash
npx serve .
```

#### Решение 3: Проверь импорты
В `main.js` есть импорты:
```javascript
import { createClient } from '@supabase/supabase-js'
import { getUsers, saveUserProgress, getUserProgress, createUserProfile, updateUserLanguage } from './logic.js'
```

Убедись, что файл `logic.js` существует и в нем есть эти функции.

### Шаг 6: Альтернативное решение 🆘

Если ничего не помогает, создай упрощенную версию:

#### `simple-main.js` (без импортов):
```javascript
// Простая версия без импортов
let currentLanguage = 'ru';

function selectLanguage(lang) {
  console.log('Выбран язык:', lang);
  currentLanguage = lang;
  localStorage.setItem('selectedLanguage', lang);
  
  // Скрываем экран выбора языка
  document.getElementById('language-selection').classList.add('hidden');
  
  // Показываем экран аутентификации
  document.getElementById('auth-section').style.display = 'block';
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM загружен');
  
  const russianBtn = document.getElementById('select-russian');
  const englishBtn = document.getElementById('select-english');
  
  if (russianBtn) {
    russianBtn.addEventListener('click', () => selectLanguage('ru'));
  }
  
  if (englishBtn) {
    englishBtn.addEventListener('click', () => selectLanguage('en'));
  }
});
```

#### Обнови `index.html`:
```html
<script src="simple-main.js"></script>
```

### Шаг 7: Проверь финальный результат ✅

После исправления должно работать:
1. **Клик по "🇷🇺 Русский"** → скрывается экран выбора, показывается экран входа
2. **Клик по "🇺🇸 English"** → то же самое
3. **В консоли появляются сообщения** о выборе языка

### 🆘 Если ничего не помогает

1. **Скопируй все сообщения из консоли**
2. **Опиши, что именно происходит**
3. **Покажи, какие ошибки появляются**

Я помогу разобраться! 😊

## Частые проблемы и решения

### Проблема: "Cannot read property 'addEventListener' of null"
**Решение:** Элемент не найден. Проверь ID в HTML и JavaScript.

### Проблема: "Module not found"
**Решение:** Проверь пути к файлам и импорты.

### Проблема: "CORS error"
**Решение:** Используй локальный сервер, не открывай файл напрямую.

### Проблема: "Supabase connection failed"
**Решение:** Проверь ключи в `logic.js` и `main.js`.
