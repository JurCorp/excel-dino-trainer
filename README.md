# Jurassic Excel / Excel Dino

Статический тренажёр Excel-формул на русском языке.

## Что внутри

- 12 уровней с упражнениями по формулам Excel.
- Контент упражнений хранится в `data/level*.json`.
- Тонкие классы уровней в `js/levels/level*.js` только загружают JSON.
- Проверка формул работает на клиенте через JavaScript + HyperFormula CDN.
- Прогресс пользователя может сохраняться в Supabase.

## Запуск локально

```bash
python3 -m http.server 8123
```

Открыть:

```text
http://127.0.0.1:8123/
```

На Windows:

```powershell
python -m http.server 8123
```

## Деплой на Vercel

Проект статический. Для Vercel используется `vercel.json`:

- build command: none
- output directory: `.`
- framework: none

## Supabase

Файл `.env` не коммитится. Публичный anon key допустим для клиента, но service_role key нельзя хранить в репозитории.

См. `SUPABASE_SETUP.md`.

## Важно по структуре

Не добавлять в репозиторий:

- `node_modules/`
- `.env*`
- `.vercel/`
- `build/`, `dist/`
- локальные архивы и копии проекта
