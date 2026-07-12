# Настройка Supabase для Jurassic Excel

## 1. Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Получите URL и API ключ из настроек проекта

## 2. Создание таблиц в базе данных

Выполните следующие SQL запросы в SQL Editor Supabase:

### Таблица профилей пользователей
```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  language TEXT DEFAULT 'ru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Политика для пользователей - могут видеть только свои профили
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### Таблица прогресса пользователей
```sql
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

-- Включаем RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Политики для прогресса
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

## 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 4. Обновление кода

Замените в файлах `logic.js` и `main.js` следующие строки:

```javascript
const SUPABASE_URL = 'your-supabase-url'
const SUPABASE_KEY = 'your-supabase-anon-key'
```

На ваши реальные значения из Supabase.

## 5. Настройка аутентификации

В настройках проекта Supabase:
1. Перейдите в Authentication > Settings
2. Включите Email подтверждение (если нужно)
3. Настройте URL для редиректа после подтверждения

## 6. Тестирование

После настройки:
1. Запустите приложение
2. Попробуйте зарегистрироваться
3. Проверьте, что данные сохраняются в таблицах
4. Проверьте, что прогресс сохраняется при прохождении уровней