/* ===================================================================
   TEMPLATE SITE CLUB DE FOOT — CONFIGURATION CENTRALE
   -------------------------------------------------------------------
   👉 C'est le SEUL fichier à modifier pour adapter le site à VOTRE club.
   Changez une valeur ici, et elle se met à jour automatiquement
   dans le header, le footer et la page d'accueil (et les couleurs
   recolorent tout le site).

   Le moteur d'injection se trouve dans js/main.js (applyConfig).
   =================================================================== */
const CONFIG = {

  /* ---------- Identité du club ---------- */
  clubName:    'FC Démo',
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

  /* ---------- Réseaux sociaux ---------- */
  social: {
    facebook:  '#',
    instagram: '#',
    tiktok:    '#',
  },

  /* ---------- Boutique ---------- */
  shopUrl: 'boutique.html',

  /* ---------- Sportif ---------- */
  flagshipTeam: {
    name:  'Équipe première',
    level: 'Régionale 1',
  },
  memberCount: 300,
  teamCount:   18,

  /* ---------- Back-office du week-end (optionnel) ----------
     • Laissez VIDE → l'admin fonctionne en local (localStorage),
       sur un seul navigateur (idéal pour tester).
     • Pour partager le week-end EN LIGNE entre tous les visiteurs,
       créez un projet Supabase gratuit, puis collez ici :
         - l'URL du projet  (ex. https://xxxx.supabase.co)
         - la clé "publishable" (publique, sans risque)
       Voir le README pour la table "content" et le bucket "photos". */
  backend: {
    supabaseUrl: '',
    supabaseKey: '',
  },
};

window.CONFIG = CONFIG;
