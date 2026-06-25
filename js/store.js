/* ===================================================================
   PARAY FC — Couche de données (Store)
   - Si CONFIG.backend (Supabase) est configuré → lit/écrit en ligne
     (partagé entre tous les visiteurs).
   - Sinon → repli automatique sur localStorage (propre au navigateur).

   API :
     Store.getAll()           -> { program, results, news }
     Store.get(key)
     Store.set(key, data)     -> upsert
     Store.uploadImage(file)  -> Promise<url publique> (Supabase Storage)
                                 (repli : data URL base64 en local)
   Clés logiques : 'program' · 'results' · 'news'
   =================================================================== */
(function () {
  'use strict';

  var BUCKET = 'photos';

  function backend() {
    var b = (typeof CONFIG !== 'undefined') ? CONFIG.backend : null;
    return (b && b.supabaseUrl && b.supabaseKey) ? b : null;
  }
  function headers(key) {
    return { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };
  }

  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  var Store = {
    getAll: function () {
      var b = backend();
      if (b) {
        return fetch(b.supabaseUrl + '/rest/v1/content?select=key,data', { headers: headers(b.supabaseKey) })
          .then(function (res) { if (!res.ok) throw new Error('read ' + res.status); return res.json(); })
          .then(function (rows) {
            var map = {};
            rows.forEach(function (r) { map[r.key] = r.data; });
            return map;
          });
      }
      return Promise.resolve({
        program: lsGet('pfc_program'),
        results: lsGet('pfc_results'),
        news: lsGet('pfc_news')
      });
    },

    get: function (key) {
      return this.getAll().then(function (all) { return all[key] || null; });
    },

    set: function (key, data) {
      var b = backend();
      if (b) {
        return fetch(b.supabaseUrl + '/rest/v1/content?on_conflict=key', {
          method: 'POST',
          headers: Object.assign(headers(b.supabaseKey), { 'Prefer': 'resolution=merge-duplicates' }),
          body: JSON.stringify({ key: key, data: data })
        }).then(function (res) {
          if (!res.ok) throw new Error('write ' + res.status);
          return true;
        });
      }
      lsSet('pfc_' + key, data);
      return Promise.resolve(true);
    },

    /* Upload d'une image -> renvoie l'URL publique */
    uploadImage: function (file) {
      var b = backend();
      if (b) {
        var safe = (file.name || 'photo').replace(/[^a-zA-Z0-9._-]/g, '_');
        var path = 'news-' + Date.now() + '-' + safe;
        return fetch(b.supabaseUrl + '/storage/v1/object/' + BUCKET + '/' + path, {
          method: 'POST',
          headers: {
            'apikey': b.supabaseKey,
            'Authorization': 'Bearer ' + b.supabaseKey,
            'Content-Type': file.type || 'application/octet-stream',
            'x-upsert': 'true'
          },
          body: file
        }).then(function (res) {
          if (!res.ok) return res.text().then(function (t) { throw new Error('upload ' + res.status + ' ' + t); });
          return b.supabaseUrl + '/storage/v1/object/public/' + BUCKET + '/' + path;
        });
      }
      /* Repli local : image encodée en base64 (data URL) */
      return new Promise(function (resolve, reject) {
        var fr = new FileReader();
        fr.onload = function () { resolve(fr.result); };
        fr.onerror = reject;
        fr.readAsDataURL(file);
      });
    }
  };

  window.Store = Store;
})();
