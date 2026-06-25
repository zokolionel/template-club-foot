/* ===================================================================
   PARAY FC — Espace admin du week-end
   - Accès par mot de passe (côté client uniquement)
   - Données via Store (Supabase en ligne, repli localStorage)
   =================================================================== */
(function () {
  'use strict';

  var PASSWORD = 'admin2026';
  var VENUES = ['Domicile', 'Extérieur'];
  var OUTCOMES = ['Victoire', 'Nul', 'Défaite', 'N/A'];
  var newsImage = '', newsFile = null;

  function $(id) { return document.getElementById(id); }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof CONFIG !== 'undefined') {
      if (CONFIG.logoUrl) { $('login-logo').src = CONFIG.logoUrl; $('admin-logo').src = CONFIG.logoUrl; }
      if (CONFIG.clubName) $('admin-club').textContent = CONFIG.clubName;
    }
    initAuth();
  });

  /* ---------- Authentification ---------- */
  function initAuth() {
    if (sessionStorage.getItem('pfc_admin_ok') === '1') showApp();

    $('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('login-pass').value === PASSWORD) {
        sessionStorage.setItem('pfc_admin_ok', '1');
        showApp();
      } else {
        $('login-err').hidden = false;
        $('login-pass').value = '';
      }
    });

    $('logout').addEventListener('click', function () {
      sessionStorage.removeItem('pfc_admin_ok');
      location.reload();
    });
  }

  function showApp() {
    $('login').hidden = true;
    $('app').hidden = false;
    wireActions();
    bootData();
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg, isError) {
    var t = $('toast');
    t.textContent = msg;
    t.style.background = isError ? '#C0192C' : '';
    t.hidden = false;
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.hidden = true; }, 320);
    }, 2600);
  }

  /* ---------- Constructeurs de lignes (DOM, sans injection) ---------- */
  function makeSelect(options, val) {
    var s = document.createElement('select'); s.className = 'in';
    options.forEach(function (o) {
      var op = document.createElement('option');
      op.textContent = o;
      if (o === val) op.selected = true;
      s.appendChild(op);
    });
    return s;
  }
  function makeInput(type, ph, val) {
    var i = document.createElement('input'); i.className = 'in'; i.type = type;
    if (ph) i.placeholder = ph;
    if (val != null) i.value = val;
    return i;
  }
  function cell(label, child) {
    var td = document.createElement('td');
    td.setAttribute('data-label', label);
    td.appendChild(child);
    return td;
  }
  function delCell(tr) {
    var td = document.createElement('td');
    td.className = 'row-act';
    td.setAttribute('data-label', '');
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'del'; b.textContent = '✕';
    b.setAttribute('aria-label', 'Supprimer la ligne');
    b.addEventListener('click', function () { tr.remove(); });
    td.appendChild(b);
    return td;
  }

  function progRow(d) {
    d = d || {};
    var tr = document.createElement('tr');
    tr.appendChild(cell('Lieu', makeSelect(VENUES, d.venue || 'Domicile')));
    tr.appendChild(cell('Équipe', makeInput('text', 'Seniors A', d.team)));
    tr.appendChild(cell('Adversaire', makeInput('text', 'Adversaire', d.opponent)));
    tr.appendChild(cell('Type', makeInput('text', 'Championnat', d.type)));
    tr.appendChild(cell('Heure', makeInput('time', '', d.time)));
    tr.appendChild(delCell(tr));
    return tr;
  }
  function resRow(d) {
    d = d || {};
    var tr = document.createElement('tr');
    tr.appendChild(cell('Lieu', makeSelect(VENUES, d.venue || 'Domicile')));
    tr.appendChild(cell('Équipe', makeInput('text', 'Seniors A', d.team)));
    tr.appendChild(cell('Adversaire', makeInput('text', 'Adversaire', d.opponent)));
    tr.appendChild(cell('Type', makeInput('text', 'Championnat', d.type)));
    tr.appendChild(cell('Heure', makeInput('time', '', d.time)));
    tr.appendChild(cell('Score', makeInput('text', '2-1', d.score)));
    tr.appendChild(cell('Résultat', makeSelect(OUTCOMES, d.outcome || 'N/A')));
    tr.appendChild(delCell(tr));
    return tr;
  }

  /* ---------- Collecte des lignes ---------- */
  function collectProg() {
    return Array.from($('prog-rows').children).map(function (tr) {
      var s = tr.querySelectorAll('select'), i = tr.querySelectorAll('input');
      return { venue: s[0].value, team: i[0].value.trim(), opponent: i[1].value.trim(), type: i[2].value.trim(), time: i[3].value };
    }).filter(function (m) { return m.team || m.opponent; });
  }
  function collectRes() {
    return Array.from($('res-rows').children).map(function (tr) {
      var s = tr.querySelectorAll('select'), i = tr.querySelectorAll('input');
      return { venue: s[0].value, team: i[0].value.trim(), opponent: i[1].value.trim(), type: i[2].value.trim(), time: i[3].value, score: i[4].value.trim(), outcome: s[1].value };
    }).filter(function (m) { return m.team || m.opponent; });
  }

  /* ---------- Chargement des données existantes ---------- */
  function bootData() {
    $('prog-rows').innerHTML = '';
    $('res-rows').innerHTML = '';
    Store.getAll().then(function (all) {
      var prog = all.program || { weekend: '', matches: [] };
      $('weekend-date').value = prog.weekend || '';
      (prog.matches || []).forEach(function (m) { $('prog-rows').appendChild(progRow(m)); });
      if (!$('prog-rows').children.length) $('prog-rows').appendChild(progRow());

      var res = all.results || { results: [] };
      (res.results || []).forEach(function (m) { $('res-rows').appendChild(resRow(m)); });
      if (!$('res-rows').children.length) $('res-rows').appendChild(resRow());

      var news = all.news;
      if (news) {
        $('news-title').value = news.title || '';
        $('news-cat').value = news.category || 'Résultats';
        $('news-text').value = news.text || '';
        newsImage = news.image || '';
        if (newsImage) { $('news-preview-img').src = newsImage; $('news-preview').hidden = false; }
      }
      updateCount();
    }).catch(function () {
      $('prog-rows').appendChild(progRow());
      $('res-rows').appendChild(resRow());
      toast('Lecture de la base impossible', true);
    });
  }

  function updateCount() { $('news-count').textContent = ($('news-text').value || '').length; }

  /* ---------- Boutons ---------- */
  function save(btn, key, data, okMsg) {
    btn.disabled = true;
    Store.set(key, data).then(function () {
      toast(okMsg);
    }).catch(function () {
      toast("Erreur d'enregistrement", true);
    }).then(function () {
      btn.disabled = false;
    });
  }

  function wireActions() {
    $('prog-add').addEventListener('click', function () { $('prog-rows').appendChild(progRow()); });
    $('res-add').addEventListener('click', function () { $('res-rows').appendChild(resRow()); });

    $('prog-save').addEventListener('click', function () {
      save(this, 'program', { weekend: $('weekend-date').value.trim(), matches: collectProg() }, '✓ Programme enregistré');
    });
    $('res-save').addEventListener('click', function () {
      save(this, 'results', { results: collectRes() }, '✓ Résultats enregistrés');
    });
    $('news-photo').addEventListener('change', function () {
      var f = this.files && this.files[0];
      if (!f) return;
      newsFile = f;
      $('news-preview-img').src = URL.createObjectURL(f);
      $('news-preview').hidden = false;
    });

    $('news-save').addEventListener('click', function () {
      var btn = this;
      var title = $('news-title').value.trim();
      if (!title) { toast('Ajoutez un titre', true); return; }
      btn.disabled = true;

      var build = function (imageUrl) {
        return {
          title: title,
          category: $('news-cat').value,
          text: $('news-text').value.trim(),
          image: imageUrl || '',
          date: new Date().toISOString()
        };
      };
      var go = function (imageUrl) {
        Store.set('news', build(imageUrl)).then(function () {
          newsImage = imageUrl || ''; newsFile = null;
          toast('✓ Actualité publiée');
        }).catch(function () {
          toast("Erreur d'enregistrement", true);
        }).then(function () { btn.disabled = false; });
      };

      if (newsFile) {
        toast('Envoi de la photo…');
        Store.uploadImage(newsFile).then(function (url) { go(url); })
          .catch(function () { toast("Échec de l'envoi de la photo", true); btn.disabled = false; });
      } else {
        go(newsImage);
      }
    });

    $('news-text').addEventListener('input', updateCount);
  }
})();
