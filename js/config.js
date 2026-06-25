/* ===================================================================
   TEMPLATE SITE CLUB DE FOOT — CONFIGURATION CENTRALE
   👉 Le SEUL fichier à modifier pour adapter le site à VOTRE club.
   =================================================================== */
const CONFIG = {

  /* ---------- Identité du club ---------- */
  clubName:    'Votre Club FC',
  city:        'Votre Ville',
  foundedYear: 1920,

  /* ---------- Couleurs (pilotent tout le thème du site) ---------- */
  colors: {
    primary:   '#1F2A44',
    secondary: '#2E7D5B',
    accent:    '#E8B43A',
  },

  /* ---------- Coordonnées ---------- */
  email: 'contact@votreclub.fr',
  phone: '',
  address: {
    street: '1 avenue du Stade',
    zip:    '00000',
    city:   'Votre Ville',
  },

  /* ---------- Logo ---------- */
  logoUrl: 'images/logo.svg',

  /* ---------- Réseaux sociaux (URL complète, ou '#' pour masquer le lien) ---------- */
  social: {
    facebook:  '#',
    instagram: '#',
    tiktok:    '#',
  },

  /* ---------- Boutique ---------- */
  shopUrl: 'boutique.html',

  /* ---------- Mesure d'audience (Google Analytics) ----------
     Mettez votre identifiant (ex. 'G-XXXXXXXXXX') pour activer GA
     APRÈS consentement du visiteur. Vide = aucune mesure. */
  analyticsId: '',

  /* ---------- Back-office du week-end (optionnel) ----------
     Vide = mode local (localStorage). Renseignez un projet Supabase
     pour partager le week-end en ligne (voir README). */
  backend: {
    supabaseUrl: '',
    supabaseKey: '',
  },
};

window.CONFIG = CONFIG;
