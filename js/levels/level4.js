// js/levels/level4.js — thin wrapper; exercise content lives in data/level4.json
class Level4 extends createJsonLevelClass(4) {}

if (typeof window !== 'undefined') {
  window.Level4 = Level4;
}
