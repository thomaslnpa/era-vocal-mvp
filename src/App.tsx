import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import eraLogo from '@/assets/era-logo.svg'
import type { Tables } from '@/lib/database.types'

// ── Types ──────────────────────────────────────────────────────────────────────
type Screen = 'home' | 'prospects' | 'detail' | 'ai-analysis'
type Qualification = 'VERT' | 'ORANGE' | 'ROUGE'
type Filter = 'Tous' | 'Rouge' | 'Orange' | 'Vert' | 'À relancer'

interface Prospect {
  id: string | number
  isDemo?: boolean
  prenom: string
  nom: string
  tel: string
  email: string
  qualification: Qualification | null
  typeBien: string
  typologie: string
  secteur: string
  budget: string
  horizon: string
  financement: string
  apport: string
  criteres: string[]
  motivation: string
  frein: string
  historique: { date: string; type: string; resume: string }[]
}

type Canal = 'appel' | 'whatsapp' | 'email'
type StatutTache = 'a_faire' | 'terminee' | 'annulee'

// Une tâche par ligne de eravocal.rappels. Échéance au jour, l'heure éventuelle reste dans le texte.
interface Tache {
  id: string
  prospectId: Prospect['id']
  echeance: string // YYYY-MM-DD, date locale
  texte: string
  canal: Canal
  contexte: string
  messageSuggere: string
  statut: StatutTache
  termineLe?: string
  isDemo?: boolean
}

const CANAL_LABEL: Record<Canal, string> = { appel: 'Appel', whatsapp: 'WhatsApp', email: 'Email' }
const CANAL_ICON: Record<Canal, string> = { appel: '📞', whatsapp: '💬', email: '✉️' }

// ── Data ───────────────────────────────────────────────────────────────────────
const DEMO_DATA: Prospect[] = [
  {
    id: 1,
    prenom: 'Sophie',
    nom: 'Martin',
    tel: '06 12 34 56 78',
    email: 'sophie.martin@example.fr',
    qualification: 'ORANGE',
    typeBien: 'Appartement',
    typologie: 'T3',
    secteur: 'Toulouse Centre',
    budget: '300 000 €',
    horizon: 'Avant janvier',
    financement: 'En cours',
    apport: '30 000 €',
    criteres: ['Balcon — indispensable', 'Parking — souhaité', 'Minimum 2 chambres'],
    motivation: 'Recherche active d\'une résidence principale.',
    frein: 'Accord bancaire en attente.',
    historique: [
      { date: '19 sept. 2026', type: 'vocal', resume: 'Recherche toujours active. Accord bancaire en attente. Souhaite acheter avant janvier.' },
      { date: '12 sept. 2026', type: 'vocal', resume: 'Recherche d\'un T3 sur Toulouse centre. Budget environ 300 000 €.' },
      { date: '5 août 2026', type: 'tache', resume: 'Email envoyé : "Bonjour Sophie, suite à notre échange de la semaine dernière, je me permets de vous transmettre une sélection de 3 biens correspondant à vos critères sur Toulouse Centre. N\'hésitez pas à me faire part de vos retours."' },
    ],
  },
  {
    id: 2,
    prenom: 'Julien',
    nom: 'Morel',
    tel: '06 98 76 54 32',
    email: 'julien.morel@example.fr',
    qualification: 'ROUGE',
    typeBien: 'Maison',
    typologie: 'T5',
    secteur: 'Balma',
    budget: '450 000 €',
    horizon: 'Automne 2026',
    financement: 'Non démarré',
    apport: '50 000 €',
    criteres: ['Jardin', 'Garage', '4 chambres minimum'],
    motivation: 'Projet de déménagement pour rapprocher les enfants de l\'école.',
    frein: 'Projet mis en pause. Situation professionnelle incertaine.',
    historique: [
      { date: '5 sept. 2026', type: 'note', resume: 'Projet initialement prévu pour l\'automne. Contact à reprendre.' },
    ],
  },
  {
    id: 3,
    prenom: 'Émilie',
    nom: 'Laurent',
    tel: '07 23 45 67 89',
    email: 'emilie.laurent@example.fr',
    qualification: 'VERT',
    typeBien: 'Appartement',
    typologie: 'T4',
    secteur: 'Toulouse / Côte Pavée',
    budget: '520 000 €',
    horizon: 'D\'ici 2 mois',
    financement: 'Accord obtenu',
    apport: '80 000 €',
    criteres: ['Vue dégagée', 'Ascenseur', 'Deux places de parking'],
    motivation: 'Financement validé, prête à signer rapidement.',
    frein: 'Peu de biens disponibles sur le secteur.',
    historique: [
      { date: '18 sept. 2026', type: 'vocal', resume: 'Accord de prêt confirmé. Très motivée. Budget extensible jusqu\'à 550 000 €.' },
    ],
  },
  {
    id: 4,
    prenom: 'Camille',
    nom: 'Bernard',
    tel: '06 55 44 33 22',
    email: 'camille.bernard@example.fr',
    qualification: 'ORANGE',
    typeBien: 'Appartement',
    typologie: 'T2',
    secteur: 'Toulouse / Saint-Étienne',
    budget: '210 000 €',
    horizon: 'Début 2027',
    financement: 'En cours',
    apport: '20 000 €',
    criteres: ['Lumineux', 'Calme'],
    motivation: 'Premier achat. Veut sécuriser son investissement.',
    frein: 'Hésite encore entre louer et acheter.',
    historique: [],
  },
  {
    id: 5,
    prenom: 'Thomas',
    nom: 'Garcia',
    tel: '07 11 22 33 44',
    email: 'thomas.garcia@example.fr',
    qualification: 'ROUGE',
    typeBien: 'Maison',
    typologie: 'T4',
    secteur: 'Colomiers',
    budget: '380 000 €',
    horizon: 'Printemps 2027',
    financement: 'Non démarré',
    apport: '40 000 €',
    criteres: ['Jardin', 'Quartier calme'],
    motivation: 'Famille qui s\'agrandit, besoin de plus d\'espace.',
    frein: 'Doit d\'abord vendre son appartement actuel.',
    historique: [],
  },
]

// Fiches fictives de démonstration (pastille « Démo »)
const PROSPECTS: Prospect[] = DEMO_DATA.map(p => ({ ...p, isDemo: true }))

// ── Tâches : dates ────────────────────────────────────────────────────────────
function isoDuJour(decalage = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + decalage)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatEcheance(iso: string): string {
  if (iso === isoDuJour()) return 'Aujourd\'hui'
  if (iso === isoDuJour(1)) return 'Demain'
  if (iso === isoDuJour(-1)) return 'Hier'
  const label = new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

// Accueil : tâches à faire. En retard < aujourd'hui, puis aujourd'hui, puis de demain à dimanche.
// Au-delà de dimanche, la tâche n'est visible que sur la fiche.
function classerTaches(taches: Tache[]) {
  const aujourdhui = isoDuJour()
  const dimanche = isoDuJour((7 - new Date().getDay()) % 7)
  const aFaire = taches.filter(t => t.statut === 'a_faire').sort((a, b) => a.echeance.localeCompare(b.echeance))
  return {
    enRetard: aFaire.filter(t => t.echeance < aujourdhui),
    aujourdhui: aFaire.filter(t => t.echeance === aujourdhui),
    semaine: aFaire.filter(t => t.echeance > aujourdhui && t.echeance <= dimanche),
  }
}

// Échéances relatives au jour courant pour que la démo reste cohérente quel que soit le jour
const TACHES_DEMO: Tache[] = [
  {
    id: 'demo-1', prospectId: 1, echeance: isoDuJour(0), canal: 'whatsapp',
    texte: 'Faire un point sur l\'accord bancaire',
    contexte: 'Accord bancaire en attente.',
    messageSuggere: 'Bonjour Sophie, je reviens vers vous concernant votre projet d\'achat d\'un T3 à Toulouse Centre. Avez-vous eu un retour de votre banque concernant votre accord de financement ? Je reste disponible pour vous accompagner dans cette étape. Bonne journée, Yohann.',
  },
  {
    id: 'demo-2', prospectId: 1, echeance: isoDuJour(2), canal: 'whatsapp',
    texte: 'Envoyer une sélection de biens',
    contexte: '4 à 5 appartements correspondant aux nouveaux critères.',
    messageSuggere: 'Bonjour Sophie, je vous transmets une sélection de biens correspondant à vos critères. N\'hésitez pas à me faire part de vos retours. Bonne journée, Yohann.',
  },
  {
    id: 'demo-3', prospectId: 1, echeance: isoDuJour(10), canal: 'appel',
    texte: 'Faire un point sur l\'avancement du projet',
    contexte: '',
    messageSuggere: 'Bonjour Sophie, je souhaitais faire un point avec vous sur l\'avancement de votre projet. Avez-vous du nouveau ? Bonne journée, Yohann.',
  },
  {
    id: 'demo-4', prospectId: 2, echeance: isoDuJour(-2), canal: 'appel',
    texte: 'Réactiver le projet',
    contexte: 'Projet mis en pause. Situation professionnelle incertaine.',
    messageSuggere: 'Bonjour Julien, j\'espère que vous allez bien. Je souhaitais revenir vers vous concernant votre projet d\'acquisition d\'une maison à Balma. Avez-vous eu l\'occasion de faire avancer votre réflexion ? Je serais ravi d\'en discuter avec vous. Bonne journée, Yohann.',
  },
  {
    id: 'demo-5', prospectId: 3, echeance: isoDuJour(1), canal: 'whatsapp',
    texte: 'Proposer les nouvelles annonces',
    contexte: 'Peu de biens disponibles sur le secteur.',
    messageSuggere: 'Bonjour Émilie, de nouvelles annonces correspondant à vos critères viennent d\'être publiées à Toulouse Côte Pavée. Je vous les transmets dès maintenant. Êtes-vous disponible cette semaine pour une visite ? Bonne journée, Yohann.',
  },
  {
    id: 'demo-6', prospectId: 3, echeance: isoDuJour(4), canal: 'appel',
    texte: 'Caler une visite à Côte Pavée, la rappeler vers 18h',
    contexte: 'Financement validé, prête à signer rapidement.',
    messageSuggere: 'Bonjour Émilie, je vous propose de caler une visite cette semaine à Côte Pavée. Quel créneau vous conviendrait ? Bonne journée, Yohann.',
  },
  {
    id: 'demo-7', prospectId: 4, echeance: isoDuJour(3), canal: 'appel',
    texte: 'Relancer sur la décision achat/location',
    contexte: 'Hésite encore entre louer et acheter.',
    messageSuggere: 'Bonjour Camille, j\'espère que vous allez bien. Avez-vous eu le temps de réfléchir à votre projet ? Achat ou location, je suis là pour vous aider à prendre la meilleure décision selon votre situation. N\'hésitez pas à me rappeler. Bonne journée, Yohann.',
  },
  {
    id: 'demo-8', prospectId: 5, echeance: isoDuJour(-7), canal: 'whatsapp',
    texte: 'Vérifier avancement de la vente de son appartement',
    contexte: 'Doit d\'abord vendre son appartement actuel.',
    messageSuggere: 'Bonjour Thomas, j\'espère que tout avance bien de votre côté. Avez-vous des nouvelles concernant la vente de votre appartement actuel ? Dès que vous aurez une visibilité, nous pourrons reprendre ensemble la recherche de votre maison à Colomiers. Bonne journée, Yohann.',
  },
].map(t => ({ ...t, canal: t.canal as Canal, statut: 'a_faire' as StatutTache, isDemo: true }))

// ── Données réelles (Supabase, schéma eravocal) ───────────────────────────────
const SCORE_TO_QUALIF: Record<string, Qualification> = { rouge: 'ROUGE', orange: 'ORANGE', vert: 'VERT' }
const DELAI_LABEL: Record<string, string> = {
  immediat: 'Immédiat',
  moins_d_un_mois: 'Moins d\'un mois',
  un_a_six_mois: '1 à 6 mois',
  plus_de_six_mois: 'Plus de 6 mois',
}
const FINANCEMENT_LABEL: Record<string, string> = {
  solide: 'Solide',
  en_cours: 'En cours',
  aucun: 'Aucun',
  inconnu: 'Inconnu',
}

function acheteurToProspect(a: Tables<{ schema: 'eravocal' }, 'acheteurs'>): Prospect {
  const details = (a.details && typeof a.details === 'object' && !Array.isArray(a.details) ? a.details : {}) as Record<string, unknown>
  return {
    id: a.id,
    prenom: a.prenom ?? '',
    nom: a.nom,
    tel: a.telephone ?? '',
    email: a.email ?? '',
    qualification: a.score ? SCORE_TO_QUALIF[a.score] : null,
    typeBien: a.type_bien ?? '',
    typologie: '',
    secteur: a.secteur ?? '',
    budget: a.budget ?? '',
    horizon: a.delai_acquisition ? DELAI_LABEL[a.delai_acquisition] : '',
    financement: a.financement_statut ? FINANCEMENT_LABEL[a.financement_statut] : '',
    apport: typeof details.apport === 'string' ? details.apport : '',
    criteres: [],
    motivation: '',
    frein: '',
    historique: [],
  }
}

// Acheteurs réels + fiches de démo, mis à jour en temps réel
function useProspects(): Prospect[] {
  const [reels, setReels] = useState<Prospect[]>([])

  useEffect(() => {
    let active = true
    const load = async () => {
      const { data, error } = await supabase.from('acheteurs').select('*').order('created_at', { ascending: false })
      if (error) return console.error('Supabase acheteurs :', error.message)
      if (active) setReels(data.map(acheteurToProspect))
    }
    load()
    const channel = supabase
      .channel('acheteurs-live')
      .on('postgres_changes', { event: '*', schema: 'eravocal', table: 'acheteurs' }, load)
      .subscribe()
    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  return [...reels, ...PROSPECTS]
}

type ChampsTache = Pick<Tache, 'echeance' | 'texte' | 'contexte'>

const CANAUX: Canal[] = ['appel', 'whatsapp', 'email']
const STATUTS: StatutTache[] = ['a_faire', 'terminee', 'annulee']

function rappelToTache(r: Tables<{ schema: 'eravocal' }, 'rappels'>): Tache {
  return {
    id: r.id,
    prospectId: r.acheteur_id,
    echeance: r.echeance,
    texte: r.texte,
    canal: CANAUX.includes(r.canal as Canal) ? (r.canal as Canal) : 'appel',
    contexte: r.contexte ?? '',
    messageSuggere: r.message_suggere ?? '',
    statut: STATUTS.includes(r.statut as StatutTache) ? (r.statut as StatutTache) : 'a_faire',
    termineLe: r.termine_le ?? undefined,
  }
}

// Tâches réelles (eravocal.rappels, temps réel) + tâches de démo en mémoire, partagées entre les écrans
function useTaches() {
  const [demo, setDemo] = useState<Tache[]>(TACHES_DEMO)
  const [reels, setReels] = useState<Tache[]>([])
  const loadRef = useRef<() => void>(() => {})

  useEffect(() => {
    let active = true
    const load = async () => {
      const { data, error } = await supabase.from('rappels').select('*').order('echeance')
      if (error) return console.error('Supabase rappels :', error.message)
      if (active) setReels(data.map(rappelToTache))
    }
    loadRef.current = load
    load()
    const channel = supabase
      .channel('rappels-live')
      .on('postgres_changes', { event: '*', schema: 'eravocal', table: 'rappels' }, load)
      .subscribe()
    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  const maj = (id: string, patch: Partial<Tache>) => {
    const appliquer = (prev: Tache[]) => prev.map(t => (t.id === id ? { ...t, ...patch } : t))
    if (demo.some(t => t.id === id)) return setDemo(appliquer)
    setReels(appliquer)
    supabase
      .from('rappels')
      .update({
        statut: patch.statut,
        termine_le: patch.termineLe,
        echeance: patch.echeance,
        texte: patch.texte,
        contexte: patch.contexte,
      })
      .eq('id', id)
      .then(({ error }) => {
        if (!error) return
        console.error('Supabase rappels :', error.message)
        loadRef.current()
      })
  }

  return {
    taches: [...reels, ...demo],
    terminer: (id: string) => maj(id, { statut: 'terminee', termineLe: new Date().toISOString() }),
    annuler: (id: string) => maj(id, { statut: 'annulee', termineLe: new Date().toISOString() }),
    modifier: (id: string, champs: ChampsTache) => maj(id, champs),
  }
}

type TachesApi = ReturnType<typeof useTaches>

function tachesAFaire(taches: Tache[], prospectId: Prospect['id']) {
  return taches
    .filter(t => t.prospectId === prospectId && t.statut === 'a_faire')
    .sort((a, b) => a.echeance.localeCompare(b.echeance))
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function qualifBadge(q: Qualification) {
  const map = {
    ROUGE: { bg: 'bg-[#FEE8EA]', text: 'text-[#D00C29]', dot: 'bg-[#D00C29]' },
    ORANGE: { bg: 'bg-[#FEF0E6]', text: 'text-[#E07B39]', dot: 'bg-[#E07B39]' },
    VERT: { bg: 'bg-[#E6F4EA]', text: 'text-[#2E7D32]', dot: 'bg-[#2E7D32]' },
  }
  return map[q]
}

function DemoBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-600 uppercase tracking-wide bg-[#F3F4F6] text-[#6B7280] border border-dashed border-[#D1D5DB]">
      Démo
    </span>
  )
}

function QualifBadge({ q }: { q: Qualification | null }) {
  if (!q) return null
  const s = qualifBadge(q)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-600 tracking-wide ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {q}
    </span>
  )
}

// ── Bottom Sheet ──────────────────────────────────────────────────────────────
function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bottom-sheet-enter md:w-full md:max-w-md md:rounded-3xl md:overflow-hidden">
        {children}
      </div>
    </div>
  )
}

// ── WhatsApp Message Card ─────────────────────────────────────────────────────
function WhatsAppMessageCard({ prospect, info, updated, onView }: {
  prospect: string
  info: string
  updated: boolean
  onView: () => void
}) {
  return (
    <div className="shrink-0 w-44 bg-white rounded-xl border border-[#C8E6C9] shadow-sm flex flex-col justify-between">
      <div className="px-3 pt-3 pb-2.5">
        <p className="text-sm font-700 text-[#111827] leading-snug mb-2">{prospect}</p>
        <div className={`rounded-lg px-2 py-1.5 ${updated ? 'bg-[#EEF2FF]' : 'bg-[#F1F8E9]'}`}>
          <p className={`text-[10px] font-600 leading-snug ${updated ? 'text-[#1A2A63]' : 'text-[#33691E]'}`}>{info}</p>
        </div>
      </div>
      <button
        onClick={onView}
        className="w-full h-9 min-h-9 shrink-0 border-t border-[#C8E6C9] text-xs font-700 text-[#2E7D32] flex items-center justify-center gap-1 active:bg-[#F1F8E9] transition-colors rounded-b-xl"
      >
        Voir <span>→</span>
      </button>
    </div>
  )
}

// ── Screen: Home ──────────────────────────────────────────────────────────────
function HomeScreen({ prospects, tachesApi, onOpenDetail, onOpenAnalysis }: {
  prospects: Prospect[]
  tachesApi: TachesApi
  onOpenDetail: (p: Prospect) => void
  onOpenAnalysis: () => void
}) {
  const { enRetard, aujourdhui, semaine } = classerTaches(
    tachesApi.taches.filter(t => prospects.some(p => p.id === t.prospectId)),
  )
  const prospectDe = (t: Tache) => prospects.find(p => p.id === t.prospectId)!
  const lateCount = enRetard.length
  const todayCount = aujourdhui.length
  const [messageTache, setMessageTache] = useState<Tache | null>(null)
  const colonnes = [
    { id: 'retard', titre: 'En retard', onglet: 'En retard', taches: enRetard, point: 'bg-[#D00C29]', texte: 'text-[#D00C29]', vide: 'Aucune tâche en retard.' },
    { id: 'aujourdhui', titre: 'Aujourd\'hui', onglet: 'Aujourd\'hui', taches: aujourdhui, point: 'bg-[#2E7D32]', texte: 'text-[#2E7D32]', vide: 'Aucune tâche prévue aujourd\'hui.' },
    { id: 'semaine', titre: 'Cette semaine', onglet: 'Semaine', taches: semaine, point: 'bg-[#850831]', texte: 'text-[#850831]', vide: 'Rien d\'autre cette semaine.' },
  ]
  // Mobile : un onglet à la fois. Ouvre sur le retard s'il y en a, sinon sur aujourd'hui.
  const [onglet, setOnglet] = useState(() => (enRetard.length > 0 ? 'retard' : 'aujourdhui'))
  const colonneActive = colonnes.find(c => c.id === onglet) ?? colonnes[1]
  const tachesRef = useRef<HTMLDivElement>(null)

  function ouvrirOnglet(id: string) {
    setOnglet(id)
    tachesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const carte = (t: Tache) => (
    <ActionCard
      key={t.id}
      tache={t}
      prospect={prospectDe(t)}
      onView={() => onOpenDetail(prospectDe(t))}
      onMessage={() => setMessageTache(t)}
      onTerminer={() => tachesApi.terminer(t.id)}
      onAnnuler={() => tachesApi.annuler(t.id)}
      onModifier={champs => tachesApi.modifier(t.id, champs)}
    />
  )

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA] relative">

      {/* Barre fixe mobile : logo + profil (sur desktop, ils sont dans le menu latéral) */}
      <div className="md:hidden px-5 pt-4 pb-3 bg-white border-b border-[#F0E8E0] shrink-0">
        <div className="flex items-center justify-between">
          <img src={eraLogo} alt="Era Immo" className="h-14 w-auto" />
          <div className="w-9 h-9 rounded-full bg-[#850831]/10 flex items-center justify-center">
            <span className="text-[#850831] text-sm font-600">Y</span>
          </div>
        </div>
      </div>

      {/* Contenu scrollable — tout le reste */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
      <div className="pb-24 md:pb-10 fade-in">

        {/* Bonjour + stats — dans le scroll */}
        <div className="bg-white border-b border-[#F0E8E0]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 pt-5 md:pt-8 pb-5">
          <h1 className="text-2xl md:text-3xl font-serif text-[#1A2A63] leading-tight">Bonjour Yohann 👋</h1>
          <p className="text-sm text-[#6B7280] mt-1">Voici ce qui mérite votre attention aujourd'hui.</p>
          <div className="flex gap-3 mt-4 md:max-w-md">
            <button onClick={() => ouvrirOnglet('retard')} className="flex-1 text-left bg-[#FEE8EA] rounded-xl px-4 py-3 border border-[#FECDD3] active:scale-[0.98] transition-transform">
              <p className="text-2xl font-700 text-[#D00C29]">{lateCount}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">tâche{lateCount > 1 ? 's' : ''} en retard</p>
            </button>
            <button onClick={() => ouvrirOnglet('aujourdhui')} className="flex-1 text-left bg-[#FFF1EA] rounded-xl px-4 py-3 border border-[#F0D8CA] active:scale-[0.98] transition-transform">
              <p className="text-2xl font-700 text-[#850831]">{todayCount}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">tâche{todayCount > 1 ? 's' : ''} aujourd'hui</p>
            </button>
          </div>
        </div>
        </div>

        {/* Derniers messages WhatsApp — carrousel IA */}
        <section className="bg-[#E8F5E9] border-b border-[#C8E6C9]">
        <div className="max-w-5xl mx-auto pt-5 pb-4 md:px-3">
          <div className="flex items-center justify-between px-5 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎙</span>
              <h2 className="text-xs font-700 text-[#2E7D32] uppercase tracking-widest">Derniers messages WhatsApp</h2>
              <span className="bg-[#2E7D32] text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full leading-none">3</span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 pb-1">
            <WhatsAppMessageCard
              prospect="Sophie Martin"
              info="Relance programmée : 15 octobre"
              updated={false}
              onView={onOpenAnalysis}
            />
            <WhatsAppMessageCard
              prospect="Julien Morel"
              info="3 infos mises à jour"
              updated
              onView={() => {}}
            />
            <WhatsAppMessageCard
              prospect="Émilie Laurent"
              info="Qualification passée en VERT"
              updated={false}
              onView={() => {}}
            />
          </div>
        </div>
        </section>

        <div ref={tachesRef}>
          {/* Mobile : onglets avec compteurs, une liste pleine largeur qui défile avec la page */}
          <div className="md:hidden">
            <div className="sticky top-0 z-10 bg-[#FFF1EA] px-5 pt-4 pb-3">
              <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#F0E8E0]">
                {colonnes.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setOnglet(c.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-700 transition-all ${
                      onglet === c.id ? 'bg-[#FFF1EA] ' + c.texte : 'text-[#9CA3AF]'
                    }`}
                  >
                    {c.onglet}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full leading-none ${onglet === c.id ? 'bg-white' : 'bg-[#F3F4F6]'}`}>{c.taches.length}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 px-5">
              {colonneActive.taches.length === 0 && (
                <p className="text-sm text-[#9CA3AF] italic py-2">{colonneActive.vide}</p>
              )}
              {colonneActive.taches.map(carte)}
            </div>
          </div>

          {/* Tablette et bureau : kanban, chaque colonne défile seule */}
          <div className="hidden md:grid md:grid-cols-3 gap-3 max-w-6xl mx-auto px-8 pt-5 pb-2">
            {colonnes.map(c => (
              <section key={c.id} className="min-w-0 flex flex-col bg-white/60 rounded-2xl border border-[#F0E8E0]">
                <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                  <span className={`w-2 h-2 rounded-full ${c.point}`} />
                  <h2 className={`text-xs font-700 uppercase tracking-widest ${c.texte}`}>{c.titre}</h2>
                  <span className="ml-auto text-[10px] font-700 text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded-full leading-none">{c.taches.length}</span>
                </div>
                <div className="grid auto-rows-max content-start gap-3 px-2 pb-2 max-h-[70vh] overflow-y-auto hide-scrollbar">
                  {c.taches.length === 0 && (
                    <p className="text-sm text-[#9CA3AF] italic px-1 py-2">{c.vide}</p>
                  )}
                  {c.taches.map(carte)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Message modal — rendu hors du scroll */}
      {messageTache && (
        <MessageModal tache={messageTache} prospect={prospectDe(messageTache)} onClose={() => setMessageTache(null)} />
      )}
    </div>
  )
}

function MessageModal({ tache: t, prospect: p, onClose }: { tache: Tache; prospect: Prospect; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(t.messageSuggere).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto md:hidden mb-5" />
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">✨</span>
          <h3 className="text-base font-700 text-[#111827]">Message généré</h3>
        </div>
        <p className="text-xs text-[#9CA3AF] mb-4">Pour {p.prenom} {p.nom} · via {CANAL_LABEL[t.canal]}</p>

        {!t.messageSuggere && (
          <p className="text-sm text-[#9CA3AF] italic">Aucun message suggéré pour cette tâche.</p>
        )}

        {t.messageSuggere && (
        <>
        <div className="bg-[#F9FAFB] rounded-2xl px-4 py-4 border border-[#E5E7EB] mb-4">
          <p className="text-sm text-[#374151] leading-relaxed">{t.messageSuggere}</p>
        </div>

        <p className="text-xs text-[#9CA3AF] text-center mb-4">
          ⚠️ Ce message n'est pas envoyé automatiquement — copiez-le et envoyez-le vous-même.
        </p>

        <button
          onClick={handleCopy}
          className={`w-full py-4 rounded-2xl text-sm font-700 transition-all active:scale-[0.98] ${
            copied
              ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
              : 'bg-[#850831] text-white shadow-md'
          }`}
        >
          {copied ? '✓ Copié dans le presse-papiers' : 'Copier le message'}
        </button>
        </>
        )}
      </div>
    </Overlay>
  )
}

// ── Tâche : contrôles partagés par ActionCard et ProspectTaskCard ────────────
function TacheControles({ onModifier, onAnnuler, onTerminer }: {
  onModifier: () => void
  onAnnuler: () => void
  onTerminer: () => void
}) {
  const [confirmAnnuler, setConfirmAnnuler] = useState(false)

  return (
    <>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onModifier}
          className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] active:text-[#850831] transition-colors"
          title="Modifier ou reporter"
          aria-label="Modifier ou reporter"
        >
          <span className="text-sm">✏️</span>
        </button>
        <button
          onClick={() => setConfirmAnnuler(true)}
          className="w-7 h-7 flex items-center justify-center text-base text-[#9CA3AF] active:text-[#D00C29] transition-colors"
          title="Annuler la tâche"
          aria-label="Annuler la tâche"
        >
          ✕
        </button>
        <button
          onClick={onTerminer}
          className="w-7 h-7 rounded-full border-2 border-[#D1D5DB] flex items-center justify-center active:border-[#4ADE80] active:bg-[#F0FDF4] transition-all"
          title="Marquer comme terminé"
          aria-label="Marquer comme terminé"
        />
      </div>

      {confirmAnnuler && (
        <Overlay onClose={() => setConfirmAnnuler(false)}>
          <div className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto md:hidden mb-5" />
            <h3 className="text-base font-700 text-[#111827] mb-1">Annuler cette tâche ?</h3>
            <p className="text-sm text-[#6B7280] mb-5">Elle sera retirée de vos tâches et conservée dans l'historique de la fiche.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAnnuler(false)} className="flex-1 py-3.5 rounded-2xl border border-[#E5E7EB] text-sm font-600 text-[#6B7280]">Garder</button>
              <button
                onClick={() => { setConfirmAnnuler(false); onAnnuler() }}
                className="flex-1 py-3.5 rounded-2xl bg-[#D00C29] text-white text-sm font-700 active:scale-[0.98] transition-transform"
              >
                Annuler la tâche
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  )
}

const REPORTS_RAPIDES = [
  { label: 'Demain', decalage: 1 },
  { label: 'Dans 3 jours', decalage: 3 },
  { label: 'Dans 1 semaine', decalage: 7 },
]

function TacheEditSheet({ tache, onSave, onClose }: {
  tache: Tache
  onSave: (champs: ChampsTache) => void
  onClose: () => void
}) {
  const [texte, setTexte] = useState(tache.texte)
  const [echeance, setEcheance] = useState(tache.echeance)
  const [contexte, setContexte] = useState(tache.contexte)

  function enregistrer() {
    onSave({ texte: texte.trim() || tache.texte, echeance, contexte: contexte.trim() })
    onClose()
  }

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto md:hidden mb-5" />
        <h3 className="text-base font-700 text-[#111827] mb-4">Modifier la tâche</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Intitulé</label>
            <input value={texte} onChange={e => setTexte(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
          </div>
          <div>
            <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Date</label>
            <input type="date" value={echeance} onChange={e => e.target.value && setEcheance(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
            <div className="flex gap-2 mt-2 overflow-x-auto hide-scrollbar">
              {REPORTS_RAPIDES.map(r => {
                const iso = isoDuJour(r.decalage)
                return (
                  <button
                    key={r.label}
                    onClick={() => setEcheance(iso)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-600 transition-all ${
                      echeance === iso ? 'bg-[#850831] text-white' : 'bg-[#F3F4F6] text-[#6B7280] active:bg-[#E5E7EB]'
                    }`}
                  >
                    {r.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Contexte</label>
            <input value={contexte} onChange={e => setContexte(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl border border-[#E5E7EB] text-sm font-600 text-[#6B7280]">Fermer</button>
          <button onClick={enregistrer} className="flex-1 py-3.5 rounded-2xl bg-[#850831] text-white text-sm font-700 active:scale-[0.98] transition-transform">Enregistrer</button>
        </div>
      </div>
    </Overlay>
  )
}

function ActionCard({ tache: t, prospect: p, onView, onMessage, onTerminer, onAnnuler, onModifier }: {
  tache: Tache
  prospect: Prospect
  onView: () => void
  onMessage: () => void
  onTerminer: () => void
  onAnnuler: () => void
  onModifier: (champs: ChampsTache) => void
}) {
  const [editing, setEditing] = useState(false)
  const isLate = t.echeance < isoDuJour()
  const isToday = t.echeance === isoDuJour()
  const borderColor = isLate ? 'border-[#FECDD3]' : 'border-[#F0E8E0]'
  const prevueColor = isLate ? 'text-[#D00C29]' : isToday ? 'text-[#2E7D32]' : 'text-[#850831]'

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-sm border ${borderColor} overflow-hidden fade-in`}>
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-700 text-[#111827]">{p.prenom} {p.nom}</p>
                <QualifBadge q={p.qualification} />
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5">{p.typeBien} {p.typologie} · {p.secteur} · {p.budget}</p>
            </div>
            <TacheControles onModifier={() => setEditing(true)} onAnnuler={onAnnuler} onTerminer={onTerminer} />
          </div>

          {t.contexte && (
            <div className="bg-[#FFF8F5] rounded-xl px-3 py-2.5 mt-2">
              <p className="text-xs text-[#9CA3AF] mb-1">Contexte</p>
              <p className="text-sm text-[#374151] font-500">{t.contexte}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm">{CANAL_ICON[t.canal]}</span>
            <p className="text-sm font-600 text-[#1A2A63]">{t.texte}</p>
          </div>
          <p className={`text-xs font-600 mt-1.5 ${prevueColor}`}>Prévue : {formatEcheance(t.echeance)}</p>
        </div>

        {/* 3 action buttons */}
        <div className="flex border-t border-[#F3F4F6]">
          <button
            onClick={onView}
            className="flex-1 py-3 flex flex-col items-center gap-1 active:bg-[#FFF8F5] transition-colors"
          >
            <span className="text-base">📋</span>
            <span className="text-[10px] font-600 text-[#850831]">Voir fiche</span>
          </button>
          <div className="w-px bg-[#F3F4F6]" />
          <button
            onClick={onMessage}
            className="flex-1 py-3 flex flex-col items-center gap-1 active:bg-[#EEF2FF] transition-colors"
          >
            <span className="text-base">✉️</span>
            <span className="text-[10px] font-600 text-[#1A2A63]">Message</span>
          </button>
          <div className="w-px bg-[#F3F4F6]" />
          <button className="flex-1 py-3 flex flex-col items-center gap-1 active:bg-[#F0FDF4] transition-colors">
            <span className="text-base">📞</span>
            <span className="text-[10px] font-600 text-[#16A34A]">Appel</span>
          </button>
        </div>
      </div>

      {editing && <TacheEditSheet tache={t} onSave={onModifier} onClose={() => setEditing(false)} />}
    </>
  )
}

// ── ProspectTaskCard — variante fiche prospect de ActionCard ──────────────────
function ProspectTaskCard({ tache, prospect, onTerminer, onAnnuler, onModifier }: {
  tache: Tache
  prospect: Prospect
  onTerminer: () => void
  onAnnuler: () => void
  onModifier: (champs: ChampsTache) => void
}) {
  const [showMessage, setShowMessage] = useState(false)
  const [editing, setEditing] = useState(false)

  return (
    <>
      <div className="shrink-0 w-72 bg-white rounded-2xl shadow-sm border border-[#F0E8E0] overflow-hidden fade-in flex flex-col" style={{ minHeight: 168 }}>
        <div className="px-4 pt-4 pb-3 flex-1 flex flex-col">
          {/* Header : date + contrôles */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className={`text-xs font-700 ${tache.echeance < isoDuJour() ? 'text-[#D00C29]' : 'text-[#850831]'}`}>{formatEcheance(tache.echeance)}</p>
            <TacheControles onModifier={() => setEditing(true)} onAnnuler={onAnnuler} onTerminer={onTerminer} />
          </div>

          {/* Contexte + Action — flex-1 pour pousser le footer en bas */}
          <div className="flex-1 flex flex-col justify-end">
            {tache.contexte ? (
              <div className="bg-[#FFF8F5] rounded-xl px-3 py-2 mb-2">
                <p className="text-xs text-[#9CA3AF] mb-0.5">Contexte</p>
                <p className="text-sm text-[#374151]">{tache.contexte}</p>
              </div>
            ) : null}

            {/* Action */}
            <div className="flex items-center gap-2">
              <span className="text-sm">{CANAL_ICON[tache.canal]}</span>
              <p className="text-sm font-600 text-[#1A2A63] leading-snug">{tache.texte}</p>
            </div>
          </div>
        </div>

        {/* Footer — Message uniquement, hauteur fixe */}
        <div className="border-t border-[#F3F4F6]">
          <button
            onClick={() => setShowMessage(true)}
            className="w-full h-11 flex items-center justify-center gap-1.5 active:bg-[#EEF2FF] transition-colors"
          >
            <span className="text-base">✉️</span>
            <span className="text-xs font-600 text-[#1A2A63]">Message</span>
          </button>
        </div>
      </div>

      {showMessage && (
        <MessageModal tache={tache} prospect={prospect} onClose={() => setShowMessage(false)} />
      )}

      {editing && <TacheEditSheet tache={tache} onSave={onModifier} onClose={() => setEditing(false)} />}
    </>
  )
}

// ── Screen: Prospects ─────────────────────────────────────────────────────────
function ProspectsScreen({ prospects, taches, onOpenDetail }: {
  prospects: Prospect[]
  taches: Tache[]
  onOpenDetail: (p: Prospect) => void
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('Tous')
  const filters: Filter[] = ['Tous', 'Rouge', 'Orange', 'Vert', 'À relancer']

  const prochaineTache = (p: Prospect): Tache | undefined => tachesAFaire(taches, p.id)[0]

  const filtered = prospects.filter(p => {
    const name = `${p.prenom} ${p.nom}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase())
    const prochaine = prochaineTache(p)
    const matchFilter =
      filter === 'Tous' ? true :
      filter === 'À relancer' ? !!prochaine && prochaine.echeance <= isoDuJour() :
      p.qualification === filter.toUpperCase() as Qualification
    return matchSearch && matchFilter
  })

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA]">
      {/* Header */}
      <div className="bg-white border-b border-[#F0E8E0]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 pt-6 md:pt-8 pb-4">
        <h1 className="text-2xl md:text-3xl font-serif text-[#1A2A63] mb-4">Prospects</h1>
        <div className="relative mb-3 md:max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un prospect"
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#850831] focus:ring-1 focus:ring-[#850831]/20 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-600 transition-all ${
                filter === f
                  ? 'bg-[#850831] text-white shadow-sm'
                  : 'bg-[#F3F4F6] text-[#6B7280] active:bg-[#E5E7EB]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
      <div className="max-w-5xl mx-auto px-5 md:px-8 pt-4 pb-24 md:pb-10">
        <p className="text-xs text-[#9CA3AF] mb-3">{filtered.length} prospect{filtered.length > 1 ? 's' : ''}</p>
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3 fade-in">
          {filtered.map(p => (
            <ProspectRow key={p.id} prospect={p} prochaine={prochaineTache(p)} onClick={() => onOpenDetail(p)} />
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

function ProspectRow({ prospect: p, prochaine, onClick }: { prospect: Prospect; prochaine?: Tache; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-[#F0E8E0] cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFF1EA] flex items-center justify-center shrink-0">
          <span className="text-sm font-600 text-[#850831]">{p.prenom[0]}{p.nom[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-600 text-[#111827] text-sm">{p.prenom} {p.nom}</p>
            <QualifBadge q={p.qualification} />
            {p.isDemo && <DemoBadge />}
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{[`${p.typeBien} ${p.typologie}`.trim(), p.secteur, p.budget].filter(Boolean).join(' · ')}</p>
          {prochaine && (
            <p className={`text-xs font-600 mt-1 ${prochaine.echeance < isoDuJour() ? 'text-[#D00C29]' : 'text-[#850831]'}`}>
              Tâche : {formatEcheance(prochaine.echeance)}
            </p>
          )}
        </div>
        <span className="text-[#D1D5DB] text-lg">›</span>
      </div>
    </div>
  )
}

// ── Screen: Detail ────────────────────────────────────────────────────────────
function DetailScreen({ prospect: p, tachesApi, onBack }: {
  prospect: Prospect
  tachesApi: TachesApi
  onBack: () => void
}) {
  const [editSection, setEditSection] = useState<string | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [projetOpen, setProjetOpen] = useState(false)
  const [financementOpen, setFinancementOpen] = useState(false)
  const [expandedHistorique, setExpandedHistorique] = useState<string[]>([])

  const toggleHistorique = (cle: string) =>
    setExpandedHistorique(prev => prev.includes(cle) ? prev.filter(x => x !== cle) : [...prev, cle])

  // Valeurs en dur du prototype : réservées aux fiches de démo
  const d = (v: string) => (p.isDemo ? v : '')

  const taches = tachesAFaire(tachesApi.taches, p.id)

  // Tâches terminées ou annulées en tête de l'historique, la plus récente d'abord
  const historique = [
    ...tachesApi.taches
      .filter(t => t.prospectId === p.id && t.statut !== 'a_faire' && t.termineLe)
      .sort((a, b) => b.termineLe!.localeCompare(a.termineLe!))
      .map(t => ({
        date: new Date(t.termineLe!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: t.statut === 'annulee' ? 'tache_annulee' : 'tache',
        resume: t.texte,
      })),
    ...p.historique,
  ]

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA] relative">
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-8">

        {/* ── Header ── */}
        <div className="bg-white border-b border-[#F0E8E0]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 pt-6 md:pt-8 pb-5">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#850831] text-sm font-500 mb-4 active:opacity-60">
            ‹ Retour
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-[#1A2A63]">{p.prenom} {p.nom}</h1>
              <div className="flex items-center gap-2 mt-2">
                <QualifBadge q={p.qualification} />
                {p.isDemo && <DemoBadge />}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#850831]/10 flex items-center justify-center shrink-0">
              <span className="text-[#850831] font-700 text-base">{p.prenom[0]}{p.nom[0]}</span>
            </div>
          </div>
          <p className="text-sm text-[#6B7280] mt-2">{[p.tel, p.email].filter(Boolean).join(' · ') || '-'}</p>
          <div className="flex gap-3 mt-4 md:max-w-md">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#850831] text-white text-sm font-600 py-2.5 rounded-xl active:scale-95 transition-transform">
              <span>📞</span> Appeler
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#128C7E] text-sm font-600 py-2.5 rounded-xl border border-[#25D366]/20 active:scale-95 transition-transform">
              <span>💬</span> WhatsApp
            </button>
          </div>
        </div>
        </div>

        {/* ── Prochaines actions — carrousel horizontal ── */}
        <div className="max-w-5xl mx-auto pt-5 md:px-3">
          <div className="flex items-center justify-between px-5 mb-3">
            <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest">Prochaines actions</p>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 pb-1">
            {taches.length === 0 && (
              <p className="text-sm text-[#9CA3AF] italic">Aucune action prévue.</p>
            )}
            {taches.map(t => (
              <ProspectTaskCard
                key={t.id}
                tache={t}
                prospect={p}
                onTerminer={() => tachesApi.terminer(t.id)}
                onAnnuler={() => tachesApi.annuler(t.id)}
                onModifier={champs => tachesApi.modifier(t.id, champs)}
              />
            ))}
          </div>
        </div>

        {/* Mobile : une colonne dans l'ordre du DOM. Desktop : deux colonnes. */}
        <div className="max-w-5xl mx-auto px-5 md:px-8 pt-5 fade-in lg:grid lg:grid-cols-2 lg:gap-4 lg:items-start">
        <div className="space-y-4">

          {/* ── Informations prospect ── */}
          <InfoCard title="Informations prospect" onEdit={() => setEditSection('info')}>
            <Row label="Situation actuelle" value={d("Locataire")} />
            <Row label="Situation familiale" value={d("Célibataire")} />
            <Row label="Lieu de travail" value={d("Toulouse Centre")} />
            <Row label="Situation professionnelle" value={d("CDI")} />
            <Row label="Revenus approximatifs" value={d("3 200 € / mois")} />
            {infoOpen && (
              <div className="fade-in">
                <Row label="Adresse" value={d("Non renseigné")} />
                <Row label="Locataire depuis" value={d("Non renseigné")} />
                <Row label="Loyer actuel" value={d("Non renseigné")} />
                <Row label="Revente nécessaire" value={d("Non")} />
                <Row label="Enfants" value={d("Non renseigné")} />
                <Row label="Secteur d'activité" value={d("Non renseigné")} />
                <Row label="Canal préféré" value={d("WhatsApp")} />
                <Row label="Origine du prospect" value={d("Recommandation")} />
                <Row label="Agent responsable" value={d("Yohann")} />
              </div>
            )}
            <button
              onClick={() => setInfoOpen(!infoOpen)}
              className="mt-3 text-xs font-600 text-[#850831] active:opacity-60"
            >
              {infoOpen ? 'Voir moins ↑' : 'Voir plus ↓'}
            </button>
          </InfoCard>

          {/* ── Projet immobilier ── */}
          <InfoCard title="Projet immobilier" onEdit={() => setEditSection('projet')}>
            <Row label="Type" value={p.typeBien} />
            <Row label="Typologie" value={p.typologie} />
            <Row label="Secteur" value={p.secteur} />
            <Row label="Budget" value={p.budget} />
            <Row label="Horizon" value={p.horizon} />
            {projetOpen && (
              <div className="fade-in">
                <Row label="Usage" value={d("Résidence principale")} />
                <Row label="Ancien / Récent" value={d("Indifférent")} />
                <Row label="Superficie" value={d("Non renseigné")} />
                <Row label="Pièces" value={d("Non renseigné")} />
                <Row label="Chambres" value={d("2 minimum")} />
                <Row label="Ascenseur" value={d("Souhaité")} />
                <Row label="Étage" value={d("Non renseigné")} />
                <Row label="Balcon / Terrasse" value={d("Indispensable")} />
                <Row label="Parking / Garage" value={d("Souhaité")} />
                <Row label="Travaux acceptés" value={d("Non")} />
              </div>
            )}
            <button
              onClick={() => setProjetOpen(!projetOpen)}
              className="mt-3 text-xs font-600 text-[#850831] active:opacity-60"
            >
              {projetOpen ? 'Voir moins ↑' : 'Voir plus ↓'}
            </button>
          </InfoCard>

          {/* ── Financement ── */}
          <InfoCard title="Financement" onEdit={() => setEditSection('financement')}>
            <Row label="Budget" value={p.budget} />
            <Row label="Situation financement" value={p.financement} />
            <Row label="Banque consultée" value={d("Oui")} />
            <Row label="Accord bancaire" value={d("En attente")} />
            <Row label="Apport" value={p.apport} />
            {financementOpen && (
              <div className="fade-in">
                <Row label="Emprunt nécessaire" value={d("Oui")} />
                <Row label="Montant emprunt" value={d("270 000 €")} />
                <Row label="Durée envisagée" value={d("20 ans")} />
                <Row label="Taux" value={d("Non renseigné")} />
                <Row label="Courtier" value={d("Non renseigné")} />
              </div>
            )}
            <button
              onClick={() => setFinancementOpen(!financementOpen)}
              className="mt-3 text-xs font-600 text-[#850831] active:opacity-60"
            >
              {financementOpen ? 'Voir moins ↑' : 'Voir plus ↓'}
            </button>
          </InfoCard>
        </div>

        <div className="space-y-4 mt-4 lg:mt-0">
          {/* ── Critères importants ── */}
          <InfoCard title="Critères importants recherchés" onEdit={() => setEditSection('criteres')}>
            <div className="space-y-2">
              {p.criteres.length === 0 && <p className="text-sm text-[#9CA3AF]">-</p>}
              {p.criteres.map((c, i) => {
                const isIndispensable = c.toLowerCase().includes('indispensable')
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isIndispensable ? 'bg-[#850831]' : 'bg-[#9CA3AF]'}`} />
                    <p className="text-sm text-[#374151] flex-1">{c}</p>
                    {isIndispensable
                      ? <span className="text-[10px] font-600 text-[#850831] bg-[#FEE8EA] px-2 py-0.5 rounded-full">Indispensable</span>
                      : <span className="text-[10px] font-600 text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">Souhaité</span>
                    }
                  </div>
                )
              })}
            </div>
          </InfoCard>

          {/* ── Motivations & freins ── */}
          <InfoCard title="Motivations & freins" onEdit={() => setEditSection('motivations')}>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Motivation</p>
                <p className="text-sm text-[#374151] font-500">{p.motivation || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Frein actuel</p>
                <p className="text-sm text-[#E07B39] font-500">{p.frein || '-'}</p>
              </div>
            </div>
          </InfoCard>

          {/* ── Historique ── */}
          <InfoCard title="Historique">
            {historique.length === 0 && (
              <p className="text-sm text-[#9CA3AF] italic">Aucune interaction enregistrée.</p>
            )}
            <div className="space-y-0">
              {historique.map((h, i) => {
                const cle = `${h.date}|${h.type}|${h.resume}`
                const open = expandedHistorique.includes(cle)
                const isAnnulee = h.type === 'tache_annulee'
                const isTache = h.type === 'tache' || isAnnulee
                const isNote = h.type === 'note'
                const icon = isAnnulee ? '✖️' : isTache ? '✅' : isNote ? '📝' : '🎙️'
                const iconBg = isAnnulee ? 'bg-[#F3F4F6]' : isTache ? 'bg-[#EEF2FF]' : isNote ? 'bg-[#FFF8F5]' : 'bg-[#E8F5E9]'
                const typeLabel = isAnnulee ? 'Tâche annulée' : isTache ? 'Tâche réalisée' : isNote ? 'Note' : 'Vocal WhatsApp'
                return (
                  <div key={i} className={`${i < historique.length - 1 ? 'border-b border-[#F3F4F6] pb-3 mb-3' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center text-sm shrink-0`}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-[#9CA3AF]">{h.date} · {typeLabel}</p>
                          {!isTache && (
                            <button
                              onClick={() => toggleHistorique(cle)}
                              className="text-xs font-600 text-[#850831] shrink-0 active:opacity-60"
                            >
                              {open ? 'Masquer ↑' : 'Voir ↓'}
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-[#374151] italic mt-1">« {h.resume} »</p>
                        {open && !isTache && (
                          <div className="mt-3 fade-in">
                            <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest mb-2">Transcription complète</p>
                            <p className="text-sm text-[#374151] leading-relaxed italic">
                              « {h.type === 'vocal'
                                ? `J'ai eu ${p.prenom} au téléphone. ${h.resume} Elle cherche activement son bien sur ${p.secteur}. Budget confirmé à ${p.budget}. Elle tient vraiment à son critère principal. La prochaine étape est de suivre l'avancement du financement.`
                                : h.resume
                              } »
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </InfoCard>
        </div>

        </div>
      </div>

      {/* Edit sheets */}
      {editSection && (
        <Overlay onClose={() => setEditSection(null)}>
          <SimpleEditSheet
            title={
              editSection === 'info' ? 'Informations prospect' :
              editSection === 'projet' ? 'Projet immobilier' :
              editSection === 'financement' ? 'Financement' :
              editSection === 'criteres' ? 'Critères importants' :
              'Motivations & freins'
            }
            onClose={() => setEditSection(null)}
          />
        </Overlay>
      )}
    </div>
  )
}

function SimpleEditSheet({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
      <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto md:hidden mb-5" />
      <h3 className="text-base font-700 text-[#111827] mb-1">Modifier</h3>
      <p className="text-xs text-[#9CA3AF] mb-5">{title}</p>
      <p className="text-sm text-[#6B7280] bg-[#F9FAFB] rounded-xl px-4 py-3 mb-5">
        Les champs de cette section sont modifiables. Dans la version finale, chaque champ est éditable individuellement.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl border border-[#E5E7EB] text-sm font-600 text-[#6B7280] active:bg-gray-50">
          Annuler
        </button>
        <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl bg-[#850831] text-white text-sm font-700 active:scale-[0.98] transition-transform">
          Enregistrer
        </button>
      </div>
    </div>
  )
}

// ── Detail helpers ─────────────────────────────────────────────────────────────
function InfoCard({ title, onEdit, children }: { title: string; onEdit?: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F0E8E0] overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-[#F9FAFB]">
        <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest">{title}</p>
        {onEdit && <button onClick={onEdit} className="text-xs font-600 text-[#850831] active:opacity-60">Modifier</button>}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#F9FAFB] last:border-0">
      <span className="text-sm text-[#9CA3AF]">{label}</span>
      <span className="text-sm font-500 text-[#111827]">{value || '-'}</span>
    </div>
  )
}

// ── Transcription Accordion ───────────────────────────────────────────────────
function TranscriptionAccordion() {
  const [open, setOpen] = useState(false)

  const transcription = `« Je viens d'avoir Sophie Martin au téléphone. Elle m'a confirmé que son projet est toujours actif. Elle cherche un T3 sur le secteur Carmes / Esquirol, son budget a évolué, elle peut aller jusqu'à 500 000 €. Elle est maintenant en CDI depuis le mois dernier, ça change sa situation pour le financement. Elle tient vraiment à avoir une terrasse, c'est indispensable pour elle. Un parking serait bien aussi mais c'est secondaire. Elle m'a demandé de lui envoyer les nouvelles annonces demain matin par email. Je pense qu'on peut requalifier son dossier, elle est beaucoup plus active qu'avant. »`

  const badge = { icon: '💬', label: 'WhatsApp · vocal', color: 'text-[#25D366] bg-[#F0FFF4] border-[#C8E6C9]' }

  return (
    <div className="border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 active:bg-[#F9FAFB] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{badge.icon}</span>
          <span className="text-sm font-600 text-[#374151]">Voir la transcription complète</span>
        </div>
        <span className={`text-[#9CA3AF] text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-[#F3F4F6] fade-in">
          <div className="flex items-center gap-2 mt-3 mb-2.5">
            <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full border ${badge.color}`}>{badge.icon} {badge.label}</span>
            <span className="text-[10px] text-[#9CA3AF]">20 sept. 2026 · 10h14</span>
          </div>
          <p className="text-sm text-[#374151] leading-relaxed italic">{transcription}</p>
        </div>
      )}
    </div>
  )
}

// ── Screen: AI Analysis (refonte) ────────────────────────────────────────────
type EditTarget = 'prospect' | 'projet' | 'criteres' | 'tache' | 'qualification' | null

function AIAnalysisScreen({ onBack }: { onBack: () => void }) {
  const [editTarget, setEditTarget] = useState<EditTarget>(null)

  // State mutable par l'agent
  const [prospectSituation, setProspectSituation] = useState('CDI')
  const [budget, setBudget] = useState('500 000 €')
  const [criteres, setCriteres] = useState(['Terrasse — indispensable', 'Parking — souhaité'])
  const [tacheLabel, setTacheLabel] = useState('Envoyer les nouvelles annonces')
  const [tacheDate, setTacheDate] = useState('Demain · 10h00')
  const [tacheCanal, setTacheCanal] = useState('Email')
  const [qualif, setQualif] = useState<'ROUGE' | 'ORANGE' | 'VERT'>('ORANGE')

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA] relative">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-8">

        {/* Header */}
        <div className="bg-white border-b border-[#F0E8E0]">
        <div className="max-w-3xl mx-auto px-5 md:px-8 pt-6 md:pt-8 pb-5">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#850831] text-sm font-500 mb-4 active:opacity-60">
            ‹ Retour
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-lg shrink-0">🎙</div>
            <div>
              <h1 className="text-lg md:text-2xl font-serif text-[#1A2A63] leading-tight">Message WhatsApp analysé</h1>
              <p className="text-xs text-[#9CA3AF]">Modifications déjà appliquées, validées depuis WhatsApp.</p>
            </div>
          </div>

          {/* Prospect identifié */}
          <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest mb-1">Prospect identifié</p>
                <p className="text-sm font-700 text-[#111827]">Sophie Martin</p>
                <p className="text-xs text-[#6B7280] mt-0.5">06 12 34 56 78</p>
              </div>
              <button className="text-xs font-600 text-[#850831] active:opacity-60 mt-0.5">Modifier</button>
            </div>
          </div>

          {/* Rappel projet */}
          <div className="flex items-center gap-2 mt-3 px-1">
            <span className="text-sm">🏠</span>
            <p className="text-xs text-[#6B7280] font-500">T3 · {budget} · Carmes / Esquirol</p>
          </div>
        </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 md:px-8 pt-5 space-y-3 fade-in">

          {/* Titre section */}
          <div className="flex items-center gap-2">
            <p className="text-xs font-700 text-[#111827] uppercase tracking-widest">Modifications appliquées</p>
            <span className="bg-[#1A2A63] text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full">4</span>
          </div>

          {/* Card 1 — Prospect */}
          <DetectedActionCard
            icon="👤"
            category="Modification du prospect"
            onEdit={() => setEditTarget('prospect')}
          >
            <ActionRow label="Situation professionnelle" from="CDD" to={prospectSituation} />
          </DetectedActionCard>

          {/* Card 2 — Projet */}
          <DetectedActionCard
            icon="🏠"
            category="Modification du projet"
            onEdit={() => setEditTarget('projet')}
          >
            <ActionRow label="Budget" from="450 000 €" to={budget} />
          </DetectedActionCard>

          {/* Card 3 — Critères */}
          <DetectedActionCard
            icon="🔎"
            category="Ajout de critères"
            onEdit={() => setEditTarget('criteres')}
          >
            <div className="space-y-1.5">
              {criteres.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#850831] shrink-0" />
                  <p className="text-sm text-[#374151]">{c}</p>
                </div>
              ))}
            </div>
          </DetectedActionCard>

          {/* Card 4 — Tâche */}
          <DetectedActionCard
            icon="📅"
            category="Nouvelle tâche"
            onEdit={() => setEditTarget('tache')}
          >
            <p className="text-sm font-600 text-[#111827] mb-1">{tacheLabel}</p>
            <p className="text-xs text-[#9CA3AF]">{tacheDate} · Canal : {tacheCanal}</p>
          </DetectedActionCard>

          {/* Qualification */}
          <div className="bg-white rounded-2xl border border-[#F0E8E0] shadow-sm px-4 py-3.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest">Qualification recalculée</p>
              <button onClick={() => setEditTarget('qualification')} className="text-xs font-600 text-[#850831] active:opacity-60">Modifier</button>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <QualifBadge q="ROUGE" />
              <span className="text-[#9CA3AF] text-sm">→</span>
              <QualifBadge q={qualif} />
            </div>
            <p className="text-[10px] text-[#6B7280] bg-[#F9FAFB] rounded-lg px-2.5 py-1.5">
              Financement avancé · budget confirmé · projet actif
            </p>
          </div>

          {/* Transcription complète */}
          <TranscriptionAccordion />

        </div>
      </div>

      {/* Bottom sheets de modification */}
      {editTarget === 'prospect' && (
        <Overlay onClose={() => setEditTarget(null)}>
          <EditSheet title="Modifier la situation professionnelle" onClose={() => setEditTarget(null)}>
            <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Situation professionnelle</label>
            <input
              value={prospectSituation}
              onChange={e => setProspectSituation(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]"
            />
          </EditSheet>
        </Overlay>
      )}
      {editTarget === 'projet' && (
        <Overlay onClose={() => setEditTarget(null)}>
          <EditSheet title="Modifier le budget" onClose={() => setEditTarget(null)}>
            <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Budget</label>
            <input
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]"
            />
          </EditSheet>
        </Overlay>
      )}
      {editTarget === 'criteres' && (
        <Overlay onClose={() => setEditTarget(null)}>
          <EditSheet title="Modifier les critères" onClose={() => setEditTarget(null)}>
            {criteres.map((c, i) => (
              <div key={i} className="mb-3">
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Critère {i + 1}</label>
                <input
                  value={c}
                  onChange={e => setCriteres(criteres.map((cr, idx) => idx === i ? e.target.value : cr))}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]"
                />
              </div>
            ))}
          </EditSheet>
        </Overlay>
      )}
      {editTarget === 'tache' && (
        <Overlay onClose={() => setEditTarget(null)}>
          <EditSheet title="Modifier la tâche" onClose={() => setEditTarget(null)}>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Intitulé</label>
                <input value={tacheLabel} onChange={e => setTacheLabel(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Date · heure</label>
                <input value={tacheDate} onChange={e => setTacheDate(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Canal</label>
                <div className="flex gap-2">
                  {['Email', 'WhatsApp', 'Appel'].map(c => (
                    <button
                      key={c}
                      onClick={() => setTacheCanal(c)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-600 border transition-all ${tacheCanal === c ? 'bg-[#850831] text-white border-[#850831]' : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </EditSheet>
        </Overlay>
      )}
      {editTarget === 'qualification' && (
        <Overlay onClose={() => setEditTarget(null)}>
          <EditSheet title="Modifier la qualification" onClose={() => setEditTarget(null)}>
            <div className="flex gap-3">
              {(['VERT', 'ORANGE', 'ROUGE'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => setQualif(q)}
                  className={`flex-1 py-3 rounded-xl text-xs font-700 border-2 transition-all ${qualif === q ? 'border-[#850831]' : 'border-[#E5E7EB]'}`}
                >
                  <QualifBadge q={q} />
                </button>
              ))}
            </div>
          </EditSheet>
        </Overlay>
      )}
    </div>
  )
}

function DetectedActionCard({ icon, category, children, onEdit }: {
  icon: string; category: string; children: React.ReactNode; onEdit: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0E8E0] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#F9FAFB]">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-wider">{category}</p>
        </div>
        <button onClick={onEdit} className="text-xs font-600 text-[#850831] active:opacity-60">Modifier</button>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

function ActionRow({ label, from, to }: { label: string; from: string; to: string }) {
  return (
    <div>
      <p className="text-xs text-[#9CA3AF] mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#6B7280] line-through">{from}</span>
        <span className="text-[#9CA3AF] text-xs">→</span>
        <span className="text-sm font-700 text-[#111827]">{to}</span>
      </div>
    </div>
  )
}

function EditSheet({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
      <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto md:hidden mb-5" />
      <h3 className="text-base font-700 text-[#111827] mb-4">{title}</h3>
      {children}
      <button
        onClick={onClose}
        className="w-full mt-5 bg-[#850831] text-white text-sm font-700 py-4 rounded-2xl active:scale-[0.98] transition-transform"
      >
        Enregistrer
      </button>
    </div>
  )
}

// ── Navigation ────────────────────────────────────────────────────────────────
function NavBar({ active, onChange }: {
  active: 'home' | 'prospects'
  onChange: (t: 'home' | 'prospects') => void
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F0E8E0] flex items-center px-6 pb-[env(safe-area-inset-bottom)]">
      <NavItem icon="🏠" label="Accueil" active={active === 'home'} onClick={() => onChange('home')} />
      <NavItem icon="👥" label="Prospects" active={active === 'prospects'} onClick={() => onChange('prospects')} />
    </div>
  )
}

function SideNav({ active, onChange }: {
  active: 'home' | 'prospects'
  onChange: (t: 'home' | 'prospects') => void
}) {
  const items = [
    { id: 'home' as const, icon: '🏠', label: 'Accueil' },
    { id: 'prospects' as const, icon: '👥', label: 'Prospects' },
  ]
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-[#F0E8E0] px-4 py-6">
      <div className="px-2 mb-8">
        <img src={eraLogo} alt="Era Immo" className="h-24 w-auto" />
      </div>
      <nav className="space-y-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-600 transition-colors ${
              active === item.id ? 'bg-[#FFF1EA] text-[#850831]' : 'text-[#6B7280] hover:bg-[#F9FAFB]'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full bg-[#850831]/10 flex items-center justify-center">
          <span className="text-[#850831] text-sm font-600">Y</span>
        </div>
        <span className="text-sm font-500 text-[#111827]">Yohann</span>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex-1 flex flex-col items-center gap-1 py-3 active:opacity-60">
      <span className="text-xl">{icon}</span>
      <span className={`text-xs font-600 ${active ? 'text-[#850831]' : 'text-[#9CA3AF]'}`}>{label}</span>
    </button>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [navTab, setNavTab] = useState<'home' | 'prospects'>('home')
  const prospects = useProspects()
  const tachesApi = useTaches()
  const [selectedId, setSelectedId] = useState<Prospect['id']>(PROSPECTS[0].id)
  // Dérivé de la liste pour que la fiche ouverte suive les mises à jour temps réel
  const selectedProspect = prospects.find(p => p.id === selectedId) ?? PROSPECTS[0]

  const showNav = screen === 'home' || screen === 'prospects'

  function openDetail(p: Prospect) {
    setSelectedId(p.id)
    setScreen('detail')
  }

  function goHome() {
    setScreen('home')
    setNavTab('home')
  }

  return (
    <div className="flex h-dvh bg-[#FFF1EA]">
      <SideNav active={navTab} onChange={(t) => { setNavTab(t); setScreen(t) }} />

      <main className="flex flex-col flex-1 min-w-0 h-full">
        {/* Content */}
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0">
          {screen === 'home' && (
            <HomeScreen
              prospects={prospects}
              tachesApi={tachesApi}
              onOpenDetail={openDetail}
              onOpenAnalysis={() => setScreen('ai-analysis')}
            />
          )}
          {screen === 'prospects' && (
            <ProspectsScreen prospects={prospects} taches={tachesApi.taches} onOpenDetail={openDetail} />
          )}
          {screen === 'detail' && (
            <DetailScreen
              prospect={selectedProspect}
              tachesApi={tachesApi}
              onBack={() => setScreen(navTab)}
            />
          )}
          {screen === 'ai-analysis' && (
            <AIAnalysisScreen onBack={() => setScreen('home')} />
          )}
          </div>
        </div>

        {/* Footer (sur mobile, laisse la place à la barre de navigation fixe) */}
        <footer className={`shrink-0 bg-white border-t border-[#F0E8E0] py-2 text-center text-xs text-[#9CA3AF] ${showNav ? 'pb-16 md:pb-2' : ''}`}>
          © 2026 Era Immo - Tous droits réservés
        </footer>

        {/* Nav mobile */}
        {showNav && (
          <NavBar
            active={navTab}
            onChange={(t) => { setNavTab(t); setScreen(t) }}
          />
        )}
      </main>
    </div>
  )
}
