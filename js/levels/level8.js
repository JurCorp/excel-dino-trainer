// js/levels/level8.js — thin wrapper; exercise content lives in data/level8.json
class Level8 extends createJsonLevelClass(8) {}

if (typeof window !== 'undefined') {
  window.Level8 = Level8;
}
