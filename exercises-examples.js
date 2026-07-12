// Примеры упражнений для Jurassic Excel
// Этот файл содержит шаблоны для создания новых уровней

export const exerciseTemplates = {
  // Уровень 1: Базовые функции
  level1: {
    ru: {
      title: 'Уровень 1: Сумма',
      task: 'Посчитай сумму продаж столбца B (ячейки B2..B4).',
      data: [
        ['Товар', 'Стоимость', '', 'ОжидаемаяФормула'],
        ['A', 10, '', '=SUM(B2:B4)'],
        ['B', 20, '', ''],
        ['C', 30, '', '']
      ],
      expectedFormula: '=SUM(B2:B4)',
      hint: 'Используй функцию СУММ для подсчета суммы'
    },
    en: {
      title: 'Level 1: Sum',
      task: 'Calculate the sum of sales in column B (cells B2..B4).',
      data: [
        ['Item', 'Value', '', 'ExpectedFormula'],
        ['A', 10, '', '=SUM(B2:B4)'],
        ['B', 20, '', ''],
        ['C', 30, '', '']
      ],
      expectedFormula: '=SUM(B2:B4)',
      hint: 'Use the SUM function to calculate the total'
    }
  },

  // Уровень 2: Среднее значение
  level2: {
    ru: {
      title: 'Уровень 2: Среднее значение',
      task: 'Найди среднее значение оценок в столбце B (ячейки B2..B5).',
      data: [
        ['Студент', 'Оценка', '', 'ОжидаемаяФормула'],
        ['Иван', 85, '', '=AVERAGE(B2:B5)'],
        ['Мария', 92, '', ''],
        ['Петр', 78, '', ''],
        ['Анна', 88, '', '']
      ],
      expectedFormula: '=AVERAGE(B2:B5)',
      hint: 'Используй функцию СРЗНАЧ для подсчета среднего'
    },
    en: {
      title: 'Level 2: Average',
      task: 'Find the average of grades in column B (cells B2..B5).',
      data: [
        ['Student', 'Grade', '', 'ExpectedFormula'],
        ['John', 85, '', '=AVERAGE(B2:B5)'],
        ['Mary', 92, '', ''],
        ['Peter', 78, '', ''],
        ['Anna', 88, '', '']
      ],
      expectedFormula: '=AVERAGE(B2:B5)',
      hint: 'Use the AVERAGE function to calculate the mean'
    }
  },

  // Уровень 3: Максимальное значение
  level3: {
    ru: {
      title: 'Уровень 3: Максимум',
      task: 'Найди максимальную цену в столбце B (ячейки B2..B6).',
      data: [
        ['Товар', 'Цена', '', 'ОжидаемаяФормула'],
        ['Яблоки', 50, '', '=MAX(B2:B6)'],
        ['Бананы', 45, '', ''],
        ['Апельсины', 60, '', ''],
        ['Груши', 55, '', ''],
        ['Виноград', 70, '', '']
      ],
      expectedFormula: '=MAX(B2:B6)',
      hint: 'Используй функцию МАКС для поиска максимального значения'
    },
    en: {
      title: 'Level 3: Maximum',
      task: 'Find the maximum price in column B (cells B2..B6).',
      data: [
        ['Product', 'Price', '', 'ExpectedFormula'],
        ['Apples', 50, '', '=MAX(B2:B6)'],
        ['Bananas', 45, '', ''],
        ['Oranges', 60, '', ''],
        ['Pears', 55, '', ''],
        ['Grapes', 70, '', '']
      ],
      expectedFormula: '=MAX(B2:B6)',
      hint: 'Use the MAX function to find the highest value'
    }
  },

  // Уровень 4: Условная функция
  level4: {
    ru: {
      title: 'Уровень 4: Условие',
      task: 'Проверь, больше ли сумма B2+B3+B4, чем 100. Если да, верни "Да", иначе "Нет".',
      data: [
        ['Показатель', 'Значение', '', 'ОжидаемаяФормула'],
        ['Продажи 1', 40, '', '=IF(SUM(B2:B4)>100,"Да","Нет")'],
        ['Продажи 2', 35, '', ''],
        ['Продажи 3', 30, '', '']
      ],
      expectedFormula: '=IF(SUM(B2:B4)>100,"Да","Нет")',
      hint: 'Используй функцию ЕСЛИ с условием и функцией СУММ'
    },
    en: {
      title: 'Level 4: Condition',
      task: 'Check if the sum of B2+B3+B4 is greater than 100. Return "Yes" if true, "No" if false.',
      data: [
        ['Metric', 'Value', '', 'ExpectedFormula'],
        ['Sales 1', 40, '', '=IF(SUM(B2:B4)>100,"Yes","No")'],
        ['Sales 2', 35, '', ''],
        ['Sales 3', 30, '', '']
      ],
      expectedFormula: '=IF(SUM(B2:B4)>100,"Yes","No")',
      hint: 'Use the IF function with a condition and SUM function'
    }
  }
};

// Функция для получения упражнения по уровню и языку
export function getExercise(level, language) {
  const levelKey = `level${level}`;
  const exercise = exerciseTemplates[levelKey];
  
  if (!exercise) {
    throw new Error(`Exercise for level ${level} not found`);
  }
  
  if (!exercise[language]) {
    throw new Error(`Exercise for level ${level} in language ${language} not found`);
  }
  
  return exercise[language];
}

// Функция для получения всех доступных уровней
export function getAvailableLevels() {
  return Object.keys(exerciseTemplates).map(key => 
    parseInt(key.replace('level', ''))
  ).sort((a, b) => a - b);
}

// Функция для проверки правильности формулы
export function validateFormula(userFormula, expectedFormula, language) {
  // Нормализуем формулы (убираем пробелы, приводим к верхнему регистру)
  const normalize = (formula) => formula.replace(/\s/g, '').toUpperCase();
  
  const normalizedUser = normalize(userFormula);
  const normalizedExpected = normalize(expectedFormula);
  
  return normalizedUser === normalizedExpected;
}