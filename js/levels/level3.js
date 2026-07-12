// js/levels/level3.js — thin wrapper; exercise content lives in data/level3.json
class Level3 extends createJsonLevelClass(3) {}

if (typeof window !== 'undefined') {
  window.Level3 = Level3;
}
