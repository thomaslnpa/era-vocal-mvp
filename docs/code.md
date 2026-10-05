# Code

Prototype Figma Make : React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4 via `@tailwindcss/vite`. Pas de router, pas de librairie UI, pas de tests.

## Où écrire

L'application est un seul module : `src/App.tsx`. `src/main.tsx` monte `App` dans `#root` et importe `src/index.css`.

Ne pas découper en fichiers tant que ce n'est pas demandé. Si un jour le fichier est scindé, le plugin Vite de Figma Make recharge la page quand un module perd sa frontière React Refresh : un fichier qui ne fait que ré-exporter peut laisser l'ancien arbre monté jusqu'au reload.

Alias `@` vers `src` dans `vite.config.ts`. Le serveur de dev tourne déjà, port `$PORT` ou 8443. Ne pas le relancer.

Styles globaux et `@theme` : `src/index.css`. Pas de `tailwind.config`. Les `@import` CSS restent en tête de fichier.

Formatage : `pnpm format` (oxfmt). Toolchain dans `.mise.toml`.

## Conventions du fichier

- Composants fonctionnels, état local `useState`, pas de store. Les tâches sont l'exception : `useTaches()` dans `App`, passé aux écrans.
- Données de démo : constantes `PROSPECTS` et `TACHES_DEMO` en tête de fichier. Dates de démo relatives au jour (`isoDuJour`), jamais en dur.
- Navigation par `setScreen`, pas par URL.
- Textes UI en français, vouvoiement dans les messages suggérés, signature « Yohann ».
- Classes Tailwind dans le JSX, couleurs en hex arbitraires.
- Handlers vides ou boutons sans `onClick` sont des trous de prototype, pas des oublis à « brancher » sur une API.

## Limites à respecter

- L'app lit `eravocal.acheteurs` et `eravocal.rappels`. Écritures : terminer, annuler ou modifier une tâche (`rappels`), et modifier les freins et motivations d'un prospect (`acheteurs.freins`, `acheteurs.motivations`), colonnes autorisées à `anon`. Pas de création ni de suppression, pas d'auth, pas d'envoi WhatsApp réel.
- Toute évolution du schéma passe par une migration dans `supabase/migrations/`, puis régénération de `src/lib/database.types.ts`.
- Ne pas transformer une feuille placeholder (`SimpleEditSheet`) en formulaire complet sans demande : le brief de fiche veut une édition par section, le code ne l'a pas encore.
- Ne pas aligner de force l'analyse WhatsApp sur la fiche Sophie : les deux jeux de chiffres illustrent deux moments (fiche actuelle et vocal plus récent).
- `vite.config.ts` et `.figma/` appartiennent au socle Figma Make. Ne pas les modifier pour une tâche UI.

## Briefs collés

`src/imports/pasted_text/` conserve les demandes d'origine. S'en servir pour l'intention, puis vérifier `docs/ecrans.md` avant de réimplémenter un écran déjà présent.
