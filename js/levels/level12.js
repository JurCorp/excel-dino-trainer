// levels/level12.js - Уровень 12: Сводные таблицы
class Level12 {
  constructor() {
    this.id = 12;
    this.title = {
      ru: "Уровень 12: Сводные таблицы",
      en: "Level 12: Pivot Tables"
    };
    this.description = {
      ru: "Интерактивная работа со сводными таблицами",
      en: "Interactive work with pivot tables"
    };
    this.difficulty = "advanced";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level12.json');
      const data = await response.json();
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      this.unlockCondition = data.unlockCondition;
      console.log('Уровень 12 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 12:', error);
      this.exercises = this.getFallbackExercises();
    }
  }

  getFallbackExercises() {
    return [
      {
        id: "pivot-interactive-1",
        task: {
          ru: "Создай сводную таблицу: перетащи поле \"Отдел\" в область строк, поле \"Продажи препаратов\" в область значений. Используй интерфейс ниже для перетаскивания полей.",
          en: "Create a pivot table: drag \"Department\" to rows area, \"Drug sales\" to values area. Use the interface below to drag fields."
        },
        data: [
          ["Отдел", "Менеджер", "Продажи препаратов", "Месяц"],
          ["Продажи", "Иванов", 24000, "Январь"],
          ["Маркетинг", "Петров", 18500, "Январь"],
          ["Продажи", "Сидоров", 28000, "Февраль"],
          ["Маркетинг", "Козлова", 19500, "Февраль"],
          ["Сервис", "Федоров", 9200, "Январь"]
        ],
        expectedFormula: "=SUM(B2:B6)",
        alternateFormulas: [
          "=SUM(B2:B6)"
        ],
        resultCell: "E2",
        hint: {
          ru: "Перетащи поля мышью в соответствующие области сводной таблицы.",
          en: "Drag fields with your mouse to the corresponding pivot table areas."
        },
        points: 200,
        explanation: {
          ru: "Сводные таблицы позволяют быстро группировать и суммировать данные.",
          en: "Pivot tables let you quickly group and sum data."
        },
        interactive: true,
        interactiveType: "pivot"
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
  window.Level12 = Level12;
}
