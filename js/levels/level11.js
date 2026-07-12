// js/levels/level11.js — thin wrapper; exercise content lives in data/level11.json
class Level11 extends createJsonLevelClass(11) {}

if (typeof window !== 'undefined') {
  window.Level11 = Level11;
}
