# Écrans

Pas de routeur. L'écran actif est l'état `screen` dans `App` : `home`, `prospects`, `detail`, `ai-analysis`.

Navigation visible : Accueil et Prospects. Barre basse en dessous de `md`, menu latéral à partir de `md`. Le menu est masqué sur la fiche et sur l'analyse.

## Accueil

`HomeScreen`. Fond chaud, salutation « Bonjour Yohann », deux compteurs (tâches en retard, tâches aujourd'hui), puis :

1. Carrousel « Derniers messages WhatsApp » (fond vert). Trois cartes en dur. Seule Sophie Martin ouvre `ai-analysis`. Julien et Émilie n'ont pas d'action.
2. Tâches en trois groupes : « En retard », « Aujourd'hui », « Cette semaine » (de demain à dimanche). Chaque groupe a un compteur et un message s'il est vide. À partir de `md`, kanban à trois colonnes égales qui défilent seules (hauteur max 70vh). En dessous, onglets collants (« En retard », « Aujourd'hui », « Semaine ») et une seule liste pleine largeur qui défile avec la page ; l'onglet par défaut est « En retard » s'il contient des tâches, sinon « Aujourd'hui ». Les deux compteurs du haut ouvrent l'onglet correspondant.

Toutes les colonnes utilisent `ActionCard`. La ligne « Prévue : » est rouge en retard, verte aujourd'hui, bordeaux ensuite ; la carte calcule ces couleurs depuis l'échéance.

Tâches de démo et tâches réelles (Supabase) sont mêlées. Règles détaillées dans `docs/donnees.md`.

Carte d'action (`ActionCard`) : nom, badge, bien, contexte de la tâche, icône du canal et texte. En haut à droite, `TacheControles` : Modifier ou reporter (crayon), Annuler (croix, avec confirmation), Terminer (cercle). Pied : Voir fiche, Message, Appel. Appel n'a pas de handler.

Modifier ouvre `TacheEditSheet` : intitulé, date, contexte, raccourcis « Demain », « Dans 3 jours », « Dans 1 semaine ». Terminer, annuler ou reporter met à jour les compteurs et les sections immédiatement.

Message ouvre `MessageModal` : texte suggéré, avertissement qu'il n'est pas envoyé, bouton Copier. Sans message suggéré, la feuille l'indique et masque Copier.

## Prospects

`ProspectsScreen`. Recherche sur prénom + nom. Filtres : Tous, Rouge, Orange, Vert, À relancer.

« À relancer » garde les prospects dont la prochaine tâche à faire est en retard ou aujourd'hui. Chaque ligne affiche « Tâche : » et la date de la prochaine tâche, en rouge si elle est en retard.

Un tap ouvre la fiche. Pas de bouton « Nouveau prospect ».

## Fiche prospect

`DetailScreen`. Ordre réel :

1. Retour vers l'onglet d'où on vient (`navTab`).
2. Nom, badge, téléphone, email, boutons Appeler et WhatsApp (sans handler).
3. Carrousel « Prochaines actions » : `ProspectTaskCard`, largeur fixe, la carte suivante dépasse.
4. Deux colonnes à partir de `lg` : Informations prospect, Projet immobilier, Financement, puis Critères, Motivations et freins, Historique.

Chaque bloc métier a Modifier, qui ouvre `SimpleEditSheet`. Cette feuille est un placeholder : Annuler et Enregistrer ferment sans écrire les champs. Exception : Motivations et freins ouvre `ListesEditSheet` (retrait par croix, ajout par champ et bouton ou Entrée), enregistré en base pour une fiche réelle.

Motivations et freins : deux listes de pastilles (freins en orange `#E07B39`), `-` si vide.

Informations, Projet et Financement ont Voir plus / Voir moins. Les lignes visibles viennent en partie du prospect (type, budget, apport, critères, motivations, freins, historique). Le reste est le même texte pour tous les prospects (locataire, CDI, 3 200 €, banque consultée, etc.).

Historique : types `vocal`, `note`, `tache`, `tache_annulee`. Les tâches terminées ou annulées du prospect arrivent en tête, la plus récente d'abord (« Tâche réalisée » ou « Tâche annulée »). Vocal et note se déplient. La « transcription complète » est une phrase générée, pas le vocal d'origine. Une tâche d'historique est affichée en entier, sans dépliage.

Tâches du carrousel (`ProspectTaskCard`) : toutes les tâches à faire du prospect, y compris au-delà de la semaine, triées par échéance. Mêmes contrôles que sur l'accueil (`TacheControles`, `TacheEditSheet`). Message réutilise `MessageModal`. Pas de bouton fixe « Ajouter une note ou une tâche » : les tâches naissent sur WhatsApp.

## Analyse d'un message WhatsApp

`AIAnalysisScreen`, ouvert depuis la carte Sophie de l'accueil. Retour vers l'accueil.

Le sous-titre dit que les modifications sont déjà appliquées et validées depuis WhatsApp. Ce n'est pas l'écran « voici ce que l'assistant a compris, validez » du brief d'origine.

Contenu, état local, non relié au tableau `PROSPECTS` :

- Prospect identifié : Sophie Martin (le bouton Modifier du bandeau n'édite rien).
- Quatre changements : situation CDD vers CDI, budget 450 000 € vers 500 000 €, critères terrasse et parking, tâche « Envoyer les nouvelles annonces ».
- Qualification ROUGE vers ORANGE, modifiable.
- Transcription dans `TranscriptionAccordion`.

Ces valeurs (budget 500 000 €, secteur Carmes / Esquirol) contredisent la fiche Sophie (300 000 €, Toulouse Centre). C'est volontaire pour la démo du vocal, pas une source de vérité.

## Absent du prototype

Prévu dans les briefs, pas dans `App.tsx` :

- Onglet Ajouter et bottom sheet (nouveau prospect, compte rendu, tâche).
- Création de prospect.
- Enregistrement vocal dans l'app. La création de tâche par la voix existe, mais côté workflow n8n, pas dans l'app.
- Confirmation « relance programmée / ajoutée à l'agenda ».
- CTA fixe d'ajout sur la fiche.
- Édition réelle des sections de la fiche, et qualification modifiable dans le header de la fiche.
