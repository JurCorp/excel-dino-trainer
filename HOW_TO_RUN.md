# 🚀 Как запустить Jurassic Excel - пошаговая инструкция

## Шаг 1: Подготовка файлов 📁

1. **Открой папку с проектом** на своем компьютере
2. **Убедись, что у тебя есть все файлы:**
   - `index.html`
   - `main.js`
   - `styles.css`
   - `logic.js`
   - `config.js`
   - `exercises-examples.js`

## Шаг 2: Настройка Supabase 🗄️

### 2.1 Создание таблиц в Supabase

1. **Зайди на [supabase.com](https://supabase.com)**
2. **Войди в свой аккаунт** (или создай новый)
3. **Выбери свой проект** (тот, откуда ты взял ключи)
4. **Нажми на "SQL Editor"** в левом меню
5. **Скопируй и вставь этот код:**

```sql
-- Создание таблицы профилей пользователей
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  language TEXT DEFAULT 'ru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем защиту данных
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Правила доступа
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

6. **Нажми "Run"** (зеленая кнопка)
7. **Повтори то же самое с этим кодом:**

```sql
-- Создание таблицы прогресса
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, level)
);

-- Включаем защиту данных
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Правила доступа
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

## Шаг 3: Запуск приложения локально 💻

### ⚠️ ВАЖНО: Не открывай файлы напрямую!

**НЕ ДЕЛАЙ ТАК:** Двойной клик на `index.html` → ❌ CORS ошибка!

**ДЕЛАЙ ТАК:** Запускай через локальный сервер → ✅ Работает!

### Вариант 1: Через Python (рекомендуется) 🐍

#### Если у тебя есть Python:

1. **Открой командную строку** (нажми Win+R, введи `cmd`, нажми Enter)
2. **Перейди в папку проекта:**
   ```bash
   cd "C:\Users\rbula\Desktop\jurassic corp\Excel-dino"
   ```
3. **Запусти сервер:**
   ```bash
   python -m http.server 8000
   ```
4. **Открой браузер** и перейди по адресу: `http://localhost:8000`

#### Если у тебя есть Node.js:

1. **Открой командную строку**
2. **Перейди в папку проекта**
3. **Запусти сервер:**
   ```bash
   npx serve .
   ```
4. **Открой браузер** по указанному адресу

## Шаг 4: Проверка работы ✅

1. **Открой приложение** в браузере
2. **Выбери язык** (русский или английский)
3. **Попробуй зарегистрироваться** с тестовым email
4. **Попробуй решить упражнение** с формулой
5. **Проверь, что все работает!**

## Шаг 5: Деплой на Vercel 🌐

### 5.1 Подготовка к деплою

1. **Создай файл `.env`** в корне проекта:
   ```
   SUPABASE_URL=https://sgsphkkrpixfjgccczgc.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnc3Boa2tycGl4ZmpnY2NjemdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTI2NjYsImV4cCI6MjA3NTY4ODY2Nn0.OrNrqZp8k5ID8ghukPET3BN_Za2H3a-6MlfApIW2-Os
   ```

### 5.2 Загрузка на GitHub

1. **Зайди на [github.com](https://github.com)**
2. **Создай новый репозиторий** (нажми зеленую кнопку "New")
3. **Назови его** например "jurassic-excel"
4. **Загрузи все файлы** проекта
5. **Сделай commit** (сохрани изменения)

### 5.3 Деплой на Vercel

1. **Зайди на [vercel.com](https://vercel.com)**
2. **Войди через GitHub**
3. **Нажми "New Project"**
4. **Выбери свой репозиторий** "jurassic-excel"
5. **Добавь переменные окружения:**
   - `SUPABASE_URL` = твой URL
   - `SUPABASE_ANON_KEY` = твой ключ
6. **Нажми "Deploy"**
7. **Готово!** Твое приложение теперь в интернете! 🚀

## Возможные проблемы и решения 🔧

### Проблема: "CORS error"
**Решение:** Используй локальный сервер (Вариант 2)

### Проблема: "Supabase connection failed"
**Решение:** Проверь, что ключи правильные и таблицы созданы

### Проблема: "Formulas not working"
**Решение:** Убедись, что HyperFormula загружается (проверь интернет)

## Что дальше? 🎯

После того как все заработает:
1. **Протестируй все функции**
2. **Добавь больше упражнений**
3. **Настрой Stripe для платежей**
4. **Поделись с друзьями!**

Удачи! 🍀
