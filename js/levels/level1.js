// levels/level1.js - Уровень 1: Сумма
class Level1 {
  constructor() {
    this.id = 1;
    this.title = {
      ru: "Уровень 1: Сумма",
      en: "Level 1: Sum"
    };
    this.description = {
      ru: "Изучи основы работы с функцией СУММ",
      en: "Learn the basics of SUM function"
    };
    this.difficulty = "beginner";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level1.json');
      const data = await response.json();
      
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      
      console.log('Уровень 1 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 1:', error);
      // Fallback данные
      this.exercises = [
        {
          id: "sum-equals-intro",
          task: {
            ru: "Найди итоговую выручку за квартал отдела продаж по данным финансовой модели: используй формулу =B2+C2+D2. Помни, что все формулы начинаются со знака '='.",
            en: "Find total quarterly revenue for the sales department from the financial model using =B2+C2+D2. Remember every Excel formula starts with '='."
          },
          data: [
            ["Отдел", "Январь", "Февраль", "Март", "Итого"],
            ["Продажи", 120000, 135000, 142000, ""],
            ["Логистика", 45000, 47000, 48500, ""],
            ["Маркетинг", 18000, 20000, 21500, ""]
          ],
          expectedFormula: "=B2+C2+D2",
          alternateFormulas: [
            "=SUM(B2:D2)",
            "=SUM(B2,C2,D2)",
            "=СУММ(B2:D2)",
            "=СУММ(B2;C2;D2)",
            "=B2+C2+D2",
            "=B2+D2+C2",
            "=C2+B2+D2",
            "=C2+D2+B2",
            "=D2+B2+C2",
            "=D2+C2+B2"
          ],
          resultCell: "E2",
          hint: {
            ru: "Все формулы начинаются с '='. Используй B2+C2+D2 или СУММ(B2:D2).",
            en: "Remember to start with '='. Use B2+C2+D2 or SUM(B2:D2)."
          },
          points: 120,
          explanation: {
            ru: "Можно сложить отдельные ячейки или воспользоваться функцией СУММ.",
            en: "Add individual cells or use the SUM function."
          }
        },
        {
          id: "sum-separators",
          task: {
            ru: "Сложи количество партий дженерика ибупрофена: воспользуйся формулой =SUM(B2,B3) или =СУММ(B2;B3). Обрати внимание как разделяются ячейки в скобках формул — в англоязычных формулах это \",\", а в русскоязычных — \";\".",
            en: "Add the batches of generic ibuprofen using =SUM(B2,B3) or =СУММ(B2;B3). Note how arguments are separated: English formulas use \",\" while Russian formulas use \";\"."
          },
          data: [
            ["Форма выпуска", "Количество партий", "Итого"],
            ["Таблетки 200 мг", 15, ""],
            ["Капсулы 400 мг", 7, ""]
          ],
          expectedFormula: "=SUM(B2,B3)",
          alternateFormulas: [
            "=SUM(B2,B3)",
            "=SUM(B2:B3)",
            "=СУММ(B2;B3)",
            "=СУММ(B2:B3)"
          ],
          resultCell: "C2",
          hint: {
            ru: "В русской версии используем ';', в английской — ','.",
            en: "Russian formulas use ';', English formulas use ','."
          },
          points: 130,
          explanation: {
            ru: "Следи за разделителями аргументов.",
            en: "Watch the argument separators."
          }
        },
        {
          id: "sum-column-b",
          task: {
            ru: "Иногда перечислять аргументы через запятую неудобно. Посчитай сумму продаж препаратов столбца B — лучше записать диапазон B2:B8 через формулу =SUM(B2:B8) или =СУММ(B2:B8).",
            en: "Listing every cell can be awkward. Sum column B drug sales instead by using the range B2:B8 with =SUM(B2:B8) or =СУММ(B2:B8)."
          },
          data: [
            ["Препарат", "Продажи (тыс. руб.)", "Итого"],
            ["Ибупрофен 200 мг", 10, ""],
            ["Ибупрофен 400 мг", 20, ""],
            ["Ибупрофен 600 мг", 30, ""],
            ["Ибупрофен гель", 25, ""],
            ["Ибупрофен суспензия", 15, ""],
            ["Ибупрофен крем", 40, ""],
            ["Ибупрофен спрей", 35, ""]
          ],
          expectedFormula: "=SUM(B2:B8)",
          alternateFormulas: [
            "=SUM(B2:B8)",
            "=SUM(B2,B3,B4,B5,B6,B7,B8)",
            "=СУММ(B2:B8)",
            "=СУММ(B2;B3;B4;B5;B6;B7;B8)"
          ],
          resultCell: "C2",
          hint: {
            ru: "Функция СУММ(B2:B4) быстро подсчитает сумму диапазона.",
            en: "SUM(B2:B4) is the quickest option."
          },
          points: 120,
          explanation: {
            ru: "Функция складывает все значения диапазона.",
            en: "The function adds all values in the range."
          }
        },
        {
          id: "sum-march-column",
          task: {
            ru: "Подсчитай общую выручку компании за март (столбец D) любым способом.",
            en: "Calculate total company revenue for March (column D) in any way you prefer."
          },
          data: [
            ["Форма выпуска", "Январь", "Февраль", "Март", "Итого"],
            ["Таблетки 200 мг", 110000, 115000, 120000, ""],
            ["Капсулы 400 мг", 85000, 87000, 91000, ""],
            ["Суспензия", 62000, 64000, 68000, ""]
          ],
          expectedFormula: "=SUM(D2:D4)",
          alternateFormulas: [
            "=SUM(D2:D4)",
            "=D2+D3+D4",
            "=SUM(D2,D3,D4)",
            "=СУММ(D2:D4)",
            "=СУММ(D2;D3;D4)"
          ],
          resultCell: "E2",
          hint: {
            ru: "Диапазон D2:D4 быстро собирает мартовскую выручку. Можно сложить и вручную.",
            en: "The range D2:D4 grabs March revenue at once. Manual addition is fine too."
          },
          points: 150,
          explanation: {
            ru: "Можно использовать функцию или сложить ячейки вручную.",
            en: "Feel free to use a function or add the cells manually."
          }
        },
        {
          id: "sum-bonus",
          task: {
            ru: "Добавь бонус 1 000 000 к сумме выручки по препаратам столбца D: воспользуйся =SUM(D2:D6,1000000) или =СУММ(D2:D6;1000000).",
            en: "Add a 1,000,000 bonus to column D drug sales totals using =SUM(D2:D6,1000000) or =СУММ(D2:D6;1000000)."
          },
          data: [
            ["Аптечная сеть", "Q1", "Q2", "Q3", "Q4", "Итого"],
            ["Сеть А", 400000, 420000, 450000, 480000, ""],
            ["Сеть Б", 320000, 330000, 350000, 370000, ""],
            ["Сеть В", 280000, 300000, 320000, 340000, ""],
            ["Сеть Г", 260000, 270000, 290000, 315000, ""],
            ["Сеть Д", 240000, 255000, 275000, 295000, ""]
          ],
          expectedFormula: "=SUM(D2:D6,1000000)",
          alternateFormulas: [
            "=SUM(D2:D6,1000000)",
            "=SUM(D2:D6, 1000000)",
            "=СУММ(D2:D6;1000000)",
            "=СУММ(D2:D6; 1000000)",
            "=SUM(D2:D6)+1000000",
            "=СУММ(D2:D6)+1000000"
          ],
          resultCell: "F2",
          hint: {
            ru: "Добавь константу как отдельный аргумент функции.",
            en: "Add the constant as an extra argument to SUM."
          },
          points: 180,
          explanation: {
            ru: "Функция СУММ поддерживает отдельные значения как аргументы.",
            en: "SUM accepts standalone values as extra arguments."
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

// Делаем класс доступным глобально
window.Level1 = Level1;
