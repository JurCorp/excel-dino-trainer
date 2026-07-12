// Конфигурация приложения Jurassic Excel

export const config = {
  // Настройки Supabase
  supabase: {
    url: process.env.SUPABASE_URL || 'your-supabase-url',
    anonKey: process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key'
  },

  // Настройки приложения
  app: {
    name: 'Jurassic Excel',
    version: '1.0.0',
    defaultLanguage: 'ru',
    supportedLanguages: ['ru', 'en']
  },

  // Настройки упражнений
  exercises: {
    maxLevel: 10,
    defaultScore: 100,
    timeLimit: 300000 // 5 минут в миллисекундах
  },

  // Настройки UI
  ui: {
    theme: {
      primary: '#2c3e50',
      secondary: '#f5c82a',
      background: '#f6f2e4',
      card: '#fff7d9',
      text: '#333333',
      muted: '#666666'
    },
    animations: {
      duration: 300,
      easing: 'ease-in-out'
    }
  },

  // Настройки формул
  formulas: {
    // Поддерживаемые русские функции
    russianFunctions: {
      'СУММ': 'SUM',
      'СРЗНАЧ': 'AVERAGE',
      'МАКС': 'MAX',
      'МИН': 'MIN',
      'СЧЁТ': 'COUNT',
      'СЧЁТЗ': 'COUNTA',
      'ЕСЛИ': 'IF',
      'И': 'AND',
      'ИЛИ': 'OR',
      'НЕ': 'NOT',
      'ПОИСК': 'SEARCH',
      'ЛЕВСИМВ': 'LEFT',
      'ПРАВСИМВ': 'RIGHT',
      'ДЛСТР': 'LEN',
      'СЦЕПИТЬ': 'CONCATENATE'
    },

    // Поддерживаемые английские функции
    englishFunctions: {
      'SUM': 'SUM',
      'AVERAGE': 'AVERAGE',
      'MAX': 'MAX',
      'MIN': 'MIN',
      'COUNT': 'COUNT',
      'COUNTA': 'COUNTA',
      'IF': 'IF',
      'AND': 'AND',
      'OR': 'OR',
      'NOT': 'NOT',
      'SEARCH': 'SEARCH',
      'LEFT': 'LEFT',
      'RIGHT': 'RIGHT',
      'LEN': 'LEN',
      'CONCATENATE': 'CONCATENATE'
    }
  },

  // Настройки базы данных
  database: {
    tables: {
      userProfiles: 'user_profiles',
      userProgress: 'user_progress',
      exercises: 'exercises',
      achievements: 'achievements'
    }
  }
};

// Функция для получения конфигурации
export function getConfig() {
  return config;
}

// Функция для обновления конфигурации
export function updateConfig(newConfig) {
  Object.assign(config, newConfig);
}

// Функция для проверки поддержки языка
export function isLanguageSupported(language) {
  return config.app.supportedLanguages.includes(language);
}

// Функция для получения перевода функции
export function translateFunction(functionName, fromLanguage, toLanguage) {
  if (fromLanguage === toLanguage) {
    return functionName;
  }

  const functionMap = fromLanguage === 'ru' 
    ? config.formulas.russianFunctions 
    : config.formulas.englishFunctions;

  const targetMap = toLanguage === 'ru' 
    ? config.formulas.russianFunctions 
    : config.formulas.englishFunctions;

  const englishFunction = functionMap[functionName.toUpperCase()];
  if (!englishFunction) {
    return functionName;
  }

  // Находим русскую функцию по английской
  const translatedFunction = Object.keys(targetMap).find(
    key => targetMap[key] === englishFunction
  );

  return translatedFunction || functionName;
}