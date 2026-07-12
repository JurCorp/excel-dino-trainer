// levels/level4.js - Уровень 5: ЕСЛИМН
class Level4 {
  constructor() {
    this.id = 4;
    this.title = {
      ru: "Уровень 5: ЕСЛИМН",
      en: "Level 5: IFS"
    };
    this.description = {
      ru: "Научись применять ЕСЛИМН для сложных условий",
      en: "Learn to apply IFS for multi-stage conditions"
    };
    this.difficulty = "beginner";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level4.json');
      const data = await response.json();
      
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      
      console.log('Уровень 4 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 4:', error);
      // Fallback данные
      this.exercises = [
        {
          id: "ifs-quality",
          task: {
            ru: "Оцени качество обслуживания по оценке в столбце B. Используй =ЕСЛИМН(B2>=90;\"Отлично\";B2>=75;\"Хорошо\";B2>=60;\"Средне\";\"Нужно улучшить\") или =IFS(B2>=90,\"Отлично\",B2>=75,\"Хорошо\",B2>=60,\"Средне\",\"Нужно улучшить\").",
            en: "Classify service quality by the score in column B using =IFS(B2>=90,\"Отлично\",B2>=75,\"Хорошо\",B2>=60,\"Средне\",\"Нужно улучшить\")."
          },
          data: [
            ["Клиент", "Оценка", "Статус", "Итого"],
            ["Omega", 94, "", ""],
            ["Delta", 82, "", ""],
            ["Beta", 67, "", ""],
            ["Alpha", 55, "", ""]
          ],
          expectedFormula: "=IFS(B2>=90,\"Отлично\",B2>=75,\"Хорошо\",B2>=60,\"Средне\",\"Нужно улучшить\")",
          alternateFormulas: [
            "=IFS(B2>=90,\"Отлично\",B2>=75,\"Хорошо\",B2>=60,\"Средне\",\"Нужно улучшить\")",
            "=ЕСЛИМН(B2>=90;\"Отлично\";B2>=75;\"Хорошо\";B2>=60;\"Средне\";\"Нужно улучшить\")"
          ],
          resultCell: "D2",
          hint: {
            ru: "Формула: =ЕСЛИМН(B2>=90;\"Отлично\";B2>=75;\"Хорошо\";B2>=60;\"Средне\";\"Нужно улучшить\").",
            en: "Hint: =IFS(B2>=90,\"Отлично\",B2>=75,\"Хорошо\",B2>=60,\"Средне\",\"Нужно улучшить\")."
          },
          points: 100,
          explanation: {
            ru: "ЕСЛИМН избавляет от вложенных ЕСЛИ для каскадных условий.",
            en: "IFS removes the need for nested IFs when cascading thresholds."
          }
        },
        {
          id: "ifs-priority",
          task: {
            ru: "Назначь приоритет обращению по уровню срочности. Используй ЕСЛИМН, чтобы «Критично» → «Высший приоритет», «Высокий» → «Приоритет», «Средний» → «Запланировать», иначе «Наблюдать».",
            en: "Assign ticket priority with IFS: \"Критично\" → \"Высший приоритет\", \"Высокий\" → \"Приоритет\", \"Средний\" → \"Запланировать\", otherwise \"Наблюдать\"."
          },
          data: [
            ["Запрос", "Срочность", "Приоритет", "Итого"],
            ["INC-101", "Критично", "", ""],
            ["INC-108", "Высокий", "", ""],
            ["INC-115", "Средний", "", ""],
            ["INC-120", "Низкий", "", ""]
          ],
          expectedFormula: "=IFS(B2=\"Критично\",\"Высший приоритет\",B2=\"Высокий\",\"Приоритет\",B2=\"Средний\",\"Запланировать\",TRUE,\"Наблюдать\")",
          alternateFormulas: [
            "=IFS(B2=\"Критично\",\"Высший приоритет\",B2=\"Высокий\",\"Приоритет\",B2=\"Средний\",\"Запланировать\",TRUE,\"Наблюдать\")",
            "=ЕСЛИМН(B2=\"Критично\";\"Высший приоритет\";B2=\"Высокий\";\"Приоритет\";B2=\"Средний\";\"Запланировать\";ИСТИНА;\"Наблюдать\")"
          ],
          resultCell: "D2",
          hint: {
            ru: "Заверши ЕСЛИМН аргументом ИСТИНА для значения по умолчанию.",
            en: "Finish IFS with TRUE to provide a default branch."
          },
          points: 150,
          explanation: {
            ru: "TRUE в конце формулы сокращает запись ветки «иначе».",
            en: "Using TRUE at the end replaces an explicit ELSE clause."
          }
        },
        {
          id: "ifs-shipping",
          task: {
            ru: "Определи статус доставки по сроку (столбец B): ≤1 — «Доставить сегодня», ≤3 — «Обычная доставка», ≤7 — «Отложить», иначе «Связаться с клиентом».",
            en: "Choose shipping status by ETA (column B): ≤1 \"Доставить сегодня\", ≤3 \"Обычная доставка\", ≤7 \"Отложить\", otherwise \"Связаться с клиентом\"."
          },
          data: [
            ["Заказ", "ETA, дни", "Статус", "Итого"],
            ["ORD-204", 1, "", ""],
            ["ORD-207", 3, "", ""],
            ["ORD-211", 6, "", ""],
            ["ORD-213", 12, "", ""]
          ],
          expectedFormula: "=IFS(B2<=1,\"Доставить сегодня\",B2<=3,\"Обычная доставка\",B2<=7,\"Отложить\",TRUE,\"Связаться с клиентом\")",
          alternateFormulas: [
            "=IFS(B2<=1,\"Доставить сегодня\",B2<=3,\"Обычная доставка\",B2<=7,\"Отложить\",TRUE,\"Связаться с клиентом\")",
            "=ЕСЛИМН(B2<=1;\"Доставить сегодня\";B2<=3;\"Обычная доставка\";B2<=7;\"Отложить\";ИСТИНА;\"Связаться с клиентом\")"
          ],
          resultCell: "D2",
          hint: {
            ru: "ЕСЛИМН возвращает первое подходящее условие — упорядочи их по возрастанию срока.",
            en: "IFS returns the first match — order checks by the smallest ETA first."
          },
          points: 200,
          explanation: {
            ru: "Такой шаблон легко переносится на SLA и логистику.",
            en: "This pattern maps nicely to SLA or logistics rules."
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
    // Простая проверка: сравниваем формулы без учета регистра и пробелов
    const normalized = str => str.trim().toUpperCase().replace(/\s/g, '');
    return normalized(userFormula) === normalized(expectedFormula);
  }

  getDataForExercise(exerciseIndex = 0) {
    return this.exercises[exerciseIndex]?.data || [];
  }
}

if (typeof window !== 'undefined') {
  window.Level4 = Level4;
}

