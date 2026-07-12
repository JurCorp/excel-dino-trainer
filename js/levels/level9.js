// levels/level9.js - Уровень 10: ИНДЕКС + ПОИСКПОЗ
class Level9 {
  constructor() {
    this.id = 9;
    this.title = {
      ru: "Уровень 10: ИНДЕКС + ПОИСКПОЗ",
      en: "Level 10: INDEX + MATCH"
    };
    this.description = {
      ru: "Освой функции ИНДЕКС, ПОИСКПОЗ и их комбинацию для гибкого поиска",
      en: "Learn INDEX, MATCH, and how to combine them for flexible lookups"
    };
    this.difficulty = "advanced";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level9.json');
      const data = await response.json();
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      console.log('Уровень 9 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 9:', error);
      this.exercises = this.getFallbackExercises();
    }
  }

  getFallbackExercises() {
    return [
      {
        id: "index-basic",
        task: {
          ru: "Используй ИНДЕКС, чтобы вернуть имя сотрудника по номеру строки: =ИНДЕКС(A2:A6;C2).",
          en: "Use INDEX to return an employee name by row number: =INDEX(A2:A6,C2)."
        },
        data: [
          ["Сотрудник", "Отдел", "Номер", "Итого"],
          ["Иванов", "Продажи", 2, ""],
          ["Петров", "Маркетинг", "", ""],
          ["Толстова", "Finance", "", ""],
          ["Осипова", "HR", "", ""],
          ["Федоров", "IT", "", ""],
          ["", "", 4, ""]
        ],
        expectedFormula: "=INDEX(A2:A6;C6)",
        alternateFormulas: [
          "=INDEX(A2:A6;C6)",
          "=INDEX(A2:A6,C6)",
          "=ИНДЕКС(A2:A6;C6)"
        ],
        resultCell: "D6",
        hint: {
          ru: "Первый аргумент — массив, второй — номер строки.",
          en: "First argument is the array, second the row number."
        },
        points: 180,
        explanation: {
          ru: "ИНДЕКС возвращает значение из массива по координатам и не зависит от расположения столбцов.",
          en: "INDEX returns a value by coordinates and doesn’t care about column order."
        }
      },
      {
        id: "match-basic",
        task: {
          ru: "Найди позицию клиента с помощью ПОИСКПОЗ: =ПОИСКПОЗ(\"Gamma\";A2:A6;0).",
          en: "Find the client position using =MATCH(\"Gamma\",A2:A6,0)."
        },
        data: [
          ["Клиент", "Регион", "Позиция", "Итого"],
          ["Alpha", "North", "", ""],
          ["Beta", "West", "", ""],
          ["Gamma", "South", "", ""],
          ["Delta", "East", "", ""],
          ["Zeta", "Central", "", ""],
          ["", "", "Gamma", ""]
        ],
        expectedFormula: "=MATCH(C6;A2:A6;0)",
        alternateFormulas: [
          "=MATCH(C6;A2:A6;0)",
          "=MATCH(C6,A2:A6,0)",
          "=ПОИСКПОЗ(C6;A2:A6;0)"
        ],
        resultCell: "D6",
        hint: {
          ru: "ПОИСКПОЗ возвращает индекс элемента в диапазоне.",
          en: "MATCH returns the index of an item in the range."
        },
        points: 180,
        explanation: {
          ru: "Функция полезна для получения номера строки или столбца для последующего использования в ИНДЕКС.",
          en: "It’s useful for supplying the row or column index to INDEX later."
        }
      },
      {
        id: "index-match-combo",
        task: {
          ru: "Комбинируй ИНДЕКС и ПОИСКПОЗ, чтобы найти цену по артикулу: =ИНДЕКС(C2:C6;ПОИСКПОЗ(E2;A2:A6;0)).",
          en: "Combine INDEX and MATCH to find the price by SKU: =INDEX(C2:C6,MATCH(E2,A2:A6,0))."
        },
        data: [
          ["Артикул", "Товар", "Цена", "Примечание", "Запрос", "Итого"],
          ["SKU-01", "Ноутбук", 1200, "", "", ""],
          ["SKU-02", "Планшет", 850, "", "", ""],
          ["SKU-03", "Монитор", 540, "", "", ""],
          ["SKU-04", "Принтер", 460, "", "", ""],
          ["SKU-05", "Проектор", 1350, "", "", ""],
          ["", "", "", "", "SKU-03", ""]
        ],
        expectedFormula: "=INDEX(C2:C6;MATCH(E6;A2:A6;0))",
        alternateFormulas: [
          "=INDEX(C2:C6;MATCH(E6;A2:A6;0))",
          "=INDEX(C2:C6,MATCH(E6,A2:A6,0))",
          "=ИНДЕКС(C2:C6;ПОИСКПОЗ(E6;A2:A6;0))"
        ],
        resultCell: "F6",
        hint: {
          ru: "ПОИСКПОЗ возвращает позицию, ИНДЕКС — значение из нужного столбца.",
          en: "MATCH finds the position, INDEX returns the value from the target column."
        },
        points: 200,
        explanation: {
          ru: "ИНДЕКС+ПОИСКПОЗ используют, когда ВПР и ПРОСМОТРХ ограничены: нужно искать влево или динамически выбирать столбец.",
          en: "Use INDEX+MATCH when VLOOKUP or XLOOKUP fall short—like left-side lookups or dynamic column selection."
        }
      }
    ];
  }

  getCurrentExercise(exerciseIndex = 0) {
    if (exerciseIndex >= 0 && exerciseIndex < this.exercises.length) {
      return this.exercises[exerciseIndex];
    }
    return null;
  }

  getExerciseCount() {
    return this.exercises.length;
  }
}

if (typeof window !== 'undefined') {
  window.Level9 = Level9;
}

