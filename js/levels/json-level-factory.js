// js/levels/json-level-factory.js — shared JSON-backed level class factory
function createJsonLevelClass(levelId) {
  return class JsonLevel {
    constructor() {
      this.id = levelId;
      this.title = { ru: `Уровень ${levelId}`, en: `Level ${levelId}` };
      this.description = { ru: '', en: '' };
      this.difficulty = 'beginner';
      this.exercises = [];
      this.completed = false;
    }

    async load() {
      const response = await fetch(`data/level${levelId}.json?v=20260712-paywall2`);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить data/level${levelId}.json`);
      }
      const data = await response.json();
      this.exercises = data.exercises || [];
      this.title = data.title || this.title;
      this.description = data.description || this.description;
      this.difficulty = data.difficulty || this.difficulty;
      this.unlockCondition = data.unlockCondition;
      console.log(`Уровень ${levelId} загружен:`, this.exercises.length, 'упражнений');
    }

    getCurrentExercise(exerciseIndex = 0) { return this.exercises[exerciseIndex]; }
    getExerciseCount() { return this.exercises.length; }
    getTotalPoints() { return this.exercises.reduce((total, exercise) => total + (exercise.points || 0), 0); }
  };
}

if (typeof window !== 'undefined') {
  window.createJsonLevelClass = createJsonLevelClass;
}
