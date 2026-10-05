# Données

Deux sources, réelles et démo, pour les prospects comme pour les tâches. Tout est dans `src/App.tsx`.

## Prospects

Fusionnés par `useProspects()` :

- Réel : table `eravocal.acheteurs` (Supabase, lecture avec la clé anon, écriture limitée à `freins` et `motivations`), mise à jour en temps réel (Realtime). `acheteurToProspect` convertit une ligne en `Prospect` : `score` rouge/orange/vert vers `ROUGE`/`ORANGE`/`VERT` (valeurs de la base), champs absents laissés vides (affichés `-`), pas d'historique propre.
- Démo : `PROSPECTS` (5 fiches fictives, `isDemo: true`, pastille « Démo »). Seules ces fiches affichent les valeurs en dur de la fiche détail (`d()` dans `DetailScreen`).

Client : `src/lib/supabase.ts`, types générés : `src/lib/database.types.ts` (`supabase gen types typescript --linked --schema eravocal`). Droits `anon` : voir `supabase/migrations/`.

### Type `Prospect`

- `id`, `prenom`, `nom`, `tel`, `email`
- `qualification` : `ROUGE` | `ORANGE` | `VERT`
- `typeBien`, `typologie`, `secteur`, `budget`, `horizon` (chaînes affichées, pas des nombres)
- `financement`, `apport`, `criteres` (liste de chaînes)
- `motivations`, `freins` : listes de phrases courtes. Réel : colonnes `text[]` de `acheteurs` (migration `20261005160000_eravocal_freins_motivations.sql`), alimentées par l'agent WhatsApp après validation et modifiables sur la fiche (`modifierListes` de `useProspects`, mise à jour optimiste puis `update`). Démo : état local, perdu au rechargement.
- `historique` : `{ date, type, resume }`, type `vocal` | `note` | `tache`

Cinq fiches de démo : Sophie Martin (ORANGE), Julien Morel (ROUGE), Émilie Laurent (VERT), Camille Bernard (ORANGE), Thomas Garcia (ROUGE).

Le brief prévoit aussi source du lead, agent responsable, budgets min/max, surface, pièces, chambres, critères indispensables et secondaires séparés, notes. Sur la fiche, ces idées sont des lignes en dur dans le JSX, identiques quel que soit le prospect ouvert.

## Tâches

À l'écran, on dit toujours « Tâche ». En base, la table s'appelle `eravocal.rappels` (nom historique, conservé pour le workflow n8n).

Fusionnées par `useTaches()`, appelé une fois dans `App` et passé aux écrans (`tachesApi`) :

- Réel : `eravocal.rappels`, temps réel, converti par `rappelToTache`. `acheteur_id` est l'`id` du prospect réel.
- Démo : `TACHES_DEMO`, en mémoire. Échéances relatives au jour (`isoDuJour(-2)`, `isoDuJour(3)`...) pour que la démo reste cohérente quel que soit le jour. Perdues au rechargement.

### Type `Tache`

- `id`, `prospectId`
- `echeance` : `YYYY-MM-DD`, date locale. La tâche fonctionne au jour : une heure évoquée reste dans le texte (« Rappeler vers 18h »)
- `texte`, `contexte`, `messageSuggere`
- `canal` : `appel` | `whatsapp` | `email`
- `statut` : `a_faire` | `terminee` | `annulee`, `termineLe` (ISO) pour les deux derniers
- `isDemo` optionnel

Pas de limite de tâches par prospect.

### Actions

`terminer`, `annuler`, `modifier` (texte, échéance, contexte). Démo : mise à jour locale. Réel : mise à jour optimiste puis `update` Supabase, rechargement en cas d'erreur. L'app ne crée ni ne supprime de tâche : la création passe par l'agent WhatsApp.

Une tâche terminée ou annulée sort de l'accueil et apparaît en tête de l'historique de la fiche (types `tache` et `tache_annulee`).

### Table `eravocal.rappels`

Colonnes : `id`, `agent_id`, `acheteur_id`, `texte`, `echeance` (date, défaut jour courant à Paris), `statut` (défaut `a_faire`), `canal`, `contexte`, `message_suggere`, `termine_le`, `created_at`, `updated_at`. Migration : `supabase/migrations/20261005133000_eravocal_taches.sql`.

Droits `anon` (démo, pas pour la production) : lecture, et mise à jour de `statut`, `echeance`, `texte`, `contexte`, `termine_le` uniquement.

### Création par n8n

Le workflow (`EraVocal/workflow-n8n`, copie dans `.figma/workflow-n8n.json`) extrait du vocal ou du texte le prospect, le jour (`echeance_rappel`, calculé depuis la date du jour), le contenu, le canal, un message suggéré et un contexte (`contexte_rappel`, la raison de la tâche). Sans contexte dans le message, il reprend le premier frein de la fiche, sinon sa première motivation. Sans jour ou sans contenu, il demande de renvoyer la demande complète et n'écrit rien. Sinon il soumet un brouillon dans `validations_en_attente` ; sur « OK », il insère toujours une nouvelle ligne dans `rappels`.

### Freins et motivations par n8n

Le prompt extrait `freins_ajoutes`, `freins_leves`, `motivations_ajoutees` et `motivations_levees`. Ils sont fusionnés avec la fiche (retrait des éléments levés sans tenir compte des accents ni de la casse, ajout sans doublon), affichés dans le résumé à valider, puis écrits par « Créer la fiche » ou « Mettre à jour la fiche ». Pour une mise à jour choisie parmi des homonymes, la fusion se fait au moment du choix, à partir des listes de la fiche candidate.

Limites : un message n'a qu'une intention. Un frein dit dans une demande de tâche devient le contexte de la tâche, sans être ajouté à la fiche. Pas de complément en deux messages, et « décale le rappel » crée une nouvelle tâche. Le report se fait depuis l'app.

## État d'application

Dans `App` :

- `screen`
- `navTab` : `home` | `prospects` (la fiche revient sur cet onglet)
- `selectedId` : la fiche ouverte suit les mises à jour temps réel
- `tachesApi` : tâches et actions

Feuilles d'édition et accordéons vivent dans les composants. L'écran d'analyse a son propre état React (`prospectSituation`, `budget`, `criteres`, tâche, `qualif`) et n'écrit nulle part.

## Règles d'affichage accueil

Seules les tâches `a_faire` des prospects connus, triées par échéance (`classerTaches`) :

- En retard : échéance avant aujourd'hui
- Aujourd'hui : échéance égale à aujourd'hui
- Cette semaine : de demain à dimanche (semaine calendaire)
- Au-delà : visibles seulement sur la fiche

## Filtres liste

`Rouge` / `Orange` / `Vert` comparent `qualification` à `filter.toUpperCase()`. `À relancer` garde les prospects dont la prochaine tâche à faire est en retard ou aujourd'hui.
