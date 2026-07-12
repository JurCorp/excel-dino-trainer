// js/levels/level6.js — thin wrapper; exercise content lives in data/level6.json
class Level6 extends createJsonLevelClass(6) {}

if (typeof window !== 'undefined') {
  window.Level6 = Level6;
}
