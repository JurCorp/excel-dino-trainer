// js/levels/level1.js — thin wrapper; exercise content lives in data/level1.json
class Level1 extends createJsonLevelClass(1) {}

if (typeof window !== 'undefined') {
  window.Level1 = Level1;
}
