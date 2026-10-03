# Écrans

Pas de routeur. L'écran actif est l'état `screen` dans `App` : `home`, `prospects`, `detail`, `ai-analysis`.

Navigation visible : Accueil et Prospects. Barre basse en dessous de `md`, menu latéral à partir de `md`. Le menu est masqué sur la fiche et sur l'analyse.

## Accueil

`HomeScreen`. Fond chaud, salutation « Bonjour Yohann », deux compteurs (tâches en retard, tâches aujourd'hui), puis :

1. Carrousel « Derniers messages WhatsApp » (fond vert). Trois cartes en dur. Seule Sophie Martin ouvre `ai-analysis`. Julien et Émilie n'ont pas d'action.
2. Section « En retard » : prospects avec `isLate` (Julien Morel).
3. Section « À faire aujourd'hui » : `relance === "aujourd'hui"` et pas en retard (Sophie Martin).
4. Section « À venir » : les autres, liste compacte.

Carte d'action (`ActionCard`) : nom, badge, bien, contexte = frein, action recommandée. Pied : Voir fiche, Message, Appel. Le cercle en haut à droite marque la tâche terminée dans l'état local du composant, perdu au changement d'écran. Appel n'a pas de handler.

Message ouvre `MessageModal` : texte suggéré, avertissement qu'il n'est pas envoyé, bouton Copier.

## Prospects

`ProspectsScreen`. Recherche sur prénom + nom. Filtres : Tous, Chaud, Tiède, Froid, À relancer.

« À relancer » ne garde que `relance === "aujourd'hui"`. Ce n'est pas le retard ni les relances futures.

Un tap ouvre la fiche. Pas de bouton « Nouveau prospect ».

## Fiche prospect

`DetailScreen`. Ordre réel :

1. Retour vers l'onglet d'où on vient (`navTab`).
2. Nom, badge, téléphone, email, boutons Appeler et WhatsApp (sans handler).
3. Carrousel « Prochaines actions » : `ProspectTaskCard`, largeur fixe, la carte suivante dépasse.
4. Deux colonnes à partir de `lg` : Informations prospect, Projet immobilier, Financement, puis Critères, Motivations et freins, Historique.

Chaque bloc métier a Modifier, qui ouvre `SimpleEditSheet`. Cette feuille est un placeholder : Annuler et Enregistrer ferment sans écrire les champs.

Informations, Projet et Financement ont Voir plus / Voir moins. Les lignes visibles viennent en partie du prospect (type, budget, apport, critères, motivation, frein, historique). Le reste est le même texte pour tous les prospects (locataire, CDI, 3 200 €, banque consultée, etc.).

Historique : types `vocal`, `note`, `tache`. Vocal et note se déplient. La « transcription complète » est une phrase générée, pas le vocal d'origine. Une tâche d'historique est affichée en entier, sans dépliage.

Tâches du carrousel : la première reprend `prochaineAction` du prospect. Les deux suivantes sont fixes (15 octobre, 28 octobre) pour tous. Modifier sur une tâche édite intitulé, date et contexte en local. Message réutilise `MessageModal`. Pas de bouton fixe « Ajouter une note ou une tâche ».

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
- Enregistrement vocal et création de tâche par la voix.
- Confirmation « relance programmée / ajoutée à l'agenda ».
- CTA fixe d'ajout sur la fiche.
- Édition réelle des sections de la fiche, et qualification modifiable dans le header de la fiche.
