// level-manager.js - Управление уровнями и прогрессом
function stripQuotedSections(formula) {
  return formula.replace(/"[^"]*"/g, '');
}

function isDecimalComma(formula, index) {
  let prev = index - 1;
  while (prev >= 0 && formula[prev] === ' ') prev--;
  let next = index + 1;
  while (next < formula.length && formula[next] === ' ') next++;
  return prev >= 0 && next < formula.length && /[0-9]/.test(formula[prev]) && /[0-9]/.test(formula[next]);
}

function hasInvalidCommaForRussian(formula) {
  const cleaned = stripQuotedSections(formula);
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] === ',') {
      if (!isDecimalComma(cleaned, i)) {
        return true;
      }
    }
  }
  return false;
}

function hasSemicolonOutsideQuotes(formula) {
  const cleaned = stripQuotedSections(formula);
  return cleaned.includes(';');
}

function replaceSemicolonsWithCommas(formula) {
  let result = '';
  let insideQuotes = false;
  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
      result += char;
    } else if (!insideQuotes && char === ';') {
      result += ',';
    } else {
      result += char;
    }
  }
  return result;
}

function detectFormulaLanguage(formula) {
  const cleaned = stripQuotedSections(formula);
  return /[А-Яа-яЁё]/.test(cleaned) ? 'ru' : 'en';
}

function normalizeFormula(formula, language, translateFn, skipValidation = false) {
  if (!formula) return null;
  const trimmed = formula.trim();
  if (language === 'ru') {
    if (!skipValidation && hasInvalidCommaForRussian(trimmed)) return null;
    const normalized = replaceSemicolonsWithCommas(trimmed);
    const translated = translateFn(normalized);
    return translated.toUpperCase().replace(/\s/g, '');
  }
  // English
  if (!skipValidation && hasSemicolonOutsideQuotes(trimmed)) return null;
  const normalized = trimmed.replace(/\s+/g, ' ');
  const translated = translateFn(normalized);
  return translated.replace(/;/g, ',').toUpperCase().replace(/\s/g, '');
}

const DEFAULT_LEVEL_EXERCISE_COUNTS = {
  1: 5,
  2: 3,
  3: 3,
  4: 3,
  5: 4,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
 10: 3,
  11: 3,
  12: 14
};

if (typeof window !== 'undefined') {
  window.DEFAULT_LEVEL_EXERCISE_COUNTS = DEFAULT_LEVEL_EXERCISE_COUNTS;
}

class LevelManager {
  constructor() {
    this.levels = new Map();
    this.currentLevel = 1;
    this.currentExercise = 0;
    this.unlockedLevels = []; // Будет заполнено при регистрации уровней
    this.completedLevels = new Set();
    this.userProgress = new Map(); // Кэш прогресса пользователя
    this.completedExercises = new Map(); // Map<levelId, Set<exerciseIndex>> - отслеживание завершенных упражнений
    this.levelExerciseCounts = new Map(); // Map<levelId, number> - количество упражнений на уровне
  }

  // Регистрируем уровень
  registerLevel(levelClass) {
    const level = new levelClass();
    this.levels.set(level.id, level);
    // Автоматически разблокируем все уровни
    if (!this.unlockedLevels.includes(level.id)) {
      this.unlockedLevels.push(level.id);
    }
    console.log(`Уровень ${level.id} зарегистрирован`);
  }

  // Загружаем уровень
  async loadLevel(levelId) {
    const level = this.levels.get(levelId);
    if (!level) {
      throw new Error(`Уровень ${levelId} не найден`);
    }

    // Загружаем данные уровня
    await level.load();
    if (Array.isArray(level.exercises) && level.exercises.length > 0) {
      this.levelExerciseCounts.set(levelId, level.exercises.length);
    } else if (DEFAULT_LEVEL_EXERCISE_COUNTS[levelId]) {
      this.levelExerciseCounts.set(levelId, DEFAULT_LEVEL_EXERCISE_COUNTS[levelId]);
    }
    this.currentLevel = levelId;
    this.currentExercise = 0;
    
    console.log(`Загружен уровень ${levelId}: ${level.title.ru}`);
    return level;
  }

  // Получаем текущий уровень
  getCurrentLevel() {
    return this.levels.get(this.currentLevel);
  }

  // Получаем текущее упражнение
  getCurrentExercise() {
    const level = this.getCurrentLevel();
    if (!level || !level.exercises) return null;
    return level.exercises[this.currentExercise];
  }

  // Переходим к следующему упражнению
  nextExercise() {
    const level = this.getCurrentLevel();
    if (!level || !level.exercises) return false;

    if (this.currentExercise < level.exercises.length - 1) {
      this.currentExercise++;
      return true; // Есть еще упражнения
    } else {
      // Уровень завершен
      this.completedLevels.add(this.currentLevel);
      this.unlockNextLevel();
      return false; // Уровень завершен
    }
  }

  // Разблокируем следующий уровень
  unlockNextLevel() {
    const nextLevelId = this.currentLevel + 1;
    if (this.levels.has(nextLevelId) && !this.unlockedLevels.includes(nextLevelId)) {
      this.unlockedLevels.push(nextLevelId);
      console.log(`Разблокирован уровень ${nextLevelId}`);
    }
  }

  // Переходим к следующему уровню
  async nextLevel() {
    const nextLevelId = this.currentLevel + 1;
    if (this.levels.has(nextLevelId) && this.isLevelUnlocked(nextLevelId)) {
      await this.loadLevel(nextLevelId);
      return true;
    }
    return false; // Больше уровней нет
  }

  // Переходим к предыдущему уровню
  async previousLevel() {
    const prevLevelId = this.currentLevel - 1;
    if (this.levels.has(prevLevelId)) {
      await this.loadLevel(prevLevelId);
      return true;
    }
    return false;
  }

  // Проверяем, разблокирован ли уровень
  isLevelUnlocked(levelId) {
    return this.unlockedLevels.includes(levelId);
  }

  // Проверяем, завершен ли уровень
  isLevelCompleted(levelId) {
    return this.completedLevels.has(levelId);
  }

  // Получаем прогресс уровня
  getLevelProgress(levelId) {
    const level = this.levels.get(levelId);
    if (!level) return null;

    const totalExercises = this.levelExerciseCounts.has(levelId)
      ? this.levelExerciseCounts.get(levelId)
      : (DEFAULT_LEVEL_EXERCISE_COUNTS[levelId] || (level.exercises ? level.exercises.length : 0));

    const completedCount = this.getCompletedExerciseCount(levelId);
    const isCompleted = totalExercises > 0
      ? completedCount >= totalExercises
      : (level && Array.isArray(level.exercises) ? completedCount >= level.exercises.length : this.isLevelCompleted(levelId));

    if (isCompleted) {
      this.completedLevels.add(levelId);
    }

    // Считаем завершенные упражнения для этого уровня
    return {
      id: levelId,
      title: level.title,
      completed: isCompleted,
      unlocked: this.isLevelUnlocked(levelId),
      currentExercise: completedCount,
      totalExercises,
      score: this.getLevelScore(levelId),
      unlockCondition: level.unlockCondition
    };
  }
  
  // Отмечаем упражнение как завершенное
  markExerciseCompleted(levelId, exerciseIndex) {
    if (!this.completedExercises.has(levelId)) {
      this.completedExercises.set(levelId, new Set());
    }
    this.completedExercises.get(levelId).add(exerciseIndex);

    const total = this.levelExerciseCounts.get(levelId) ?? (this.levels.get(levelId)?.exercises?.length || 0);
    if (total > 0 && this.completedExercises.get(levelId).size >= total) {
      this.completedLevels.add(levelId);
    }
  }

  async markLevelCompleted(levelId) {
    const total = await this.getLevelExerciseCount(levelId);
    if (total === 0) {
      const level = this.levels.get(levelId);
      if (level && Array.isArray(level.exercises)) {
        for (let i = 0; i < level.exercises.length; i++) {
          this.markExerciseCompleted(levelId, i);
        }
      }
    } else {
      for (let i = 0; i < total; i++) {
        this.markExerciseCompleted(levelId, i);
      }
    }
    this.completedLevels.add(levelId);
  }

  // Получаем очки уровня
  getLevelScore(levelId) {
    const completedCount = this.getCompletedExerciseCount(levelId);
    return completedCount * 100;
  }

  // Получаем общий прогресс
  getOverallProgress() {
    const totalLevels = this.levels.size;
    const completedLevels = this.completedLevels.size;
    const unlockedLevels = this.unlockedLevels.length;
    
    let totalScore = 0;
    let totalExercises = 0;
    let completedExercises = 0;
    
    this.levels.forEach((level, levelId) => {
      const totalForLevel = this.levelExerciseCounts.has(levelId)
        ? this.levelExerciseCounts.get(levelId)
        : (DEFAULT_LEVEL_EXERCISE_COUNTS[levelId] || (level.exercises ? level.exercises.length : 0));
      totalExercises += totalForLevel;
      totalScore += this.getLevelScore(levelId);
      completedExercises += this.getCompletedExerciseCount(levelId);
    });

    return {
      totalLevels,
      completedLevels,
      unlockedLevels,
      totalScore,
      totalExercises,
      completedExercises,
      completionPercentage: totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0
    };
  }

  // Получаем список всех уровней (строго 12 штук, без дубликатов)
  getAllLevels() {
    const customOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const allowedIds = new Set(customOrder);
    const byId = new Map();
    this.levels.forEach((level, levelId) => {
      if (allowedIds.has(levelId) && !byId.has(levelId)) {
        byId.set(levelId, this.getLevelProgress(levelId));
      }
    });
    const levels = customOrder
      .filter((id) => byId.has(id))
      .map((id) => byId.get(id));
    return levels;
  }

  getCompletedExerciseCount(levelId) {
    const total = this.levelExerciseCounts.get(levelId) ?? (this.levels.get(levelId)?.exercises?.length || 0);
    const completedSet = this.completedExercises.get(levelId);
    if (completedSet && completedSet.size) {
      return total > 0 ? Math.min(completedSet.size, total) : completedSet.size;
    }
    if (this.isLevelCompleted(levelId) && total > 0) {
      return total;
    }
    return 0;
  }

  async getLevelExerciseCount(levelId) {
    if (this.levelExerciseCounts.has(levelId)) {
      return this.levelExerciseCounts.get(levelId);
    }

    const level = this.levels.get(levelId);
    if (!level) return 0;

    if (Array.isArray(level.exercises) && level.exercises.length > 0) {
      const count = level.exercises.length;
      this.levelExerciseCounts.set(levelId, count);
      return count;
    }

    try {
      const response = await fetch(`data/level${levelId}.json`);
      if (response.ok) {
        const data = await response.json();
        const count = Array.isArray(data.exercises) ? data.exercises.length : 0;
        this.levelExerciseCounts.set(levelId, count);
        return count;
      }
    } catch (error) {
      console.warn(`Не удалось получить данные уровня ${levelId} для подсчета упражнений:`, error);
    }

    if (DEFAULT_LEVEL_EXERCISE_COUNTS[levelId]) {
      this.levelExerciseCounts.set(levelId, DEFAULT_LEVEL_EXERCISE_COUNTS[levelId]);
      return DEFAULT_LEVEL_EXERCISE_COUNTS[levelId];
    }

    this.levelExerciseCounts.set(levelId, 0);
    return 0;
  }

  async preloadLevelExerciseCounts() {
    this.levels.forEach((_, levelId) => {
      if (!this.unlockedLevels.includes(levelId)) {
        this.unlockedLevels.push(levelId);
      }
    });
    const promises = [];
    this.levels.forEach((_, levelId) => {
      promises.push(this.getLevelExerciseCount(levelId));
    });
    await Promise.all(promises);
  }

  // Проверяем ответ пользователя
  checkAnswer(userFormula) {
    const exercise = this.getCurrentExercise();
    if (!exercise) return false;

    const translate = this.translateFormulaToEnglish.bind(this);
    const formulas = [exercise.expectedFormula, ...(exercise.alternateFormulas || [])]
      .filter(Boolean)
      .map(f => f.trim());
 
    const expectedForms = new Set();
    formulas.forEach(formulaVariant => {
      const expectedRu = normalizeFormula(formulaVariant, 'ru', translate, true);
      if (expectedRu) expectedForms.add(expectedRu);
      const expectedEn = normalizeFormula(formulaVariant, 'en', translate, true);
      if (expectedEn) expectedForms.add(expectedEn);
    });

    const userLang = detectFormulaLanguage(userFormula);
    const userNormalized = normalizeFormula(userFormula, userLang, translate);
    if (!userNormalized) return false;

    return expectedForms.has(userNormalized);
  }

  // Переводим формулу в английский для HyperFormula
  translateFormulaToEnglish(formula) {
    const translations = {
      'СУММ': 'SUM',
      'СРЗНАЧ': 'AVERAGE',
      'МАКС': 'MAX',
      'МИН': 'MIN',
      'СЧЁТ': 'COUNT',
      'СЧЁТЗ': 'COUNTA',
      'ЕСЛИ': 'IF',
      'И': 'AND',
      'ИЛИ': 'OR',
      'НЕ': 'NOT',
      'СУММЕСЛИ': 'SUMIF',
      'СРЗНАЧЕСЛИ': 'AVERAGEIF',
      'СЧЁТЕСЛИ': 'COUNTIF',
      'СЧЁТЕСЛИМН': 'COUNTIFS',
      'СУММЕСЛИМН': 'SUMIFS',
      'СРЗНАЧЕСЛИМН': 'AVERAGEIFS',
      'МАКСЕСЛИ': 'MAXIFS',
      'МИНЕСЛИ': 'MINIFS',
      'ВПР': 'VLOOKUP',
      'ПОИСКПОЗ': 'MATCH',
      'ПРОСМОТРХ': 'XLOOKUP',
      'ИНДЕКС': 'INDEX',
      'ЕСЛИОШИБКА': 'IFERROR',
      'ЕСЛИМН': 'IFS',
      'ИСТИНА': 'TRUE',
      'ЛОЖЬ': 'FALSE'
    };
    
    let translatedFormula = formula;
    for (const [russian, english] of Object.entries(translations)) {
      const regex = new RegExp(russian, 'gi');
      translatedFormula = translatedFormula.replace(regex, english);
    }
    
    return translatedFormula;
  }

  // Сохраняем прогресс в Supabase
  async saveProgress() {
    if (!window.saveUserProgress || !currentUser) return;

    try {
      const level = this.getCurrentLevel();
      const progress = this.getLevelProgress(this.currentLevel);
      
      await window.saveUserProgress(
        currentUser.id,
        this.currentLevel,
        progress.completed,
        progress.score
      );

      console.log('Прогресс сохранен:', {
        level: this.currentLevel,
        exercise: this.currentExercise,
        completed: progress.completed,
        score: progress.score
      });
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
    }
  }

  // Загружаем прогресс из Supabase
  async loadUserProgress() {
    if (!window.getUserProgress || !currentUser) return;

    try {
      const result = await window.getUserProgress(currentUser.id);
      if (result.success && result.data) {
        this.userProgress.clear();
        
        result.data.forEach(progress => {
          this.userProgress.set(progress.level, {
            completed: progress.completed,
            score: progress.score,
            updatedAt: progress.updated_at
          });
          
          if (progress.completed) {
            this.completedLevels.add(progress.level);
          }

        const completedByScore = progress.score ? Math.floor(progress.score / 100) : 0;
        if (completedByScore > 0) {
          if (!this.completedExercises.has(progress.level)) {
            this.completedExercises.set(progress.level, new Set());
          }
          const set = this.completedExercises.get(progress.level);
          for (let i = 0; i < completedByScore; i++) {
            set.add(i);
          }
        }
        });

        // Определяем последний завершенный уровень
        const completedLevels = Array.from(this.completedLevels).sort((a, b) => b - a);
        if (completedLevels.length > 0) {
          const lastCompleted = completedLevels[0];
          // Не ограничиваем unlockedLevels - все уровни должны быть открыты
          // Просто убеждаемся, что все уровни разблокированы
          this.levels.forEach((level, levelId) => {
            if (!this.unlockedLevels.includes(levelId)) {
              this.unlockedLevels.push(levelId);
            }
          });
          
          // Устанавливаем текущий уровень как следующий после последнего завершенного
          this.currentLevel = lastCompleted + 1;
          this.currentExercise = 0;
        } else {
          // Если нет завершенных уровней, начинаем с первого
          // Убеждаемся, что все уровни разблокированы
          this.levels.forEach((level, levelId) => {
            if (!this.unlockedLevels.includes(levelId)) {
              this.unlockedLevels.push(levelId);
            }
          });
          this.currentLevel = 1;
          this.currentExercise = 0;
        }

        console.log('Прогресс загружен:', this.userProgress);
      }
    } catch (error) {
      console.error('Ошибка загрузки прогресса:', error);
    }
  }

  // Сбрасываем прогресс (для тестирования)
  resetProgress() {
    this.completedLevels.clear();
    // Разблокируем все зарегистрированные уровни
    this.unlockedLevels = Array.from(this.levels.keys());
    this.currentLevel = 1;
    this.currentExercise = 0;
    this.userProgress.clear();
    this.completedExercises.clear();
    console.log('Прогресс сброшен');
  }
}

// Создаем глобальный менеджер уровней
window.levelManager = new LevelManager();
