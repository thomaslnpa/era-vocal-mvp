# Design

Esthétique ERA : premium, sobre, beaucoup de blanc et de fond chaud. Cartes arrondies, ombre légère, zones pouce larges. Pas de nouveau logo : un carré `#850831` avec le mot ERA et le libellé FRANCE.

## Couleurs

Définies dans `src/index.css` (`@theme`) et recopiées en hex dans le JSX :

- Principal, CTA, accents : `#850831`
- Fond d'écran : `#FFF1EA`
- Blanc des cartes : `#FFFFFF`
- Rouge ERA, retard, ROUGE : `#D00C29` (fond de badge `#FEE8EA`)
- Bleu ERA, titres serif : `#1A2A63`
- ORANGE : `#E07B39` (fond `#FEF0E6`)
- VERT : `#2E7D32` (fond `#E6F4EA`)
- Bordures chaudes : `#F0E8E0`
- Texte secondaire : `#6B7280`, tertiaire `#9CA3AF`
- Bandeau WhatsApp : fond `#E8F5E9`, texte `#2E7D32`

Le rouge sert au retard et au badge ROUGE, peu ailleurs. Le bordeaux porte les CTA.

Les tokens Tailwind `era-primary`, `era-red`, `era-blue`, `era-warm`, `chaud`, `tiede`, `froid` existent. L'UI actuelle utilise surtout les hex arbitraires (`bg-[#850831]`). Rester cohérent avec le fichier touché.

## Typographie

Google Fonts dans `src/index.css` : DM Sans pour le texte, DM Serif Display pour les titres (`font-serif` sur les `h1`).

Le JSX utilise `font-500`, `font-600`, `font-700`. Ce ne sont pas les classes Tailwind standard (`font-medium`, `font-semibold`, `font-bold`). En modifiant un bloc, garder les classes déjà là.

## Composants à réutiliser

Tout est dans `src/App.tsx`. Ne pas recréer un style de carte parallèle.

- `QualifBadge` : pastille ROUGE / ORANGE / VERT.
- `ActionCard` : tâche accueil. Pied Voir fiche, Message, Appel. En haut à droite, `TacheControles` (Modifier, Annuler, Terminer), partagé avec `ProspectTaskCard`.
- `TacheEditSheet` : édition d'une tâche (intitulé, date, contexte, raccourcis de report).
- `ProspectTaskCard` : même langage, variante fiche. Largeur `w-72`, pied Message seul, crayon + cercle en haut à droite. Le contexte fiche est déjà la fiche, l'appel est dans le header.
- `Overlay` : bottom sheet mobile, dialogue centré à partir de `md` (`max-w-md`).
- `MessageModal` : suggestion + copier. Toujours dire que le message n'est pas envoyé.
- `InfoCard` + `Row` : section de fiche, titre en petites capitales, Modifier optionnel.
- `DetectedActionCard` + `ActionRow` : changement avant / après sur l'analyse.
- `WhatsAppMessageCard` : tuile du carrousel d'accueil, largeur `w-44`.

Animations globales : `fade-in`, `bottom-sheet-enter`. Listes horizontales : `hide-scrollbar`.

## Layout

`h-dvh`, colonne. Contenu scrollable avec `pb-24` sur mobile pour la barre basse. Largeur de contenu `max-w-5xl` (accueil, liste, fiche) et `max-w-3xl` (analyse). Grille deux colonnes à partir de `lg` sur l'accueil (retard / aujourd'hui) et sur la fiche.
