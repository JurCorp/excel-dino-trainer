// levels/level8.js - Уровень 7: СРЗНАЧЕСЛИМН
class Level8 {
  constructor() {
    this.id = 8;
    this.title = {
      ru: "Уровень 7: СРЗНАЧЕСЛИМН",
      en: "Level 7: AVERAGEIFS"
    };
    this.description = {
      ru: "Вычисляй средние значения по нескольким условиям с помощью СРЗНАЧЕСЛИ и СРЗНАЧЕСЛИМН",
      en: "Calculate averages with one or many criteria via AVERAGEIF and AVERAGEIFS"
    };
    this.difficulty = "intermediate";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level8.json');
      const data = await response.json();
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      console.log('Уровень 8 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 8:', error);
      this.exercises = [
        {
          id: "averageif-department",
          task: {
            ru: "Вычисли средний рейтинг сотрудников отдела «Продажи» со статусом «Активен». Используй =СРЗНАЧЕСЛИМН(D2:D6;B2:B6;\"Продажи\";C2:C6;\"Активен\") или =AVERAGEIFS(D2:D6,B2:B6,\"Продажи\",C2:C6,\"Активен\").",
            en: "Calculate the average score for active Sales employees using =AVERAGEIFS(D2:D6,B2:B6,\"Продажи\",C2:C6,\"Активен\") (or the Russian variant)."
          },
          data: [
            ["Сотрудник", "Отдел", "Статус", "Рейтинг", "Итого"],
            ["Иванов", "Продажи", "Активен", 88, ""],
            ["Петров", "Маркетинг", "Активен", 74, ""],
            ["Сидоров", "Продажи", "Активен", 91, ""],
            ["Николаева", "Поддержка", "Активен", 79, ""],
            ["Попов", "Продажи", "Стажировка", 85, ""]
          ],
          expectedFormula: "=AVERAGEIFS(D2:D6;B2:B6;\"Продажи\";C2:C6;\"Активен\")",
          alternateFormulas: [
            "=AVERAGEIFS(D2:D6;B2:B6;\"Продажи\";C2:C6;\"Активен\")",
            "=AVERAGEIFS(D2:D6,B2:B6,\"Продажи\",C2:C6,\"Активен\")",
            "=СРЗНАЧЕСЛИМН(D2:D6;B2:B6;\"Продажи\";C2:C6;\"Активен\")"
          ],
          resultCell: "E2",
          hint: {
            ru: "СРЗНАЧЕСЛИМН принимает диапазон средних и пары диапазон/критерий.",
            en: "AVERAGEIFS expects the average range followed by range/criterion pairs."
          },
          points: 170,
          explanation: {
            ru: "Формула усредняет рейтинг только для сотрудников отдела «Продажи» со статусом «Активен».",
            en: "The formula averages the score only for Sales employees whose status is Active."
          }
        },
        {
          id: "averageif-threshold",
          task: {
            ru: "Определи среднюю выручку заказов выше 50 000 и со статусом «Оплачен»: используй =СРЗНАЧЕСЛИМН(C2:C8;C2:C8;\">50000\";D2:D8;\"Оплачен\") или =AVERAGEIFS(C2:C8,C2:C8,\">50000\",D2:D8,\"Оплачен\").",
            en: "Determine the average revenue for orders above 50 000 whose status is \"Paid\" using =AVERAGEIFS(C2:C8,C2:C8,\">50000\",D2:D8,\"Paid\")."
          },
          data: [
            ["Заказ", "Клиент", "Выручка", "Статус", "Итого"],
            ["SO-101", "Alpha", 42000, "Оплачен", ""],
            ["SO-102", "Beta", 68000, "Оплачен", ""],
            ["SO-103", "Gamma", 75500, "В ожидании", ""],
            ["SO-104", "Omega", 31000, "Оплачен", ""],
            ["SO-105", "Sigma", 84500, "Оплачен", ""],
            ["SO-106", "Delta", 52000, "Отменён", ""],
            ["SO-107", "Eta", 47000, "Оплачен", ""]
          ],
          expectedFormula: "=AVERAGEIFS(C2:C8;C2:C8;\">50000\";D2:D8;\"Оплачен\")",
          alternateFormulas: [
            "=AVERAGEIFS(C2:C8;C2:C8;\">50000\";D2:D8;\"Оплачен\")",
            "=AVERAGEIFS(C2:C8,C2:C8,\">50000\",D2:D8,\"Оплачен\")",
            "=СРЗНАЧЕСЛИМН(C2:C8;C2:C8;\">50000\";D2:D8;\"Оплачен\")"
          ],
          resultCell: "E2",
          hint: {
            ru: "СРЗНАЧЕСЛИМН принимает диапазон средних и пары диапазон/критерий.",
            en: "AVERAGEIFS expects the average range followed by range/criterion pairs."
          },
          points: 180,
          explanation: {
            ru: "Формула усредняет выручку только для оплаченных заказов выше 50 000.",
            en: "The formula averages revenue only for paid orders greater than 50 000."
          }
        },
        {
          id: "averageifs-multi",
          task: {
            ru: "Найди средний срок поставки для региона North со статусом «Готово»: =СРЗНАЧЕСЛИМН(D2:D7;B2:B7;\"North\";C2:C7;\"Готово\").",
            en: "Find the average delivery time for region North and status \"Completed\" using =AVERAGEIFS(D2:D7,B2:B7,\"North\",C2:C7,\"Готово\")."
          },
          data: [
            ["Заказ", "Регион", "Статус", "Срок, дней", "Итого"],
            ["PO-201", "North", "Готово", 5, ""],
            ["PO-202", "West", "В работе", 7, ""],
            ["PO-203", "North", "Готово", 6, ""],
            ["PO-204", "South", "Готово", 4, ""],
            ["PO-205", "North", "В работе", 8, ""],
            ["PO-206", "North", "Готово", 5, ""]
          ],
          expectedFormula: "=AVERAGEIFS(D2:D7;B2:B7;\"North\";C2:C7;\"Готово\")",
          hint: {
            ru: "СРЗНАЧЕСЛИМН принимает диапазон средних и пары «диапазон-условие».",
            en: "AVERAGEIFS uses an average range followed by criteria range/criteria pairs."
          },
          resultCell: "E2",
          points: 200,
          explanation: {
            ru: "Функция накладывает несколько фильтров перед вычислением среднего значения.",
            en: "The function applies multiple filters before calculating the mean."
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

  checkAnswer(exerciseIndex, userFormula, expectedFormula) {
    const normalized = str => str.trim().toUpperCase().replace(/\s/g, '');
    return normalized(userFormula) === normalized(expectedFormula);
  }

  getDataForExercise(exerciseIndex = 0) {
    return this.exercises[exerciseIndex]?.data || [];
  }
}

if (typeof window !== 'undefined') {
  window.Level8 = Level8;
}

