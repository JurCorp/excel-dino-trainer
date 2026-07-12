# 💳 Интеграция Stripe - полное руководство

## Что такое Stripe? 🤔

**Stripe** - это сервис для приема платежей в интернете. Как касса в магазине, но для сайтов!

## Что тебе понадобится? 📋

1. ✅ **Аккаунт Stripe** (бесплатный)
2. ✅ **Твой код Jurassic Excel**
3. ✅ **Supabase** (уже есть)
4. ✅ **Vercel** (уже есть)
5. 🆕 **Новые навыки** (я научу!)

## Пошаговый план интеграции 🗺️

### Шаг 1: Создание аккаунта Stripe 🏦

1. **Зайди на [stripe.com](https://stripe.com)**
2. **Нажми "Start now"** (Начать)
3. **Заполни форму:**
   - Email: твой email
   - Пароль: придумай надежный
   - Страна: выбери свою страну
4. **Подтверди email** (проверь почту)
5. **Заполни информацию о бизнесе:**
   - Название: "Jurassic Excel"
   - Тип: "Individual" (частное лицо)
   - Описание: "Excel обучение онлайн"

### Шаг 2: Получение ключей Stripe 🔑

1. **Войди в Stripe Dashboard**
2. **Нажми на "Developers"** в левом меню
3. **Выбери "API keys"**
4. **Скопируй ключи:**
   - **Publishable key** (начинается с pk_test_)
   - **Secret key** (начинается с sk_test_)

⚠️ **ВАЖНО:** Никогда не показывай Secret key никому!

### Шаг 3: Создание продуктов в Stripe 🛍️

1. **В Stripe Dashboard нажми "Products"**
2. **Нажми "Add product"**
3. **Создай продукт "Premium доступ":**
   - Название: "Premium доступ к Jurassic Excel"
   - Описание: "Полный доступ ко всем уровням"
   - Цена: $9.99 (или любая другая)
   - Валюта: USD
4. **Сохрани Product ID** (начинается с prod_)

### Шаг 4: Обновление базы данных Supabase 🗄️

Добавь новые таблицы в Supabase:

```sql
-- Таблица подписок
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица платежей
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount INTEGER, -- в центах
  currency TEXT DEFAULT 'usd',
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем защиту данных
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Правила доступа
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);
```

### Шаг 5: Создание файлов для Stripe 📁

#### `js/stripe/stripe-config.js` - Конфигурация
```javascript
// НЕ ХРАНИМ КЛЮЧИ В КОДЕ!
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...'
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_...'

export const stripeConfig = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  secretKey: STRIPE_SECRET_KEY,
  productId: process.env.STRIPE_PRODUCT_ID || 'prod_...'
}
```

#### `js/stripe/payment-handler.js` - Обработка платежей
```javascript
import { stripeConfig } from './stripe-config.js'
import { createCustomer, createSubscription } from './stripe-api.js'

export class PaymentHandler {
  constructor() {
    this.stripe = Stripe(stripeConfig.publishableKey)
  }

  async createCheckoutSession(userId, productId) {
    try {
      // Создаем сессию оплаты
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: productId,
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cancel`,
        customer_email: userId, // или получи email из профиля
      })

      // Перенаправляем на страницу оплаты
      window.location.href = session.url
    } catch (error) {
      console.error('Payment error:', error)
      alert('Ошибка при создании платежа')
    }
  }

  async handleSuccessfulPayment(sessionId) {
    try {
      // Получаем информацию о сессии
      const session = await this.stripe.checkout.sessions.retrieve(sessionId)
      
      // Сохраняем в базу данных
      await this.savePaymentToDatabase(session)
      
      // Обновляем статус пользователя
      await this.updateUserSubscription(session.customer_email, 'premium')
      
      alert('Платеж успешно обработан!')
    } catch (error) {
      console.error('Payment processing error:', error)
    }
  }
}
```

#### `js/stripe/stripe-api.js` - API для работы со Stripe
```javascript
import { stripeConfig } from './stripe-config.js'

// Создание клиента Stripe
export async function createCustomer(email, name) {
  const response = await fetch('/api/create-customer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name })
  })
  
  return response.json()
}

// Создание подписки
export async function createSubscription(customerId, priceId) {
  const response = await fetch('/api/create-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId, priceId })
  })
  
  return response.json()
}
```

### Шаг 6: Обновление интерфейса 🎨

#### Добавь кнопку "Premium" в `index.html`:
```html
<div class="premium-section">
  <h3>🚀 Получи Premium доступ!</h3>
  <p>Разблокируй все уровни и получи эксклюзивные функции</p>
  <button id="upgrade-btn" class="premium-btn">
    💎 Upgrade to Premium - $9.99
  </button>
</div>
```

#### Добавь стили в `styles.css`:
```css
.premium-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  text-align: center;
}

.premium-btn {
  background: #ffd700;
  color: #333;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
```

### Шаг 7: Обновление переменных окружения 🔐

#### В Vercel добавь новые переменные:
1. **Зайди в настройки проекта** в Vercel
2. **Выбери "Environment Variables"**
3. **Добавь:**
   - `STRIPE_PUBLISHABLE_KEY` = твой публичный ключ
   - `STRIPE_SECRET_KEY` = твой секретный ключ
   - `STRIPE_PRODUCT_ID` = ID твоего продукта

#### Создай файл `.env` для локальной разработки:
```env
SUPABASE_URL=https://sgsphkkrpixfjgccczgc.supabase.co
SUPABASE_ANON_KEY=твой_ключ_supabase
STRIPE_PUBLISHABLE_KEY=pk_test_твой_ключ
STRIPE_SECRET_KEY=sk_test_твой_ключ
STRIPE_PRODUCT_ID=prod_твой_id
```

### Шаг 8: Тестирование 💳

1. **Используй тестовые карты Stripe:**
   - Успешная оплата: `4242 4242 4242 4242`
   - Отклоненная карта: `4000 0000 0000 0002`
   - Требует 3D Secure: `4000 0025 0000 3155`

2. **Проверь все сценарии:**
   - ✅ Успешная оплата
   - ❌ Отклоненная карта
   - 🔄 Отмена платежа
   - 📧 Уведомления

## Безопасность - ВАЖНО! 🛡️

### ❌ НИКОГДА не делай так:
```javascript
// ПЛОХО! Ключи в коде
const STRIPE_SECRET_KEY = 'sk_test_123456789'
```

### ✅ Всегда делай так:
```javascript
// ХОРОШО! Ключи в переменных окружения
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
```

## Готовые шаблоны кода 📝

Хочешь, чтобы я создал все эти файлы для тебя? Я могу:

1. **Создать полную структуру Stripe интеграции**
2. **Настроить безопасное хранение ключей**
3. **Добавить обработку платежей**
4. **Создать красивый интерфейс для оплаты**
5. **Настроить webhooks для автоматических обновлений**

## Следующие шаги после Stripe 🚀

1. **Аналитика платежей** - отслеживай доходы
2. **Промокоды** - скидки для пользователей
3. **Подписки** - ежемесячные платежи
4. **Реферальная программа** - бонусы за приглашения
5. **Мобильные платежи** - Apple Pay, Google Pay

Готов помочь с любым из этих шагов! 😊
