# OBJECTIF

Crée un prototype mobile interactif et réaliste d'une application appelée provisoirement **« Assistant Commercial ERA »**, destinée aux agents immobiliers ERA France.

Il s'agit d'un prototype UX destiné à être testé avec de vrais agents immobiliers. L'objectif n'est donc pas de créer un CRM complexe, mais une expérience extrêmement simple, rapide et orientée action.

Le produit doit donner l'impression d'un **copilote commercial intelligent** qui aide l'agent à ne plus perdre d'informations après ses échanges avec des prospects et à savoir qui relancer, quand et pourquoi.

---

# CONTEXTE PRODUIT

Les agents immobiliers échangent quotidiennement avec de nombreux prospects acheteurs.

Après un appel, un rendez-vous ou une visite, beaucoup d'informations importantes restent dans la tête de l'agent ou ne sont pas suffisamment renseignées dans le CRM existant.

Le CRM ERA actuel reste l'outil transactionnel de référence, mais il est fermé : cette nouvelle application doit fonctionner comme un référentiel complémentaire et autonome.

Le problème principal à résoudre est la perte progressive des prospects, particulièrement ceux dont le projet immobilier est prévu dans plusieurs semaines ou plusieurs mois.

Le principe du produit est donc :

**L'agent parle → l'IA comprend → la fiche prospect est enrichie → l'IA qualifie le prospect → elle recommande la prochaine action → une relance est programmée.**

L'application ne doit jamais donner l'impression de demander du travail administratif supplémentaire.

Elle doit au contraire supprimer de la saisie et agir comme la mémoire commerciale de l'agent.

---

# UTILISATEUR CIBLE

Agent immobilier ERA utilisant principalement son smartphone.

Il travaille beaucoup en mobilité.

Il passe de nombreux appels.

Il utilise déjà WhatsApp / WhatsApp Business dans son activité quotidienne.

Il dispose de peu de temps pour saisir des comptes rendus après chaque interaction.

L'application doit donc être :

* mobile-first ;
* extrêmement rapide ;
* facile à comprendre ;
* orientée actions ;
* utilisable avec très peu de saisie manuelle ;
* professionnelle sans être austère.

---

# CANAL VOCAL

Le principal scénario de captation des comptes rendus est **WhatsApp**.

Après un appel ou un rendez-vous, l'agent peut envoyer un message vocal à l'assistant ERA via WhatsApp.

Exemple :

« Je viens d'avoir Sophie Martin. Elle cherche toujours un T3 sur Toulouse centre autour de 300 000 euros. Elle a vu sa banque mais attend encore son accord de financement. Elle souhaite acheter avant janvier. Elle veut absolument un balcon et idéalement un parking. Je pense qu'on devrait la rappeler dans trois semaines. »

L'IA analyse ensuite ce vocal et enrichit la fiche prospect correspondante.

Dans l'application elle-même, un agent doit également pouvoir sélectionner un prospect existant puis ajouter :

* une note écrite ;
* un compte rendu vocal ;
* une tâche.

Le vocal peut également servir à créer une tâche spontanée.

Exemple :

« Rappelle-moi jeudi de contacter Julien Morel pour savoir s'il a reçu son accord de prêt. »

---

# PRINCIPES UX FONDAMENTAUX

Ne conçois PAS cette application comme un CRM traditionnel.

L'écran principal ne doit pas être rempli de statistiques, graphiques ou tableaux de bord complexes.

La question à laquelle l'accueil doit répondre est :

**« Qu'est-ce que je dois faire aujourd'hui ? »**

L'interface doit mettre en avant les actions commerciales importantes.

La base prospects existe en arrière-plan, mais elle est au service de l'action.

Utiliser une navigation inférieure mobile simple avec 3 entrées principales :

**Accueil**
**Prospects**
**Ajouter**

Le bouton « Ajouter » peut être visuellement plus important.

---

# IDENTITÉ VISUELLE

Le prototype représente une application officielle ERA France.

Utiliser une esthétique moderne, premium, sobre et rassurante correspondant au secteur immobilier.

Palette :

* couleur principale / boutons : `#850831`
* fond principal légèrement chaud : `#FFF1EA`
* blanc : `#FFFFFF`
* rouge du logo ERA : `#D00C29`
* bleu du logo ERA : `#1A2A63`

Utiliser beaucoup de blanc et `#FFF1EA` pour éviter une interface trop sombre.

`#850831` doit principalement servir aux CTA, éléments sélectionnés et accents importants.

Utiliser le rouge ERA avec parcimonie.

Design :

* cartes légèrement arrondies ;
* ombres très légères ;
* espacements généreux ;
* excellente hiérarchie typographique ;
* boutons facilement utilisables au pouce ;
* icônes simples ;
* aucune surcharge graphique ;
* interface professionnelle mais humaine.

Ne pas inventer un nouveau logo ERA. Prévoir simplement un emplacement propre pour le logo officiel.

---

# ÉCRAN 1 — ACCUEIL / ASSISTANT COMMERCIAL

Créer l'écran principal de l'application.

En haut :

Logo ERA.

Puis :

**Bonjour Nicolas 👋**

Sous-titre :

**Voici ce qui mérite votre attention aujourd'hui.**

Afficher ensuite une synthèse légère :

**4 relances aujourd'hui**
**2 prospects à réactiver**

Ne pas transformer ces informations en gros dashboard statistique.

Créer ensuite la section principale :

## À faire aujourd'hui

Première carte :

**Sophie Martin**

Badge :

**TIÈDE**

Informations secondaires :

T3 • Toulouse Centre
Budget : 300 000 €

Message contextuel :

**Financement en attente**

Action recommandée :

📞 **Faire un point sur l'accord bancaire**

Afficher :

**Aujourd'hui**

Boutons :

**Voir la fiche**
**Terminé**

---

Deuxième carte :

**Julien Morel**

Badge :

**FROID**

Informations :

Maison • Balma
Budget : 450 000 €

Contexte :

**Projet initialement prévu pour l'automne**

Action :

💬 **Réactiver le projet**

Boutons :

**Voir la fiche**
**Terminé**

---

Créer ensuite une section moins prioritaire :

## À venir

Afficher par exemple :

**Camille Bernard**
Relance dans 3 jours

**Thomas Garcia**
Relance le 28 septembre

L'écran doit immédiatement faire comprendre :

**« Je n'ai plus besoin de me souvenir de mes relances : mon assistant le fait pour moi. »**

---

# ÉCRAN 2 — LISTE DES PROSPECTS

Titre :

**Prospects**

Ajouter une barre de recherche :

**Rechercher un prospect**

Ajouter des filtres simples sous forme de chips :

**Tous**
**Chaud**
**Tiède**
**Froid**

Ajouter éventuellement un filtre :

**À relancer**

Ne pas afficher trop de colonnes : il s'agit d'une interface mobile.

Chaque prospect apparaît sous forme de carte ou ligne claire.

Exemple :

**Sophie Martin**
🟠 Tiède
T3 • Toulouse Centre
300 000 €
**Relance : aujourd'hui**

---

**Julien Morel**
🔵 Froid
Maison • Balma
450 000 €
**Relance : aujourd'hui**

---

**Émilie Laurent**
🔴 Chaud
T4 • Toulouse / Côte Pavée
520 000 €
**Relance : demain**

Permettre de toucher une ligne pour ouvrir la fiche prospect.

Ajouter un bouton visible :

**+ Nouveau prospect**

---

# ÉCRAN 3 — FICHE PROSPECT

Créer une fiche détaillée pour :

**Sophie Martin**

En haut :

Sophie Martin
Badge **TIÈDE**

Téléphone : 06 12 34 56 78
Email : [sophie.martin@example.fr](mailto:sophie.martin@example.fr)

Ajouter deux actions rapides :

**Appeler**
**WhatsApp**

Puis créer plusieurs sections clairement séparées.

## Projet immobilier

Type : Appartement
Typologie : T3
Secteur : Toulouse Centre
Budget : 300 000 €
Horizon : avant janvier

## Financement

Situation : En cours
Banque consultée : Oui
Accord bancaire : En attente
Apport : 30 000 €

## Critères recherchés

Balcon — indispensable
Parking — souhaité
Minimum 2 chambres

## Motivations et freins

Motivation :

**Recherche active d'une résidence principale.**

Frein actuel :

**Accord bancaire en attente.**

---

Créer ensuite une carte très visible :

## Prochaine action

📅 **15 octobre**

📞 **Faire un point sur l'accord bancaire**

Canal recommandé :

**WhatsApp**

Ajouter :

**Modifier la relance**

---

Puis une section :

## Historique

19 septembre 2026

🎙️ **Compte rendu vocal**

« Recherche toujours active. Accord bancaire en attente. Souhaite acheter avant janvier. »

---

12 septembre 2026

🎙️ **Premier échange**

« Recherche d'un T3 sur Toulouse centre. Budget environ 300 000 €. »

---

Ajouter en bas un CTA important :

**+ Ajouter une note ou une tâche**

Lorsqu'il est pressé, ouvrir une bottom sheet permettant :

🎙️ **Compte rendu vocal**

✏️ **Note écrite**

✓ **Créer une tâche**

---

# ÉCRAN 4 — ANALYSE IA APRÈS UN VOCAL

Cet écran est essentiel.

Il doit représenter ce qui se passe lorsqu'un vocal WhatsApp vient d'être analysé.

Créer un écran ou une bottom sheet avec :

✨ **Compte rendu analysé**

Sous-titre :

**Voici ce que l'assistant a compris.**

Prospect :

**Sophie Martin**

---

## Informations détectées

Projet : T3

Zone : Toulouse Centre

Budget : 300 000 €

Financement : Accord bancaire en attente

Horizon : Avant janvier

Critères importants :

Balcon
Parking
2 chambres minimum

---

## Qualification proposée

🟠 **TIÈDE**

Ajouter une explication courte :

**Recherche active • financement en cours • horizon de quelques mois**

Ne PAS utiliser de score numérique.

La qualification Chaud / Tiède / Froid est encore conceptuelle.

---

## Prochaine action recommandée

📞 **Faire un point sur l'accord bancaire**

**Date suggérée : 15 octobre 2026**

**Canal suggéré : WhatsApp**

Ajouter un petit bloc :

### Message suggéré

« Bonjour Sophie, je reviens vers vous concernant votre projet d'achat. Avez-vous eu un retour de votre banque concernant votre financement ? »

Afficher clairement que ce message est seulement une **suggestion** et qu'il n'est pas envoyé automatiquement.

CTA principal :

**Valider la relance**

CTA secondaire :

**Modifier**

Une fois validé, afficher un petit feedback :

✓ **Relance programmée**

**Ajoutée à votre agenda.**

---

# ÉCRAN 5 — CRÉATION D'UN PROSPECT

Créer un parcours volontairement extrêmement simple.

Titre :

**Nouveau prospect**

Sous-titre :

**Ajoutez seulement l'essentiel. Vous pourrez compléter la fiche plus tard.**

Champs :

**Prénom**

**Nom**

Puis :

**Téléphone**

**Email**

Afficher clairement que :

**Un numéro de téléphone ou une adresse email est nécessaire.**

Ne rendre aucun autre champ obligatoire.

Ajouter une section optionnelle repliable :

**+ Ajouter des informations sur le projet**

Elle peut contenir :

* type de bien ;
* secteur ;
* budget ;
* financement ;
* apport ;
* surface ;
* nombre de pièces ;
* nombre de chambres ;
* horizon ;
* motivations ;
* freins ;
* critères indispensables ;
* critères secondaires ;
* source du lead ;
* notes.

CTA :

**Créer le prospect**

Après création :

✓ Prospect créé

Puis proposer :

**🎙 Ajouter un premier compte rendu**

---

# MODAL — AJOUT RAPIDE

Depuis le bouton central « Ajouter » de la navigation, ouvrir une bottom sheet.

Titre :

**Que souhaitez-vous ajouter ?**

Options :

**👤 Nouveau prospect**

**🎙 Compte rendu prospect**

**✓ Tâche**

Si l'utilisateur choisit :

**Compte rendu prospect**

afficher d'abord :

**Sélectionner un prospect**

avec une barre de recherche.

Une fois le prospect sélectionné :

**Sophie Martin**

proposer :

🎙️ **Enregistrer un vocal**

ou

✏️ **Écrire une note**

---

# CRÉATION D'UNE TÂCHE PAR LA VOIX

Prévoir également une petite interaction démontrable.

L'utilisateur choisit :

**Créer une tâche**

puis utilise le microphone.

Afficher :

🎙️ **Je vous écoute...**

Exemple de transcription :

« Rappelle-moi jeudi de contacter Julien Morel pour savoir s'il a reçu son accord de prêt. »

Puis afficher l'analyse :

✓ **Tâche comprise**

Prospect :

**Julien Morel**

Action :

**Appeler**

Date :

**Jeudi 24 septembre**

Motif :

**Vérifier l'accord de prêt**

Boutons :

**Modifier**
**Ajouter à mon agenda**

---

# SYNCHRONISATION AGENDA

Dans ce prototype, considérer que les tâches validées peuvent être synchronisées avec l'agenda professionnel de l'agent.

Ne pas créer un écran complexe de configuration.

Lorsque l'utilisateur valide une relance, afficher simplement :

✓ **Relance programmée**

**Ajoutée à votre agenda.**

L'objectif est de matérialiser le bénéfice, pas de concevoir l'intégration technique.

---

# QUALIFICATION

Utiliser uniquement :

**CHAUD**
**TIÈDE**
**FROID**

Ne jamais afficher de score sur 100.

Les règles définitives de scoring ne sont pas encore établies.

Pour le prototype, utiliser des règles plausibles uniquement afin de démontrer le concept.

Toujours rendre la qualification IA compréhensible grâce à 2 ou 3 éléments factuels.

Exemple :

**TIÈDE**

Recherche active • financement en cours • horizon 3–6 mois

L'agent doit pouvoir modifier manuellement la qualification.

---

# COMPORTEMENT DE L'IA

L'IA ne doit pas apparaître comme un chatbot omniprésent.

Elle agit discrètement en arrière-plan.

Son rôle est de :

1. comprendre les comptes rendus vocaux ;
2. extraire les informations commerciales ;
3. enrichir la fiche prospect ;
4. identifier les changements par rapport aux échanges précédents ;
5. proposer une qualification ;
6. déterminer une prochaine action pertinente ;
7. proposer une date de relance ;
8. suggérer le canal de communication ;
9. éventuellement proposer le contenu d'un message ;
10. créer une tâche après validation de l'agent.

L'agent reste toujours décisionnaire.

---

# DONNÉES PROSPECTS

Prévoir dans le modèle de données les champs suivants, même s'ils ne sont pas tous visibles immédiatement :

* prénom ;
* nom ;
* téléphone ;
* email ;
* source du lead ;
* responsable commercial ;
* type de projet ;
* type de bien ;
* secteurs recherchés ;
* budget minimum ;
* budget maximum ;
* financement ;
* apport ;
* surface ;
* nombre de pièces ;
* nombre de chambres ;
* critères indispensables ;
* critères secondaires ;
* motivations ;
* freins ;
* horizon temporel ;
* qualification Chaud / Tiède / Froid ;
* historique des interactions ;
* notes ;
* prochaine relance ;
* type de relance ;
* canal recommandé.

Seuls sont obligatoires lors de la création :

**Prénom + nom + téléphone OU email.**

---

# IMPORTANT — PHILOSOPHIE DU PRODUIT

Ne jamais donner l'impression que l'agent doit « gérer un CRM supplémentaire ».

Le produit doit ressembler à un **assistant personnel commercial**.

Éviter :

* les tableaux complexes ;
* les nombreux champs obligatoires ;
* les statistiques inutiles ;
* les formulaires longs ;
* les menus profonds ;
* les fonctionnalités d'administration ;
* les graphiques ;
* les écrans de configuration complexes.

Privilégier :

* les prochaines actions ;
* le contexte utile ;
* la voix ;
* les suggestions IA ;
* les raccourcis ;
* les fiches synthétiques ;
* la rapidité.

La promesse implicite de chaque écran doit être :

**« Vous vous concentrez sur vos clients. L'assistant se charge de la mémoire et des relances. »**

---

# PROTOTYPE INTERACTIF

Créer de vraies interactions entre les écrans.

Le prototype doit permettre de démontrer au minimum ce scénario :

**Accueil**
→ toucher Sophie Martin
→ ouvrir sa fiche
→ consulter son projet et son historique
→ ajouter un compte rendu
→ afficher l'analyse IA
→ voir la qualification proposée
→ voir la prochaine action recommandée
→ modifier ou valider la relance
→ confirmation d
