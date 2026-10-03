# Produit

Prototype UX de l'Assistant commercial ERA, pour des agents immobiliers ERA France. Ce n'est pas un CRM. Le CRM ERA reste l'outil transactionnel. Cette app est une mémoire commerciale autonome, orientée action.

## Promesse

L'agent parle, l'assistant comprend, la fiche s'enrichit, le prospect est qualifié, une prochaine action et une relance sont proposées.

Question de l'accueil : qu'est-ce que je dois faire aujourd'hui ?

L'agent reste décisionnaire. L'IA n'est pas un chatbot. Elle travaille en arrière-plan : extraction, mise à jour de fiche, qualification, prochaine action, date, canal, message suggéré. Rien n'est envoyé tout seul.

## Utilisateur

Agent immobilier ERA, surtout sur smartphone, entre deux appels, déjà sur WhatsApp. Peu de temps pour saisir un compte rendu. L'interface est mobile-first, rapide, avec peu de champs obligatoires.

Persona de démo : Nicolas.

## Canal principal

Après un appel ou une visite, l'agent envoie un vocal WhatsApp à l'assistant. L'app affiche ensuite ce qui a été compris et déjà appliqué, et laisse corriger.

Le vocal peut aussi créer une tâche spontanée. Ce second parcours n'est pas dans le prototype actuel.

## Qualification

Uniquement CHAUD, TIÈDE, FROID. Jamais de score sur 100. Les règles de scoring ne sont pas figées. Toujours expliquer la qualification par 2 ou 3 faits (financement, horizon, activité du projet). L'agent peut la modifier.

## À ne pas construire

Tableaux, graphiques, dashboards statistiques, formulaires longs, menus profonds, écrans d'admin ou de configuration, champs obligatoires au-delà du minimum, envoi automatique de messages.

Création d'un prospect, si elle est ajoutée : prénom, nom, et téléphone ou email. Le reste est optionnel.

## Sources

Le brief d'origine et les refontes de la fiche sont dans `src/imports/pasted_text/`. En cas d'écart, `src/App.tsx` fait foi pour l'état actuel. Les écarts sont listés dans `docs/ecrans.md`.
