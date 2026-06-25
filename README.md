# Template Site Club de Foot

Un site web **complet, responsive et personnalisable** pour un club de football
amateur. HTML / CSS / JavaScript pur — **aucun framework, aucune dépendance,
aucun build**.

👉 Page vitrine de présentation : ouvrez **`demo.html`** (sélecteur de thème en direct).

---

## 🚀 Démarrage rapide

1. Ouvrez **`js/config.js`** et remplissez les informations de votre club
   (nom, ville, couleurs, contact, réseaux, compteurs…).
2. Remplacez **`images/logo.svg`** par le logo de votre club
   (gardez le même nom, ou changez `logoUrl` dans la config).
3. Ouvrez `index.html` dans un navigateur. C'est tout.

> Tout le **header**, le **footer** et la **page d'accueil** se mettent à jour
> automatiquement à partir de `config.js`. Les **3 couleurs** recolorent
> l'intégralité du site.

---

## 🎨 Personnaliser les couleurs

Dans `js/config.js` :

```js
colors: {
  primary:   '#1F2A44',  // dominante (header, titres, fonds sombres)
  secondary: '#2E7D5B',  // action (boutons, accents forts)
  accent:    '#E8B43A',  // détails (badges, surlignages)
}
```

Ces valeurs pilotent les variables CSS `--primary / --secondary / --accent`.
Les nuances foncées/claires sont dérivées automatiquement.

---

## 📁 Structure

```
template-club-foot/
├── index.html          Accueil
├── club.html           Le Club (histoire, valeurs, staff)
├── equipes.html        Nos équipes (par pôle)
├── actualites.html     Actualités (filtrables) + galerie
├── partenaires.html    Partenaires (formules + formulaire)
├── rejoindre.html      Inscriptions (formulaire)
├── boutique.html       Boutique
├── contact.html        Contact (carte + formulaire)
├── demo.html           ⭐ Page vitrine (sélecteur de thème en direct)
├── css/style.css       Styles (variables de thème)
├── js/
│   ├── config.js       ⭐ LE fichier à éditer
│   └── main.js         Moteur (injection config, menu, filtres, formulaires)
└── images/
    └── logo.svg        Logo (à remplacer)
```

---

## ✏️ Contenu éditorial

`config.js` gère **l'identité** du club (nom, couleurs, contact…), mais pas le
contenu rédactionnel. Les articles, équipes, partenaires et produits livrés sont
des **exemples** : modifiez-les directement dans les fichiers `.html`
correspondants.

Les **formulaires** (contact, inscription, partenariat) affichent un message de
succès de démonstration. Pour recevoir réellement les messages, branchez-les sur
[Formspree](https://formspree.io) (voir le commentaire au-dessus de chaque
`<form>`).

---

## 🗓️ Back-office du week-end (`admin.html`)

Une interface protégée par mot de passe pour gérer **le programme, les résultats
et l'actualité du week-end** (avec photo) — sans toucher au code.

- Accès : `admin.html` · mot de passe par défaut **`admin2026`** (modifiable dans `js/admin.js`)
- L'accueil affiche automatiquement le programme, les 3 derniers résultats et la dernière actu.

**Deux modes :**
- **Local** (par défaut) : données dans le navigateur (localStorage). Parfait pour tester,
  mais visible uniquement sur l'appareil qui saisit.
- **En ligne** (recommandé en production) : renseignez `backend` dans `js/config.js` avec un
  projet **Supabase** gratuit → les données et les photos sont partagées avec **tous les visiteurs**.

Pour activer le mode en ligne : créez un projet sur supabase.com, exécutez le SQL ci-dessous,
créez un bucket Storage **public** nommé `photos`, puis collez votre URL de projet et votre clé
« publishable » dans `CONFIG.backend`.

<details><summary>SQL à exécuter dans Supabase</summary>

```sql
create table if not exists public.content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.content enable row level security;
create policy "Lecture publique"   on public.content for select to anon using (true);
create policy "Ecriture publique"  on public.content for insert to anon with check (true);
create policy "Mise a jour publique" on public.content for update to anon using (true) with check (true);

-- Après avoir créé un bucket public nommé "photos" :
create policy "Upload public dans photos"
  on storage.objects for insert to anon with check (bucket_id = 'photos');
```
</details>

## 🌐 Déploiement

Site 100 % statique → se déploie en 1 clic, sans configuration :

- **Vercel** : importez le dossier, Framework Preset = `Other`, pas de build.
- **Netlify** : glissez-déposez le dossier.
- **GitHub Pages** : poussez le dossier, activez Pages sur la branche.
