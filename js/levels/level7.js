// js/levels/level7.js — thin wrapper; exercise content lives in data/level7.json
class Level7 extends createJsonLevelClass(7) {}

if (typeof window !== 'undefined') {
  window.Level7 = Level7;
}
