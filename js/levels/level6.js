// levels/level6.js - Уровень 9: ПРОСМОТРХ
class Level6 {
  constructor() {
    this.id = 6;
    this.title = {
      ru: "Уровень 9: ПРОСМОТРХ",
      en: "Level 9: XLOOKUP"
    };
    this.description = {
      ru: "Освой современные сценарии использования ПРОСМОТРХ",
      en: "Master modern XLOOKUP scenarios"
    };
    this.difficulty = "intermediate";
    this.exercises = [];
    this.completed = false;
  }

  async load() {
    try {
      const response = await fetch('data/level6.json');
      const data = await response.json();
      this.exercises = data.exercises;
      this.title = data.title;
      this.description = data.description;
      this.difficulty = data.difficulty;
      console.log('Уровень 6 загружен:', this.exercises.length, 'упражнений');
    } catch (error) {
      console.error('Ошибка загрузки уровня 6:', error);
      this.exercises = [
        {
          id: "xlookup-basic",
          task: {
            ru: "Найди зарплату сотрудника, используя =ПРОСМОТРХ(A5;A2:A4;B2:B4) или =XLOOKUP(A5,A2:A4,B2:B4).\n\nАргументы: A5 — значение, которое ищем; A2:A4 — массив, где ищем; B2:B4 — массив, из которого возвращаем результат.",
            en: "Find an employee salary with =XLOOKUP(A5,A2:A4,B2:B4).\n\nArguments: A5 is the lookup value; A2:A4 is the lookup array; B2:B4 is the return array."
          },
          data: [
            ["Сотрудник", "Зарплата", "", "", "ОжидаемаяФормула"],
            ["Иванов", 50000, "", "", "=XLOOKUP(A5;A2:A4;B2:B4)"],
            ["Петров", 60000, "", "", ""],
            ["Сидоров", 55000, "", "", ""],
            ["Иванов", "", "", "", ""]
          ],
          expectedFormula: "=XLOOKUP(A5;A2:A4;B2:B4)",
          alternateFormulas: [
            "=XLOOKUP(A5;A2:A4;B2:B4)",
            "=XLOOKUP(A5,A2:A4,B2:B4)",
            "=ПРОСМОТРХ(A5;A2:A4;B2:B4)"
          ],
          hint: {
            ru: "Передай значение, массив поиска и массив результата — в таком порядке.",
            en: "Pass the lookup value, lookup array and return array in that order."
          },
          points: 200,
          explanation: {
            ru: "ПРОСМОТРХ ищет имя в A2:A4 и возвращает зарплату из B2:B4.",
            en: "XLOOKUP searches A2:A4 for the name and returns the salary from B2:B4."
          }
        },
        {
          id: "xlookup-column",
          task: {
            ru: "Верни отдел сотрудника, указав поле для поиска и столбец результата",
            en: "Return an employee department by selecting lookup and return arrays"
          },
          data: [
            ["Сотрудник", "Отдел", "Роль", "ОжидаемаяФормула"],
            ["Иванов", "Продажи", "Менеджер", ""],
            ["Петров", "Сервис", "Тимлид", ""],
            ["Сидоров", "Логистика", "Аналитик", ""],
            ["Иванов", "", "", "=XLOOKUP(A5;A2:A4;B2:B4)"],
            ["Петров", "", "", ""]
          ],
          expectedFormula: "=XLOOKUP(A5;A2:A4;B2:B4)",
          alternateFormulas: [
            "=XLOOKUP(A5;A2:A4;B2:B4)",
            "=XLOOKUP(A5,A2:A4,B2:B4)",
            "=ПРОСМОТРХ(A5;A2:A4;B2:B4)"
          ],
          hint: {
            ru: "Задай массив поиска и массив возврата вручную.",
            en: "Specify lookup and return arrays explicitly."
          },
          points: 200,
          explanation: {
            ru: "ПРОСМОТРХ возвращает значения из любого столбца.",
            en: "XLOOKUP can return values from any column."
          }
        },
        {
          id: "xlookup-default",
          task: {
            ru: "Добавь значение по умолчанию, если код не найден",
            en: "Provide a default value when the code is missing"
          },
          data: [
            ["Код", "Статус", "Менеджер", "ОжидаемаяФормула"],
            ["CL001", "Active", "Иванова", ""],
            ["CL002", "Pending", "Петров", ""],
            ["CL003", "Closed", "Сидоров", ""],
            ["CL999", "", "", "=XLOOKUP(A5;A2:A4;B2:B4;\"Не найден\")"],
            ["CL999", "", "", ""]
          ],
          expectedFormula: "=XLOOKUP(A5;A2:A4;B2:B4;\"Не найден\")",
          alternateFormulas: [
            "=XLOOKUP(A5;A2:A4;B2:B4;\"Не найден\")",
            "=XLOOKUP(A5,A2:A4,B2:B4,\"Не найден\")",
            "=ПРОСМОТРХ(A5;A2:A4;B2:B4;\"Не найден\")"
          ],
          hint: {
            ru: "Используй четвёртый аргумент для значения по умолчанию.",
            en: "Use the fourth argument for a default value."
          },
          points: 210,
          explanation: {
            ru: "ПРОСМОТРХ может вернуть заданный текст, если совпадение не найдено.",
            en: "XLOOKUP can return custom text when no match is found."
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
  window.Level6 = Level6;
}

