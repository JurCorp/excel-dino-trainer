// levels/level10.js - Уровень 6: СУММЕСЛИМН
class Level10 {
  constructor() {
    this.id = 10;
    this.title = {
      ru: "Уровень 6: СУММЕСЛИМН",
      en: "Level 6: SUMIFS"
    };
    this.description = {
      ru: "Суммируй данные по нескольким условиям и сравни подход с СУММЕСЛИ",
      en: "Sum data with multiple conditions and understand how SUMIFS differs from SUMIF"
    };
    this.difficulty = "advanced";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level10.json');
      const data = await response.json();
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      console.log('Уровень 10 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 10:', error);
      this.exercises = [
        {
          id: "sumifs-basic",
          task: {
            ru: "Посчитай продажи больше 1000 для региона \"North\". Используй =SUMIFS(C2:C5;A2:A5;\"North\";C2:C5;\">1000\") или =СУММЕСЛИМН(C2:C5;A2:A5;\"North\";C2:C5;\">1000\").\n\nПервый раз C2:C5 — диапазон, который суммируем.\nA2:A5 — диапазон, где проверяем условие 1.\n\"North\" — условие 1.\nВторой раз C2:C5 — диапазон, где проверяем условие 2.\n\">1000\" — условие 2.\n\n1) Все диапазоны должны совпадать по размеру.\n2) Условий может быть сколько угодно.\n\nСУММЕСЛИ (SUMIF) работает только с одним условием и в другом порядке аргументов, поэтому при появлении второго условия всё равно придётся перейти на СУММЕСЛИМН.",
            en: "Sum the sales above 1000 for region \"North\" with =SUMIFS(C2:C5,A2:A5,\"North\",C2:C5,\">1000\") (or the Russian variant).\n\nFirst C2:C5 is the range to sum.\nA2:A5 is the range checked for condition 1.\n\"North\" is condition 1.\nSecond C2:C5 is the range checked for condition 2.\n\">1000\" is condition 2.\n\n1) All ranges must be the same size.\n2) You can add as many conditions as needed.\n\nSUMIF exists, but it handles only one condition and uses a different argument order, so once a second criterion appears you must switch to SUMIFS anyway."
          },
          data: [
            ["Регион", "Менеджер", "Продажи"],
            ["North", "Anna", 1500],
            ["South", "Ben", 900],
            ["North", "Liam", 1300],
            ["East", "Emma", 700]
          ],
          expectedFormula: "=SUMIFS(C2:C5;A2:A5;\"North\";C2:C5;\">1000\")",
          alternateFormulas: [
            "=SUMIFS(C2:C5;A2:A5;\"North\";C2:C5;\">1000\")",
            "=SUMIFS(C2:C5,A2:A5,\"North\",C2:C5,\">1000\")",
            "=СУММЕСЛИМН(C2:C5;A2:A5;\"North\";C2:C5;\">1000\")"
          ],
          hint: {
            ru: "Начинай с диапазона суммирования, затем добавляй пары диапазон/критерий.",
            en: "Start with the sum range, then add the range/criterion pairs."
          },
          points: 210,
          explanation: {
            ru: "СУММЕСЛИМН позволяет учитывать несколько условий и заменяет СУММЕСЛИ, когда фильтров больше одного.",
            en: "SUMIFS lets you apply multiple conditions and replaces SUMIF once more than one filter is required."
          }
        },
        {
          id: "sumifs-dates",
          task: {
            ru: "Подсчитай доходы за февраль 2025 года от клиентов класса Premium.",
            en: "Sum the February 2025 revenue from Premium clients."
          },
          data: [
            ["Дата", "Класс", "Доход"],
            ["2025-02-05", "Premium", 12000],
            ["2025-02-18", "Standard", 6500],
            ["2025-02-25", "Premium", 9800],
            ["2025-03-02", "Premium", 11000]
          ],
          expectedFormula: "=SUMIFS(C2:C5;A2:A5;\">=2025-02-01\";A2:A5;\"<=2025-02-28\";B2:B5;\"Premium\")",
          alternateFormulas: [
            "=SUMIFS(C2:C5;A2:A5;\">=2025-02-01\";A2:A5;\"<=2025-02-28\";B2:B5;\"Premium\")",
            "=SUMIFS(C2:C5,A2:A5,\">=2025-02-01\",A2:A5,\"<=2025-02-28\",B2:B5,\"Premium\")",
            "=СУММЕСЛИМН(C2:C5;A2:A5;\">=2025-02-01\";A2:A5;\"<=2025-02-28\";B2:B5;\"Premium\")"
          ],
          hint: {
            ru: "Используй два условия по датам и одно по классу — порядок аргументов остаётся тем же.",
            en: "Use two date conditions plus one for class—the argument order stays the same."
          },
          points: 220,
          explanation: {
            ru: "Все диапазоны критериев должны совпадать по размеру с диапазоном суммирования.",
            en: "Each criteria range must align in size with the sum range."
          }
        },
        {
          id: "sumifs-mixed",
          task: {
            ru: "Подсчитай бонусы отдела Sales за кварталы Q2 и Q3.",
            en: "Sum the Sales bonuses for quarters Q2 and Q3."
          },
          data: [
            ["Отдел", "Квартал", "Бонус"],
            ["Sales", "Q1", 15000],
            ["Sales", "Q2", 23000],
            ["Sales", "Q3", 19500],
            ["Support", "Q2", 12000],
            ["Support", "Q3", 13000]
          ],
          expectedFormula: "=SUMIFS(C2:C6;A2:A6;\"Sales\";B2:B6;\"Q2\")+SUMIFS(C2:C6;A2:A6;\"Sales\";B2:B6;\"Q3\")",
          alternateFormulas: [
            "=SUMIFS(C2:C6;A2:A6;\"Sales\";B2:B6;\"Q2\")+SUMIFS(C2:C6;A2:A6;\"Sales\";B2:B6;\"Q3\")",
            "=SUMIFS(C2:C6,A2:A6,\"Sales\",B2:B6,\"Q2\")+SUMIFS(C2:C6,A2:A6,\"Sales\",B2:B6,\"Q3\")",
            "=СУММЕСЛИМН(C2:C6;A2:A6;\"Sales\";B2:B6;\"Q2\")+СУММЕСЛИМН(C2:C6;A2:A6;\"Sales\";B2:B6;\"Q3\")"
          ],
          hint: {
            ru: "Складывай результаты нескольких вызовов СУММЕСЛИМН, если нужно объединить разные условия.",
            en: "Add the results of several SUMIFS calls when you need to combine different conditions."
          },
          points: 230,
          explanation: {
            ru: "Несколько вызовов функции можно сложить, чтобы получить итог по набору условий.",
            en: "You can add multiple SUMIFS calls to get an overall result across distinct criteria sets."
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

  getTotalPoints() {
    return this.exercises.reduce((total, exercise) => total + (exercise.points || 0), 0);
  }
}

if (typeof window !== 'undefined') {
  window.Level10 = Level10;
}

