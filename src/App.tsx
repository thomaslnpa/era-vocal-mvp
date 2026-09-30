import { useState, useRef } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
type Screen = 'home' | 'prospects' | 'detail' | 'ai-analysis' | 'new-prospect' | 'task-voice' | 'note-analysis'
type Qualification = 'CHAUD' | 'TIÈDE' | 'FROID'
type Filter = 'Tous' | 'Chaud' | 'Tiède' | 'Froid' | 'À relancer'

interface Prospect {
  id: number
  prenom: string
  nom: string
  tel: string
  email: string
  qualification: Qualification
  typeBien: string
  typologie: string
  secteur: string
  budget: string
  horizon: string
  relance: string
  relanceLabel: string
  isLate?: boolean
  financement: string
  apport: string
  criteres: string[]
  motivation: string
  frein: string
  historique: { date: string; type: string; resume: string }[]
  prochaineAction: string
  prochaineActionDate: string
  canal: string
  messageSuggere: string
}

// ── Data ───────────────────────────────────────────────────────────────────────
const PROSPECTS: Prospect[] = [
  {
    id: 1,
    prenom: 'Sophie',
    nom: 'Martin',
    tel: '06 12 34 56 78',
    email: 'sophie.martin@example.fr',
    qualification: 'TIÈDE',
    typeBien: 'Appartement',
    typologie: 'T3',
    secteur: 'Toulouse Centre',
    budget: '300 000 €',
    horizon: 'Avant janvier',
    relance: 'aujourd\'hui',
    relanceLabel: 'Aujourd\'hui',
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
    prochaineAction: 'Faire un point sur l\'accord bancaire',
    prochaineActionDate: '15 octobre 2026',
    canal: 'WhatsApp',
    messageSuggere: 'Bonjour Sophie, je reviens vers vous concernant votre projet d\'achat d\'un T3 à Toulouse Centre. Avez-vous eu un retour de votre banque concernant votre accord de financement ? Je reste disponible pour vous accompagner dans cette étape. Bonne journée, Nicolas.',
  },
  {
    id: 2,
    prenom: 'Julien',
    nom: 'Morel',
    tel: '06 98 76 54 32',
    email: 'julien.morel@example.fr',
    qualification: 'FROID',
    typeBien: 'Maison',
    typologie: 'T5',
    secteur: 'Balma',
    budget: '450 000 €',
    horizon: 'Automne 2026',
    relance: 'aujourd\'hui',
    relanceLabel: 'Aujourd\'hui',
    isLate: true,
    financement: 'Non démarré',
    apport: '50 000 €',
    criteres: ['Jardin', 'Garage', '4 chambres minimum'],
    motivation: 'Projet de déménagement pour rapprocher les enfants de l\'école.',
    frein: 'Projet mis en pause. Situation professionnelle incertaine.',
    historique: [
      { date: '5 sept. 2026', type: 'note', resume: 'Projet initialement prévu pour l\'automne. Contact à reprendre.' },
    ],
    prochaineAction: 'Réactiver le projet',
    prochaineActionDate: 'Aujourd\'hui',
    canal: 'Appel',
    messageSuggere: 'Bonjour Julien, j\'espère que vous allez bien. Je souhaitais revenir vers vous concernant votre projet d\'acquisition d\'une maison à Balma. Avez-vous eu l\'occasion de faire avancer votre réflexion ? Je serais ravi d\'en discuter avec vous. Bonne journée, Nicolas.',
  },
  {
    id: 3,
    prenom: 'Émilie',
    nom: 'Laurent',
    tel: '07 23 45 67 89',
    email: 'emilie.laurent@example.fr',
    qualification: 'CHAUD',
    typeBien: 'Appartement',
    typologie: 'T4',
    secteur: 'Toulouse / Côte Pavée',
    budget: '520 000 €',
    horizon: 'D\'ici 2 mois',
    relance: 'demain',
    relanceLabel: 'Demain',
    financement: 'Accord obtenu',
    apport: '80 000 €',
    criteres: ['Vue dégagée', 'Ascenseur', 'Deux places de parking'],
    motivation: 'Financement validé, prête à signer rapidement.',
    frein: 'Peu de biens disponibles sur le secteur.',
    historique: [
      { date: '18 sept. 2026', type: 'vocal', resume: 'Accord de prêt confirmé. Très motivée. Budget extensible jusqu\'à 550 000 €.' },
    ],
    prochaineAction: 'Proposer les nouvelles annonces',
    prochaineActionDate: 'Demain',
    canal: 'WhatsApp',
    messageSuggere: 'Bonjour Émilie, de nouvelles annonces correspondant à vos critères viennent d\'être publiées à Toulouse Côte Pavée. Je vous les transmets dès maintenant. Êtes-vous disponible cette semaine pour une visite ? Bonne journée, Nicolas.',
  },
  {
    id: 4,
    prenom: 'Camille',
    nom: 'Bernard',
    tel: '06 55 44 33 22',
    email: 'camille.bernard@example.fr',
    qualification: 'TIÈDE',
    typeBien: 'Appartement',
    typologie: 'T2',
    secteur: 'Toulouse / Saint-Étienne',
    budget: '210 000 €',
    horizon: 'Début 2027',
    relance: 'dans 3 jours',
    relanceLabel: 'Dans 3 jours',
    financement: 'En cours',
    apport: '20 000 €',
    criteres: ['Lumineux', 'Calme'],
    motivation: 'Premier achat. Veut sécuriser son investissement.',
    frein: 'Hésite encore entre louer et acheter.',
    historique: [],
    prochaineAction: 'Relancer sur la décision achat/location',
    prochaineActionDate: 'Dans 3 jours',
    canal: 'Appel',
    messageSuggere: 'Bonjour Camille, j\'espère que vous allez bien. Avez-vous eu le temps de réfléchir à votre projet ? Achat ou location, je suis là pour vous aider à prendre la meilleure décision selon votre situation. N\'hésitez pas à me rappeler. Bonne journée, Nicolas.',
  },
  {
    id: 5,
    prenom: 'Thomas',
    nom: 'Garcia',
    tel: '07 11 22 33 44',
    email: 'thomas.garcia@example.fr',
    qualification: 'FROID',
    typeBien: 'Maison',
    typologie: 'T4',
    secteur: 'Colomiers',
    budget: '380 000 €',
    horizon: 'Printemps 2027',
    relance: '28 septembre',
    relanceLabel: '28 septembre',
    financement: 'Non démarré',
    apport: '40 000 €',
    criteres: ['Jardin', 'Quartier calme'],
    motivation: 'Famille qui s\'agrandit, besoin de plus d\'espace.',
    frein: 'Doit d\'abord vendre son appartement actuel.',
    historique: [],
    prochaineAction: 'Vérifier avancement de la vente de son appartement',
    prochaineActionDate: '28 septembre',
    canal: 'WhatsApp',
    messageSuggere: 'Bonjour Thomas, j\'espère que tout avance bien de votre côté. Avez-vous des nouvelles concernant la vente de votre appartement actuel ? Dès que vous aurez une visibilité, nous pourrons reprendre ensemble la recherche de votre maison à Colomiers. Bonne journée, Nicolas.',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function qualifBadge(q: Qualification) {
  const map = {
    CHAUD: { bg: 'bg-[#FEE8EA]', text: 'text-[#D00C29]', dot: 'bg-[#D00C29]' },
    TIÈDE: { bg: 'bg-[#FEF0E6]', text: 'text-[#E07B39]', dot: 'bg-[#E07B39]' },
    FROID: { bg: 'bg-[#E8EBF5]', text: 'text-[#1A2A63]', dot: 'bg-[#1A2A63]' },
  }
  return map[q]
}

function QualifBadge({ q }: { q: Qualification }) {
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
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bottom-sheet-enter">
        {children}
      </div>
    </div>
  )
}

// ── AI Validation Card ────────────────────────────────────────────────────────
function AIValidationCard({ prospect, info, updated, onVerify }: {
  prospect: string
  info: string
  updated: boolean
  onVerify: () => void
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
        onClick={onVerify}
        className="w-full h-9 min-h-9 shrink-0 border-t border-[#C8E6C9] text-xs font-700 text-[#2E7D32] flex items-center justify-center gap-1 active:bg-[#F1F8E9] transition-colors rounded-b-xl"
      >
        Vérifier <span>→</span>
      </button>
    </div>
  )
}

// ── Screen: Home ──────────────────────────────────────────────────────────────
function HomeScreen({ onOpenDetail, onOpenAnalysis }: {
  onOpenDetail: (p: Prospect) => void
  onOpenAnalysis: () => void
}) {
  const lateProspects = PROSPECTS.filter(p => p.isLate)
  const todayProspects = PROSPECTS.filter(p => p.relance === 'aujourd\'hui' && !p.isLate)
  const upcoming = PROSPECTS.filter(p => p.relance !== 'aujourd\'hui')
  const lateCount = lateProspects.length
  const todayCount = todayProspects.length
  const [messageProspect, setMessageProspect] = useState<Prospect | null>(null)

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA] relative">

      {/* Barre fixe — logo + profil uniquement */}
      <div className="px-5 pt-14 pb-3 bg-white border-b border-[#F0E8E0] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#850831] flex items-center justify-center">
              <span className="text-white text-xs font-700 tracking-wider">ERA</span>
            </div>
            <span className="text-[#1A2A63] text-xs font-500 tracking-wide uppercase">France</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#850831]/10 flex items-center justify-center">
            <span className="text-[#850831] text-sm font-600">N</span>
          </div>
        </div>
      </div>

      {/* Contenu scrollable — tout le reste */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
      <div className="pb-24 fade-in">

        {/* Bonjour + stats — dans le scroll */}
        <div className="px-5 pt-5 pb-5 bg-white border-b border-[#F0E8E0]">
          <h1 className="text-2xl font-serif text-[#1A2A63] leading-tight">Bonjour Nicolas 👋</h1>
          <p className="text-sm text-[#6B7280] mt-1">Voici ce qui mérite votre attention aujourd'hui.</p>
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-[#FEE8EA] rounded-xl px-4 py-3 border border-[#FECDD3]">
              <p className="text-2xl font-700 text-[#D00C29]">{lateCount}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">tâche{lateCount > 1 ? 's' : ''} en retard</p>
            </div>
            <div className="flex-1 bg-[#FFF1EA] rounded-xl px-4 py-3 border border-[#F0D8CA]">
              <p className="text-2xl font-700 text-[#850831]">{todayCount}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">tâche{todayCount > 1 ? 's' : ''} aujourd'hui</p>
            </div>
          </div>
        </div>

        {/* À valider — carrousel IA */}
        <section className="bg-[#E8F5E9] pt-5 pb-4 border-b border-[#C8E6C9]">
          <div className="flex items-center justify-between px-5 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎙</span>
              <h2 className="text-xs font-700 text-[#2E7D32] uppercase tracking-widest">À valider</h2>
              <span className="text-xs text-[#4CAF50] font-400">— depuis WhatsApp</span>
              <span className="bg-[#2E7D32] text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full leading-none">3</span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 pb-1">
            <AIValidationCard
              prospect="Sophie Martin"
              info="Relance proposée : 15 octobre"
              updated={false}
              onVerify={onOpenAnalysis}
            />
            <AIValidationCard
              prospect="Julien Morel"
              info="3 infos mises à jour"
              updated
              onVerify={() => {}}
            />
            <AIValidationCard
              prospect="Émilie Laurent"
              info="Qualification CHAUD proposée"
              updated={false}
              onVerify={() => {}}
            />
          </div>
        </section>

        {/* En retard */}
        {lateProspects.length > 0 && (
          <section className="px-5 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#D00C29]" />
              <h2 className="text-xs font-700 text-[#D00C29] uppercase tracking-widest">En retard</h2>
            </div>
            <div className="space-y-3">
              {lateProspects.map(p => (
                <ActionCard key={p.id} prospect={p} onView={() => onOpenDetail(p)} isLate onMessage={() => setMessageProspect(p)} />
              ))}
            </div>
          </section>
        )}

        {/* À faire aujourd'hui */}
        <section className="px-5 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#850831]" />
            <h2 className="text-xs font-600 text-[#9CA3AF] uppercase tracking-widest">À faire aujourd'hui</h2>
          </div>
          <div className="space-y-3">
            {todayProspects.map(p => (
              <ActionCard key={p.id} prospect={p} onView={() => onOpenDetail(p)} onMessage={() => setMessageProspect(p)} />
            ))}
          </div>
        </section>

        {/* À venir */}
        <section className="px-5 pt-5">
          <h2 className="text-xs font-600 text-[#9CA3AF] uppercase tracking-widest mb-3">À venir</h2>
          <div className="bg-white rounded-2xl divide-y divide-[#F3F4F6] shadow-sm border border-[#F0E8E0]">
            {upcoming.map((p, i) => (
              <div
                key={p.id}
                onClick={() => onOpenDetail(p)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-[#FFF8F5] ${i === 0 ? 'rounded-t-2xl' : ''} ${i === upcoming.length - 1 ? 'rounded-b-2xl' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-[#FFF1EA] flex items-center justify-center shrink-0">
                  <span className="text-sm font-600 text-[#850831]">{p.prenom[0]}{p.nom[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-600 text-[#111827]">{p.prenom} {p.nom}</p>
                  <p className="text-xs text-[#9CA3AF]">Relance {p.relance}</p>
                </div>
                <QualifBadge q={p.qualification} />
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>

      {/* Message modal — rendu hors du scroll, ancré au bas du frame */}
      {messageProspect && (
        <Overlay onClose={() => setMessageProspect(null)}>
          <MessageModal prospect={messageProspect} onClose={() => setMessageProspect(null)} />
        </Overlay>
      )}
    </div>
  )
}

function MessageModal({ prospect: p, onClose }: { prospect: Prospect; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(p.messageSuggere).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">✨</span>
          <h3 className="text-base font-700 text-[#111827]">Message généré</h3>
        </div>
        <p className="text-xs text-[#9CA3AF] mb-4">Pour {p.prenom} {p.nom} · via {p.canal}</p>

        <div className="bg-[#F9FAFB] rounded-2xl px-4 py-4 border border-[#E5E7EB] mb-4">
          <p className="text-sm text-[#374151] leading-relaxed">{p.messageSuggere}</p>
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
      </div>
    </Overlay>
  )
}

function ActionCard({ prospect: p, onView, onMessage, isLate }: { prospect: Prospect; onView: () => void; onMessage: () => void; isLate?: boolean }) {
  const [done, setDone] = useState(false)

  const borderColor = isLate ? 'border-[#FECDD3]' : 'border-[#F0E8E0]'

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] px-4 py-3 flex items-center gap-3 fade-in opacity-60">
        <div className="w-6 h-6 rounded-full bg-[#F0FDF4] border-2 border-[#4ADE80] flex items-center justify-center shrink-0">
          <span className="text-[#16A34A] text-xs font-700">✓</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-600 text-[#6B7280]">{p.prenom} {p.nom}</p>
          <p className="text-xs text-[#9CA3AF]">Tâche marquée comme terminée</p>
        </div>
      </div>
    )
  }

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
            {/* Terminé checkbox */}
            <button
              onClick={() => setDone(true)}
              className="w-7 h-7 rounded-full border-2 border-[#D1D5DB] flex items-center justify-center shrink-0 active:border-[#4ADE80] active:bg-[#F0FDF4] transition-all mt-0.5"
              title="Marquer comme terminé"
            />
          </div>

          <div className="bg-[#FFF8F5] rounded-xl px-3 py-2.5 mt-2">
            <p className="text-xs text-[#9CA3AF] mb-1">Contexte</p>
            <p className="text-sm text-[#374151] font-500">{p.frein}</p>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm">{p.canal === 'WhatsApp' ? '💬' : '📞'}</span>
            <p className="text-sm font-600 text-[#1A2A63]">{p.prochaineAction}</p>
          </div>
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

    </>
  )
}

// ── ProspectTaskCard — variante fiche prospect de ActionCard ──────────────────
interface ProspectTask {
  date: string
  icon: string
  label: string
  contexte: string
  messageSuggere: string
}

function ProspectTaskCard({ task, prospect }: { task: ProspectTask; prospect: Prospect }) {
  const [done, setDone] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(task.label)
  const [date, setDate] = useState(task.date)
  const [contexte, setContexte] = useState(task.contexte)

  // Synthetic prospect-like object for MessageModal
  const syntheticProspect = { ...prospect, prochaineAction: label, messageSuggere: task.messageSuggere }

  if (done) {
    return (
      <div className="shrink-0 w-72 bg-white rounded-2xl border border-[#E5E7EB] px-4 py-3 flex items-center gap-3 fade-in opacity-60">
        <div className="w-6 h-6 rounded-full bg-[#F0FDF4] border-2 border-[#4ADE80] flex items-center justify-center shrink-0">
          <span className="text-[#16A34A] text-xs font-700">✓</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-600 text-[#6B7280]">{label}</p>
          <p className="text-xs text-[#9CA3AF]">Tâche terminée</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="shrink-0 w-72 bg-white rounded-2xl shadow-sm border border-[#F0E8E0] overflow-hidden fade-in flex flex-col" style={{ minHeight: 168 }}>
        <div className="px-4 pt-4 pb-3 flex-1 flex flex-col">
          {/* Header : date + contrôles */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-xs font-700 text-[#850831]">{date}</p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="w-6 h-6 flex items-center justify-center text-[#9CA3AF] active:text-[#850831] transition-colors"
                title="Modifier"
              >
                <span className="text-sm">✏️</span>
              </button>
              <button
                onClick={() => setDone(true)}
                className="w-7 h-7 rounded-full border-2 border-[#D1D5DB] flex items-center justify-center active:border-[#4ADE80] active:bg-[#F0FDF4] transition-all"
                title="Marquer comme terminé"
              />
            </div>
          </div>

          {/* Contexte + Action — flex-1 pour pousser le footer en bas */}
          <div className="flex-1 flex flex-col justify-end">
            {contexte ? (
              <div className="bg-[#FFF8F5] rounded-xl px-3 py-2 mb-2">
                <p className="text-xs text-[#9CA3AF] mb-0.5">Contexte</p>
                <p className="text-sm text-[#374151]">{contexte}</p>
              </div>
            ) : null}

            {/* Action */}
            <div className="flex items-center gap-2">
              <span className="text-sm">{task.icon}</span>
              <p className="text-sm font-600 text-[#1A2A63] leading-snug">{label}</p>
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

      {/* Message modal — rendered outside card scroll */}
      {showMessage && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 390, margin: '0 auto' }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowMessage(false)} />
          <div className="relative bottom-sheet-enter">
            <MessageModal prospect={syntheticProspect} onClose={() => setShowMessage(false)} />
          </div>
        </div>
      )}

      {/* Edit bottom sheet */}
      {editing && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 390, margin: '0 auto' }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setEditing(false)} />
          <div className="relative bottom-sheet-enter bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
            <h3 className="text-base font-700 text-[#111827] mb-4">Modifier la tâche</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Intitulé</label>
                <input value={label} onChange={e => setLabel(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Date</label>
                <input value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Contexte</label>
                <input value={contexte} onChange={e => setContexte(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(false)} className="flex-1 py-3.5 rounded-2xl border border-[#E5E7EB] text-sm font-600 text-[#6B7280]">Annuler</button>
              <button onClick={() => setEditing(false)} className="flex-1 py-3.5 rounded-2xl bg-[#850831] text-white text-sm font-700 active:scale-[0.98] transition-transform">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Screen: Prospects ─────────────────────────────────────────────────────────
function ProspectsScreen({ onOpenDetail, onNewProspect }: {
  onOpenDetail: (p: Prospect) => void
  onNewProspect: () => void
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('Tous')
  const filters: Filter[] = ['Tous', 'Chaud', 'Tiède', 'Froid', 'À relancer']

  const filtered = PROSPECTS.filter(p => {
    const name = `${p.prenom} ${p.nom}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase())
    const matchFilter =
      filter === 'Tous' ? true :
      filter === 'À relancer' ? p.relance === 'aujourd\'hui' :
      p.qualification === filter.toUpperCase() as Qualification
    return matchSearch && matchFilter
  })

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA]">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-white border-b border-[#F0E8E0]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-serif text-[#1A2A63]">Prospects</h1>
          <button
            onClick={onNewProspect}
            className="flex items-center gap-1.5 bg-[#850831] text-white text-sm font-600 px-3.5 py-2 rounded-full active:scale-95 transition-transform"
          >
            <span className="text-base leading-none">+</span> Nouveau
          </button>
        </div>
        <div className="relative mb-3">
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

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-24">
        <p className="text-xs text-[#9CA3AF] mb-3">{filtered.length} prospect{filtered.length > 1 ? 's' : ''}</p>
        <div className="space-y-2.5 fade-in">
          {filtered.map(p => (
            <ProspectRow key={p.id} prospect={p} onClick={() => onOpenDetail(p)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProspectRow({ prospect: p, onClick }: { prospect: Prospect; onClick: () => void }) {
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
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{p.typeBien} {p.typologie} · {p.secteur} · {p.budget}</p>
          <p className="text-xs font-600 text-[#850831] mt-1">Relance : {p.relance}</p>
        </div>
        <span className="text-[#D1D5DB] text-lg">›</span>
      </div>
    </div>
  )
}

// ── Screen: Detail ────────────────────────────────────────────────────────────
function DetailScreen({ prospect: p, onBack, onOpenAnalysis, onOpenAddSheet }: {
  prospect: Prospect
  onBack: () => void
  onOpenAnalysis: () => void
  onOpenAddSheet: () => void
}) {
  const [editSection, setEditSection] = useState<string | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [projetOpen, setProjetOpen] = useState(false)
  const [financementOpen, setFinancementOpen] = useState(false)
  const [expandedHistorique, setExpandedHistorique] = useState<number[]>([])

  const toggleHistorique = (i: number) =>
    setExpandedHistorique(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const taches: ProspectTask[] = [
    {
      date: p.prochaineActionDate,
      icon: p.canal === 'WhatsApp' ? '💬' : '📞',
      label: p.prochaineAction,
      contexte: p.frein,
      messageSuggere: p.messageSuggere,
    },
    {
      date: '15 octobre',
      icon: '💬',
      label: 'Envoyer une sélection de biens',
      contexte: '4–5 appartements correspondant aux nouveaux critères.',
      messageSuggere: `Bonjour ${p.prenom}, je vous transmets une sélection de biens correspondant à vos critères. N'hésitez pas à me faire part de vos retours. Bonne journée, Nicolas.`,
    },
    {
      date: '28 octobre',
      icon: '📞',
      label: 'Faire un point sur l\'avancement du projet',
      contexte: '',
      messageSuggere: `Bonjour ${p.prenom}, je souhaitais faire un point avec vous sur l'avancement de votre projet. Avez-vous du nouveau ? Bonne journée, Nicolas.`,
    },
  ]

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA] relative">
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">

        {/* ── Header ── */}
        <div className="bg-white px-5 pt-14 pb-5 border-b border-[#F0E8E0]">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#850831] text-sm font-500 mb-4 active:opacity-60">
            ‹ Retour
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-serif text-[#1A2A63]">{p.prenom} {p.nom}</h1>
              <div className="flex items-center gap-2 mt-2">
                <QualifBadge q={p.qualification} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#850831]/10 flex items-center justify-center shrink-0">
              <span className="text-[#850831] font-700 text-base">{p.prenom[0]}{p.nom[0]}</span>
            </div>
          </div>
          <p className="text-sm text-[#6B7280] mt-2">{p.tel} · {p.email}</p>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#850831] text-white text-sm font-600 py-2.5 rounded-xl active:scale-95 transition-transform">
              <span>📞</span> Appeler
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#128C7E] text-sm font-600 py-2.5 rounded-xl border border-[#25D366]/20 active:scale-95 transition-transform">
              <span>💬</span> WhatsApp
            </button>
          </div>
        </div>

        {/* ── Prochaines actions — carrousel horizontal ── */}
        <div className="pt-5">
          <div className="flex items-center justify-between px-5 mb-3">
            <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest">Prochaines actions</p>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 pb-1">
            {taches.map((t, i) => (
              <ProspectTaskCard key={i} task={t} prospect={p} />
            ))}
          </div>
        </div>

        <div className="px-5 pt-5 space-y-4 fade-in">

          {/* ── Informations prospect ── */}
          <InfoCard title="Informations prospect" onEdit={() => setEditSection('info')}>
            <Row label="Situation actuelle" value="Locataire" />
            <Row label="Situation familiale" value="Célibataire" />
            <Row label="Lieu de travail" value="Toulouse Centre" />
            <Row label="Situation professionnelle" value="CDI" />
            <Row label="Revenus approximatifs" value="3 200 € / mois" />
            {infoOpen && (
              <div className="fade-in">
                <Row label="Adresse" value="Non renseigné" />
                <Row label="Locataire depuis" value="Non renseigné" />
                <Row label="Loyer actuel" value="Non renseigné" />
                <Row label="Revente nécessaire" value="Non" />
                <Row label="Enfants" value="Non renseigné" />
                <Row label="Secteur d'activité" value="Non renseigné" />
                <Row label="Canal préféré" value="WhatsApp" />
                <Row label="Origine du prospect" value="Recommandation" />
                <Row label="Agent responsable" value="Nicolas" />
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
                <Row label="Usage" value="Résidence principale" />
                <Row label="Ancien / Récent" value="Indifférent" />
                <Row label="Superficie" value="Non renseigné" />
                <Row label="Pièces" value="Non renseigné" />
                <Row label="Chambres" value="2 minimum" />
                <Row label="Ascenseur" value="Souhaité" />
                <Row label="Étage" value="Non renseigné" />
                <Row label="Balcon / Terrasse" value="Indispensable" />
                <Row label="Parking / Garage" value="Souhaité" />
                <Row label="Travaux acceptés" value="Non" />
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
            <Row label="Banque consultée" value="Oui" />
            <Row label="Accord bancaire" value="En attente" />
            <Row label="Apport" value={p.apport} />
            {financementOpen && (
              <div className="fade-in">
                <Row label="Emprunt nécessaire" value="Oui" />
                <Row label="Montant emprunt" value="270 000 €" />
                <Row label="Durée envisagée" value="20 ans" />
                <Row label="Taux" value="Non renseigné" />
                <Row label="Courtier" value="Non renseigné" />
              </div>
            )}
            <button
              onClick={() => setFinancementOpen(!financementOpen)}
              className="mt-3 text-xs font-600 text-[#850831] active:opacity-60"
            >
              {financementOpen ? 'Voir moins ↑' : 'Voir plus ↓'}
            </button>
          </InfoCard>

          {/* ── Critères importants ── */}
          <InfoCard title="Critères importants recherchés" onEdit={() => setEditSection('criteres')}>
            <div className="space-y-2">
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
                <p className="text-sm text-[#374151] font-500">{p.motivation}</p>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Frein actuel</p>
                <p className="text-sm text-[#E07B39] font-500">{p.frein}</p>
              </div>
            </div>
          </InfoCard>

          {/* ── Historique ── */}
          <InfoCard title="Historique">
            {p.historique.length === 0 && (
              <p className="text-sm text-[#9CA3AF] italic">Aucune interaction enregistrée.</p>
            )}
            <div className="space-y-0">
              {p.historique.map((h, i) => {
                const open = expandedHistorique.includes(i)
                const isTache = h.type === 'tache'
                const isNote = h.type === 'note'
                const icon = isTache ? '✅' : isNote ? '📝' : '🎙️'
                const iconBg = isTache ? 'bg-[#EEF2FF]' : isNote ? 'bg-[#FFF8F5]' : 'bg-[#E8F5E9]'
                const typeLabel = isTache ? 'Tâche réalisée' : isNote ? 'Note' : 'Vocal WhatsApp'
                return (
                  <div key={i} className={`${i < p.historique.length - 1 ? 'border-b border-[#F3F4F6] pb-3 mb-3' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center text-sm shrink-0`}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-[#9CA3AF]">{h.date} · {typeLabel}</p>
                          {!isTache && (
                            <button
                              onClick={() => toggleHistorique(i)}
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

      {/* ── CTA fixe ── */}
      <div className="absolute bottom-16 left-0 right-0 px-5 pb-4 pt-3 bg-gradient-to-t from-[#FFF1EA] to-transparent">
        <button
          onClick={onOpenAddSheet}
          className="w-full bg-[#850831] text-white text-sm font-700 py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
        >
          + Ajouter une note ou une tâche
        </button>
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
      <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
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
      <span className="text-sm font-500 text-[#111827]">{value}</span>
    </div>
  )
}

function AddNoteSheet({ onClose, onVocal }: { onClose: () => void; onVocal: () => void }) {
  return (
    <div className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
      <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-6" />
      <h3 className="text-base font-700 text-[#111827] mb-4">Ajouter à Sophie Martin</h3>
      <div className="space-y-3">
        {[
          { icon: '🎙️', label: 'Compte rendu vocal', sub: 'Dictez votre compte rendu', action: onVocal },
          { icon: '✏️', label: 'Note écrite', sub: 'Saisissez une note rapide', action: onClose },
          { icon: '✓', label: 'Créer une tâche', sub: 'Planifiez une action', action: onClose },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-4 bg-[#F9FAFB] rounded-2xl px-4 py-3.5 active:bg-[#F3F4F6] transition-colors text-left"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-600 text-[#111827]">{item.label}</p>
              <p className="text-xs text-[#9CA3AF]">{item.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Transcription Accordion ───────────────────────────────────────────────────
function TranscriptionAccordion({ source = 'whatsapp' }: { source?: 'whatsapp' | 'vocal-app' | 'text-app' }) {
  const [open, setOpen] = useState(false)

  const transcriptions = {
    'whatsapp': `« Je viens d'avoir Sophie Martin au téléphone. Elle m'a confirmé que son projet est toujours actif. Elle cherche un T3 sur le secteur Carmes / Esquirol, son budget a évolué, elle peut aller jusqu'à 500 000 €. Elle est maintenant en CDI depuis le mois dernier, ça change sa situation pour le financement. Elle tient vraiment à avoir une terrasse, c'est indispensable pour elle. Un parking serait bien aussi mais c'est secondaire. Elle m'a demandé de lui envoyer les nouvelles annonces demain matin par email. Je pense qu'on peut requalifier son dossier, elle est beaucoup plus active qu'avant. »`,
    'vocal-app': `« Nouveau contact, Marie Dupont. Elle cherche un T3 sur Bordeaux centre, budget autour de 280 000 €. Projet pour le printemps 2027. Elle aimerait un balcon ou une terrasse, c'est indispensable pour elle. Un parking serait un plus. Célibataire, situation stable. À recontacter rapidement pour lui envoyer une première sélection. »`,
    'text-app': `« Marie Dupont, cherche un T3 à Bordeaux centre, budget 280 000 €, projet pour le printemps 2027. Souhaite balcon ou terrasse (indispensable), parking souhaité. Célibataire. Envoyer une sélection de biens cette semaine. »`,
  }

  const badges = {
    'whatsapp':   { icon: '💬', label: 'WhatsApp · vocal',   color: 'text-[#25D366] bg-[#F0FFF4] border-[#C8E6C9]' },
    'vocal-app':  { icon: '🎙️', label: 'Note vocale · app',  color: 'text-[#850831] bg-[#FFF1EA] border-[#F0D8CA]' },
    'text-app':   { icon: '✏️', label: 'Note écrite · app',  color: 'text-[#1A2A63] bg-[#EEF2FF] border-[#C7D2FE]' },
  }

  const badge = badges[source]

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
          <p className="text-sm text-[#374151] leading-relaxed italic">{transcriptions[source]}</p>
        </div>
      )}
    </div>
  )
}

// ── Screen: AI Analysis (refonte) ────────────────────────────────────────────
type EditTarget = 'prospect' | 'projet' | 'criteres' | 'tache' | 'qualification' | null

function AIAnalysisScreen({ onBack, onBackToDashboard, titleOverride, transcriptionSource = 'whatsapp', prospect }: { onBack: () => void; onBackToDashboard?: () => void; titleOverride?: string; transcriptionSource?: 'whatsapp' | 'vocal-app' | 'text-app'; prospect?: Prospect }) {
  const [validated, setValidated] = useState(false)
  const [editTarget, setEditTarget] = useState<EditTarget>(null)

  // State mutable par l'agent
  const [prospectSituation, setProspectSituation] = useState('CDI')
  const [budget, setBudget] = useState('500 000 €')
  const [criteres, setCriteres] = useState(['Terrasse — indispensable', 'Parking — souhaité'])
  const [tacheLabel, setTacheLabel] = useState('Envoyer les nouvelles annonces')
  const [tacheDate, setTacheDate] = useState('Demain · 10h00')
  const [tacheCanal, setTacheCanal] = useState('Email')
  const [qualif, setQualif] = useState<'FROID' | 'TIÈDE' | 'CHAUD'>('TIÈDE')

  if (validated) {
    return (
      <div className="flex flex-col h-full bg-[#FFF1EA]">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[#F0FDF4] border-2 border-[#BBF7D0] flex items-center justify-center text-4xl mb-5 fade-in">✓</div>
          <h2 className="text-2xl font-serif text-[#111827] mb-2">Modifications enregistrées</h2>
          <div className="space-y-2 mt-3 mb-8">
            {['3 informations mises à jour', '1 tâche créée', 'Google Calendar mis à jour'].map(line => (
              <p key={line} className="text-sm text-[#6B7280] flex items-center justify-center gap-2">
                <span className="text-[#16A34A]">✓</span> {line}
              </p>
            ))}
          </div>
          <button
            onClick={onBackToDashboard ?? onBack}
            className="bg-[#850831] text-white text-sm font-700 px-8 py-4 rounded-2xl shadow-md active:scale-95 transition-transform"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA] relative">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28">

        {/* Header */}
        <div className="bg-white px-5 pt-14 pb-5 border-b border-[#F0E8E0]">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#850831] text-sm font-500 mb-4 active:opacity-60">
            ‹ Retour
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-lg shrink-0">🎙</div>
            <div>
              <h1 className="text-lg font-serif text-[#1A2A63] leading-tight">{titleOverride ?? 'Message WhatsApp analysé'}</h1>
              <p className="text-xs text-[#9CA3AF]">Vérifiez les actions détectées avant de les appliquer.</p>
            </div>
          </div>

          {/* Prospect identifié */}
          <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest mb-1">Prospect identifié</p>
                <p className="text-sm font-700 text-[#111827]">{prospect ? `${prospect.prenom} ${prospect.nom}` : 'Sophie Martin'}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{prospect ? prospect.tel : '06 12 34 56 78'}</p>
              </div>
              <button className="text-xs font-600 text-[#850831] active:opacity-60 mt-0.5">Modifier</button>
            </div>
            {!prospect && <button className="mt-2.5 text-xs text-[#9CA3AF] font-500 active:opacity-60">+ Créer un nouveau prospect</button>}
          </div>

          {/* Rappel projet */}
          <div className="flex items-center gap-2 mt-3 px-1">
            <span className="text-sm">🏠</span>
            <p className="text-xs text-[#6B7280] font-500">T3 · {budget} · Carmes / Esquirol</p>
          </div>
        </div>

        <div className="px-5 pt-5 space-y-3 fade-in">

          {/* Titre section */}
          <div className="flex items-center gap-2">
            <p className="text-xs font-700 text-[#111827] uppercase tracking-widest">Actions détectées</p>
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
              <QualifBadge q="FROID" />
              <span className="text-[#9CA3AF] text-sm">→</span>
              <QualifBadge q={qualif} />
            </div>
            <p className="text-[10px] text-[#6B7280] bg-[#F9FAFB] rounded-lg px-2.5 py-1.5">
              Financement avancé · budget confirmé · projet actif
            </p>
          </div>

          {/* Transcription complète */}
          <TranscriptionAccordion source={transcriptionSource} />

        </div>
      </div>

      {/* CTA fixe */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-[#FFF1EA] via-[#FFF1EA] to-transparent">
        <button
          onClick={() => setValidated(true)}
          className="w-full bg-[#850831] text-white text-sm font-700 py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
        >
          Tout valider
        </button>
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
              {(['CHAUD', 'TIÈDE', 'FROID'] as const).map(q => (
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
      <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
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

// ── Screen: New Prospect ──────────────────────────────────────────────────────
function NewProspectScreen({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [created, setCreated] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')

  if (created) {
    return (
      <div className="flex flex-col h-full bg-[#FFF1EA]">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[#F0FDF4] border-2 border-[#BBF7D0] flex items-center justify-center text-4xl mb-5 fade-in">
            ✓
          </div>
          <h2 className="text-2xl font-serif text-[#111827] mb-2">Prospect créé</h2>
          <p className="text-sm text-[#9CA3AF]">{prenom || 'Nouveau'} {nom || 'prospect'} a été ajouté à votre liste.</p>

          <button className="mt-8 flex items-center gap-2 bg-[#850831] text-white text-sm font-700 px-6 py-4 rounded-2xl shadow-md active:scale-95 transition-transform">
            <span>🎙</span> Ajouter un premier compte rendu
          </button>
          <button onClick={onBack} className="mt-3 text-[#9CA3AF] text-sm font-500 active:opacity-60">
            Retour aux prospects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA]">
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        <div className="bg-white px-5 pt-14 pb-5 border-b border-[#F0E8E0]">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#850831] text-sm font-500 mb-4 active:opacity-60">
            ‹ Retour
          </button>
          <h1 className="text-2xl font-serif text-[#1A2A63]">Nouveau prospect</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Ajoutez l'essentiel. Vous complèterez la fiche plus tard.</p>
        </div>

        <div className="px-5 pt-5 space-y-4 fade-in">
          <div className="bg-white rounded-2xl px-4 py-4 space-y-4 border border-[#F0E8E0] shadow-sm">
            <Field label="Prénom" value={prenom} onChange={setPrenom} placeholder="Sophie" />
            <Field label="Nom" value={nom} onChange={setNom} placeholder="Martin" />
          </div>

          <div className="bg-white rounded-2xl px-4 py-4 space-y-4 border border-[#F0E8E0] shadow-sm">
            <Field label="Téléphone" value={tel} onChange={setTel} placeholder="06 12 34 56 78" type="tel" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="sophie.martin@example.fr" type="email" />
            <p className="text-xs text-[#9CA3AF] bg-[#FFF8F5] rounded-lg px-3 py-2">
              ℹ️ Un numéro de téléphone ou une adresse email est nécessaire.
            </p>
          </div>

          {/* Section optionnelle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between bg-white rounded-2xl px-4 py-4 border border-[#F0E8E0] shadow-sm active:bg-[#FFF8F5] transition-colors"
          >
            <span className="text-sm font-600 text-[#850831]">+ Ajouter des informations sur le projet</span>
            <span className={`text-[#9CA3AF] transition-transform ${expanded ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {expanded && (
            <div className="bg-white rounded-2xl px-4 py-4 space-y-4 border border-[#F0E8E0] shadow-sm fade-in">
              {[
                { label: 'Type de bien', placeholder: 'Appartement, Maison…' },
                { label: 'Secteur', placeholder: 'Toulouse Centre, Balma…' },
                { label: 'Budget', placeholder: '300 000 €' },
                { label: 'Horizon', placeholder: 'Avant janvier 2027' },
                { label: 'Motivations', placeholder: 'Résidence principale…' },
                { label: 'Freins', placeholder: 'Financement en cours…' },
              ].map(f => (
                <Field key={f.label} label={f.label} value="" onChange={() => {}} placeholder={f.placeholder} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 px-5 pb-4 pt-3 bg-gradient-to-t from-[#FFF1EA] to-transparent">
        <button
          onClick={() => setCreated(true)}
          className="w-full bg-[#850831] text-white text-sm font-700 py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
        >
          Créer le prospect
        </button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label className="text-xs font-600 text-[#6B7280] block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831] focus:ring-1 focus:ring-[#850831]/20 transition-all placeholder:text-[#D1D5DB]"
      />
    </div>
  )
}

// ── Screen: Task by Voice ─────────────────────────────────────────────────────
function TaskVoiceScreen({ onBack, onValidate, existingProspect }: {
  onBack: () => void
  onValidate: (mode: 'vocal' | 'text') => void
  existingProspect?: Prospect
}) {
  const [mode, setMode] = useState<'vocal' | 'text'>('vocal')
  const [step, setStep] = useState<'listen' | 'transcribe' | 'processing'>('listen')
  const [textNote, setTextNote] = useState('')

  const switchMode = (m: 'vocal' | 'text') => { setMode(m); setStep('listen') }

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA]">
      <div className="bg-white px-5 pt-14 pb-4 border-b border-[#F0E8E0]">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#850831] text-sm font-500 mb-4 active:opacity-60">
          ‹ Retour
        </button>
        <h1 className="text-2xl font-serif text-[#1A2A63]">Créer une note</h1>

        {/* Sous-titre : prospect existant ou nouveau */}
        {existingProspect ? (
          <div className="mt-2 mb-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFF1EA] border border-[#F0D8CA] flex items-center justify-center text-xs font-600 text-[#850831] shrink-0">
              {existingProspect.prenom[0]}{existingProspect.nom[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-[#111827]">{existingProspect.prenom} {existingProspect.nom}</p>
              <p className="text-xs text-[#9CA3AF]">{existingProspect.typeBien} · {existingProspect.secteur}</p>
            </div>
            <QualifBadge q={existingProspect.qualification} />
          </div>
        ) : (
          <p className="text-sm text-[#9CA3AF] mt-1 mb-4">Nouveau prospect</p>
        )}

        {/* Toggle tabs */}
        <div className="flex gap-2 bg-[#F3F4F6] rounded-xl p-1">
          <button
            onClick={() => switchMode('vocal')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-600 transition-all ${mode === 'vocal' ? 'bg-white text-[#850831] shadow-sm' : 'text-[#9CA3AF]'}`}
          >
            <span className="text-base">🎙️</span> Vocal
          </button>
          <button
            onClick={() => switchMode('text')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-600 transition-all ${mode === 'text' ? 'bg-white text-[#850831] shadow-sm' : 'text-[#9CA3AF]'}`}
          >
            <span className="text-base">✏️</span> Texte
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 fade-in">
        {mode === 'vocal' && step === 'listen' && (
          <div className="text-center w-full">
            <button
              onClick={() => { setStep('transcribe'); setTimeout(() => { setStep('processing'); setTimeout(() => onValidate('vocal'), 1200) }, 2000) }}
              className="w-24 h-24 rounded-full bg-[#850831] flex items-center justify-center shadow-2xl shadow-[#850831]/30 active:scale-95 transition-transform mx-auto mb-6"
            >
              <span className="text-5xl">🎙️</span>
            </button>
            <p className="text-base font-600 text-[#111827]">Appuyez pour dicter</p>
            <p className="text-sm text-[#9CA3AF] mt-1">Décrivez votre prospect et les informations clés</p>
          </div>
        )}

        {mode === 'vocal' && step === 'transcribe' && (
          <div className="text-center fade-in">
            <div className="w-24 h-24 rounded-full bg-[#850831]/10 border-2 border-[#850831] flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-5xl">🎙️</span>
            </div>
            <p className="text-base font-600 text-[#850831]">Je vous écoute...</p>
            <p className="text-sm text-[#9CA3AF] mt-1 italic">« Nouveau contact, Marie Dupont, cherche un T3 à Bordeaux... »</p>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center fade-in">
            <div className="w-20 h-20 rounded-full bg-[#FFF1EA] border-2 border-[#850831]/20 flex items-center justify-center mx-auto mb-5 animate-pulse">
              <span className="text-4xl">✨</span>
            </div>
            <p className="text-base font-600 text-[#111827]">Analyse en cours…</p>
            <p className="text-sm text-[#9CA3AF] mt-1">L'IA extrait les informations</p>
          </div>
        )}

        {mode === 'text' && step === 'listen' && (
          <div className="w-full fade-in">
            <p className="text-sm font-600 text-[#111827] mb-2">Décrivez votre nouveau prospect</p>
            <p className="text-xs text-[#9CA3AF] mb-4">Prénom, nom, ce qu'il cherche, son budget, ses critères…</p>
            <textarea
              value={textNote}
              onChange={e => setTextNote(e.target.value)}
              placeholder="Ex : Marie Dupont, cherche un T3 à Bordeaux centre, budget 280 000 €, projet pour le printemps 2027…"
              rows={6}
              className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3.5 text-sm text-[#111827] outline-none focus:border-[#850831] resize-none placeholder:text-[#D1D5DB] shadow-sm"
            />
            <button
              onClick={() => { setStep('processing'); setTimeout(() => onValidate('text'), 1000) }}
              disabled={textNote.trim().length < 5}
              className="mt-4 w-full bg-[#850831] text-white text-sm font-700 py-4 rounded-2xl shadow-md active:scale-[0.98] transition-all disabled:opacity-40 disabled:scale-100"
            >
              Analyser la note
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Screen: Note Analysis (nouveau prospect) ─────────────────────────────────
function NoteAnalysisScreen({ noteMode, onBack, onBackToDashboard }: {
  noteMode: 'vocal' | 'text'
  onBack: () => void
  onBackToDashboard: () => void
}) {
  const [validated, setValidated] = useState(false)
  type NoteEditTarget = 'prospect' | 'projet' | 'criteres' | 'tache' | 'qualification' | null
  const [editTarget, setEditTarget] = useState<NoteEditTarget>(null)

  // Données extraites — prénom et tel manquants pour déclencher la validation
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('Dupont')
  const [tel, setTel] = useState('')
  const [situation, setSituation] = useState('Célibataire')
  const [typeBien, setTypeBien] = useState('T3')
  const [secteur, setSecteur] = useState('Bordeaux centre')
  const [budget, setBudget] = useState('280 000 €')
  const [horizon, setHorizon] = useState('Printemps 2027')
  const [criteres, setCriteres] = useState(['Balcon ou terrasse — indispensable', 'Parking — souhaité'])
  const [tacheLabel, setTacheLabel] = useState('Envoyer une sélection de biens')
  const [tacheDate, setTacheDate] = useState('Demain · 10h00')
  const [tacheCanal, setTacheCanal] = useState('Email')
  const [qualif, setQualif] = useState<'FROID' | 'TIÈDE' | 'CHAUD'>('TIÈDE')

  const nomComplet = [prenom, nom].filter(Boolean).join(' ') || '—'
  const missing = [!prenom.trim() && 'Prénom', !nom.trim() && 'Nom', !tel.trim() && 'Téléphone'].filter(Boolean) as string[]
  const canCreate = missing.length === 0

  if (validated) {
    return (
      <div className="flex flex-col h-full bg-[#FFF1EA]">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[#F0FDF4] border-2 border-[#BBF7D0] flex items-center justify-center text-4xl mb-5 fade-in">✓</div>
          <h2 className="text-2xl font-serif text-[#111827] mb-2">Fiche créée</h2>
          <div className="space-y-2 mt-3 mb-8">
            {['Nouveau prospect ajouté', '1 tâche créée', 'Disponible dans votre liste'].map(line => (
              <p key={line} className="text-sm text-[#6B7280] flex items-center justify-center gap-2">
                <span className="text-[#16A34A]">✓</span> {line}
              </p>
            ))}
          </div>
          <button onClick={onBackToDashboard} className="bg-[#850831] text-white text-sm font-700 px-8 py-4 rounded-2xl shadow-md active:scale-95 transition-transform">
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF1EA] relative">
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28">

        {/* Header — même structure qu'AIAnalysisScreen */}
        <div className="bg-white px-5 pt-14 pb-5 border-b border-[#F0E8E0]">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#850831] text-sm font-500 mb-4 active:opacity-60">
            ‹ Retour
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#FFF1EA] border border-[#F0D8CA] flex items-center justify-center text-lg shrink-0">
              {noteMode === 'vocal' ? '🎙️' : '✏️'}
            </div>
            <div>
              <h1 className="text-lg font-serif text-[#1A2A63] leading-tight">
                {noteMode === 'vocal' ? 'Note vocale analysée' : 'Note écrite analysée'}
              </h1>
              <p className="text-xs text-[#9CA3AF]">Vérifiez les actions détectées avant de les appliquer.</p>
            </div>
          </div>

          {/* Nouveau prospect — avec alerte si champs manquants */}
          <div className={`rounded-xl border px-4 py-3 ${missing.length > 0 ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest mb-1">Nouveau prospect</p>
                <p className="text-sm font-700 text-[#111827]">{nomComplet}</p>
                {tel.trim()
                  ? <p className="text-xs text-[#6B7280] mt-0.5">{tel}</p>
                  : <p className="text-xs text-[#EF4444] mt-0.5 italic">Téléphone manquant</p>
                }
                {missing.length > 0 && (
                  <p className="text-[10px] text-[#B91C1C] mt-1.5 font-600">⚠ Manquant : {missing.join(', ')}</p>
                )}
              </div>
              <button onClick={() => setEditTarget('prospect')} className="text-xs font-600 text-[#850831] active:opacity-60 mt-0.5 shrink-0">Modifier</button>
            </div>
          </div>

          {/* Rappel projet */}
          <div className="flex items-center gap-2 mt-3 px-1">
            <span className="text-sm">🏠</span>
            <p className="text-xs text-[#6B7280] font-500">{typeBien} · {budget} · {secteur}</p>
          </div>
        </div>

        <div className="px-5 pt-5 space-y-3 fade-in">

          {/* Titre section */}
          <div className="flex items-center gap-2">
            <p className="text-xs font-700 text-[#111827] uppercase tracking-widest">Actions détectées</p>
            <span className="bg-[#1A2A63] text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full">4</span>
          </div>

          {/* Card 1 — Ajout prospect */}
          <DetectedActionCard icon="👤" category="Ajout du prospect" onEdit={() => setEditTarget('prospect')}>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#850831] shrink-0" />
                <p className="text-sm text-[#374151]">Situation : {situation}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#850831] shrink-0" />
                <p className="text-sm text-[#374151]">Horizon : {horizon}</p>
              </div>
            </div>
          </DetectedActionCard>

          {/* Card 2 — Ajout projet */}
          <DetectedActionCard icon="🏠" category="Ajout du projet" onEdit={() => setEditTarget('projet')}>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#850831] shrink-0" />
                <p className="text-sm text-[#374151]">Type : {typeBien} · {secteur}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#850831] shrink-0" />
                <p className="text-sm text-[#374151]">Budget : {budget}</p>
              </div>
            </div>
          </DetectedActionCard>

          {/* Card 3 — Critères */}
          <DetectedActionCard icon="🔎" category="Ajout de critères" onEdit={() => setEditTarget('criteres')}>
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
          <DetectedActionCard icon="📅" category="Nouvelle tâche" onEdit={() => setEditTarget('tache')}>
            <p className="text-sm font-600 text-[#111827] mb-1">{tacheLabel}</p>
            <p className="text-xs text-[#9CA3AF]">{tacheDate} · Canal : {tacheCanal}</p>
          </DetectedActionCard>

          {/* Qualification */}
          <div className="bg-white rounded-2xl border border-[#F0E8E0] shadow-sm px-4 py-3.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-700 text-[#9CA3AF] uppercase tracking-widest">Qualification suggérée</p>
              <button onClick={() => setEditTarget('qualification')} className="text-xs font-600 text-[#850831] active:opacity-60">Modifier</button>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <QualifBadge q={qualif} />
            </div>
            <p className="text-[10px] text-[#6B7280] bg-[#F9FAFB] rounded-lg px-2.5 py-1.5">
              Budget défini · projet actif · horizon précisé
            </p>
          </div>

          {/* Transcription complète */}
          <TranscriptionAccordion source={noteMode === 'vocal' ? 'vocal-app' : 'text-app'} />
        </div>
      </div>

      {/* CTA fixe */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-[#FFF1EA] via-[#FFF1EA] to-transparent">
        {!canCreate && (
          <p className="text-center text-xs text-[#EF4444] font-500 mb-2">
            Complétez Prénom, Nom et Téléphone pour créer la fiche
          </p>
        )}
        <button
          onClick={() => canCreate && setValidated(true)}
          disabled={!canCreate}
          className="w-full bg-[#850831] text-white text-sm font-700 py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-40 disabled:scale-100"
        >
          Tout valider
        </button>
      </div>

      {/* Bottom sheet — Prospect (identité + obligatoires) */}
      {editTarget === 'prospect' && (
        <Overlay onClose={() => setEditTarget(null)}>
          <EditSheet title="Informations du prospect" onClose={() => setEditTarget(null)}>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Prénom <span className="text-[#EF4444]">*</span></label>
                <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Ex : Marie" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Nom <span className="text-[#EF4444]">*</span></label>
                <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex : Dupont" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Téléphone <span className="text-[#EF4444]">*</span></label>
                <input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="Ex : 06 12 34 56 78" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Situation</label>
                <input value={situation} onChange={e => setSituation(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
            </div>
          </EditSheet>
        </Overlay>
      )}
      {editTarget === 'projet' && (
        <Overlay onClose={() => setEditTarget(null)}>
          <EditSheet title="Modifier le projet" onClose={() => setEditTarget(null)}>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Type de bien</label>
                <input value={typeBien} onChange={e => setTypeBien(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Secteur</label>
                <input value={secteur} onChange={e => setSecteur(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Budget</label>
                <input value={budget} onChange={e => setBudget(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
              <div>
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Horizon</label>
                <input value={horizon} onChange={e => setHorizon(e.target.value)} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
              </div>
            </div>
          </EditSheet>
        </Overlay>
      )}
      {editTarget === 'criteres' && (
        <Overlay onClose={() => setEditTarget(null)}>
          <EditSheet title="Modifier les critères" onClose={() => setEditTarget(null)}>
            {criteres.map((c, i) => (
              <div key={i} className="mb-3">
                <label className="text-xs font-600 text-[#6B7280] block mb-1.5">Critère {i + 1}</label>
                <input value={c} onChange={e => setCriteres(criteres.map((cr, idx) => idx === i ? e.target.value : cr))} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#850831]" />
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
                    <button key={c} onClick={() => setTacheCanal(c)} className={`flex-1 py-2.5 rounded-xl text-xs font-600 border transition-all ${tacheCanal === c ? 'bg-[#850831] text-white border-[#850831]' : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]'}`}>{c}</button>
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
              {(['CHAUD', 'TIÈDE', 'FROID'] as const).map(q => (
                <button key={q} onClick={() => setQualif(q)} className={`flex-1 py-3 rounded-xl text-xs font-700 border-2 transition-all ${qualif === q ? 'border-[#850831]' : 'border-[#E5E7EB]'}`}>
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

// ── Add Sheet (from + nav) ────────────────────────────────────────────────────
function AddSheet({ onClose, onNewProspect, onTaskVoice, onExistingProspectNote }: {
  onClose: () => void
  onNewProspect: () => void
  onTaskVoice: () => void
  onExistingProspectNote: (p: Prospect) => void
}) {
  const [subStep, setSubStep] = useState<'menu' | 'select-prospect'>('menu')
  const [search, setSearch] = useState('')
  const filtered = PROSPECTS.filter(p =>
    `${p.prenom} ${p.nom}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-6" />

        {subStep === 'menu' && (
          <>
            <h3 className="text-base font-700 text-[#111827] mb-1">Que souhaitez-vous ajouter ?</h3>
            <p className="text-xs text-[#9CA3AF] mb-5">Choisissez le type de note à créer</p>
            <div className="space-y-3">
              {[
                {
                  icon: '✨',
                  label: 'Note pour nouveau prospect',
                  sub: 'Dicter ou écrire, une fiche sera créée',
                  action: () => { onClose(); onTaskVoice() },
                },
                {
                  icon: '👤',
                  label: 'Note pour prospect existant',
                  sub: 'Ajouter une note à une fiche existante',
                  action: () => setSubStep('select-prospect'),
                },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 bg-[#F9FAFB] rounded-2xl px-4 py-4 active:bg-[#F3F4F6] transition-colors text-left"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-600 text-[#111827]">{item.label}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{item.sub}</p>
                  </div>
                  <span className="ml-auto text-[#D1D5DB] text-lg">›</span>
                </button>
              ))}
            </div>
          </>
        )}

        {subStep === 'select-prospect' && (
          <>
            <button onClick={() => setSubStep('menu')} className="flex items-center gap-1.5 text-[#850831] text-sm font-500 mb-4">
              ‹ Retour
            </button>
            <h3 className="text-base font-700 text-[#111827] mb-3">Sélectionner un prospect</h3>
            <div className="relative mb-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#850831]"
              />
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto hide-scrollbar">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onExistingProspectNote(p); onClose() }}
                  className="w-full flex items-center gap-3 bg-[#F9FAFB] rounded-xl px-3 py-2.5 active:bg-[#F3F4F6] transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-[#FFF1EA] border border-[#F0D8CA] flex items-center justify-center text-xs font-600 text-[#850831] shrink-0">
                    {p.prenom[0]}{p.nom[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-600 text-[#111827]">{p.prenom} {p.nom}</p>
                    <p className="text-xs text-[#9CA3AF]">{p.typeBien} · {p.secteur}</p>
                  </div>
                  <QualifBadge q={p.qualification} />
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-[#9CA3AF] text-center py-4">Aucun prospect trouvé</p>
              )}
            </div>
          </>
        )}

      </div>
    </Overlay>
  )
}

// ── Navigation ────────────────────────────────────────────────────────────────
function NavBar({ active, onChange, onAdd }: {
  active: 'home' | 'prospects'
  onChange: (t: 'home' | 'prospects') => void
  onAdd: () => void
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F0E8E0] flex items-center px-6 pb-safe">
      <NavItem icon="🏠" label="Accueil" active={active === 'home'} onClick={() => onChange('home')} />
      <div className="flex-1 flex justify-center py-2">
        <button
          onClick={onAdd}
          className="w-14 h-14 rounded-full bg-[#850831] flex items-center justify-center shadow-lg shadow-[#850831]/30 active:scale-90 transition-transform -mt-5"
        >
          <span className="text-white text-3xl leading-none font-300">+</span>
        </button>
      </div>
      <NavItem icon="👥" label="Prospects" active={active === 'prospects'} onClick={() => onChange('prospects')} />
    </div>
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
  const [selectedProspect, setSelectedProspect] = useState<Prospect>(PROSPECTS[0])
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [noteMode, setNoteMode] = useState<'vocal' | 'text'>('vocal')
  const [noteProspect, setNoteProspect] = useState<Prospect | null>(null)
  const [analysisFromNote, setAnalysisFromNote] = useState(false)
  const [taskVoiceFrom, setTaskVoiceFrom] = useState<'home' | 'detail'>('home')

  const showNav = screen === 'home' || screen === 'prospects'

  function openDetail(p: Prospect) {
    setSelectedProspect(p)
    setScreen('detail')
  }

  function goHome() {
    setScreen('home')
    setNavTab('home')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8E0D8]">
      {/* Mobile frame */}
      <div
        className="relative bg-[#FFF1EA] overflow-hidden shadow-2xl"
        style={{ width: 390, height: 844, borderRadius: 44, maxHeight: '100dvh' }}
      >
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-white z-10 flex items-end justify-between px-8 pb-2">
          <span className="text-xs font-600 text-[#111827]">9:41</span>
          <div className="w-28 h-5 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="flex items-center gap-1">
            <span className="text-xs">●●●</span>
            <span className="text-xs">📶</span>
            <span className="text-xs">🔋</span>
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 top-0">
          {screen === 'home' && (
            <HomeScreen
              onOpenDetail={openDetail}
              onOpenAnalysis={() => { setAnalysisFromNote(false); setScreen('ai-analysis') }}
            />
          )}
          {screen === 'prospects' && (
            <ProspectsScreen
              onOpenDetail={openDetail}
              onNewProspect={() => setScreen('new-prospect')}
            />
          )}
          {screen === 'detail' && (
            <DetailScreen
              prospect={selectedProspect}
              onBack={() => setScreen(navTab)}
              onOpenAnalysis={() => { setAnalysisFromNote(false); setScreen('ai-analysis') }}
              onOpenAddSheet={() => {
                setNoteProspect(selectedProspect)
                setAnalysisFromNote(false)
                setTaskVoiceFrom('detail')
                setScreen('task-voice')
              }}
            />
          )}
          {screen === 'new-prospect' && (
            <NewProspectScreen onBack={() => { setScreen('prospects'); setNavTab('prospects') }} />
          )}
          {screen === 'task-voice' && (
            <TaskVoiceScreen
              onBack={() => {
                const dest = taskVoiceFrom === 'detail' ? 'detail' : 'home'
                setNoteProspect(null)
                setTaskVoiceFrom('home')
                setScreen(dest)
              }}
              existingProspect={noteProspect ?? undefined}
              onValidate={(m) => {
                setNoteMode(m)
                if (noteProspect) {
                  setAnalysisFromNote(true)
                  setScreen('ai-analysis')
                } else {
                  setScreen('note-analysis')
                }
              }}
            />
          )}
          {screen === 'note-analysis' && (
            <NoteAnalysisScreen
              noteMode={noteMode}
              onBack={() => setScreen('task-voice')}
              onBackToDashboard={() => { setScreen('home'); setNavTab('home') }}
            />
          )}
          {screen === 'ai-analysis' && analysisFromNote && (
            <AIAnalysisScreen
              onBack={() => setScreen('task-voice')}
              onBackToDashboard={() => {
                const dest = taskVoiceFrom === 'detail' ? 'detail' : 'home'
                setAnalysisFromNote(false)
                setNoteProspect(null)
                setTaskVoiceFrom('home')
                setScreen(dest)
                if (dest === 'home') setNavTab('home')
              }}
              titleOverride={noteMode === 'vocal' ? 'Note vocale analysée' : 'Note écrite analysée'}
              transcriptionSource={noteMode === 'vocal' ? 'vocal-app' : 'text-app'}
              prospect={noteProspect ?? undefined}
            />
          )}
          {screen === 'ai-analysis' && !analysisFromNote && (
            <AIAnalysisScreen
              onBack={() => setScreen('home')}
              onBackToDashboard={() => { setScreen('home'); setNavTab('home') }}
            />
          )}
        </div>

        {/* Nav */}
        {showNav && (
          <NavBar
            active={navTab}
            onChange={(t) => { setNavTab(t); setScreen(t) }}
            onAdd={() => setShowAddSheet(true)}
          />
        )}

        {/* Add sheet overlay */}
        {showAddSheet && (
          <AddSheet
            onClose={() => setShowAddSheet(false)}
            onNewProspect={() => { setShowAddSheet(false); setScreen('new-prospect'); setNavTab('prospects') }}
            onTaskVoice={() => { setNoteProspect(null); setAnalysisFromNote(false); setTaskVoiceFrom('home'); setShowAddSheet(false); setScreen('task-voice') }}
            onExistingProspectNote={(p) => { setNoteProspect(p); setAnalysisFromNote(false); setTaskVoiceFrom('home'); setShowAddSheet(false); setScreen('task-voice') }}
          />
        )}
      </div>
    </div>
  )
}
