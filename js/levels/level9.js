// js/levels/level9.js — thin wrapper; exercise content lives in data/level9.json
class Level9 extends createJsonLevelClass(9) {}

if (typeof window !== 'undefined') {
  window.Level9 = Level9;
}
