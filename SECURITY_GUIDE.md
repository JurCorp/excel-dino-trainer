# 🛡️ Руководство по безопасности для Jurassic Excel

## ❌ НИКОГДА не делай так!

### Плохо - ключи в коде:
```javascript
// ПЛОХО! Не делай так!
const SUPABASE_URL = 'https://sgsphkkrpixfjgccczgc.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Плохо - ключи в HTML:
```html
<!-- ПЛОХО! Не делай так! -->
<script>
  const SUPABASE_URL = 'https://sgsphkkrpixfjgccczgc.supabase.co'
</script>
```

## ✅ Всегда делай так!

### Хорошо - переменные окружения:
```javascript
// ХОРОШО! Делай так!
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
```

## 🔐 Как правильно хранить ключи

### 1. Создай файл `.env` (НЕ загружай в GitHub!)
```env
# .env файл - только для тебя!
SUPABASE_URL=https://sgsphkkrpixfjgccczgc.supabase.co
SUPABASE_ANON_KEY=твой_реальный_ключ_здесь
STRIPE_SECRET_KEY=sk_test_твой_ключ_здесь
```

### 2. Добавь `.env` в `.gitignore`
```gitignore
# Секретные файлы
.env
.env.local
.env.production

# Ключи
*.key
secrets/
```

### 3. В Vercel добавь переменные окружения:
1. Зайди в настройки проекта
2. Выбери "Environment Variables"
3. Добавь все ключи через интерфейс

## 🚨 Что делать если ключи попали в код?

### Срочные действия:
1. **Смени ключи** в Supabase/Stripe
2. **Удали старые ключи** из кода
3. **Обнови переменные окружения**
4. **Перезапусти приложение**

### Как сменить ключи Supabase:
1. Зайди в Supabase Dashboard
2. Settings → API
3. Regenerate API keys
4. Обнови в Vercel

### Как сменить ключи Stripe:
1. Зайди в Stripe Dashboard
2. Developers → API keys
3. Regenerate keys
4. Обнови в Vercel

## 🔒 Дополнительные меры безопасности

### 1. Row Level Security (RLS) в Supabase
```sql
-- Включаем защиту данных
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Пользователи видят только свои данные
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
```

### 2. Валидация на сервере
```javascript
// Всегда проверяй данные на сервере
export async function saveUserProgress(userId, level, completed, score) {
  // Проверяем, что пользователь авторизован
  if (!userId) {
    throw new Error('User not authenticated')
  }
  
  // Проверяем права доступа
  const { data: user } = await supabase.auth.getUser()
  if (user.id !== userId) {
    throw new Error('Access denied')
  }
  
  // Сохраняем данные
  return await supabase.from('user_progress').insert({...})
}
```

### 3. Ограничения API
```javascript
// Ограничивай количество запросов
const RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000 // 15 минут
}
```

## 📋 Чек-лист безопасности

### Перед деплоем проверь:
- [ ] Ключи НЕ в коде
- [ ] `.env` в `.gitignore`
- [ ] RLS включен в Supabase
- [ ] Валидация на сервере
- [ ] HTTPS включен
- [ ] CORS настроен правильно

### Регулярно проверяй:
- [ ] Логи доступа
- [ ] Подозрительную активность
- [ ] Обновления зависимостей
- [ ] Резервные копии

## 🆘 Что делать при взломе?

### Немедленные действия:
1. **Смени ВСЕ ключи**
2. **Заблокируй подозрительные аккаунты**
3. **Проверь логи**
4. **Уведоми пользователей**

### Восстановление:
1. **Восстанови из резервной копии**
2. **Обнови все пароли**
3. **Проверь целостность данных**
4. **Усиль безопасность**

## 📚 Полезные ресурсы

- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe Security](https://stripe.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Checklist](https://github.com/FallibleInc/security-guide-for-developers)

## 🤝 Нужна помощь?

Если что-то непонятно или есть подозрения на взлом:
1. Создай Issue в GitHub
2. Обратись в поддержку Supabase/Stripe
3. Консультируйся с экспертами

**Помни: безопасность - это не разовая задача, а постоянный процесс!** 🛡️
