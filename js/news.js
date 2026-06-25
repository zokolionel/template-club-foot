/* ===================================================================
   PARAY FC — Moteur des actualités
   Source : Store ('news' = tableau d'articles).
   Article : { id, title, category, text, long, image, date }

   - Accueil (#news-grid)      : la dernière actu active "à la une"
   - actualites.html (#news-dynamic) : les actus actives (< 7 jours)
   - archives.html (#archives-list)  : les actus périmées (≥ 7 jours)
   - article.html (#article-view)    : lecture d'un article (contenu long)

   Le bouton "Lire" n'apparaît que si l'article a un contenu long (>100 car.).
   =================================================================== */
(function () {
  'use strict';

  var WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  var CAT_COLORS = {
    'Résultats':   { bg: 'var(--secondary)', fg: '#fff' },
    'Événement':   { bg: 'var(--accent)',    fg: 'var(--primary)' },
    'Recrutement': { bg: 'var(--navy-text)', fg: '#fff' },
    'Communiqué':  { bg: 'var(--navy-dark)', fg: '#fff' }
  };

  function esc(s) { var d = document.createElement('div'); d.textContent = (s == null ? '' : String(s)); return d.innerHTML; }
  function attr(s) { return esc(s).replace(/"/g, '&quot;'); }
  function normalize(n) { if (!n) return []; if (Array.isArray(n)) return n.slice(); if (n.title) return [n]; return []; }
  function ts(a) { var t = Date.parse(a.date); return isNaN(t) ? 0 : t; }
  function byDateDesc(a, b) { return ts(b) - ts(a); }
  function isActive(a) { var t = ts(a); if (!t) return true; return (Date.now() - t) < WEEK_MS; }
  function hasLong(a) { return a.long && String(a.long).trim().length > 100; }
  function articleHref(a) { return 'article.html?id=' + encodeURIComponent(a.id || a.date || a.title || ''); }
  function fmtDate(a) { var t = ts(a); if (!t) return ''; return new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function catColor(cat) { return CAT_COLORS[cat] || { bg: 'var(--navy-text)', fg: '#fff' }; }

  function cardHTML(a, featured) {
    var c = catColor(a.category);
    var media = a.image
      ? '<img class="news-card__img" src="' + attr(a.image) + '" alt="">'
      : '<div class="img-placeholder">' + (featured ? 'À la une' : esc(a.category)) + '</div>';
    var lire = hasLong(a) ? '<span class="news-card__more">Lire l\'article →</span>' : '';
    var inner =
      '<div class="news-card__media">' + media +
      '<span class="news-card__cat" style="background:' + c.bg + ';color:' + c.fg + ';">' + esc(String(a.category).toUpperCase()) + '</span></div>' +
      '<div class="news-card__body">' +
      '<span class="news-card__date">' + esc(fmtDate(a)) + '</span>' +
      '<h3 class="news-card__title">' + esc(a.title) + '</h3>' +
      '<p class="news-card__excerpt">' + esc(a.text) + '</p>' + lire +
      '</div>';
    var cls = 'news-card' + (featured ? ' news-card--featured' : '');
    var dc = ' data-cat="' + attr(a.category) + '"';
    if (hasLong(a)) return '<a class="' + cls + '"' + dc + ' href="' + articleHref(a) + '">' + inner + '</a>';
    return '<div class="' + cls + '"' + dc + '>' + inner + '</div>';
  }

  function firstChildFrom(html) { var t = document.createElement('div'); t.innerHTML = html; return t.firstChild; }

  /* --- Accueil : la dernière actu active, "à la une" --- */
  function renderFeatured(list) {
    var grid = document.getElementById('news-grid');
    if (!grid) return;
    var active = list.filter(isActive).sort(byDateDesc);
    if (!active.length) return;
    grid.prepend(firstChildFrom(cardHTML(active[0], true)));
  }

  /* --- actualites.html : toutes les actus actives --- */
  function renderActualites(list) {
    var wrap = document.getElementById('news-dynamic');
    if (!wrap) return;
    var active = list.filter(isActive).sort(byDateDesc);
    var empty = document.getElementById('news-empty');
    if (!active.length) { if (empty) empty.hidden = false; wrap.innerHTML = ''; updateCounts([]); return; }
    if (empty) empty.hidden = true;
    wrap.innerHTML = active.map(function (a) { return cardHTML(a, false); }).join('');
    updateCounts(active);
  }

  function updateCounts(active) {
    document.querySelectorAll('[data-filter]').forEach(function (btn) {
      var f = btn.getAttribute('data-filter');
      var n = (f === 'Tout') ? active.length : active.filter(function (a) { return a.category === f; }).length;
      var c = btn.querySelector('.count');
      if (c) c.textContent = n;
    });
  }

  /* --- archives.html : les actus périmées --- */
  function renderArchives(list) {
    var wrap = document.getElementById('archives-list');
    if (!wrap) return;
    var expired = list.filter(function (a) { return !isActive(a); }).sort(byDateDesc);
    var empty = document.getElementById('archives-empty');
    if (!expired.length) { if (empty) empty.hidden = false; return; }
    if (empty) empty.hidden = true;
    wrap.innerHTML = expired.map(function (a) { return cardHTML(a, false); }).join('');
  }

  /* --- article.html : lecture d'un article --- */
  function paragraphs(t) {
    if (!t) return '';
    return String(t).split(/\n+/).filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  }
  function renderArticle(list) {
    var view = document.getElementById('article-view');
    if (!view) return;
    var id = new URLSearchParams(location.search).get('id');
    var a = list.filter(function (x) { return String(x.id || x.date || x.title) === String(id); })[0];
    if (!a) { view.innerHTML = '<p class="wk-empty">Article introuvable. <a href="actualites.html">← Retour aux actualités</a></p>'; return; }
    var c = catColor(a.category);
    document.title = a.title + ' — Actualité';
    view.innerHTML =
      '<a class="article-back" href="actualites.html">← Toutes les actualités</a>' +
      '<span class="news-card__cat article-cat" style="background:' + c.bg + ';color:' + c.fg + ';">' + esc(String(a.category).toUpperCase()) + '</span>' +
      '<h1 class="article-title">' + esc(a.title) + '</h1>' +
      '<span class="article-date">' + esc(fmtDate(a)) + '</span>' +
      (a.image ? '<div class="article-hero"><img src="' + attr(a.image) + '" alt=""></div>' : '') +
      '<p class="article-lead">' + esc(a.text) + '</p>' +
      '<div class="article-body">' + paragraphs(a.long) + '</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof Store === 'undefined') return;
    Store.getAll().then(function (all) {
      var list = normalize(all.news);
      renderFeatured(list);
      renderActualites(list);
      renderArchives(list);
      renderArticle(list);
    }).catch(function () { /* base indisponible */ });
  });
})();
