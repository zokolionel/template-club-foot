/* ===================================================================
   PARAY FC — Programme & résultats du week-end sur l'accueil
   Lit le Store (Supabase en ligne, repli localStorage) et injecte :
   - le programme du week-end (tableau)
   - les 3 derniers résultats
   (Les actualités sont gérées par js/news.js)
   =================================================================== */
(function () {
  'use strict';

  var OUT_CLASS = { 'Victoire': 'win', 'Nul': 'draw', 'Défaite': 'loss', 'N/A': 'na' };

  function esc(s) { var d = document.createElement('div'); d.textContent = (s == null ? '' : String(s)); return d.innerHTML; }
  function fmtTime(t) { return t ? String(t).replace(':', 'h') : ''; }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof Store === 'undefined') return;
    if (!document.getElementById('weekend')) return;
    Store.getAll().then(function (all) {
      renderWeekend(all.program, all.results);
    }).catch(function () { /* base indisponible */ });
  });

  function renderWeekend(prog, res) {
    var section = document.getElementById('weekend');
    if (!section) return;

    var hasProg = prog && prog.matches && prog.matches.length;
    var hasRes = res && res.results && res.results.length;
    if (!hasProg && !hasRes) { section.hidden = true; return; }
    section.hidden = false;

    var dateEl = document.getElementById('weekend-date');
    if (dateEl) dateEl.textContent = (prog && prog.weekend) ? prog.weekend : '';

    var pwrap = document.getElementById('program-wrap');
    var pempty = document.getElementById('program-empty');
    if (hasProg) {
      pempty.hidden = true;
      var rows = prog.matches.map(function (m) {
        var badge = (m.venue === 'Domicile')
          ? '<span class="wk-badge wk-badge--dom">DOM</span>'
          : '<span class="wk-badge wk-badge--ext">EXT</span>';
        return '<tr>' +
          '<td class="wk-time">' + esc(fmtTime(m.time)) + '</td>' +
          '<td class="wk-team">' + esc(m.team) + '</td>' +
          '<td>' + badge + '</td>' +
          '<td>' + esc(m.opponent) + '</td>' +
          '<td class="wk-type">' + esc(m.type) + '</td>' +
          '</tr>';
      }).join('');
      pwrap.innerHTML =
        '<table class="wk-table"><thead><tr><th>Heure</th><th>Équipe</th><th></th><th>Adversaire</th><th>Type</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>';
    } else {
      pwrap.innerHTML = '';
      pempty.hidden = false;
    }

    var rwrap = document.getElementById('results-wrap');
    var rempty = document.getElementById('results-empty');
    if (hasRes) {
      rempty.hidden = true;
      var last = res.results.slice(-3).reverse();
      rwrap.innerHTML = last.map(function (r) {
        var cls = OUT_CLASS[r.outcome] || 'na';
        var link = (r.venue === 'Domicile' ? 'reçoit ' : 'à ') + esc(r.opponent);
        return '<div class="result-card result-card--' + cls + '">' +
          '<div class="result-card__main">' +
          '<span class="result-card__team">' + esc(r.team) + '</span>' +
          '<span class="result-card__opp">' + link + '</span>' +
          '</div>' +
          '<div class="result-card__score">' + esc(r.score || '—') + '</div>' +
          '</div>';
      }).join('');
    } else {
      rwrap.innerHTML = '';
      rempty.hidden = false;
    }
  }
})();
