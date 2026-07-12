// js/levels/level12.js — thin wrapper; exercise content lives in data/level12.json
class Level12 extends createJsonLevelClass(12) {}

if (typeof window !== 'undefined') {
  window.Level12 = Level12;
}
