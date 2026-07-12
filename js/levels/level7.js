// levels/level7.js - Уровень 4: ЕСЛИ
class Level7 {
  constructor() {
    this.id = 7;
    this.title = {
      ru: "Уровень 4: ЕСЛИ",
      en: "Level 4: IF"
    };
    this.description = {
      ru: "Освой базовые проверки с помощью функции ЕСЛИ",
      en: "Practice simple conditional checks with IF"
    };
    this.difficulty = "intermediate";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level7.json');
      const data = await response.json();
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      console.log('Уровень 7 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 7:', error);
      this.exercises = [
        {
          id: "if-basic",
          task: {
            ru: "Используй ЕСЛИ, чтобы проверить: если значение >50, выводи «Высокое», иначе «Низкое». Для B2 подойдут формулы =ЕСЛИ(A2>50;\"Высокое\";\"Низкое\") или =IF(A2>50,\"Высокое\",\"Низкое\"). Первое значение в скобках — само условие (для ячейки B2 это продажи в A2). Следующее значение после первой \";\" или \",\" показывает, что будет, если условие выполняется, а последнее — что произойдёт, если A2 ≤ 50.",
            en: "Use IF to check whether A2 is greater than 50: return \"Высокое\" if true, otherwise \"Низкое\". In B2 use =IF(A2>50,\"Высокое\",\"Низкое\") or =ЕСЛИ(A2>50;\"Высокое\";\"Низкое\"). The first argument in the parentheses is the condition (in this case the sales in A2). The next argument after the first comma/semicolon is the result when the condition is true, and the last argument is used when A2 ≤ 50."
          },
          data: [
            ["Продажи", "Статус", "Комментарий"],
            [60, "", ""],
            [45, "", ""],
            [72, "", ""]
          ],
          expectedFormula: "=IF(A2>50,\"Высокое\",\"Низкое\")",
          alternateFormulas: [
            "=IF(A2>50,\"Высокое\",\"Низкое\")",
            "=ЕСЛИ(A2>50;\"Высокое\";\"Низкое\")"
          ],
          resultCell: "B2",
          hint: {
            ru: "Полные формулы: =ЕСЛИ(A2>50;\"Высокое\";\"Низкое\") / =IF(A2>50,\"Высокое\",\"Низкое\").",
            en: "Formulas: =IF(A2>50,\"Высокое\",\"Низкое\") / =ЕСЛИ(A2>50;\"Высокое\";\"Низкое\")."
          },
          points: 150,
          explanation: {
            ru: "ЕСЛИ проверяет условие и возвращает разные значения для true/false веток.",
            en: "IF evaluates a condition and returns different results for the true/false branches."
          }
        },
        {
          id: "if-stock",
          task: {
            ru: "Определи, нужно ли пополнить запасы. Если остаток в B2 меньше 100, верни «Заказать», иначе «Достаточно».",
            en: "Decide whether to restock: if the stock in B2 is below 100, return \"Заказать\", otherwise \"Достаточно\"."
          },
          data: [
            ["Товар", "Остаток", "Решение", "Комментарий"],
            ["Ноутбуки", 85, "", ""],
            ["Планшеты", 120, "", ""],
            ["Мониторы", 60, "", ""]
          ],
          expectedFormula: "=ЕСЛИ(B2<100;\"Заказать\";\"Достаточно\")",
          alternateFormulas: [
            "=ЕСЛИ(B2<100;\"Заказать\";\"Достаточно\")",
            "=IF(B2<100,\"Заказать\",\"Достаточно\")"
          ],
          resultCell: "C2",
          hint: {
            ru: "Формулы: =ЕСЛИ(B2<100;\"Заказать\";\"Достаточно\") / =IF(B2<100,\"Заказать\",\"Достаточно\").",
            en: "Formulas: =IF(B2<100,\"Заказать\",\"Достаточно\") / =ЕСЛИ(B2<100;\"Заказать\";\"Достаточно\")."
          },
          points: 180,
          explanation: {
            ru: "ЕСЛИ помогает помечать позиции, где запас ниже порога.",
            en: "IF flags items whose stock falls below the threshold."
          }
        },
        {
          id: "if-attendance",
          task: {
            ru: "Проверь посещаемость: если процент в B2 не ниже 90%, выводи «Отлично», иначе «Нужно подтянуть».",
            en: "Check attendance: if B2 is at least 90%, return \"Отлично\", otherwise \"Нужно подтянуть\"."
          },
          data: [
            ["Группа", "Посещаемость, %", "Оценка", "Комментарий"],
            ["Alpha", 94, "", ""],
            ["Beta", 88, "", ""],
            ["Gamma", 91, "", ""]
          ],
          expectedFormula: "=ЕСЛИ(B2>=90;\"Отлично\";\"Нужно подтянуть\")",
          alternateFormulas: [
            "=ЕСЛИ(B2>=90;\"Отлично\";\"Нужно подтянуть\")",
            "=IF(B2>=90,\"Отлично\",\"Нужно подтянуть\")"
          ],
          resultCell: "C2",
          hint: {
            ru: "Формулы: =ЕСЛИ(B2>=90;\"Отлично\";\"Нужно подтянуть\") / =IF(B2>=90,\"Отлично\",\"Нужно подтянуть\").",
            en: "Formulas: =IF(B2>=90,\"Отлично\",\"Нужно подтянуть\") / =ЕСЛИ(B2>=90;\"Отлично\";\"Нужно подтянуть\")."
          },
          points: 180,
          explanation: {
            ru: "Оценка посещаемости строится на простом сравнении в ЕСЛИ.",
            en: "A simple IF comparison classifies the attendance quality."
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
  window.Level7 = Level7;
}

