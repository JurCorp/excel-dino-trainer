// levels/level2.js - Уровень 2: Среднее значение
class Level2 {
  constructor() {
    this.id = 2;
    this.title = {
      ru: "Уровень 2: Среднее значение",
      en: "Level 2: Average"
    };
    this.description = {
      ru: "Научись находить среднее значение",
      en: "Learn to find average values"
    };
    this.difficulty = "beginner";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level2.json');
      const data = await response.json();
      
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      
      console.log('Уровень 2 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 2:', error);
      // Fallback данные
      this.exercises = [
        {
          id: "average-basic",
          task: {
            ru: "Найди средний рейтинг качества партий дженерика ибупрофена с помощью формулы =AVERAGE(B2:B5) (или =СРЗНАЧ(B2:B5)).",
            en: "Calculate the average quality rating of generic ibuprofen batches using =AVERAGE(B2:B5) (or =СРЗНАЧ(B2:B5))."
          },
          data: [
            ["Форма выпуска", "Рейтинг качества", "Итого", "ОжидаемаяФормула"],
            ["Таблетки 200 мг", 85, "", "=AVERAGE(B2:B5)"],
            ["Капсулы 400 мг", 92, "", ""],
            ["Суспензия", 78, "", ""],
            ["Гель", 88, "", ""]
          ],
          expectedFormula: "=AVERAGE(B2:B5)",
          alternateFormulas: [
            "=AVERAGE(B2:B5)",
            "=AVERAGE(B2,B3,B4,B5)",
            "=СРЗНАЧ(B2:B5)",
            "=СРЗНАЧ(B2;B3;B4;B5)"
          ],
          resultCell: "C2",
          hint: {
            ru: "Формула =СРЗНАЧ(B2:B5) мгновенно посчитает средний балл.",
            en: "Use =AVERAGE(B2:B5) to get the mean instantly."
          },
          points: 100,
          explanation: {
            ru: "Функция СРЗНАЧ вычисляет среднее арифметическое",
            en: "AVERAGE function calculates arithmetic mean"
          }
        },
        {
          id: "average-advanced",
          task: {
            ru: "Посчитай средний объём продаж препаратов за квартал для столбца C.",
            en: "Find the average quarterly drug sales stored in column C."
          },
          data: [
            ["Аптечная сеть", "Регион", "Продажи", "Примечание", "Итого"],
            ["Сеть А", "Север", 125000, "", ""],
            ["Сеть Б", "Юг", 118500, "", ""],
            ["Сеть В", "Запад", 131200, "", ""],
            ["Сеть Г", "Восток", 122400, "", ""],
            ["Сеть Д", "Центр", 119900, "", ""]
          ],
          expectedFormula: "=AVERAGE(C2:C6)",
          alternateFormulas: [
            "=AVERAGE(C2:C6)",
            "=AVERAGE(C2,C3,C4,C5,C6)",
            "=СРЗНАЧ(C2:C6)",
            "=СРЗНАЧ(C2;C3;C4;C5;C6)"
          ],
          resultCell: "E2",
          hint: {
            ru: "Подсказка: =СРЗНАЧ(C2:C6) вычислит среднее значение продаж.",
            en: "Hint: use =AVERAGE(C2:C6) to calculate the mean sales."
          },
          points: 150,
          explanation: {
            ru: "СРЗНАЧ помогает быстро сравнить показатели разных регионов.",
            en: "AVERAGE lets you compare performance across regions."
          }
        },
        {
          id: "average-weighted",
          task: {
            ru: "Определи среднее время производства партии дженерика (столбец B) за неделю на заводе.",
            en: "Determine the average production time per batch (column B) for the week at the pharma factory."
          },
          data: [
            ["День", "Время производства, ч", "Смена", "Комментарий", "Итого"],
            ["Понедельник", 12, "Ирина", "", ""],
            ["Вторник", 15, "Алексей", "", ""],
            ["Среда", 11, "Мария", "", ""],
            ["Четверг", 16, "Артур", "", ""],
            ["Пятница", 14, "Наталья", "", ""],
            ["Суббота", 10, "Олег", "", ""],
            ["Воскресенье", 13, "Тимур", "", ""]
          ],
          expectedFormula: "=AVERAGE(B2:B8)",
          alternateFormulas: [
            "=AVERAGE(B2:B8)",
            "=AVERAGE(B2,B3,B4,B5,B6,B7,B8)",
            "=СРЗНАЧ(B2:B8)",
            "=СРЗНАЧ(B2;B3;B4;B5;B6;B7;B8)"
          ],
          resultCell: "E2",
          hint: {
            ru: "Формула =СРЗНАЧ(B2:B8) пригодится для анализа нагрузки.",
            en: "Try =AVERAGE(B2:B8) to analyze workload."
          },
          points: 100,
          explanation: {
            ru: "Среднее время помогает оценить эффективность команды.",
            en: "Average call length helps track team efficiency."
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
window.Level2 = Level2;
