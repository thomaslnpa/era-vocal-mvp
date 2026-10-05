# Données

Deux sources, fusionnées par `useProspects()` dans `src/App.tsx` :

- Réel : table `eravocal.acheteurs` (Supabase, lecture seule avec la clé anon), mise à jour en temps réel (Realtime). `acheteurToProspect` convertit une ligne en `Prospect` : `score` rouge/orange/vert vers `ROUGE`/`ORANGE`/`VERT` (valeurs de la base), champs absents laissés vides (affichés `-`), pas de relance ni d'historique.
- Démo : `PROSPECTS` (5 fiches fictives, `isDemo: true`, pastille « Démo »). Seules ces fiches affichent les valeurs en dur de la fiche détail (`d()` dans `DetailScreen`) et les tâches.

L'accueil (`HomeScreen`) n'utilise que `PROSPECTS`. Client : `src/lib/supabase.ts`, types : `src/lib/database.types.ts` (`supabase gen types typescript --linked --schema eravocal`). Droits `anon` : voir `supabase/anon_lecture_eravocal.sql`.

## Schéma `eravocal`

Tables du workflow : `agents`, `acheteurs`, `debriefs`, `validations_en_attente`, `sessions`, `rappels`.

`rappels` est une liste de tâches, plusieurs lignes par acheteur. Colonnes ajoutées au texte d'origine : `echeance` (date), `statut` (texte, valeur observée `a_faire`), `canal`, `contexte`, `message_suggere`, `termine_le` (timestamptz). `canal`, `contexte`, `message_suggere` et `termine_le` sont nuls sur les lignes existantes. Le workflow n'écrit que `echeance`, `texte`, `canal` et `message_suggere`, plus les clés `agent_id` et `acheteur_id`. Un `OK` crée une nouvelle ligne. Il ne met plus à jour un rappel existant.

## Type `Prospect`

Champs présents :

- `id`, `prenom`, `nom`, `tel`, `email`
- `qualification` : `ROUGE` | `ORANGE` | `VERT`
- `typeBien`, `typologie`, `secteur`, `budget`, `horizon` (chaînes affichées, pas des nombres)
- `relance` (clé de tri : `aujourd'hui`, `demain`, `dans 3 jours`, ou une date texte) et `relanceLabel`
- `isLate` optionnel
- `financement`, `apport`, `criteres` (liste de chaînes)
- `motivation`, `frein`
- `historique` : `{ date, type, resume }`, type `vocal` | `note` | `tache`
- `prochaineAction`, `prochaineActionDate`, `canal`, `messageSuggere`

Cinq fiches : Sophie Martin (ORANGE), Julien Morel (ROUGE, seul `isLate`), Émilie Laurent (VERT), Camille Bernard (ORANGE), Thomas Garcia (ROUGE).

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

`Rouge` / `Orange` / `Vert` comparent `qualification` à `filter.toUpperCase()`. `À relancer` teste seulement `relance === "aujourd'hui"`.
