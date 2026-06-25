/* ===================================================================
   PARAY FC — Script principal (vanilla JS)
   - applyConfig()      : injecte les variables de config.js
   - injectFooterLinks(): liens Archives + Mentions légales (toutes pages)
   - menu mobile
   - filtre des actualités (compatible contenu dynamique)
   - formulaires de démonstration
   - bannière cookies RGPD + Google Analytics conditionnel
   =================================================================== */
(function () {
  'use strict';

  /* =============== CONFIG -> PAGE =============== */
  function applyConfig() {
    if (typeof CONFIG === 'undefined') return;
    var c = CONFIG;

    var root = document.documentElement;
    if (c.colors) {
      if (c.colors.primary)   root.style.setProperty('--primary', c.colors.primary);
      if (c.colors.secondary) root.style.setProperty('--secondary', c.colors.secondary);
      if (c.colors.accent)    root.style.setProperty('--accent', c.colors.accent);
    }

    var addr = c.address || {};
    var derived = {
      since:       'DEPUIS ' + c.foundedYear,
      aboutText:   'Le club de football de ' + c.city + ' depuis ' + c.foundedYear + '. ' +
                   c.memberCount + ' licenciés, ' + c.teamCount + ' équipes, une même passion.',
      addressHtml: [addr.street, ((addr.zip || '') + ' ' + (addr.city || '')).trim()].filter(Boolean).join('<br>'),
      addressLine: [addr.street, addr.zip, addr.city].filter(Boolean).join(', '),
      emailHref:   c.email ? 'mailto:' + c.email : '#',
      telHref:     c.phone ? 'tel:' + String(c.phone).replace(/\s+/g, '') : '#'
    };
    function resolve(path) {
      if (path in derived) return derived[path];
      return path.split('.').reduce(function (o, k) { return (o == null) ? undefined : o[k]; }, c);
    }
    document.querySelectorAll('[data-config]').forEach(function (el) { var v = resolve(el.getAttribute('data-config')); if (v != null) el.textContent = v; });
    document.querySelectorAll('[data-config-html]').forEach(function (el) { var v = resolve(el.getAttribute('data-config-html')); if (v != null) el.innerHTML = v; });
    document.querySelectorAll('[data-config-href]').forEach(function (el) { var v = resolve(el.getAttribute('data-config-href')); if (v != null) el.setAttribute('href', v); });
    document.querySelectorAll('[data-config-src]').forEach(function (el) { var v = resolve(el.getAttribute('data-config-src')); if (v != null) el.setAttribute('src', v); });
    document.querySelectorAll('[data-config-show]').forEach(function (el) { var v = resolve(el.getAttribute('data-config-show')); el.hidden = !(v && String(v).trim()); });
  }

  /* =============== Liens footer (toutes pages) =============== */
  function injectFooterLinks() {
    document.querySelectorAll('.footer-bottom span').forEach(function (s) {
      if (/Mentions légales/.test(s.textContent) && !s.querySelector('a')) {
        s.innerHTML = '<a href="mentions-legales.html" class="footer-legal-link">Mentions légales</a> · Politique de confidentialité';
      }
    });
    var titles = document.querySelectorAll('.footer-col__title');
    for (var i = 0; i < titles.length; i++) {
      if (/Navigation/i.test(titles[i].textContent)) {
        var col = titles[i].parentNode;
        if (col && !col.querySelector('a[href="archives.html"]')) {
          var a = document.createElement('a'); a.className = 'footer-link'; a.href = 'archives.html'; a.textContent = 'Archives';
          col.appendChild(a);
        }
        break;
      }
    }
  }

  /* =============== Cookies RGPD + Google Analytics =============== */
  function loadGA() {
    var id = (typeof CONFIG !== 'undefined' && CONFIG.analyticsId) ? CONFIG.analyticsId : '';
    if (!id || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }
  function initCookies() {
    var KEY = 'pfc_cookie_consent';
    var consent = localStorage.getItem(KEY);
    if (consent === 'accepted') { loadGA(); return; }
    if (consent === 'refused') { return; }

    var bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Consentement cookies');
    bar.innerHTML =
      '<p class="cookie-bar__txt">Ce site utilise Google Analytics pour mesurer son audience. ' +
      '<a href="mentions-legales.html">En savoir plus</a></p>' +
      '<div class="cookie-bar__btns">' +
      '<button type="button" class="cookie-btn cookie-btn--refuse">Refuser</button>' +
      '<button type="button" class="cookie-btn cookie-btn--accept">Accepter</button>' +
      '</div>';
    document.body.appendChild(bar);
    bar.querySelector('.cookie-btn--accept').addEventListener('click', function () { localStorage.setItem(KEY, 'accepted'); bar.remove(); loadGA(); });
    bar.querySelector('.cookie-btn--refuse').addEventListener('click', function () { localStorage.setItem(KEY, 'refused'); bar.remove(); });
  }

  /* =============== Init =============== */
  document.addEventListener('DOMContentLoaded', function () {
    applyConfig();
    injectFooterLinks();
    initCookies();

    /* ---- Menu mobile ---- */
    var burger = document.querySelector('[data-burger]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (burger && menu) {
      var closeMenu = function () { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
      burger.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
      window.addEventListener('resize', function () { if (window.innerWidth >= 768) closeMenu(); });
    }

    /* ---- Filtre des actualités (re-interroge le DOM, compatible dynamique) ---- */
    var filterBtns = document.querySelectorAll('[data-filter]');
    if (filterBtns.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var f = btn.getAttribute('data-filter');
          filterBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          document.querySelectorAll('[data-cat]').forEach(function (card) {
            var show = (f === 'Tout') || (card.getAttribute('data-cat') === f);
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    /* ---- Formulaires de démonstration ---- */
    document.querySelectorAll('[data-demo-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var card = form.closest('.form-card');
        var success = card ? card.querySelector('[data-form-success]') : null;
        if (success) {
          form.hidden = true;
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  });
})();
