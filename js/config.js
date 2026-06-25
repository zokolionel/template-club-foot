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

  /* ---------- Couleurs (pilotent tout le thème du site) ----------
     primary   = couleur dominante (header, titres, fonds sombres)
     secondary = couleur d'action (boutons, accents forts)
     accent    = couleur de détail (surlignages, badges)             */
  colors: {
    primary:   '#1F2A44',
    secondary: '#2E7D5B',
    accent:    '#E8B43A',
  },

  /* ---------- Coordonnées ---------- */
  email: 'contact@votreclub.fr',
  phone: '',                 // ex. '01 23 45 67 89' — laissez vide pour masquer la ligne
  address: {
    street: '1 avenue du Stade',
    zip:    '00000',
    city:   'Votre Ville',
  },

  /* ---------- Logo (remplacez par le logo de votre club) ---------- */
  logoUrl: 'images/logo.svg',

  /* ---------- Réseaux sociaux (URL complète) ---------- */
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
};

window.CONFIG = CONFIG;
