# Données

Tout est en mémoire dans `src/App.tsx`. Pas d'API, pas de persistance, pas de base. Recharger la page restaure `PROSPECTS`.

## Type `Prospect`

Champs présents :

- `id`, `prenom`, `nom`, `tel`, `email`
- `qualification` : `CHAUD` | `TIÈDE` | `FROID`
- `typeBien`, `typologie`, `secteur`, `budget`, `horizon` (chaînes affichées, pas des nombres)
- `relance` (clé de tri : `aujourd'hui`, `demain`, `dans 3 jours`, ou une date texte) et `relanceLabel`
- `isLate` optionnel
- `financement`, `apport`, `criteres` (liste de chaînes)
- `motivation`, `frein`
- `historique` : `{ date, type, resume }`, type `vocal` | `note` | `tache`
- `prochaineAction`, `prochaineActionDate`, `canal`, `messageSuggere`

Cinq fiches : Sophie Martin (TIÈDE), Julien Morel (FROID, seul `isLate`), Émilie Laurent (CHAUD), Camille Bernard (TIÈDE), Thomas Garcia (FROID).

## Ce que le type ne porte pas

Le brief prévoit aussi source du lead, agent responsable, budgets min/max, surface, pièces, chambres, critères indispensables et secondaires séparés, notes. Sur la fiche, ces idées sont des lignes en dur dans le JSX, identiques quel que soit le prospect ouvert.

Les tâches du carrousel fiche (`ProspectTask`) ne sont pas stockées sur `Prospect`. Deux d'entre elles sont recréées à chaque rendu.

L'écran d'analyse a son propre état React (`prospectSituation`, `budget`, `criteres`, tâche, `qualif`). Il n'écrit pas dans `PROSPECTS`.

## État d'application

Dans `App` :

- `screen`
- `navTab` : `home` | `prospects` (la fiche revient sur cet onglet)
- `selectedProspect` : copie de l'objet au moment du clic, défaut `PROSPECTS[0]`

`done`, textes de tâches, feuilles d'édition et accordéons vivent dans le composant. Marquer une tâche terminée ne change pas `PROSPECTS`.

## Règles d'affichage accueil

- En retard : `isLate`
- Aujourd'hui : `relance === "aujourd'hui"` et pas `isLate`
- À venir : `relance !== "aujourd'hui"`

Julien a `relance: "aujourd'hui"` et `isLate: true`, donc il n'apparaît que dans En retard.

## Filtres liste

`Chaud` / `Tiède` / `Froid` comparent `qualification` à `filter.toUpperCase()` (`TIÈDE`, `FROID`, `CHAUD`). `À relancer` teste seulement `relance === "aujourd'hui"`.
