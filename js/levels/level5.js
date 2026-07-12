// levels/level5.js - Уровень 8: ВПР
class Level5 {
  constructor() {
    this.id = 5;
    this.title = {
      ru: "Уровень 8: ВПР",
      en: "Level 8: VLOOKUP"
    };
    this.description = {
      ru: "Научись извлекать данные по ключу с помощью функции ВПР",
      en: "Learn how to retrieve data by key using VLOOKUP"
    };
    this.difficulty = "intermediate";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level5.json');
      const data = await response.json();
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      console.log('Уровень 5 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 5:', error);
      this.exercises = this.getFallbackExercises();
    }
  }

  getFallbackExercises() {
    return [
      {
        id: "vlookup-price",
        task: {
          ru: "Найди цену товара по коду с помощью =ВПР(A6;A2:C4;3;0).",
          en: "Find the product price by code using =VLOOKUP(A6,A2:C4,3,0)."
        },
        data: [
          ["Код", "Товар", "Цена", "Итого"],
          ["PR-01", "Ноутбук", 1200, ""],
          ["PR-02", "Планшет", 850, ""],
          ["PR-03", "Монитор", 540, ""],
          ["PR-02", "", "", ""]
        ],
        expectedFormula: "=VLOOKUP(A5;A2:C4;3;0)",
        alternateFormulas: [
          "=VLOOKUP(A5;A2:C4;3;0)",
          "=VLOOKUP(A5,A2:C4,3,0)",
          "=ВПР(A5;A2:C4;3;0)"
        ],
        resultCell: "D2",
        hint: {
          ru: "Последовательность: что ищем, где ищем, номер столбца, точное совпадение.",
          en: "Order: lookup value, table array, column index, exact match."
        },
        points: 150,
        explanation: {
          ru: "ВПР ищет код в первом столбце и возвращает цену из третьего столбца.",
          en: "VLOOKUP searches the first column and returns the price from column three."
        }
      },
      {
        id: "vlookup-manager",
        task: {
          ru: "Определи менеджера по коду клиента с помощью ВПР.",
          en: "Find the account manager by customer code using VLOOKUP."
        },
        data: [
          ["Код", "Клиент", "Менеджер", "Регион", "Итого"],
          ["CL-100", "Alpha", "Иванова", "North", ""],
          ["CL-101", "Beta", "Петров", "West", ""],
          ["CL-102", "Gamma", "Сидоров", "South", ""],
          ["CL-101", "", "", "", ""]
        ],
        expectedFormula: "=VLOOKUP(A5;A2:D4;3;0)",
        alternateFormulas: [
          "=VLOOKUP(A5;A2:D4;3;0)",
          "=VLOOKUP(A5,A2:D4,3,0)",
          "=ВПР(A5;A2:D4;3;0)"
        ],
        resultCell: "E2",
        hint: {
          ru: "Столбец с кодами должен быть первым в диапазоне поиска.",
          en: "The lookup column must be the first column of the range."
        },
        points: 170,
        explanation: {
          ru: "Третий аргумент возвращает имя менеджера из третьего столбца.",
          en: "The third argument returns the manager name from column three."
        }
      },
      {
        id: "vlookup-approximate",
        task: {
          ru: "Определи бонус по выручке с помощью приблизительного ВПР.",
          en: "Determine the bonus from revenue using approximate VLOOKUP."
        },
        data: [
          ["Выручка", "Бонус", "", "Клиент", "Факт", "Итого"],
          [0, "5%", "", "Компания A", 480000, ""],
          [500000, "7%", "", "Компания B", 720000, ""],
          [800000, "10%", "", "Компания C", 960000, ""],
          ["", "", "", "Компания B", 720000, ""]
        ],
        expectedFormula: "=VLOOKUP(E5;A2:B4;2;1)",
        alternateFormulas: [
          "=VLOOKUP(E5;A2:B4;2;1)",
          "=VLOOKUP(E5,A2:B4,2,1)",
          "=ВПР(E5;A2:B4;2;1)"
        ],
        resultCell: "F5",
        hint: {
          ru: "При аргументе 1 столбец с выручкой должен быть отсортирован по возрастанию.",
          en: "With argument 1 the revenue column must be sorted ascending."
        },
        points: 190,
        explanation: {
          ru: "Функция возвращает бонус для ближайшего меньшего или равного порога.",
          en: "The function returns the bonus for the closest lower or equal threshold."
        }
      }
    ];
  }

  getCurrentExercise(exerciseIndex = 0) {
    return this.exercises[exerciseIndex];
  }

  getExerciseCount() {
    return this.exercises.length;
  }
}

if (typeof window !== 'undefined') {
  window.Level5 = Level5;
}

