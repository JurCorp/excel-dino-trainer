// logic.js - функции для работы с базой данных
// Supabase будет доступен как window.supabase после загрузки CDN

// Конфигурация Supabase - используем переменные окружения
const SUPABASE_URL = 'https://sgsphkkrpixfjgccczgc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnc3Boa2tycGl4ZmpnY2NjemdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTI2NjYsImV4cCI6MjA3NTY4ODY2Nn0.OrNrqZp8k5ID8ghukPET3BN_Za2H3a-6MlfApIW2-Os'

// Функция инициализации Supabase
function initSupabase() {
  if (window.supabase && !window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase инициализирован');
  } else if (!window.supabase) {
    console.error('Supabase не загружен!');
  }
}

// Инициализируем Supabase сразу, если он уже загружен
if (window.supabase) {
  initSupabase();
} else {
  // Ждем загрузки Supabase
  window.addEventListener('load', initSupabase);
}

// Функции для работы с базой данных (доступны глобально)

async function getUsers() {
  const { data, error } = await window.supabaseClient.from('users').select('*')
  if (error) console.error(error)
  return data
}

// Функция для сохранения прогресса пользователя
async function saveUserProgress(userId, level, completed, score) {
  const { data, error } = await window.supabaseClient
    .from('user_progress')
    .upsert({
      user_id: userId,
      level: level,
      completed: completed,
      score: score,
      updated_at: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error saving progress:', error)
    return { success: false, error }
  }
  
  return { success: true, data }
}

// Функция для получения прогресса пользователя
async function getUserProgress(userId) {
  const { data, error } = await window.supabaseClient
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('level', { ascending: true })
  
  if (error) {
    console.error('Error fetching progress:', error)
    return { success: false, error }
  }
  
  return { success: true, data }
}

// Функция для получения следующего уровня
async function getNextLevel(userId) {
  const { data, error } = await window.supabaseClient
    .from('user_progress')
    .select('level')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('level', { ascending: false })
    .limit(1)
  
  if (error) {
    console.error('Error fetching next level:', error)
    return 1 // Начинаем с первого уровня
  }
  
  return data.length > 0 ? data[0].level + 1 : 1
}

// Функция для создания профиля пользователя
async function createUserProfile(userId, email, language = 'ru') {
  const { data, error } = await window.supabaseClient
    .from('user_profiles')
    .insert({
      user_id: userId,
      email: email,
      language: language,
      created_at: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error creating user profile:', error)
    return { success: false, error }
  }
  
  return { success: true, data }
}

// Функция для обновления языка пользователя
async function updateUserLanguage(userId, language) {
  const { data, error } = await window.supabaseClient
    .from('user_profiles')
    .update({ language: language })
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error updating language:', error)
    return { success: false, error }
  }
  
  return { success: true, data }
}

// Делаем функции доступными глобально
window.getUsers = getUsers;
window.saveUserProgress = saveUserProgress;
window.getUserProgress = getUserProgress;
window.getNextLevel = getNextLevel;
window.createUserProfile = createUserProfile;
window.updateUserLanguage = updateUserLanguage;
