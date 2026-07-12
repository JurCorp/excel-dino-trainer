// levels/level3.js - Уровень 3: СЧЁТЕСЛИ
class Level3 {
  constructor() {
    this.id = 3;
    this.title = {
      ru: "Уровень 3: MIN и MAX",
      en: "Level 3: MIN and MAX"
    };
    this.description = {
      ru: "Изучи функции МИН, МАКС и их сочетание",
      en: "Learn MIN, MAX, and how to combine them"
    };
    this.difficulty = "beginner";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level3.json');
      const data = await response.json();
      
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      
      console.log('Уровень 3 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 3:', error);
      // Fallback данные
      this.exercises = [
        {
          id: "min-basic",
          task: {
            ru: "Найди минимальную температуру хранения препаратов в диапазоне B2:B5 на складе, используй формулу =MIN(B2:B5) или =МИН(B2:B5).",
            en: "Find the minimum storage temperature for drugs in range B2:B5 at the warehouse using =MIN(B2:B5) (or =МИН(B2:B5))."
          },
          data: [
            ["Месяц", "Температура хранения, °C", "Итого"],
            ["Январь", -5, ""],
            ["Февраль", -3, ""],
            ["Март", 0, ""],
            ["Апрель", 5, ""]
          ],
          expectedFormula: "=MIN(B2:B5)",
          alternateFormulas: [
            "=MIN(B2:B5)",
            "=MIN(B2,B3,B4,B5)",
            "=МИН(B2:B5)",
            "=МИН(B2;B3;B4;B5)"
          ],
          resultCell: "C2",
          hint: {
            ru: "Используй формулу =МИН(B2:B5), чтобы сразу получить минимум.",
            en: "Use =MIN(B2:B5) to get the lowest value instantly."
          },
          points: 100,
          explanation: {
            ru: "МИН возвращает самое маленькое число в указанном диапазоне.",
            en: "MIN returns the smallest number in the range."
          }
        },
        {
          id: "max-basic",
          task: {
            ru: "Определи максимальные продажи препаратов в диапазоне B2:B5 с помощью =MAX(B2:B5) или =МАКС(B2:B5).",
            en: "Find the maximum drug sales in B2:B5 using =MAX(B2:B5) (or =МАКС(B2:B5))."
          },
          data: [
            ["Квартал", "Продажи (тыс. руб.)", "Итого"],
            ["Q1", 1000, ""],
            ["Q2", 1500, ""],
            ["Q3", 1200, ""],
            ["Q4", 1800, ""]
          ],
          expectedFormula: "=MAX(B2:B5)",
          alternateFormulas: [
            "=MAX(B2:B5)",
            "=MAX(B2,B3,B4,B5)",
            "=МАКС(B2:B5)",
            "=МАКС(B2;B3;B4;B5)"
          ],
          resultCell: "C2",
          hint: {
            ru: "=МАКС(B2:B5) мгновенно покажет самый большой результат.",
            en: "Use =MAX(B2:B5) to see the highest value."
          },
          points: 120,
          explanation: {
            ru: "МАКС ищет наибольшее значение внутри диапазона.",
            en: "MAX returns the largest number within the range."
          }
        },
        {
          id: "min-max-diff",
          task: {
            ru: "Вычисли разброс заказов на поставку препаратов: применяй формулу =MAX(B2:B8)-MIN(B2:B8).",
            en: "Measure the order spread with =MAX(B2:B8)-MIN(B2:B8)."
          },
          data: [
            ["День", "Заказы (шт.)", "Итого"],
            ["Понедельник", 50, ""],
            ["Вторник", 45, ""],
            ["Среда", 60, ""],
            ["Четверг", 55, ""],
            ["Пятница", 70, ""],
            ["Суббота", 40, ""],
            ["Воскресенье", 30, ""]
          ],
          expectedFormula: "=MAX(B2:B8)-MIN(B2:B8)",
          alternateFormulas: [
            "=MAX(B2:B8)-MIN(B2:B8)",
            "=MAX(B2:B8)-MIN(B2:B8)",
            "=МАКС(B2:B8)-МИН(B2:B8)",
            "=МАКС(B2;B3;B4;B5;B6;B7;B8)-МИН(B2;B3;B4;B5;B6;B7;B8)"
          ],
          resultCell: "C2",
          hint: {
            ru: "Вычти минимум из максимума: =МАКС(B2:B8)-МИН(B2:B8).",
            en: "Subtract the minimum from the maximum: =MAX(B2:B8)-MIN(B2:B8)."
          },
          points: 180,
          explanation: {
            ru: "Разница между минимумом и максимумом показывает диапазон данных.",
            en: "The MAX-MIN difference shows the data range."
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
window.Level3 = Level3;
