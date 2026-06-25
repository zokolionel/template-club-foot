/* ===================================================================
   PARAY FC — Script principal (vanilla JS)
   - applyConfig() : injecte les variables de config.js dans la page
   - Menu mobile (toutes les pages)
   - Filtre des actualités par catégorie (page Actualités)
   - Formulaires de démonstration (message de succès, sans backend)
   =================================================================== */
(function () {
  'use strict';

  /* ===============================================================
     INJECTION DE LA CONFIGURATION CENTRALE
     Pilotée par des attributs dans le HTML :
       data-config="clubName"        -> remplace le texte (textContent)
       data-config-html="addressHtml"-> remplace le HTML (innerHTML)
       data-config-href="social.facebook" -> définit l'attribut href
       data-config-src="logoUrl"     -> définit l'attribut src
       data-config-show="phone"      -> masque l'élément si la valeur est vide
     Les chemins acceptent la notation pointée (ex. address.street).
     =============================================================== */
  function applyConfig() {
    if (typeof CONFIG === 'undefined') return;
    var c = CONFIG;

    /* Couleurs -> variables CSS du thème */
    var root = document.documentElement;
    if (c.colors) {
      if (c.colors.primary)   root.style.setProperty('--primary', c.colors.primary);
      if (c.colors.secondary) root.style.setProperty('--secondary', c.colors.secondary);
      if (c.colors.accent)    root.style.setProperty('--accent', c.colors.accent);
    }

    /* Valeurs composées (dérivées des valeurs brutes) */
    var addr = c.address || {};
    var derived = {
      since:       'DEPUIS ' + c.foundedYear,
      aboutText:   'Le club de football de ' + c.city + ' depuis ' + c.foundedYear + '. ' +
                   c.memberCount + ' licenciés, ' + c.teamCount + ' équipes, une même passion.',
      addressHtml: [addr.street, ((addr.zip || '') + ' ' + (addr.city || '')).trim()].filter(Boolean).join('<br>'),
      addressLine: [addr.street, addr.zip, addr.city].filter(Boolean).join(' '),
      emailHref:   c.email ? 'mailto:' + c.email : '#',
      telHref:     c.phone ? 'tel:' + String(c.phone).replace(/\s+/g, '') : '#',
    };

    function resolve(path) {
      if (path in derived) return derived[path];
      return path.split('.').reduce(function (o, k) {
        return (o == null) ? undefined : o[k];
      }, c);
    }

    document.querySelectorAll('[data-config]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-config'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-config-html]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-config-html'));
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-config-href]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-config-href'));
      if (v != null) el.setAttribute('href', v);
    });
    document.querySelectorAll('[data-config-src]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-config-src'));
      if (v != null) el.setAttribute('src', v);
    });
    document.querySelectorAll('[data-config-show]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-config-show'));
      el.hidden = !(v && String(v).trim());
    });
  }

  document.addEventListener('DOMContentLoaded', function () {

    applyConfig();

    /* ---------- Menu mobile ---------- */
    var burger = document.querySelector('[data-burger]');
    var menu   = document.querySelector('[data-mobile-menu]');

    if (burger && menu) {
      var closeMenu = function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      };
      burger.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) closeMenu();
      });
    }

    /* ---------- Filtre des actualités ---------- */
    var filterBtns = document.querySelectorAll('[data-filter]');
    var newsCards  = document.querySelectorAll('[data-cat]');

    if (filterBtns.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var f = btn.getAttribute('data-filter');
          filterBtns.forEach(function (b) {
            b.classList.toggle('is-active', b === btn);
          });
          newsCards.forEach(function (card) {
            var show = (f === 'Tout') || (card.getAttribute('data-cat') === f);
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    /* ---------- Formulaires de démonstration ---------- */
    var demoForms = document.querySelectorAll('[data-demo-form]');

    demoForms.forEach(function (form) {
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
