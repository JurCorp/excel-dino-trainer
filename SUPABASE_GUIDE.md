# 🔐 Руководство по Supabase для Jurassic Excel

## 📊 Где хранятся данные

### 1. **Пароли и аутентификация**
- **Таблица:** `auth.users` (системная таблица Supabase)
- **Безопасность:** Пароли зашифрованы, никто их не видит
- **Управление:** Через Supabase Dashboard → Authentication

### 2. **Профили пользователей**
- **Таблица:** `user_profiles` (твоя таблица)
- **Данные:** email, язык, дата создания
- **Связь:** `user_id` → `auth.users.id`

### 3. **Прогресс пользователей**
- **Таблица:** `user_progress` (твоя таблица)
- **Данные:** уровень, завершенность, очки
- **Связь:** `user_id` → `auth.users.id`

## 🔑 Управление паролями

### Сброс пароля пользователем:
```javascript
// В твоем коде добавь кнопку "Забыл пароль"
async function resetPassword() {
  const email = document.getElementById('email').value;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  
  if (error) {
    alert('Ошибка: ' + error.message);
  } else {
    alert('Письмо для сброса пароля отправлено!');
  }
}
```

### Сброс пароля администратором:
1. **Зайди в Supabase Dashboard**
2. **Authentication → Users**
3. **Найди пользователя**
4. **Нажми "..." → Reset Password**

## 🛡️ Безопасность

### Row Level Security (RLS):
```sql
-- Пользователи видят только свои данные
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
```

### Что это означает:
- ✅ Пользователь видит только свой профиль
- ✅ Пользователь видит только свой прогресс
- ❌ Пользователь НЕ видит данные других

## 📈 Мониторинг

### В Supabase Dashboard можешь видеть:
- **Количество пользователей**
- **Активность** (кто когда заходил)
- **Ошибки** в логах
- **Использование** (сколько запросов)

### Полезные запросы:
```sql
-- Количество пользователей
SELECT COUNT(*) FROM auth.users;

-- Самые активные пользователи
SELECT user_id, COUNT(*) as sessions 
FROM auth.sessions 
GROUP BY user_id 
ORDER BY sessions DESC;

-- Прогресс пользователей
SELECT 
  up.user_id,
  up.email,
  COUNT(pr.level) as completed_levels
FROM user_profiles up
LEFT JOIN user_progress pr ON up.user_id = pr.user_id
WHERE pr.completed = true
GROUP BY up.user_id, up.email;
```

## 🔧 Управление пользователями

### Блокировка пользователя:
```sql
-- В Supabase Dashboard → SQL Editor
UPDATE auth.users 
SET banned_until = '2025-12-31'::timestamp 
WHERE email = 'problematic@user.com';
```

### Удаление пользователя:
```sql
-- Удаляет пользователя и все его данные
DELETE FROM auth.users WHERE email = 'user@example.com';
```

## 📧 Email функции

### Настройка email в Supabase:
1. **Dashboard → Authentication → Settings**
2. **Site URL:** `https://your-domain.com`
3. **Redirect URLs:** `https://your-domain.com/auth/callback`

### Кастомизация email:
1. **Authentication → Email Templates**
2. **Выбери шаблон** (Confirm signup, Reset password)
3. **Настрой текст** и дизайн

## 🚨 Что делать при проблемах

### Пользователь не может войти:
1. **Проверь email** в Supabase Dashboard
2. **Посмотри логи** в Authentication → Logs
3. **Проверь настройки** RLS политик

### Пароль не сбрасывается:
1. **Проверь настройки email**
2. **Посмотри логи** отправки писем
3. **Проверь спам** у пользователя

### Данные не сохраняются:
1. **Проверь RLS политики**
2. **Проверь права доступа**
3. **Посмотри ошибки** в консоли

## 💡 Полезные советы

### 1. **Регулярные бэкапы:**
- Supabase делает автоматические бэкапы
- Можешь создать свой через Dashboard → Backups

### 2. **Мониторинг производительности:**
- Следи за количеством запросов
- Оптимизируй запросы к базе

### 3. **Тестирование:**
- Используй тестовые email адреса
- Проверяй все сценарии входа/выхода

## 🆘 Поддержка

### Если что-то не работает:
1. **Проверь логи** в Supabase Dashboard
2. **Обратись в поддержку** Supabase
3. **Посмотри документацию** Supabase

### Полезные ссылки:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Community Forum](https://github.com/supabase/supabase/discussions)
