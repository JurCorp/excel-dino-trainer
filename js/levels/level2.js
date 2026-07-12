// js/levels/level2.js — thin wrapper; exercise content lives in data/level2.json
class Level2 extends createJsonLevelClass(2) {}

if (typeof window !== 'undefined') {
  window.Level2 = Level2;
}
