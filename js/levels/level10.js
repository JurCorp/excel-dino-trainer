// js/levels/level10.js — thin wrapper; exercise content lives in data/level10.json
class Level10 extends createJsonLevelClass(10) {}

if (typeof window !== 'undefined') {
  window.Level10 = Level10;
}
