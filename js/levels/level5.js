// js/levels/level5.js — thin wrapper; exercise content lives in data/level5.json
class Level5 extends createJsonLevelClass(5) {}

if (typeof window !== 'undefined') {
  window.Level5 = Level5;
}
