MODIFICATION CIBLÉE — CARDS « PROCHAINES ACTIONS » DE LA FICHE PROSPECT
Modifie uniquement les cards présentes dans la section « PROCHAINES ACTIONS » de la fiche prospect Sophie Martin.
Le design actuel de ces cards n'est pas correct.
IMPORTANT — RÉUTILISER LE COMPOSANT DU DASHBOARD
Sur le Dashboard, dans les sections « EN RETARD » et « À FAIRE AUJOURD'HUI », il existe déjà un composant de card représentant une tâche.
Utilise ce composant existant comme référence visuelle et structurelle.
Les cards « Prochaines actions » de la fiche prospect doivent être visuellement issues du même composant :
même border-radius ;
même bordure ;
même ombre ;
mêmes espacements internes ;
même typographie ;
même hiérarchie des informations ;
même présentation du contexte ;
même icône correspondant au type d'action ;
même système de statut/date ;
même bouton circulaire de validation en haut à droite.
Ne crée pas un nouveau style de card.
L'objectif est que l'utilisateur reconnaisse immédiatement qu'une « prochaine action » sur une fiche prospect est exactement le même objet qu'une tâche affichée sur le Dashboard.
STRUCTURE DE LA CARD
Reprends la structure de la card Dashboard.
Exemple :
15 octobre 2026
💬 Faire un point sur l'accord bancaire
Contexte
Accord bancaire en attente.
En haut à droite, afficher les deux contrôles suivants :
✏️ Modifier sous forme d'une petite icône seule, discrète.
○ bouton circulaire permettant de marquer la tâche comme terminée.
L'icône Modifier et le cercle de validation doivent être placés côte à côte ou de manière compacte dans le coin supérieur droit sans prendre une nouvelle ligne.
Ne plus afficher de grand bouton texte « Modifier » dans le footer de la card.
Ne plus afficher de bouton texte « Terminé ».
Le cercle de validation reprend exactement le comportement et le design du cercle déjà présent en haut à droite des cards du Dashboard.
Lorsque la tâche est cochée, afficher son état terminé de la même manière que sur le Dashboard.
FOOTER DE LA CARD
Sur le Dashboard, les cards possèdent actuellement les actions :
Voir fiche | Message | Appel
Sur la fiche prospect, ne conserver que l'action « Message ».
Ne pas afficher :
« Voir fiche », car l'utilisateur se trouve déjà sur la fiche ;
« Appel », car le bouton Appeler est déjà présent dans le header de Sophie Martin.
Créer donc un footer compact avec :
💬 Message
Le footer ne doit pas prendre inutilement toute la hauteur de la card.
COMPORTEMENT DU BOUTON MESSAGE
Le bouton Message doit avoir exactement le même comportement que le bouton Message déjà présent sur les cards du Dashboard.
Réutiliser la bottom sheet existante du Dashboard.
Lorsqu'on touche « Message », ouvrir la même bottom sheet contenant le message suggéré et permettant à l'agent de le copier pour l'envoyer au prospect.
Exemple :
Message suggéré
« Bonjour Sophie, je reviens vers vous concernant votre projet d'achat. Avez-vous eu un retour de votre banque concernant votre financement ? »
CTA :
Copier le message
Ne crée pas une nouvelle modal ou un nouveau comportement si le composant existe déjà sur le Dashboard.
SCROLL HORIZONTAL
Conserve le fonctionnement actuel de la section PROCHAINES ACTIONS en carrousel horizontal.
Les cards doivent être suffisamment larges pour être facilement lisibles sur mobile, mais la card suivante doit rester partiellement visible sur le bord droit de l'écran afin de signaler qu'il est possible de swiper horizontalement.
Exemple :
[ Card action 1 ] [ début card 2...
L'utilisateur swipe horizontalement pour voir les autres actions.
Ne transforme surtout pas cette section en scroll vertical.
EXEMPLE CARD 1
15 octobre 2026
En haut à droite :
✏️ ○
💬 Faire un point sur l'accord bancaire
Contexte
Accord bancaire en attente.
Footer :
💬 Message
EXEMPLE CARD 2
28 octobre 2026
En haut à droite :
✏️ ○
💬 Envoyer une sélection de biens
Contexte
4–5 appartements correspondant aux nouveaux critères.
Footer :
💬 Message
COMPORTEMENT DE MODIFICATION
Un clic sur l'icône ✏️ ouvre une bottom sheet permettant de modifier uniquement cette tâche :
intitulé ;
date ;
heure ;
type d'action ;
contexte ;
message suggéré si applicable.
Boutons :
Annuler
Enregistrer
Une fois enregistrée, mettre à jour la card sans modifier les autres prochaines actions.
COHÉRENCE DES COMPOSANTS — TRÈS IMPORTANT
Ne cherche pas simplement à créer des cards « ressemblant » à celles du Dashboard.
Identifie le composant de tâche actuellement utilisé dans les sections « EN RETARD » et « À FAIRE AUJOURD'HUI » du Dashboard et réutilise sa structure et ses styles pour les cards de « PROCHAINES ACTIONS ».
Il doit s'agir du même langage de composant, avec seulement une variante adaptée au contexte de la fiche prospect.
La variante Dashboard contient :
Voir fiche + Message + Appel
La variante Fiche prospect contient :
Message uniquement
Dans les deux variantes, conserver :
le même header ;
la même date/statut ;
le même cercle de validation ;
la même présentation de l'action ;
la même présentation du contexte ;
les mêmes dimensions visuelles ;
les mêmes couleurs et bordures.
NE RIEN MODIFIER D'AUTRE
Ne modifie pas :
le header de Sophie Martin ;
les boutons Appeler / WhatsApp ;
Informations prospect ;
Projet immobilier ;
Financement ;
Critères importants recherchés ;
Motivations & freins ;
Historique ;
le bouton fixe « + Ajouter une note ou une tâche » ;
le Dashboard.
La modification concerne exclusivement le composant des cards de la section « PROCHAINES ACTIONS » de la fiche prospect.