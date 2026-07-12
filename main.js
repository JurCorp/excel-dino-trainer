// main.js — минимальный пример с HyperFormula
// HyperFormula доступен как window.HyperFormula (мы подключили CDN в index.html)

// Импорты будут загружены через script теги в HTML
// import { createClient } from '@supabase/supabase-js'
// import { getUsers, saveUserProgress, getUserProgress, createUserProfile, updateUserLanguage } from './logic.js'

// Глобальные переменные для языка и состояния
let currentLanguage = 'ru'; // 'ru' или 'en'
let currentUser = null;
let currentLevel = 1;

// Тексты интерфейса на разных языках
const texts = {
  ru: {
    title: 'Jurassic Excel — Уровень 1',
    task: 'Посчитай сумму продаж столбца B (ячейки B2..B4).',
    formulaPlaceholder: '',
    checkButton: 'Проверить',
    resetButton: 'Сбросить',
    nextButton: 'Следующий уровень →',
    enterFormula: 'Введите формулу, начиная с =',
    correct: 'Правильно! Результат:',
    incorrect: 'Неправильно. Твой результат:',
    expected: 'ожидалось:',
    formulaError: 'Ошибка в формуле или ссылках. Проверь синтаксис.',
    levelComplete: 'Отлично — модуль пройден. Переходим к уровню 2 (заглушка).',
    authTitle: 'Вход или регистрация',
    signUp: 'Регистрация',
    signIn: 'Войти',
    registrationSuccess: 'Регистрация успешна! Проверь почту.',
    welcome: 'Добро пожаловать!',
    authError: 'Ошибка:',
    loginError: 'Ошибка входа:',
    exercise: 'Упражнение',
    of: 'из',
    hintButton: 'Подсказка',
    exercises: 'упражнений',
    resultLabel: 'Результат',
    progress: 'Прогресс'
  },
  en: {
    title: 'Jurassic Excel — Level 1',
    task: 'Calculate the sum of sales in column B (cells B2..B4).',
    formulaPlaceholder: '',
    checkButton: 'Check',
    resetButton: 'Reset',
    nextButton: 'Next level →',
    enterFormula: 'Enter a formula starting with =',
    correct: 'Correct! Result:',
    incorrect: 'Incorrect. Your result:',
    expected: 'expected:',
    formulaError: 'Error in formula or references. Check syntax.',
    levelComplete: 'Great — module completed. Moving to level 2 (placeholder).',
    authTitle: 'Sign in or register',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    registrationSuccess: 'Registration successful! Check your email.',
    welcome: 'Welcome!',
    authError: 'Error:',
    loginError: 'Login error:',
    exercise: 'Exercise',
    of: 'of',
    hintButton: 'Hint',
    exercises: 'exercises',
    resultLabel: 'Result',
    progress: 'Progress'
  }
};

// Функция для перевода русских формул в английские
function translateFormulaToEnglish(formula) {
  if (currentLanguage === 'en') return formula;
  
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
    'НЕ': 'NOT'
  };
  
  let translatedFormula = formula;
  for (const [russian, english] of Object.entries(translations)) {
    const regex = new RegExp(russian, 'gi');
    translatedFormula = translatedFormula.replace(regex, english);
  }
  
  return translatedFormula;
}

// Функция для перевода английских формул в русские
function translateFormulaToRussian(formula) {
  if (currentLanguage === 'ru') return formula;
  
  const translations = {
    'SUM': 'СУММ',
    'AVERAGE': 'СРЗНАЧ',
    'MAX': 'МАКС',
    'MIN': 'МИН',
    'COUNT': 'СЧЁТ',
    'COUNTA': 'СЧЁТЗ',
    'IF': 'ЕСЛИ',
    'AND': 'И',
    'OR': 'ИЛИ',
    'NOT': 'НЕ'
  };
  
  let translatedFormula = formula;
  for (const [english, russian] of Object.entries(translations)) {
    const regex = new RegExp(english, 'gi');
    translatedFormula = translatedFormula.replace(regex, russian);
  }
  
  return translatedFormula;
}

// Функция для обновления интерфейса в зависимости от языка
function updateInterface() {
  const t = texts[currentLanguage];
  
  // Обновляем заголовки уровней
  const levelTitle = document.getElementById('level-title');
  if (levelTitle) {
    levelTitle.textContent = t.title || 'Jurassic Excel';
  }
  
  // Обновляем задачу
  const taskText = document.getElementById('task-text');
  if (taskText) {
    taskText.textContent = t.task || 'Задача';
  }
  
  // Обновляем placeholder формулы
  const userFormula = document.getElementById('userFormula');
  if (userFormula) {
    userFormula.placeholder = t.formulaPlaceholder || 'Введите формулу';
  }
  
  // Обновляем заголовки аутентификации
  const authSection = document.querySelector('#auth-section');
  if (authSection) {
    authSection.querySelector('h2').textContent = t.authTitle;
    authSection.querySelector('#signUpBtn').textContent = t.signUp;
    authSection.querySelector('#signInBtn').textContent = t.signIn;
  }
  
  // Обновляем активную кнопку языка
  document.querySelectorAll('.lang-switch-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = currentLanguage === 'ru' ? 
    document.querySelector('#switch-to-ru') : 
    document.querySelector('#switch-to-en');
  
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Старый обработчик удален - функции теперь глобальные

async function signUp() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('authMessage');
  const t = texts[currentLanguage];
  
  if (!email || !password) {
    msg.textContent = currentLanguage === 'ru' ? 'Пожалуйста, введите email и пароль' : 'Please enter email and password';
    msg.style.color = 'red';
    return;
  }
  
  if (!window.supabaseClient) {
    msg.textContent = currentLanguage === 'ru' ? 'Ошибка: Supabase не инициализирован. Перезагрузите страницу.' : 'Error: Supabase not initialized. Please reload the page.';
    msg.style.color = 'red';
    return;
  }
  
  try {
    const { data, error } = await window.supabaseClient.auth.signUp({ email, password });
    
  if (error) {
      msg.textContent = t.authError + ' ' + error.message;
    msg.style.color = 'red';
  } else {
      msg.textContent = t.registrationSuccess;
    msg.style.color = 'green';
      
      // Создаем профиль пользователя
      if (data.user && window.createUserProfile) {
        await window.createUserProfile(data.user.id, email, currentLanguage);
      }
    }
  } catch (err) {
    msg.textContent = currentLanguage === 'ru' ? 'Ошибка подключения. Проверьте интернет-соединение.' : 'Connection error. Check your internet connection.';
    msg.style.color = 'red';
    console.error('Ошибка при регистрации:', err);
  }
}

async function signIn() {
  console.log('signIn function called');
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('authMessage');
  const t = texts[currentLanguage];
  
  console.log('Email:', email, 'Password length:', password ? password.length : 0);
  
  if (!email || !password) {
    msg.textContent = currentLanguage === 'ru' ? 'Пожалуйста, введите email и пароль' : 'Please enter email and password';
    msg.style.color = 'red';
    return;
  }
  
  // Используем window.supabaseClient напрямую
  console.log('Checking supabaseClient:', window.supabaseClient);
  if (!window.supabaseClient) {
    msg.textContent = currentLanguage === 'ru' ? 'Ошибка: Supabase не инициализирован. Перезагрузите страницу.' : 'Error: Supabase not initialized. Please reload the page.';
    msg.style.color = 'red';
    console.error('Supabase client не найден');
    return;
  }
  
  try {
    console.log('Attempting sign in...');
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
    console.log('Sign in result:', { data: data ? 'success' : 'no data', error });
    
  if (error) {
      let errorMsg = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMsg = currentLanguage === 'ru' ? 'Неверный email или пароль' : 'Invalid email or password';
      }
      msg.textContent = t.loginError + ' ' + errorMsg;
    msg.style.color = 'red';
      console.error('Ошибка входа:', error);
  } else {
      currentUser = data.user;
      msg.textContent = t.welcome;
    msg.style.color = 'green';
      
      // Загружаем прогресс пользователя
      await loadUserProgress();
      
      // Показываем экран выбора уровней
      await showLevelSelection();
      
      console.log('Пользователь вошел, показываем экран выбора уровней');
    }
  } catch (err) {
    msg.textContent = currentLanguage === 'ru' ? 'Ошибка подключения. Проверьте интернет-соединение.' : 'Connection error. Check your internet connection.';
    msg.style.color = 'red';
    console.error('Ошибка при входе:', err);
  }
}

async function handleForgotPassword() {
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('authMessage');
  
  if (!email) {
    msg.textContent = currentLanguage === 'ru' ? 'Пожалуйста, введите email для восстановления пароля' : 'Please enter your email to reset password';
    msg.style.color = 'red';
    return;
  }
  
  if (!window.supabaseClient) {
    msg.textContent = currentLanguage === 'ru' ? 'Ошибка: Supabase не инициализирован' : 'Error: Supabase not initialized';
    msg.style.color = 'red';
    return;
  }
  
  try {
    const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    
    if (error) {
      msg.textContent = currentLanguage === 'ru' ? 'Ошибка: ' + error.message : 'Error: ' + error.message;
      msg.style.color = 'red';
    } else {
      msg.textContent = currentLanguage === 'ru' ? 'Письмо для восстановления пароля отправлено на ' + email : 'Password reset email sent to ' + email;
      msg.style.color = 'green';
    }
  } catch (err) {
    msg.textContent = currentLanguage === 'ru' ? 'Ошибка при отправке письма' : 'Error sending email';
    msg.style.color = 'red';
    console.error('Ошибка восстановления пароля:', err);
  }
}

async function logout() {
  try {
    if (window.supabaseClient) {
      await window.supabaseClient.auth.signOut();
    }
  } catch (error) {
    console.error('Ошибка при выходе из Supabase:', error);
  }

  currentUser = null;
  const msg = document.getElementById('authMessage');
  if (msg) {
    msg.textContent = '';
  }
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.value = '';
  }
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.value = '';
  }
  if (window.levelManager) {
    window.levelManager.currentLevel = 1;
    window.levelManager.currentExercise = 0;
  }
  showAuthScreen();
}

// Функция для загрузки прогресса пользователя
async function loadUserProgress() {
  if (!currentUser) return;
  
  try {
    // Загружаем прогресс через levelManager
    await window.levelManager.loadUserProgress();
    console.log('Прогресс пользователя загружен');
  } catch (error) {
    console.error('Error loading user progress:', error);
  }
}

// Функция для сохранения прогресса при завершении уровня
async function saveProgress(level, completed, score = 100) {
  if (!currentUser) return;
  
  try {
    if (window.saveUserProgress) {
      await window.saveUserProgress(currentUser.id, level, completed, score);
      console.log('Progress saved successfully');
    }
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}


// Инициализация уровней
function initLevels() {
  // Проверяем, что levelManager доступен
  if (window.levelManager) {
    // Очищаем перед регистрацией — убирает дубликаты при повторном вызове
    window.levelManager.levels.clear();
    window.levelManager.unlockedLevels = [];
    window.levelManager.levelExerciseCounts.clear();
    // Регистрируем уровни
    if (typeof Level1 !== 'undefined') {
      window.levelManager.registerLevel(Level1);
    }
    if (typeof Level2 !== 'undefined') {
      window.levelManager.registerLevel(Level2);
    }
    if (typeof Level3 !== 'undefined') {
      window.levelManager.registerLevel(Level3);
    }
    if (typeof Level4 !== 'undefined') {
      window.levelManager.registerLevel(Level4);
    }
    if (typeof Level5 !== 'undefined') {
      window.levelManager.registerLevel(Level5);
    }
    if (typeof Level6 !== 'undefined') {
      window.levelManager.registerLevel(Level6);
    }
    if (typeof Level7 !== 'undefined') {
      window.levelManager.registerLevel(Level7);
    }
    if (typeof Level8 !== 'undefined') {
      window.levelManager.registerLevel(Level8);
    }
    if (typeof Level9 !== 'undefined') {
      window.levelManager.registerLevel(Level9);
    }
    if (typeof Level10 !== 'undefined') {
      window.levelManager.registerLevel(Level10);
    }
    if (typeof Level11 !== 'undefined') {
      window.levelManager.registerLevel(Level11);
    }
    if (typeof Level12 !== 'undefined') {
      window.levelManager.registerLevel(Level12);
    }
    console.log('Уровни инициализированы');
      } else {
    console.error('levelManager не доступен!');
  }
}

function renderTable() {
  const wrap = document.getElementById('tableWrap');
  if (!wrap) return;

  const exercise = window.levelManager.getCurrentExercise();
  if (!exercise) {
    wrap.innerHTML = '';
    return;
  }
  
  // Для уровня 12 (сводные таблицы) не показываем таблицу - только информационный контент
  const level = window.levelManager.getCurrentLevel();
  if (level && level.id === 12) {
    wrap.innerHTML = '';
    return;
  }
  
  if (!Array.isArray(exercise.data) || exercise.data.length === 0) {
    wrap.innerHTML = '';
    return;
  }

  renderLevelTable(exercise.data);
}

function getExpectedValue() {
  // ожидаемая формула заранее записана в ячейке D2 (row=1,col=3) в sheetData
  try {
    return window.HyperFormula.getCellValue({sheet:0, row:1, col:3});
  } catch(e){
    return null;
  }
}

function onCheck() {
  const formulaInput = document.getElementById('userFormula');
  const resultBox = document.getElementById('result');
  const explanationBox = document.getElementById('explanation');
  const userFormula = autoCloseFormulaParentheses(formulaInput.value);
  formulaInput.value = userFormula;
  const t = texts[currentLanguage];

  if (!userFormula || !userFormula.startsWith('=')) {
    resultBox.textContent = t.enterFormula;
    resultBox.style.color = 'red';
    return;
  }

  try {
    const exercise = window.levelManager.getCurrentExercise();
    if (!exercise) {
      resultBox.style.color = 'red';
      resultBox.textContent = 'Ошибка: упражнение не найдено';
      return;
    }
    
    let isCorrect = false;
    try {
      isCorrect = window.levelManager.checkAnswer(userFormula);
    } catch (checkError) {
      console.error('Ошибка в checkAnswer:', checkError);
      resultBox.style.color = 'red';
      resultBox.textContent = t.formulaError;
      return;
    }

    if (isCorrect) {
      resultBox.style.color = 'green';
      resultBox.classList.remove('error');
      resultBox.classList.add('success');
      resultBox.textContent = `${t.correct} Формула: ${userFormula}`;
      
      // Отмечаем упражнение как завершенное
      const level = window.levelManager.getCurrentLevel();
      if (level) {
        window.levelManager.markExerciseCompleted(level.id, window.levelManager.currentExercise);
      }
      
      const computedValue = evaluateFormulaForExercise(userFormula, exercise);
      if (computedValue !== null && !Number.isNaN(computedValue)) {
        displayComputedResult(computedValue);
        if (exercise.resultCell) {
          updateResultCell(exercise.resultCell, computedValue);
        }
      } else {
        displayComputedResult(null);
      }

      // Показываем объяснение
      if (exercise.explanation) {
        explanationBox.textContent = exercise.explanation[currentLanguage];
        explanationBox.style.display = 'block';
      }
      
      // Обновляем только кнопки навигации, не очищая результат
      if (updateNavigationButtons) {
        updateNavigationButtons().catch(console.error);
      }
      
    } else {
      resultBox.style.color = 'red';
      resultBox.classList.remove('success');
      resultBox.classList.add('error');
      // Находим русскую версию формулы из alternateFormulas
      let russianFormula = '';
      if (exercise.alternateFormulas) {
        const russianMatch = exercise.alternateFormulas.find(f => 
          f.includes('СУММ') || f.includes('СРЗНАЧ') || f.includes('МАКС') || 
          f.includes('МИН') || f.includes('ЕСЛИ') || f.includes('ВПР') || 
          f.includes('ПРОСМОТРХ') || f.includes('ИНДЕКС') || f.includes('ПОИСКПОЗ')
        );
        if (russianMatch) {
          russianFormula = russianMatch;
        }
      }
      
      // Находим английскую версию с запятыми
      let englishFormula = exercise.expectedFormula;
      if (exercise.alternateFormulas) {
        const englishMatch = exercise.alternateFormulas.find(f => 
          !f.includes(';') && (f.includes('SUM') || f.includes('AVERAGE') || 
          f.includes('MAX') || f.includes('MIN') || f.includes('IF') || 
          f.includes('VLOOKUP') || f.includes('XLOOKUP') || f.includes('INDEX') || 
          f.includes('MATCH') || f.includes('SUMIFS') || f.includes('AVERAGEIFS'))
        );
        if (englishMatch && !englishMatch.includes(';')) {
          englishFormula = englishMatch;
        }
      }
      
      // Формируем сообщение с обеими версиями
      let expectedText = englishFormula;
      if (russianFormula && russianFormula !== englishFormula) {
        expectedText = `${englishFormula} или ${russianFormula}`;
      }
      
      resultBox.textContent = `${t.incorrect} Твоя формула: ${userFormula} — ${t.expected} ${expectedText}`;
      explanationBox.style.display = 'none';
      displayComputedResult(null);
      if (exercise.resultCell) {
        updateResultCell(exercise.resultCell, null);
      }
    }

    // Сохраняем прогресс
    window.levelManager.saveProgress();
    
  } catch (err) {
    resultBox.style.color = 'red';
    resultBox.textContent = t.formulaError;
    console.error('Ошибка в onCheck:', err);
    console.error('Стек ошибки:', err.stack);
    console.error('Формула пользователя:', userFormula);
    console.error('Текущее упражнение:', window.levelManager.getCurrentExercise());
    console.error('Текущий уровень:', window.levelManager.getCurrentLevel());
  }
}

function onReset() {
  document.getElementById('userFormula').value = '';
  const resultEl = document.getElementById('result');
  resultEl.textContent = '';
  resultEl.classList.remove('success', 'error');
  document.getElementById('explanation').style.display = 'none';
  displayComputedResult(null);
  const exercise = window.levelManager.getCurrentExercise();
  if (exercise && exercise.resultCell) {
    updateResultCell(exercise.resultCell, null);
  }
}


function autoCloseFormulaParentheses(rawFormula) {
  let formula = rawFormula.trim();
  if (!formula.startsWith('=')) return formula;
  const opens = (formula.match(/\(/g) || []).length;
  const closes = (formula.match(/\)/g) || []).length;
  if (opens > closes) {
    formula += ')'.repeat(opens - closes);
  }
  return formula;
}

function setupFormulaInputHelpers() {
  const input = document.getElementById('userFormula');
  if (!input || input.dataset.helpersAttached === 'true') return;
  input.dataset.helpersAttached = 'true';
  input.addEventListener('blur', () => {
    const fixed = autoCloseFormulaParentheses(input.value);
    if (fixed !== input.value.trim()) input.value = fixed;
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      input.value = autoCloseFormulaParentheses(input.value);
      onCheck();
    }
  });
}

function onHint() {
  const exercise = window.levelManager.getCurrentExercise();
  if (!exercise) return;
  
  const hintParts = [];
  if (exercise.hint?.ru) hintParts.push(exercise.hint.ru);
  if (exercise.hint?.en) hintParts.push(exercise.hint.en);
  if (!hintParts.length) {
    alert(currentLanguage === 'ru' ? 'Подсказка недоступна для этого упражнения.' : 'No hint available for this exercise.');
    return;
  }
  alert(hintParts.join(' / '));
}

async function nextExercise() {
  const level = window.levelManager.getCurrentLevel();
  if (!level) return;
  
  // Получаем количество упражнений правильно
  const exerciseCount = level.exercises && Array.isArray(level.exercises) ? level.exercises.length : await window.levelManager.getLevelExerciseCount(level.id);
  const isLastExercise = window.levelManager.currentExercise >= exerciseCount - 1;
  
  // Если это последнее упражнение, не переходим дальше
  if (isLastExercise) {
    // Обновляем интерфейс, чтобы показать кнопку "Завершить уровень"
    await updateExerciseInterface();
    return;
  }
  
  if (window.levelManager.nextExercise()) {
    await updateExerciseInterface();
  }
}

async function prevExercise() {
  if (window.levelManager.currentExercise > 0) {
    window.levelManager.currentExercise--;
    await updateExerciseInterface();
  }
}

async function completeLevel() {
  const t = texts[currentLanguage];
  
  // Разблокируем следующий уровень
  if (window.levelManager) {
    const level = window.levelManager.getCurrentLevel();
    if (level) {
      // Отмечаем все упражнения как завершенные
      const exerciseCount = await window.levelManager.getLevelExerciseCount(level.id);
      for (let i = 0; i < exerciseCount; i++) {
        window.levelManager.markExerciseCompleted(level.id, i);
      }
      await window.levelManager.markLevelCompleted(level.id);
      window.levelManager.unlockNextLevel();
      await window.levelManager.saveProgress();
      await updateProgressBar();
    }
  }
  
  const message = document.getElementById('level-complete-message');
  if (message) {
    message.style.display = 'flex';
  } else {
    await showLevelSelection();
  }
}

async function prevLevel() {
  if (await window.levelManager.previousLevel()) {
    updateLevelInterface();
    await updateExerciseInterface();
  }
}

async function nextLevel() {
  if (await window.levelManager.nextLevel()) {
    updateLevelInterface();
    await updateExerciseInterface();
  }
}

async function backToLevels() {
  await showLevelSelection();
}

async function resetProgress() {
  if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
    window.levelManager.resetProgress();
    // Очищаем localStorage
    localStorage.removeItem('userProgress');
    localStorage.removeItem('completedLevels');
    localStorage.removeItem('completedExercises');
    // Очищаем в Supabase если есть пользователь
    if (currentUser && window.supabaseClient) {
      try {
        const { error } = await window.supabaseClient
          .from('user_progress')
          .delete()
          .eq('user_id', currentUser.id);
        if (error) console.error('Ошибка удаления прогресса из Supabase:', error);
      } catch (err) {
        console.error('Ошибка при очистке прогресса:', err);
      }
    }
    if (window.levelManager && typeof window.levelManager.preloadLevelExerciseCounts === 'function') {
      await window.levelManager.preloadLevelExerciseCounts();
    }
    await loadLevelsList();
    await updateProgressBar();
    alert('Прогресс полностью очищен!');
  }
}

// Функция показа экрана выбора уровней
async function showLevelSelection() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('level-selection').style.display = 'flex';
  document.querySelector('.wrap').style.display = 'none';
  
  // Убираем класс уровня 12 при возврате в меню
  document.body.classList.remove('level-12');
  
  // Загружаем список уровней
  await loadLevelsList();
  await updateProgressBar();
}

let levelsListRenderSeq = 0;

// Функция загрузки списка уровней
async function loadLevelsList() {
  const levelsGrid = document.getElementById('levels-grid');
  if (!levelsGrid) return;
  const renderSeq = ++levelsListRenderSeq;

  // Очищаем сразу, чтобы пользователь не видел старое/дубли в момент перерендера
  levelsGrid.innerHTML = '';

  if (window.levelManager && typeof window.levelManager.preloadLevelExerciseCounts === 'function') {
    await window.levelManager.preloadLevelExerciseCounts();
  }

  const levels = window.levelManager.getAllLevels();
  const t = texts[currentLanguage];

  const pointsLabel = currentLanguage === 'ru' ? 'очков' : 'points';
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < levels.length; index++) {
    if (renderSeq !== levelsListRenderSeq) return; // Есть более свежий рендер — этот устарел
    const level = levels[index];
    const levelItem = document.createElement('div');
    levelItem.className = 'level-item';

    if (!level) {
      continue;
    }

    const defaultsMap = window.DEFAULT_LEVEL_EXERCISE_COUNTS || {};

    let totalExercises = typeof window.levelManager.getLevelExerciseCount === 'function'
      ? await window.levelManager.getLevelExerciseCount(level.id)
      : (level.totalExercises || 0);
    if ((!totalExercises || totalExercises === 0) && defaultsMap[level.id]) {
      totalExercises = defaultsMap[level.id];
    }

    const completedExercises = typeof window.levelManager.getCompletedExerciseCount === 'function'
      ? window.levelManager.getCompletedExerciseCount(level.id)
      : (level.currentExercise || 0);

    const score = typeof window.levelManager.getLevelScore === 'function'
      ? window.levelManager.getLevelScore(level.id)
      : (level.score || 0);

    // Проверяем unlockCondition из данных уровня
    let unlocked = level.unlocked !== undefined
      ? level.unlocked
      : (window.levelManager ? window.levelManager.isLevelUnlocked(level.id) : true);
    
    // Демо-режим: все уровни доступны.
    if (false && level.unlockCondition && level.unlockCondition.type === "none") {
      unlocked = false;
    }

    const isCompleted = totalExercises > 0 && completedExercises >= totalExercises;

    let statusClass = '';
    let statusText = '';

    if (isCompleted) {
      statusClass = 'completed';
      statusText = currentLanguage === 'ru' ? 'Завершен' : 'Completed';
    } else if (!unlocked) {
      statusClass = 'locked';
      statusText = currentLanguage === 'ru' ? 'Заблокирован' : 'Locked';
    } else {
      statusText = currentLanguage === 'ru' ? 'Доступен' : 'Available';
    }

    if (statusClass) {
      levelItem.classList.add(statusClass);
    }

    const displayNumber = index + 1;
    const totalDisplay = totalExercises || 0;
    const completedDisplay = completedExercises > totalDisplay ? totalDisplay : completedExercises;

    levelItem.innerHTML = `
      <div class="level-number">${displayNumber}</div>
      <div class="level-title">${level.title && level.title[currentLanguage] ? level.title[currentLanguage] : `Уровень ${level.id}`}</div>
      <div class="level-description">${level.description && level.description[currentLanguage] ? level.description[currentLanguage] : ''}</div>
      <div class="level-status">
        <span class="level-score">${score} ${pointsLabel}</span>
      </div>
      <div class="level-status">
        <span>${statusText}</span>
        <span>${completedDisplay}/${totalDisplay} ${t.exercises || 'упражнений'}</span>
      </div>
    `;

    if (unlocked) {
      levelItem.style.cursor = 'pointer';
      levelItem.addEventListener('click', () => startLevel(level.id));
    } else {
      levelItem.style.cursor = 'not-allowed';
      levelItem.style.opacity = '0.6';
    }

    fragment.appendChild(levelItem);
  }

  if (renderSeq !== levelsListRenderSeq) return;
  levelsGrid.innerHTML = '';
  levelsGrid.appendChild(fragment);
}

// Функция обновления прогресс-бара
async function updateProgressBar() {
  try {
    if (window.levelManager && typeof window.levelManager.preloadLevelExerciseCounts === 'function') {
      await window.levelManager.preloadLevelExerciseCounts();
    }
    const progress = window.levelManager.getOverallProgress();
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const t = texts[currentLanguage];
    
    if (progressFill && progressText && progress) {
      progressFill.style.width = `${progress.completionPercentage || 0}%`;
      progressText.textContent = `Прогресс: ${progress.completionPercentage || 0}% (${progress.completedExercises || 0}/${progress.totalExercises || 0} упражнений)`;
    }
  } catch (error) {
    console.error('Ошибка обновления прогресс-бара:', error);
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    if (progressFill && progressText) {
      progressFill.style.width = '0%';
      progressText.textContent = `${texts[currentLanguage].progress || 'Прогресс'}: 0%`;
    }
  }
}

// Функция начала уровня
async function startLevel(levelId) {
  try {
    // Все уровни открыты в демо-режиме.
    await window.levelManager.loadLevel(levelId);
    
    document.getElementById('level-selection').style.display = 'none';
    document.querySelector('.wrap').style.display = 'block';
    
    // Добавляем класс для уровня 12 для специальных стилей
    if (levelId === 12) {
      document.body.classList.add('level-12');
    } else {
      document.body.classList.remove('level-12');
    }
    
    // Обновляем интерфейс для нового уровня
    updateLevelInterface();
    await updateExerciseInterface();
    
    console.log(`Начат уровень ${levelId}`);
  } catch (error) {
    console.error('Ошибка загрузки уровня:', error);
    alert('Ошибка загрузки уровня');
  }
}

// Функция обновления интерфейса уровня
function updateLevelInterface() {
  const level = window.levelManager.getCurrentLevel();
  if (!level) return;
  
  // Обновляем заголовок (только название уровня)
  document.getElementById('level-title').textContent = 
    level.title[currentLanguage] || `Уровень ${level.id}`;
}

function renderLevelTable(rawData) {
  const wrap = document.getElementById('tableWrap');
  if (!wrap) return;

  wrap.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'excel-table';

  const sourceData = Array.isArray(rawData) ? rawData : [];
  const headerDataRow = Array.isArray(sourceData[0]) ? sourceData[0] : [];
  const lastHeaderCell = headerDataRow[headerDataRow.length - 1];
  const shouldTrimLastColumn =
    typeof lastHeaderCell === 'string' &&
    /ожидаем|expectedformula/i.test(lastHeaderCell);

  const filteredData = shouldTrimLastColumn
    ? sourceData.map(row => (Array.isArray(row) ? row.slice(0, -1) : row))
    : sourceData;

  const maxCols = 7; // фиксируем A-G

  const headerTr = document.createElement('tr');
  const emptyHeader = document.createElement('th');
  emptyHeader.className = 'row-header';
  headerTr.appendChild(emptyHeader);

  for (let c = 0; c < maxCols; c++) {
    const th = document.createElement('th');
    th.className = 'col-header';
    th.textContent = String.fromCharCode(65 + c); // A, B, C ...
    headerTr.appendChild(th);
  }
  table.appendChild(headerTr);

  const totalRows = Math.max(10, filteredData.length);

  for (let r = 0; r < totalRows; r++) {
    const tr = document.createElement('tr');

    const rowNumCell = document.createElement('td');
    rowNumCell.className = 'row-header';
    rowNumCell.textContent = r + 1;
    tr.appendChild(rowNumCell);

    const rowData = filteredData[r] || [];
    for (let c = 0; c < maxCols; c++) {
      const td = document.createElement('td');
      td.textContent = rowData[c] !== undefined ? rowData[c] : '';
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  wrap.appendChild(table);
}

// Функция обновления интерфейса упражнения
async function updateExerciseInterface() {
  const exercise = window.levelManager.getCurrentExercise();
  if (!exercise) return;
  ensureExerciseResultCell(exercise);
  
  const level = window.levelManager.getCurrentLevel();
  if (!level) return;
  const t = texts[currentLanguage];
  
  // Обновляем задачу
  const taskText = document.getElementById('task-text');
  if (taskText) {
    const taskContent = exercise.task[currentLanguage] || exercise.task.ru || '';
    // Поддерживаем markdown-форматирование
    let htmlContent = formatMarkdown(taskContent);
    
    // Добавляем изображение если есть
    if (exercise.imageUrl) {
      htmlContent = `<img src="${exercise.imageUrl}" alt="Пример сводной таблицы" style="max-width: 100%; height: auto; margin: 15px 0; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />` + htmlContent;
    }
    
    taskText.innerHTML = htmlContent;
  }
  
  // Для уровня 12 скрываем таблицу и поле ввода формулы
  const isInfoLevel = level && level.id === 12;
  const tableWrap = document.getElementById('tableWrap');
  const userFormulaInput = document.getElementById('userFormula');
  const checkBtn = document.getElementById('checkBtn');
  const resetBtn = document.getElementById('resetBtn');
  const hintBtn = document.getElementById('hintBtn');
  
  if (isInfoLevel) {
    // Скрываем таблицу
    if (tableWrap) tableWrap.style.display = 'none';
    // Скрываем поле ввода формулы и кнопки проверки, но НЕ скрываем кнопки навигации
    if (userFormulaInput) userFormulaInput.style.display = 'none';
    if (checkBtn) checkBtn.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';
    if (hintBtn) hintBtn.style.display = 'none';
    // Скрываем родительский label для поля ввода, если он есть
    const formulaLabel = document.querySelector('.card label');
    if (formulaLabel) formulaLabel.style.display = 'none';
    // Скрываем контейнер с кнопками проверки
    const buttonsContainer = document.querySelector('.card .buttons');
    if (buttonsContainer) buttonsContainer.style.display = 'none';
    // Скрываем результат и объяснение
    const resultDiv = document.getElementById('result');
    const computedResultDiv = document.getElementById('computed-result');
    const explanationDiv = document.getElementById('explanation');
    if (resultDiv) resultDiv.style.display = 'none';
    if (computedResultDiv) computedResultDiv.style.display = 'none';
    if (explanationDiv) explanationDiv.style.display = 'none';
  } else {
    // Показываем обычный интерфейс
    if (tableWrap) tableWrap.style.display = 'block';
    if (checkBtn) checkBtn.style.display = 'inline-block';
    if (resetBtn) resetBtn.style.display = 'inline-block';
    if (hintBtn) hintBtn.style.display = 'inline-block';
    if (userFormulaInput) userFormulaInput.style.display = 'block';
    const formulaLabel = document.querySelector('.card label');
    if (formulaLabel) formulaLabel.style.display = 'block';
    const buttonsContainer = document.querySelector('.card .buttons');
    if (buttonsContainer) buttonsContainer.style.display = 'flex';
    
    // Обновляем placeholder
    const placeholder = currentLanguage === 'ru'
      ? 'Например: =СУММ(B2:B8). Можно писать русские функции с ; или английские с ,'
      : 'Example: =SUM(B2:B8). Use English functions with commas.';
    if (userFormulaInput) {
      userFormulaInput.placeholder = placeholder;
    }
    
    // Рендерим таблицу
  renderTable();
    displayComputedResult(null);
    if (exercise.resultCell) {
      updateResultCell(exercise.resultCell, null);
    }
  }
  
  // Обновляем кнопки навигации
  const prevExerciseBtn = document.getElementById('prev-exercise');
  const nextExerciseBtn = document.getElementById('next-exercise');
  const completeLevelBtn = document.getElementById('complete-level');
  
  // Получаем количество упражнений правильно
  const exerciseCount = level.exercises && Array.isArray(level.exercises) ? level.exercises.length : await window.levelManager.getLevelExerciseCount(level.id);
  const isLastExercise = window.levelManager.currentExercise >= exerciseCount - 1;
  
  if (prevExerciseBtn) {
    prevExerciseBtn.disabled = window.levelManager.currentExercise <= 0;
    // Для уровня 12 всегда показываем кнопки навигации
    if (isInfoLevel) {
      prevExerciseBtn.style.display = window.levelManager.currentExercise <= 0 ? 'none' : 'inline-block';
    } else {
      prevExerciseBtn.style.display = 'inline-block';
    }
  }
  
  if (nextExerciseBtn) {
    nextExerciseBtn.disabled = isLastExercise;
    // Для уровня 12 всегда показываем кнопки навигации
    if (isInfoLevel) {
      nextExerciseBtn.style.display = isLastExercise ? 'none' : 'inline-block';
    } else {
      nextExerciseBtn.style.display = isLastExercise ? 'none' : 'inline-block';
    }
  }
  
  if (completeLevelBtn) {
    completeLevelBtn.style.display = isLastExercise ? 'inline-block' : 'none';
  }
  
  // Очищаем результат и объяснение
  const resultEl = document.getElementById('result');
  resultEl.textContent = '';
  resultEl.classList.remove('success', 'error');
  document.getElementById('explanation').style.display = 'none';
  document.getElementById('userFormula').value = '';
  
  // Скрываем сообщение о завершении уровня
  const levelCompleteMessage = document.getElementById('level-complete-message');
  if (levelCompleteMessage) {
    levelCompleteMessage.style.display = 'none';
  }
}

// Функция для обновления только кнопок навигации (без очистки результатов)
async function updateNavigationButtons() {
  const level = window.levelManager.getCurrentLevel();
  if (!level) return;
  
  const prevExerciseBtn = document.getElementById('prev-exercise');
  const nextExerciseBtn = document.getElementById('next-exercise');
  const completeLevelBtn = document.getElementById('complete-level');
  
  // Получаем количество упражнений правильно
  const exerciseCount = level.exercises && Array.isArray(level.exercises) ? level.exercises.length : await window.levelManager.getLevelExerciseCount(level.id);
  const isLastExercise = window.levelManager.currentExercise >= exerciseCount - 1;
  const isInfoLevel = level && level.id === 12;
  
  if (prevExerciseBtn) {
    prevExerciseBtn.disabled = window.levelManager.currentExercise <= 0;
    if (isInfoLevel) {
      prevExerciseBtn.style.display = window.levelManager.currentExercise <= 0 ? 'none' : 'inline-block';
    } else {
      prevExerciseBtn.style.display = 'inline-block';
    }
  }
  
  if (nextExerciseBtn) {
    nextExerciseBtn.disabled = isLastExercise;
    if (isInfoLevel) {
      nextExerciseBtn.style.display = isLastExercise ? 'none' : 'inline-block';
    } else {
      nextExerciseBtn.style.display = isLastExercise ? 'none' : 'inline-block';
    }
  }
  
  if (completeLevelBtn) {
    completeLevelBtn.style.display = isLastExercise ? 'inline-block' : 'none';
  }
}

function ensureExerciseResultCell(exercise) {
  if (!exercise) return;
  if (!exercise.resultCell) {
    exercise.resultCell = 'G2';
  }
}

// Функция форматирования markdown текста для отображения
function formatMarkdown(text) {
  if (!text) return '';
  
  // Заголовки
  text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Списки
  text = text.replace(/^\* (.*$)/gim, '<li>$1</li>');
  text = text.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Выделение жирным
  text = text.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Переносы строк
  text = text.replace(/\n/g, '<br>');
  
  // Оборачиваем списки
  text = text.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  
  // Убираем дублирующиеся теги ul
  text = text.replace(/<\/ul>\s*<ul>/gim, '');
  
  return text;
}

function columnLetterToIndex(columnLetters) {
  let index = 0;
  const letters = columnLetters.toUpperCase();
  for (let i = 0; i < letters.length; i++) {
    const charCode = letters.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) { // A-Z
      index = index * 26 + (charCode - 64);
    }
  }
  return index;
}

const FORMULA_TRANSLATIONS = [
  ['СУММЕСЛИМН', 'SUMIFS'],
  ['СРЗНАЧЕСЛИМН', 'AVERAGEIFS'],
  ['СУММЕСЛИ', 'SUMIF'],
  ['СРЗНАЧЕСЛИ', 'AVERAGEIF'],
  ['СЧЁТЕСЛИМН', 'COUNTIFS'],
  ['СЧЕТЕСЛИМН', 'COUNTIFS'],
  ['СЧЁТЕСЛИ', 'COUNTIF'],
  ['СЧЕТЕСЛИ', 'COUNTIF'],
  ['СЧЁТЗ', 'COUNTA'],
  ['СЧЁТ', 'COUNT'],
  ['СЧЕТ', 'COUNT'],
  ['СУММ', 'SUM'],
  ['СРЗНАЧ', 'AVERAGE'],
  ['МАКС', 'MAX'],
  ['МИН', 'MIN'],
  ['ПРОСМОТРХ', 'XLOOKUP'],
  ['ВПР', 'VLOOKUP'],
  ['ИНДЕКС', 'INDEX'],
  ['ПОИСКПОЗ', 'MATCH'],
  ['МАКСЕСЛИ', 'MAXIFS'],
  ['МИНЕСЛИ', 'MINIFS'],
  ['ЕСЛИОШИБКА', 'IFERROR'],
  ['ЕСЛИМН', 'IFS'],
  ['ЕСЛИ', 'IF'],
  ['ИСТИНА', 'TRUE'],
  ['ЛОЖЬ', 'FALSE']
];

function standardizeFormulaForEvaluation(formula) {
  if (!formula) return '';
  const parts = formula.trim().split(/(".*?")/);
  const transformed = parts.map(part => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return part;
    }
    let segment = part.replace(/;/g, ',');
    FORMULA_TRANSLATIONS.forEach(([ru, en]) => {
      const regex = new RegExp(ru, 'gi');
      segment = segment.replace(regex, en);
    });
    return segment.toUpperCase();
  });
  return transformed.join('');
}

function columnLetterToZeroIndex(letter) {
  return columnLetterToIndex(letter) - 1;
}

function getExerciseCellValue(exercise, columnLetter, rowNumber) {
  if (!exercise || !exercise.data) return 0;
  const rowIndex = rowNumber - 1;
  const colIndex = columnLetterToZeroIndex(columnLetter);
  if (rowIndex < 0 || colIndex < 0) return 0;
  const row = exercise.data[rowIndex];
  if (!row || colIndex >= row.length) return 0;
  const rawValue = row[colIndex];
  if (typeof rawValue === 'number') {
    return rawValue;
  }
  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    if (trimmed === '') return 0;
    const numeric = parseFloat(trimmed.replace(/\s/g, '').replace(',', '.'));
    if (Number.isFinite(numeric)) {
      return numeric;
    }
    return trimmed;
  }
  return rawValue ?? 0;
}

function evaluateRange(rangeRef, exercise) {
  const parts = rangeRef.split(':');
  if (parts.length === 1) {
    const match = parts[0].match(/^([A-Z]+)(\d+)$/);
    if (!match) return 0;
    return getExerciseCellValue(exercise, match[1], parseInt(match[2], 10));
  }
  const startMatch = parts[0].match(/^([A-Z]+)(\d+)$/);
  const endMatch = parts[1].match(/^([A-Z]+)(\d+)$/);
  if (!startMatch || !endMatch) return 0;
  const startCol = columnLetterToZeroIndex(startMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endCol = columnLetterToZeroIndex(endMatch[1]);
  const endRow = parseInt(endMatch[2], 10);
  if (!Number.isFinite(startRow) || !Number.isFinite(endRow)) return 0;
  let total = 0;
  for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
    for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
      const value = getExerciseCellValue(exercise, String.fromCharCode(65 + col), row);
      total += value;
    }
  }
  return total;
}

function getRangeValues(rangeRef, exercise) {
  const parts = rangeRef.split(':');
  if (parts.length === 1) {
    const match = parts[0].match(/^([A-Z]+)(\d+)$/);
    if (!match) return [];
    const value = getExerciseCellValue(exercise, match[1], parseInt(match[2], 10));
    return typeof value === 'number' ? [value] : [];
  }
  const startMatch = parts[0].match(/^([A-Z]+)(\d+)$/);
  const endMatch = parts[1].match(/^([A-Z]+)(\d+)$/);
  if (!startMatch || !endMatch) return [];
  const startCol = columnLetterToZeroIndex(startMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endCol = columnLetterToZeroIndex(endMatch[1]);
  const endRow = parseInt(endMatch[2], 10);
  if (!Number.isFinite(startRow) || !Number.isFinite(endRow)) return [];
  const values = [];
  for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
    for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
      const value = getExerciseCellValue(exercise, String.fromCharCode(65 + col), row);
      if (typeof value === 'number' && Number.isFinite(value)) {
        values.push(value);
      }
    }
  }
  return values;
}

function splitByDelimiter(formulaSegment, delimiter) {
  const result = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < formulaSegment.length; i++) {
    const char = formulaSegment[i];
    if (char === '(') {
      depth++;
    } else if (char === ')') {
      depth--;
    }
    if (char === delimiter && depth === 0) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) {
    result.push(current);
  }
  return result;
}

function evaluateTerm(term, exercise) {
  const cleaned = term.trim();
  if (!cleaned) return 0;
  if (cleaned.startsWith('SUM(') && cleaned.endsWith(')')) {
    return evaluateSum(cleaned, exercise);
  }
  if (cleaned.startsWith('AVERAGE(') && cleaned.endsWith(')')) {
    return evaluateAverage(cleaned, exercise);
  }
  if (cleaned.startsWith('MIN(') && cleaned.endsWith(')')) {
    return evaluateMin(cleaned, exercise);
  }
  if (cleaned.startsWith('MAX(') && cleaned.endsWith(')')) {
    return evaluateMax(cleaned, exercise);
  }
  if (cleaned.startsWith('COUNT(') && cleaned.endsWith(')')) {
    return evaluateCount(cleaned, exercise);
  }
  if (cleaned.startsWith('IF(') && cleaned.endsWith(')')) {
    return evaluateIf(cleaned, exercise);
  }
  if (cleaned.startsWith('IFS(') && cleaned.endsWith(')')) {
    return evaluateIfs(cleaned, exercise);
  }
  if (cleaned.startsWith('IFERROR(') && cleaned.endsWith(')')) {
    return evaluateIferror(cleaned, exercise);
  }
  if (cleaned.startsWith('VLOOKUP(') && cleaned.endsWith(')')) {
    return evaluateVlookup(cleaned, exercise);
  }
  if (cleaned.startsWith('XLOOKUP(') && cleaned.endsWith(')')) {
    return evaluateXlookup(cleaned, exercise);
  }
  if (cleaned.startsWith('SUMIFS(') && cleaned.endsWith(')')) {
    return evaluateSumifs(cleaned, exercise);
  }
  if (cleaned.startsWith('AVERAGEIFS(') && cleaned.endsWith(')')) {
    return evaluateAverageifs(cleaned, exercise);
  }
  if (cleaned.startsWith('INDEX(') && cleaned.endsWith(')')) {
    return evaluateIndex(cleaned, exercise);
  }
  if (cleaned.startsWith('MATCH(') && cleaned.endsWith(')')) {
    return evaluateMatch(cleaned, exercise);
  }
  if (cleaned === 'TRUE') return true;
  if (cleaned === 'FALSE') return false;
  if (/^".*"$/.test(cleaned)) {
    return cleaned.slice(1, -1);
  }
  if (/^[A-Z]+\d+$/i.test(cleaned)) {
    const match = cleaned.match(/^([A-Z]+)(\d+)$/);
    return getExerciseCellValue(exercise, match[1], parseInt(match[2], 10));
  }
  if (cleaned.includes(':')) {
    return evaluateRange(cleaned, exercise);
  }
  const numeric = parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function evaluateSum(sumExpression, exercise) {
  const inner = sumExpression.slice(4, -1); // remove SUM(
  const args = splitByDelimiter(inner, ',');
  return args.reduce((total, arg) => total + evaluateExpression(arg, exercise), 0);
}

function evaluateAverage(averageExpression, exercise) {
  const inner = averageExpression.slice(8, -1); // remove AVERAGE(
  const args = splitByDelimiter(inner, ',');
  const allValues = [];
  for (const arg of args) {
    const trimmed = arg.trim();
    if (trimmed.includes(':')) {
      // Это диапазон - получаем все значения
      const rangeValues = getRangeValues(trimmed, exercise);
      allValues.push(...rangeValues);
    } else {
      // Это отдельная ячейка или число
      const value = evaluateTerm(trimmed, exercise);
      if (typeof value === 'number' && Number.isFinite(value)) {
        allValues.push(value);
      }
    }
  }
  if (allValues.length === 0) return 0;
  const sum = allValues.reduce((total, val) => total + val, 0);
  return sum / allValues.length;
}

function evaluateMin(minExpression, exercise) {
  const inner = minExpression.slice(4, -1); // remove MIN(
  const args = splitByDelimiter(inner, ',');
  const allValues = [];
  for (const arg of args) {
    const trimmed = arg.trim();
    if (trimmed.includes(':')) {
      // Это диапазон - получаем все значения
      const rangeValues = getRangeValues(trimmed, exercise);
      allValues.push(...rangeValues);
    } else {
      // Это отдельная ячейка или число
      const value = evaluateTerm(trimmed, exercise);
      if (typeof value === 'number' && Number.isFinite(value)) {
        allValues.push(value);
      }
    }
  }
  if (allValues.length === 0) return 0;
  return Math.min(...allValues);
}

function evaluateMax(maxExpression, exercise) {
  const inner = maxExpression.slice(4, -1); // remove MAX(
  const args = splitByDelimiter(inner, ',');
  const allValues = [];
  for (const arg of args) {
    const trimmed = arg.trim();
    if (trimmed.includes(':')) {
      // Это диапазон - получаем все значения
      const rangeValues = getRangeValues(trimmed, exercise);
      allValues.push(...rangeValues);
    } else {
      // Это отдельная ячейка или число
      const value = evaluateTerm(trimmed, exercise);
      if (typeof value === 'number' && Number.isFinite(value)) {
        allValues.push(value);
      }
    }
  }
  if (allValues.length === 0) return 0;
  return Math.max(...allValues);
}

function evaluateCount(countExpression, exercise) {
  const inner = countExpression.slice(6, -1); // remove COUNT(
  const args = splitByDelimiter(inner, ',');
  return args.filter(arg => {
    const value = evaluateExpression(arg, exercise);
    return typeof value === 'number' && Number.isFinite(value);
  }).length;
}

function evaluateVlookup(vlookupExpression, exercise) {
  const inner = vlookupExpression.slice(8, -1); // remove VLOOKUP(
  const args = splitByDelimiter(inner, ',');
  if (args.length < 3) return 0;
  const lookupValue = evaluateTerm(args[0].trim(), exercise);
  const tableRange = args[1].trim();
  const colIndex = parseInt(evaluateTerm(args[2].trim(), exercise), 10);
  const rangeMatch = args.length >= 4 ? parseInt(evaluateTerm(args[3].trim(), exercise), 10) : 1;
  
  // Парсим диапазон таблицы
  const rangeParts = tableRange.split(':');
  if (rangeParts.length !== 2) return 0;
  const startMatch = rangeParts[0].match(/^([A-Z]+)(\d+)$/);
  const endMatch = rangeParts[1].match(/^([A-Z]+)(\d+)$/);
  if (!startMatch || !endMatch) return 0;
  
  const startRow = parseInt(startMatch[2], 10);
  const endRow = parseInt(endMatch[2], 10);
  const startCol = columnLetterToZeroIndex(startMatch[1]);
  const endCol = columnLetterToZeroIndex(endMatch[1]);
  
  // Ищем значение в первом столбце
  // Для приблизительного поиска (rangeMatch = 1) нужно найти ближайшее меньшее или равное значение
  if (rangeMatch === 1) {
    // Приблизительный поиск - находим ближайшее меньшее или равное значение
    let bestMatch = null;
    let bestRow = null;
    for (let row = startRow; row <= endRow; row++) {
      const cellValue = getExerciseCellValue(exercise, startMatch[1], row);
      const cellNum = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
      const lookupNum = typeof lookupValue === 'number' ? lookupValue : parseFloat(lookupValue);
      if (Number.isFinite(cellNum) && Number.isFinite(lookupNum)) {
        if (cellNum <= lookupNum && (bestMatch === null || cellNum > bestMatch)) {
          bestMatch = cellNum;
          bestRow = row;
        }
      }
    }
    if (bestRow !== null) {
      const resultCol = startCol + colIndex - 1;
      const resultColLetter = String.fromCharCode(65 + resultCol);
      return getExerciseCellValue(exercise, resultColLetter, bestRow);
    }
  } else {
    // Точный поиск (rangeMatch = 0)
    for (let row = startRow; row <= endRow; row++) {
      const cellValue = getExerciseCellValue(exercise, startMatch[1], row);
      if (cellValue === lookupValue || String(cellValue) === String(lookupValue)) {
        // Возвращаем значение из нужного столбца
        const resultCol = startCol + colIndex - 1;
        const resultColLetter = String.fromCharCode(65 + resultCol);
        return getExerciseCellValue(exercise, resultColLetter, row);
      }
    }
  }
  return 0;
}

function evaluateXlookup(xlookupExpression, exercise) {
  const inner = xlookupExpression.slice(8, -1); // remove XLOOKUP(
  const args = splitByDelimiter(inner, ',');
  if (args.length < 3) return 0;
  const lookupValue = evaluateTerm(args[0].trim(), exercise);
  const lookupArray = args[1].trim();
  const returnArray = args[2].trim();
  const defaultValue = args.length >= 4 ? evaluateTerm(args[3].trim(), exercise) : null;
  
  // Парсим lookup array
  const lookupParts = lookupArray.split(':');
  if (lookupParts.length !== 2) return 0;
  const lookupStartMatch = lookupParts[0].match(/^([A-Z]+)(\d+)$/);
  const lookupEndMatch = lookupParts[1].match(/^([A-Z]+)(\d+)$/);
  if (!lookupStartMatch || !lookupEndMatch) return 0;
  
  const lookupStartRow = parseInt(lookupStartMatch[2], 10);
  const lookupEndRow = parseInt(lookupEndMatch[2], 10);
  const lookupCol = lookupStartMatch[1];
  
  // Парсим return array
  const returnParts = returnArray.split(':');
  if (returnParts.length !== 2) return 0;
  const returnStartMatch = returnParts[0].match(/^([A-Z]+)(\d+)$/);
  const returnEndMatch = returnParts[1].match(/^([A-Z]+)(\d+)$/);
  if (!returnStartMatch || !returnEndMatch) return defaultValue || 0;
  
  const returnStartRow = parseInt(returnStartMatch[2], 10);
  const returnCol = returnStartMatch[1];
  
  // Ищем значение
  for (let i = 0; i <= lookupEndRow - lookupStartRow; i++) {
    const row = lookupStartRow + i;
    const cellValue = getExerciseCellValue(exercise, lookupCol, row);
    if (cellValue === lookupValue || String(cellValue) === String(lookupValue)) {
      const returnRow = returnStartRow + i;
      return getExerciseCellValue(exercise, returnCol, returnRow);
    }
  }
  return defaultValue || 0;
}

function evaluateSumifs(sumifsExpression, exercise) {
  const inner = sumifsExpression.slice(7, -1); // remove SUMIFS(
  const args = splitByDelimiter(inner, ',');
  if (args.length < 3 || args.length % 2 === 0) return 0; // Должно быть sum_range + пары criteria_range/criteria
  
  const sumRange = args[0].trim();
  let total = 0;
  
  // Парсим sum range
  const sumParts = sumRange.split(':');
  if (sumParts.length !== 2) return 0;
  const sumStartMatch = sumParts[0].match(/^([A-Z]+)(\d+)$/);
  const sumEndMatch = sumParts[1].match(/^([A-Z]+)(\d+)$/);
  if (!sumStartMatch || !sumEndMatch) return 0;
  
  const sumStartRow = parseInt(sumStartMatch[2], 10);
  const sumEndRow = parseInt(sumEndMatch[2], 10);
  const sumCol = sumStartMatch[1];
  
  // Проверяем условия (пары range/criteria)
  const conditions = [];
  for (let i = 1; i < args.length; i += 2) {
    if (i + 1 >= args.length) break;
    const criteriaRange = args[i].trim();
    const criteria = args[i + 1].trim();
    conditions.push({ range: criteriaRange, criteria });
  }
  
  // Проверяем каждую строку
  for (let row = sumStartRow; row <= sumEndRow; row++) {
    let matchesAll = true;
    for (const condition of conditions) {
      const rangeParts = condition.range.split(':');
      if (rangeParts.length !== 2) {
        matchesAll = false;
        break;
      }
      const rangeStartMatch = rangeParts[0].match(/^([A-Z]+)(\d+)$/);
      if (!rangeStartMatch) {
        matchesAll = false;
        break;
      }
      const rangeCol = rangeStartMatch[1];
      const rangeRow = parseInt(rangeStartMatch[2], 10);
      const rowOffset = row - sumStartRow;
      const checkRow = rangeRow + rowOffset;
      
      const cellValue = getExerciseCellValue(exercise, rangeCol, checkRow);
      const criteriaValue = evaluateConditionValue(condition.criteria, cellValue);
      if (!criteriaValue) {
        matchesAll = false;
        break;
      }
    }
    if (matchesAll) {
      total += getExerciseCellValue(exercise, sumCol, row);
    }
  }
  return total;
}

function evaluateAverageifs(averageifsExpression, exercise) {
  const inner = averageifsExpression.slice(11, -1); // remove AVERAGEIFS(
  const args = splitByDelimiter(inner, ',');
  if (args.length < 3 || args.length % 2 === 0) return 0; // Должно быть average_range + пары criteria_range/criteria
  
  const averageRange = args[0].trim();
  const values = [];
  
  // Парсим average range
  const avgParts = averageRange.split(':');
  if (avgParts.length !== 2) return 0;
  const avgStartMatch = avgParts[0].match(/^([A-Z]+)(\d+)$/);
  const avgEndMatch = avgParts[1].match(/^([A-Z]+)(\d+)$/);
  if (!avgStartMatch || !avgEndMatch) return 0;
  
  const avgStartRow = parseInt(avgStartMatch[2], 10);
  const avgEndRow = parseInt(avgEndMatch[2], 10);
  const avgCol = avgStartMatch[1];
  
  // Проверяем условия (пары range/criteria)
  const conditions = [];
  for (let i = 1; i < args.length; i += 2) {
    if (i + 1 >= args.length) break;
    const criteriaRange = args[i].trim();
    const criteria = args[i + 1].trim();
    conditions.push({ range: criteriaRange, criteria });
  }
  
  // Проверяем каждую строку
  for (let row = avgStartRow; row <= avgEndRow; row++) {
    let matchesAll = true;
    for (const condition of conditions) {
      const rangeParts = condition.range.split(':');
      if (rangeParts.length !== 2) {
        matchesAll = false;
        break;
      }
      const rangeStartMatch = rangeParts[0].match(/^([A-Z]+)(\d+)$/);
      if (!rangeStartMatch) {
        matchesAll = false;
        break;
      }
      const rangeCol = rangeStartMatch[1];
      const rangeRow = parseInt(rangeStartMatch[2], 10);
      const rowOffset = row - avgStartRow;
      const checkRow = rangeRow + rowOffset;
      
      const cellValue = getExerciseCellValue(exercise, rangeCol, checkRow);
      const criteriaValue = evaluateConditionValue(condition.criteria, cellValue);
      if (!criteriaValue) {
        matchesAll = false;
        break;
      }
    }
    if (matchesAll) {
      const value = getExerciseCellValue(exercise, avgCol, row);
      if (typeof value === 'number' && Number.isFinite(value)) {
        values.push(value);
      }
    }
  }
  
  if (values.length === 0) return 0;
  const sum = values.reduce((total, val) => total + val, 0);
  return sum / values.length;
}

function evaluateConditionValue(criteria, cellValue) {
  let crit = criteria.trim();
  // Убираем кавычки если есть
  if (crit.startsWith('"') && crit.endsWith('"')) {
    crit = crit.slice(1, -1);
  }
  
  // Текстовое сравнение
  if (crit.startsWith('"') && crit.endsWith('"')) {
    const critValue = crit.slice(1, -1);
    return String(cellValue) === critValue;
  }
  
  // Сравнение дат (формат YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const cellStr = String(cellValue);
  const isDate = datePattern.test(cellStr);
  
  // Проверяем условия с датами
  if (crit.startsWith('>=')) {
    const dateStr = crit.slice(2);
    if (datePattern.test(dateStr) && isDate) {
      const cellDate = new Date(cellStr + 'T00:00:00');
      const critDate = new Date(dateStr + 'T00:00:00');
      return cellDate >= critDate;
    }
  }
  if (crit.startsWith('<=')) {
    const dateStr = crit.slice(2);
    if (datePattern.test(dateStr) && isDate) {
      const cellDate = new Date(cellStr + 'T00:00:00');
      const critDate = new Date(dateStr + 'T00:00:00');
      return cellDate <= critDate;
    }
  }
  if (crit.startsWith('>')) {
    const dateStr = crit.slice(1);
    if (datePattern.test(dateStr) && isDate) {
      const cellDate = new Date(cellStr + 'T00:00:00');
      const critDate = new Date(dateStr + 'T00:00:00');
      return cellDate > critDate;
    }
  }
  if (crit.startsWith('<')) {
    const dateStr = crit.slice(1);
    if (datePattern.test(dateStr) && isDate) {
      const cellDate = new Date(cellStr + 'T00:00:00');
      const critDate = new Date(dateStr + 'T00:00:00');
      return cellDate < critDate;
    }
  }
  // Точное совпадение дат
  if (datePattern.test(crit) && isDate) {
    return cellStr === crit;
  }
  
  // Числовые сравнения
  if (crit.startsWith('>=')) {
    const num = parseFloat(crit.slice(2));
    const cellNum = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
    return Number.isFinite(cellNum) && Number.isFinite(num) && cellNum >= num;
  }
  if (crit.startsWith('<=')) {
    const num = parseFloat(crit.slice(2));
    const cellNum = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
    return Number.isFinite(cellNum) && Number.isFinite(num) && cellNum <= num;
  }
  if (crit.startsWith('>')) {
    const num = parseFloat(crit.slice(1));
    const cellNum = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
    return Number.isFinite(cellNum) && Number.isFinite(num) && cellNum > num;
  }
  if (crit.startsWith('<')) {
    const num = parseFloat(crit.slice(1));
    const cellNum = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
    return Number.isFinite(cellNum) && Number.isFinite(num) && cellNum < num;
  }
  
  // Точное совпадение
  return String(cellValue) === crit;
}

function evaluateIndex(indexExpression, exercise) {
  const inner = indexExpression.slice(6, -1); // remove INDEX(
  const args = splitByDelimiter(inner, ',');
  if (args.length < 2) return 0;
  const arrayRange = args[0].trim();
  const rowNum = parseInt(evaluateTerm(args[1].trim(), exercise), 10);
  const colNum = args.length >= 3 ? parseInt(evaluateTerm(args[2].trim(), exercise), 10) : 1;
  
  const rangeParts = arrayRange.split(':');
  if (rangeParts.length !== 2) return 0;
  const startMatch = rangeParts[0].match(/^([A-Z]+)(\d+)$/);
  const endMatch = rangeParts[1].match(/^([A-Z]+)(\d+)$/);
  if (!startMatch || !endMatch) return 0;
  
  const startRow = parseInt(startMatch[2], 10);
  const startCol = columnLetterToZeroIndex(startMatch[1]);
  const targetRow = startRow + rowNum - 1;
  const targetCol = startCol + colNum - 1;
  const targetColLetter = String.fromCharCode(65 + targetCol);
  
  return getExerciseCellValue(exercise, targetColLetter, targetRow);
}

function evaluateMatch(matchExpression, exercise) {
  const inner = matchExpression.slice(6, -1); // remove MATCH(
  const args = splitByDelimiter(inner, ',');
  if (args.length < 2) return 0;
  const lookupValue = evaluateTerm(args[0].trim(), exercise);
  const lookupArray = args[1].trim();
  const matchType = args.length >= 3 ? parseInt(evaluateTerm(args[2].trim(), exercise), 10) : 1;
  
  const rangeParts = lookupArray.split(':');
  if (rangeParts.length !== 2) return 0;
  const startMatch = rangeParts[0].match(/^([A-Z]+)(\d+)$/);
  const endMatch = rangeParts[1].match(/^([A-Z]+)(\d+)$/);
  if (!startMatch || !endMatch) return 0;
  
  const startRow = parseInt(startMatch[2], 10);
  const endRow = parseInt(endMatch[2], 10);
  const col = startMatch[1];
  
  // Точное совпадение (matchType = 0)
  if (matchType === 0) {
    for (let i = 0; i <= endRow - startRow; i++) {
      const row = startRow + i;
      const cellValue = getExerciseCellValue(exercise, col, row);
      if (cellValue === lookupValue || String(cellValue) === String(lookupValue)) {
        return i + 1;
      }
    }
  }
  return 0;
}

function evaluateIfs(ifsExpression, exercise) {
  const inner = ifsExpression.slice(4, -1); // remove IFS(
  const args = splitByDelimiter(inner, ',');
  for (let i = 0; i < args.length; i += 2) {
    const condition = args[i];
    const valueExpr = args[i + 1];
    if (condition === undefined || valueExpr === undefined) continue;
    const conditionResult = evaluateCondition(condition, exercise);
    if (conditionResult) {
      return evaluateExpression(valueExpr, exercise);
    }
  }
  return 0;
}

function evaluateIf(ifExpression, exercise) {
  const inner = ifExpression.slice(3, -1); // remove IF(
  const args = splitByDelimiter(inner, ',');
  if (args.length < 2) return 0;
  const condition = args[0];
  const valueIfTrue = args[1];
  const valueIfFalse = args.length >= 3 ? args[2] : '""';
  const conditionResult = evaluateCondition(condition, exercise);
  const branchExpression = conditionResult ? valueIfTrue : valueIfFalse;
  return evaluateExpression(branchExpression, exercise);
}

function evaluateIferror(iferrorExpression, exercise) {
  const inner = iferrorExpression.slice(8, -1); // remove IFERROR(
  const args = splitByDelimiter(inner, ',');
  if (args.length < 2) return 0;
  const fallback = args[1];
  try {
    const value = evaluateExpression(args[0], exercise);
    if (value === 0 || value === null || value === undefined || Number.isNaN(value)) {
      return evaluateExpression(fallback, exercise);
    }
    return value;
  } catch (error) {
    return evaluateExpression(fallback, exercise);
  }
}

function evaluateCondition(conditionSegment, exercise) {
  const condition = conditionSegment.trim();
  const operators = ['>=', '<=', '<>', '!=', '>', '<', '='];
  for (const operator of operators) {
    const index = condition.indexOf(operator);
    if (index !== -1) {
      const left = condition.slice(0, index).trim();
      const right = condition.slice(index + operator.length).trim();
      const leftValue = evaluateTerm(left, exercise);
      const rightValue = evaluateTerm(right, exercise);

      switch (operator) {
        case '>':
          return leftValue > rightValue;
        case '<':
          return leftValue < rightValue;
        case '>=':
          return leftValue >= rightValue;
        case '<=':
          return leftValue <= rightValue;
        case '=':
          return leftValue === rightValue;
        case '<>':
        case '!=':
          return leftValue !== rightValue;
        default:
          break;
      }
    }
  }
  if (condition === 'TRUE') return true;
  if (condition === 'FALSE') return false;
  return false;
}

function evaluateExpression(expression, exercise) {
  // Обрабатываем выражения с + и -
  const cleaned = expression.trim();
  if (!cleaned) return 0;
  
  // Разбиваем на части по + и -, сохраняя знаки
  const parts = [];
  let current = '';
  let sign = 1;
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '+' && current) {
      parts.push({ value: current.trim(), sign });
      current = '';
      sign = 1;
    } else if (char === '-' && current) {
      parts.push({ value: current.trim(), sign });
      current = '';
      sign = -1;
    } else if (char === '-' && !current) {
      sign = -1;
    } else {
      current += char;
    }
  }
  if (current) {
    parts.push({ value: current.trim(), sign });
  }
  
  let result = null;
  parts.forEach(({ value, sign: partSign }) => {
    const termValue = evaluateTerm(value, exercise);
    if (typeof termValue === 'string') {
      result = termValue;
    } else if (typeof termValue === 'boolean') {
      result = termValue;
    } else {
      if (result === null || typeof result === 'string' || typeof result === 'boolean') {
        result = 0;
      }
      result += termValue * partSign;
    }
  });
  if (result === null) return 0;
  return result;
}

function evaluateFormulaForExercise(formula, exercise) {
  if (!formula || !exercise) return null;
  const standardized = standardizeFormulaForEvaluation(formula);
  if (!standardized.startsWith('=')) return null;
  const expression = standardized.slice(1);
  try {
    return evaluateExpression(expression, exercise);
  } catch (error) {
    console.warn('Не удалось вычислить формулу', error);
    return null;
  }
}

function formatNumberForDisplay(value) {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  if (value === null || value === undefined) {
    return '';
  }
  if (!Number.isFinite(value)) {
    return '';
  }
  const formatter = new Intl.NumberFormat(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
    maximumFractionDigits: 2
  });
  return formatter.format(value);
}

function displayComputedResult(value) {
  const resultElement = document.getElementById('computed-result');
  if (!resultElement) return;
  if (value === null || value === undefined) {
    resultElement.textContent = '';
    return;
  }
  const label = (texts[currentLanguage] && texts[currentLanguage].resultLabel) || 'Result';
  resultElement.textContent = `${label}: ${formatNumberForDisplay(value)}`;
}

function updateResultCell(cellRef, value) {
  if (!cellRef) return;
  const table = document.querySelector('#tableWrap table');
  if (!table) return;
  const match = cellRef.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return;
  const colIndex = columnLetterToIndex(match[1]);
  const rowNumber = parseInt(match[2], 10);
  if (!colIndex || !rowNumber) return;
  const rowElement = table.querySelector(`tr:nth-child(${rowNumber + 1})`);
  if (!rowElement) return;
  const cells = rowElement.querySelectorAll('td');
  if (colIndex >= cells.length) return;
  if (value === null || value === undefined || value === '') {
    cells[colIndex].textContent = '';
  } else {
    cells[colIndex].textContent = formatNumberForDisplay(value);
  }
}

// Функция для выделения диапазонов в таблице (как в Excel)
function highlightRanges(formula) {
  // Убираем все выделения
  document.querySelectorAll('.excel-table td').forEach(cell => {
    // Удаляем все классы выделения
    cell.classList.remove('highlighted', 'range-start', 'range-end', 'range-1', 'range-2', 'range-3', 'range-4', 'range-5');
    cell.style.backgroundColor = '';
    cell.style.removeProperty('border');
  });
  
  if (!formula) return;
  const table = document.querySelector('.excel-table');
  if (!table) return;
  const normalizedFormula = formula.toUpperCase().replace(/\s/g, '');
  const highlightedCells = new Set();
  
  // Парсим формулы типа =SUM(B2:B4;D2:D3) - находим все диапазоны
  const rangePattern = /([A-Z]+)(\d+):([A-Z]+)(\d+)/gi;
  const matches = Array.from(normalizedFormula.matchAll(rangePattern));
  
  // Цвета для разных диапазонов
  const rangeColors = [
    { bg: '#d0e8f7', border: '#0078d4' }, // Синий
    { bg: '#e8f5e8', border: '#27ae60' }, // Зеленый
    { bg: '#fff3e0', border: '#f57c00' }, // Оранжевый
    { bg: '#f3e5f5', border: '#9c27b0' }, // Фиолетовый
    { bg: '#ffebee', border: '#c62828' }  // Красный
  ];
  
  matches.forEach((match, rangeIndex) => {
    const startCol = match[1];
    const startRow = parseInt(match[2], 10);
    const endCol = match[3];
    const endRow = parseInt(match[4], 10);
    const startColIndex = columnLetterToIndex(startCol);
    const endColIndex = columnLetterToIndex(endCol);
    const colorIndex = rangeIndex % rangeColors.length;
    const color = rangeColors[colorIndex];
    
    // Выделяем ячейки в диапазоне
    const rows = table.querySelectorAll('tr');
    const adjustedStartRow = startRow;
    const adjustedEndRow = endRow;
    rows.forEach((row, r) => {
      // Пропускаем первую строку (заголовки колонок)
      if (r === 0) return;
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, c) => {
        // Пропускаем первую ячейку (номер строки)
        if (c === 0) return;
        
        // Номер строки берем из первой ячейки строки
        const rowNumCell = cells[0];
        const displayRowNum = parseInt(rowNumCell.textContent, 10);
        const currentRowIndex = Number.isNaN(displayRowNum) ? r : displayRowNum;
        const cellColIndex = c; // c=1 соответствует колонке A
        if (cellColIndex >= startColIndex && cellColIndex <= endColIndex &&
            currentRowIndex >= adjustedStartRow && currentRowIndex <= adjustedEndRow) {
          // Применяем цвет и пунктирную границу для всех ячеек диапазона одинаково
          cell.style.backgroundColor = color.bg;
          cell.style.setProperty('border', `2px dashed ${color.border}`, 'important');
          cell.classList.add(`range-${rangeIndex + 1}`);
          highlightedCells.add(`${cellColIndex}:${currentRowIndex}`);
        }
      });
    });
  });

  // Подсветка одиночных ячеек (B2, C3 и т.п.)
  const singlePattern = /([A-Z]+)(\d+)/gi;
  let singleMatch;
  let singleIndex = matches.length;
  const rows = table.querySelectorAll('tr');

  while ((singleMatch = singlePattern.exec(normalizedFormula)) !== null) {
    const [whole, colLetters, rowDigits] = singleMatch;
    const matchIndex = singleMatch.index;
    const prevChar = normalizedFormula[matchIndex - 1];
    const nextChar = normalizedFormula[matchIndex + whole.length];

    // Пропускаем границы диапазонов (B2:B4 должно подсветиться уже как диапазон)
    if (prevChar === ':' || nextChar === ':') continue;

    const colIndex = columnLetterToIndex(colLetters);
    const rowNumber = parseInt(rowDigits, 10);
    if (!colIndex || Number.isNaN(rowNumber)) continue;

    const key = `${colIndex}:${rowNumber}`;
    if (highlightedCells.has(key)) continue;

    const colorIndex = singleIndex % rangeColors.length;
    const color = rangeColors[colorIndex];
    singleIndex += 1;

    const rowElement = rows[rowNumber];
    if (!rowElement) continue;
    const cells = rowElement.querySelectorAll('td');
    if (!cells || colIndex >= cells.length) continue;
    const cell = cells[colIndex];
    if (!cell) continue;

    cell.style.backgroundColor = color.bg;
    cell.style.setProperty('border', `2px dashed ${color.border}`, 'important');
    cell.classList.add(`range-${colorIndex + 1}`);
    highlightedCells.add(key);
  }
}

function applyLanguage(lang, { refreshUI = true } = {}) {
  currentLanguage = lang === 'ru' ? 'ru' : 'en';
  localStorage.setItem('selectedLanguage', currentLanguage);
  const html = document.documentElement;
  if (html) {
    html.setAttribute('lang', currentLanguage);
  }
  updateInterface();
  if (refreshUI) {
    try {
      updateLevelInterface();
      updateExerciseInterface().catch(console.error);
    } catch (error) {
      console.warn('Не удалось обновить интерфейс уровня при смене языка:', error);
    }
  }
}

function showAuthScreen() {
  // Экран авторизации отключен, сразу показываем выбор уровней
  showLevelSelection();
}

function handleLanguageSelection(lang) {
  applyLanguage(lang);
}

function setupEventListeners() {
  const signUpBtn = document.getElementById('signUpBtn');
  if (signUpBtn) {
    signUpBtn.addEventListener('click', signUp);
  }
  const signInBtn = document.getElementById('signInBtn');
  console.log('Sign in button:', signInBtn);
  if (signInBtn) {
    signInBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Sign in button clicked');
      signIn();
    });
  } else {
    console.warn('Sign in button not found!');
  }
  
  // Показать/скрыть пароль
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  console.log('Toggle password button:', togglePasswordBtn);
  console.log('Password input:', passwordInput);
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Toggle password clicked, current type:', passwordInput.type);
      const currentType = passwordInput.type;
      const newType = currentType === 'password' ? 'text' : 'password';
      passwordInput.type = newType;
      togglePasswordBtn.textContent = newType === 'password' ? '👁️' : '🙈';
      console.log('Password type changed to:', newType);
    });
  } else {
    console.warn('Toggle password elements not found!');
  }
  
  // Восстановление пароля
  const forgotPasswordLink = document.getElementById('forgotPassword');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleForgotPassword();
    });
  }
  
  // Вход по Enter
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        signIn();
      }
    });
  }
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        signIn();
      }
    });
  }
  
  const backToAuthBtn = document.getElementById('back-to-auth');
  if (backToAuthBtn) {
    backToAuthBtn.addEventListener('click', showAuthScreen);
  }
  const resetProgressBtn = document.getElementById('reset-progress');
  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', resetProgress);
  }
  const backToLevelsBtn = document.getElementById('back-to-levels');
  if (backToLevelsBtn) {
    backToLevelsBtn.addEventListener('click', backToLevels);
  }
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  const prevExerciseBtn = document.getElementById('prev-exercise');
  if (prevExerciseBtn) {
    prevExerciseBtn.addEventListener('click', prevExercise);
  }
  const nextExerciseBtn = document.getElementById('next-exercise');
  if (nextExerciseBtn) {
    nextExerciseBtn.addEventListener('click', nextExercise);
  }
  const checkBtn = document.getElementById('checkBtn');
  if (checkBtn) {
    checkBtn.addEventListener('click', onCheck);
  }
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', onReset);
  }
  const hintBtn = document.getElementById('hintBtn');
  if (hintBtn) {
    hintBtn.addEventListener('click', onHint);
  }
  const completeLevelBtn = document.getElementById('complete-level');
  if (completeLevelBtn) {
    completeLevelBtn.addEventListener('click', completeLevel);
  }
  const backToLevelsFromCompleteBtn = document.getElementById('back-to-levels-from-complete');
  if (backToLevelsFromCompleteBtn) {
    backToLevelsFromCompleteBtn.addEventListener('click', showLevelSelection);
  }
  const prevLevelBtn = document.getElementById('prev-level');
  if (prevLevelBtn) {
    prevLevelBtn.addEventListener('click', prevLevel);
  }
  const nextLevelBtn = document.getElementById('next-level');
  if (nextLevelBtn) {
    nextLevelBtn.addEventListener('click', nextLevel);
  }

  const formulaInput = document.getElementById('userFormula');
  if (formulaInput) {
    formulaInput.addEventListener('input', event => highlightRanges(event.target.value));
    formulaInput.addEventListener('focus', event => highlightRanges(event.target.value));
  }
}

async function connectSupabase(retry = 0) {
  if (window.supabaseClient) {
    console.log('Supabase подключен в main.js');
    try {
      const { data, error } = await window.supabaseClient.auth.getSession();
      if (!error && data?.session?.user) {
        currentUser = data.session.user;
        await loadUserProgress();
        if (document.querySelector('.wrap')?.style.display !== 'block') {
          await showLevelSelection();
        }
      }
    } catch (error) {
      console.error('Ошибка получения сессии Supabase:', error);
    }

    if (window.supabaseClient && window.supabaseClient.auth && typeof window.supabaseClient.auth.onAuthStateChange === 'function') {
      window.supabaseClient.auth.onAuthStateChange(async (_event, session) => {
        if (session && session.user) {
          currentUser = session.user;
          await loadUserProgress();
          if (document.querySelector('.wrap')?.style.display !== 'block') {
            await showLevelSelection();
          }
        } else {
          currentUser = null;
          // Авторизация отключена для демо-режима: не возвращаем пользователя в меню
          // во время прохождения уровня при фоновых auth-событиях Supabase.
          if (document.querySelector('.wrap')?.style.display !== 'block') {
            showAuthScreen();
          }
        }
      });
    }
    return window.supabaseClient;
  }
  if (retry < 20) {
    setTimeout(() => connectSupabase(retry + 1), 250);
  } else {
    console.warn('Supabase client не найден после нескольких попыток.');
  }
  return null;
}

async function initializeApp() {
  try {
    setupEventListeners();
  setupFormulaInputHelpers();
    initLevels();
    
    try {
      await connectSupabase();
    } catch (error) {
      console.error('Ошибка подключения к Supabase:', error);
      // Продолжаем работу даже если Supabase не подключился
    }

    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      applyLanguage(savedLanguage, { refreshUI: false });
    } else {
      localStorage.setItem('selectedLanguage', currentLanguage);
    }

    // Очищаем весь прогресс при загрузке
    if (window.levelManager) {
      window.levelManager.resetProgress();
      localStorage.removeItem('userProgress');
      localStorage.removeItem('completedLevels');
      localStorage.removeItem('completedExercises');
    }
    
    // Сразу показываем выбор уровней без авторизации
    await showLevelSelection();
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error);
    // В случае ошибки показываем выбор уровней
    await showLevelSelection();
  }
}

// Запускаем инициализацию когда DOM готов
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM уже загружен
  initializeApp();
}