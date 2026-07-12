# Инструкция по деплою на Vercel

## Шаг 1: Подготовка репозитория на GitHub

1. Открой терминал в папке проекта
2. Инициализируй git (если еще не сделано):
```bash
git init
```

3. Добавь все файлы:
```bash
git add .
```

4. Сделай первый коммит:
```bash
git commit -m "Initial commit"
```

5. Создай репозиторий на GitHub:
   - Зайди на https://github.com/new
   - Назови репозиторий (например, `excel-dino`)
   - НЕ добавляй README, .gitignore или лицензию (они уже есть)
   - Нажми "Create repository"

6. Подключи локальный репозиторий к GitHub:
```bash
git remote add origin https://github.com/ТВОЙ_USERNAME/excel-dino.git
git branch -M main
git push -u origin main
```

## Шаг 2: Деплой на Vercel

### Вариант 1: Через веб-интерфейс Vercel

1. Зайди на https://vercel.com и войди в аккаунт
2. Нажми "Add New..." → "Project"
3. Импортируй репозиторий из GitHub:
   - Нажми "Import" рядом с твоим репозиторием `excel-dino`
   - Или подключи GitHub аккаунт, если еще не подключен

4. Настройки проекта:
   - **Framework Preset**: Other (или оставь пустым)
   - **Root Directory**: `./` (по умолчанию)
   - **Build Command**: оставь пустым
   - **Output Directory**: `./` (по умолчанию)
   - **Install Command**: оставь пустым

5. Нажми "Deploy"

### Вариант 2: Через Vercel CLI

1. Установи Vercel CLI:
```bash
npm i -g vercel
```

2. В папке проекта выполни:
```bash
vercel
```

3. Следуй инструкциям:
   - Войди в аккаунт Vercel
   - Подтверди настройки проекта
   - Дождись деплоя

## Шаг 3: Настройка переменных окружения (если нужно)

Если в будущем понадобятся переменные окружения:

1. В Vercel Dashboard → твой проект → Settings → Environment Variables
2. Добавь переменные:
   - `SUPABASE_URL` (если будешь использовать из переменных)
   - `SUPABASE_ANON_KEY` (если будешь использовать из переменных)

**Примечание**: В текущей версии ключи Supabase уже встроены в `logic.js`, поэтому переменные окружения не обязательны.

## Шаг 4: Проверка деплоя

После деплоя:
1. Vercel автоматически даст тебе URL (например, `excel-dino.vercel.app`)
2. Открой этот URL в браузере
3. Проверь, что приложение работает

## Обновление проекта

После изменений в коде:

```bash
git add .
git commit -m "Описание изменений"
git push
```

Vercel автоматически задеплоит новую версию!

## Полезные ссылки

- Vercel Dashboard: https://vercel.com/dashboard
- Документация Vercel: https://vercel.com/docs
- GitHub репозиторий: https://github.com/ТВОЙ_USERNAME/excel-dino

