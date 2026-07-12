// levels/level11.js - Уровень 10: ЕСЛИОШИБКА
class Level11 {
  constructor() {
    this.id = 11;
    this.title = {
      ru: "Уровень 11: ЕСЛИОШИБКА",
      en: "Level 11: IFERROR"
    };
    this.description = {
      ru: "Освой обработку ошибок в формулах Excel",
      en: "Master error handling in Excel formulas"
    };
    this.difficulty = "advanced";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level11.json');
      const data = await response.json();
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      console.log('Уровень 11 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 11:', error);
      this.exercises = [
        {
          id: "iferror-basic-division",
          task: {
            ru: "Добавь обработку деления на ноль: =ЕСЛИОШИБКА(A2/B2;\"Ошибка\").",
            en: "Wrap the division with =IFERROR(A2/B2,\"Error\")."
          },
          data: [
            ["Числитель", "Знаменатель", "Результат", "Итого"],
            [10, 2, "", ""],
            [5, 0, "", ""],
            [8, 4, "", ""]
          ],
          expectedFormula: "=IFERROR(A2/B2;\"Ошибка\")",
          hint: {
            ru: "IFERROR принимает исходную формулу и значение, которое вернётся при ошибке.",
            en: "IFERROR takes the calculation first and the fallback value second."
          },
          resultCell: "D2",
          points: 160,
          explanation: {
            ru: "Функция перехватывает #DIV/0! и возвращает понятное сообщение.",
            en: "It catches #DIV/0! and returns a friendly message."
          }
        },
        {
          id: "iferror-vlookup",
          task: {
            ru: "Соедини ВПР с ЕСЛИОШИБКА, чтобы вывести «Не найден», если кода нет в таблице.",
            en: "Combine VLOOKUP with IFERROR to return \"Not found\" when the code is missing."
          },
          data: [
            ["Код", "Товар", "Цена", "Итого"],
            ["PR-01", "Ноутбук", 1200, ""],
            ["PR-02", "Планшет", 850, ""],
            ["PR-03", "Монитор", 540, ""],
            ["PR-99", "", "", ""]
          ],
          expectedFormula: "=IFERROR(VLOOKUP(A5;A2:C4;3;0);\"Не найден\")",
          hint: {
            ru: "Сначала выполните ВПР, затем окружите формулу ЕСЛИОШИБКА, передав текст ошибки.",
            en: "Build the VLOOKUP, then wrap it with IFERROR providing fallback text."
          },
          resultCell: "D2",
          points: 180,
          explanation: {
            ru: "Такой шаблон позволяет избежать #N/A и показать понятный статус.",
            en: "This prevents #N/A and shows a clear status instead."
          }
        },
        {
          id: "iferror-index-match",
          task: {
            ru: "Используй ЕСЛИОШИБКА вместе с ИНДЕКС+ПОИСКПОЗ, чтобы при отсутствии клиента вернуть \"Клиент не найден\".",
            en: "Use IFERROR with INDEX+MATCH to show \"Client not found\" when no match exists."
          },
          data: [
            ["Клиент", "Менеджер", "Регион", "Итого"],
            ["Alpha", "Иванова", "North", ""],
            ["Beta", "Петров", "West", ""],
            ["Gamma", "Сидоров", "South", ""],
            ["Zeta", "", "", ""]
          ],
          expectedFormula: "=IFERROR(INDEX(B2:B4;MATCH(A5;A2:A4;0));\"Клиент не найден\")",
          hint: {
            ru: "Построй формулу ИНДЕКС+ПОИСКПОЗ и оберни её ЕСЛИОШИБКА с текстом по умолчанию.",
            en: "Compose INDEX+MATCH first, then wrap with IFERROR and the default text."
          },
          resultCell: "D2",
          points: 200,
          explanation: {
            ru: "Такой приём предотвращает ошибки поиска и делает отчёт понятнее пользователю.",
            en: "It prevents lookup errors and keeps the report user-friendly."
          }
        }
      ];
    }
  }

  getCurrentExercise(exerciseIndex = 0) {
    return this.exercises[exerciseIndex];
  }

  getExerciseCount() {
    return this.exercises.length;
  }
}

if (typeof window !== 'undefined') {
  window.Level11 = Level11;
}

