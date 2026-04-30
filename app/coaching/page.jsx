"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const T = "#0DA9A4";
const P = "#D4197A";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";

// ── Quiz ──────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "Comment décririez-vous votre intérieur aujourd'hui ?",
    opts: [
      { label: "Globalement ordonné, je cherche à optimiser", val: "m" },
      { label: "J'ai accumulé beaucoup de choses auxquelles je tiens", val: "c" },
      { label: "C'est le chaos, je ne sais pas par où commencer", val: "t" },
      { label: "Des objets partout, chargés de souvenirs", val: "s" },
    ],
  },
  {
    q: "Quelle est votre plus grande difficulté à ranger ?",
    opts: [
      { label: "Trouver le bon système d'organisation", val: "m" },
      { label: "Me séparer de choses encore « utiles »", val: "c" },
      { label: "Savoir par où commencer concrètement", val: "t" },
      { label: "Me défaire d'objets chargés de mémoire", val: "s" },
    ],
  },
  {
    q: "Face à un objet, quelle question vous vient naturellement ?",
    opts: [
      { label: "« Est-il vraiment indispensable ? »", val: "m" },
      { label: "« Vais-je m'en servir un jour ? »", val: "c" },
      { label: "« Où est-ce que je le mets ? »", val: "t" },
      { label: "« Qui me l'a donné ? »", val: "s" },
    ],
  },
  {
    q: "Quel espace est le plus problématique chez vous ?",
    opts: [
      { label: "Bureau / espace de travail", val: "m" },
      { label: "Placards et dressing", val: "c" },
      { label: "Toute la maison en général", val: "t" },
      { label: "Tiroirs et boîtes à souvenirs", val: "s" },
    ],
  },
  {
    q: "Qu'est-ce qui vous motive à ranger ?",
    opts: [
      { label: "Avoir un espace épuré et efficace", val: "m" },
      { label: "Ne garder que ce qui compte vraiment", val: "c" },
      { label: "Retrouver la paix dans mon foyer", val: "t" },
      { label: "Honorer mes souvenirs sans encombrement", val: "s" },
    ],
  },
];

const PROFILES = {
  m: {
    key: "m", emoji: "🌿", name: "Le Minimaliste",
    color: T,
    desc: "Vous avez le sens de l'essentiel. Votre défi n'est pas de trier, mais d'optimiser : créer des systèmes durables et élégants qui tiennent dans le temps.",
    conseil: "Commencez par votre espace de travail et vos affaires du quotidien. Une organisation fine des zones d'usage transformera votre efficacité.",
    formule: "Accompagnement",
  },
  c: {
    key: "c", emoji: "📚", name: "Le Collectionneur",
    color: "#8B5CF6",
    desc: "Vous donnez de la valeur aux objets — c'est une richesse ! La méthode KonMari vous apprendra à distinguer ce qui mérite d'être gardé de ce qui vous alourdit.",
    conseil: "Débutez par vos vêtements : c'est la catégorie la plus facile à trier et le premier succès vous donnera de l'élan pour la suite.",
    formule: "Accompagnement",
  },
  t: {
    key: "t", emoji: "🌀", name: "Le Tourbillon",
    color: P,
    desc: "Vous êtes débordé·e et l'accumulation vous pèse. Une remise à zéro complète, guidée pas à pas, est exactement ce dont vous avez besoin.",
    conseil: "N'essayez pas seul·e. Une prise en charge intégrale par un·e coach vous permettra de transformer votre espace en un week-end.",
    formule: "Rangement intégral",
  },
  s: {
    key: "s", emoji: "💝", name: "Le Sentimental",
    color: "#F59E0B",
    desc: "Vous vivez entouré·e d'histoire et d'affection. La méthode KonMari respecte ce lien émotionnel et vous accompagne en douceur pour que chaque objet gardé soit un choix conscient.",
    conseil: "Gardez les objets chargés de mémoire pour la fin du processus. Commencez par le neutre (vêtements, cuisine) pour vous échauffer.",
    formule: "Accompagnement",
  },
};

// ── Catégories KonMari ─────────────────────────────────────────────
const KONMARI = [
  { num: "01", icon: "👗", label: "Vêtements",  color: P,      tips: ["Réunissez TOUS vos vêtements en un seul endroit", "Prenez chaque pièce en main : apporte-t-elle de la joie ?", "Pliez en rectangle et rangez à la verticale"] },
  { num: "02", icon: "📚", label: "Livres",     color: "#8B5CF6", tips: ["Posez chaque livre sur le sol, tenez-le entre vos mains", "Un livre lu et aimé mérite d'être gardé", "Offrez ceux qui peuvent enrichir d'autres vies"] },
  { num: "03", icon: "📄", label: "Papiers",    color: T,      tips: ["La règle d'or : tout jeter sauf l'indispensable", "3 catégories : à traiter / à conserver / contrats en cours", "Numérisez ce qui peut l'être"] },
  { num: "04", icon: "🔧", label: "Komono",     color: "#F59E0B", tips: ["CD, câbles, cuisine, déco… la plus grande catégorie", "Triez par sous-catégorie, jamais par pièce", "Gardez ce qui a un usage réel dans votre vie actuelle"] },
  { num: "05", icon: "💝", label: "Souvenirs",  color: "#EC4899", tips: ["La catégorie la plus émotionnelle, toujours en dernier", "Touchez chaque objet et ressentez la joie qu'il vous procure", "Photographiez ce que vous ne pouvez garder en volume"] },
];

// ── Checklist par pièce ─────────────────────────────────────────────
const ROOMS = [
  { id: "entree",    icon: "🚪", label: "Entrée",        tasks: ["Chaussures rangées et triées","Vêtements d'extérieur organisés","Clés et courrier à leur place","Sol dégagé"] },
  { id: "salon",     icon: "🛋️", label: "Salon",         tasks: ["Canapé dégagé","Télécommandes regroupées","Déco voulue (pas par défaut)","Câbles cachés ou rangés","Livres / magazines triés"] },
  { id: "cuisine",   icon: "🍽️", label: "Cuisine",       tasks: ["Placards organisés par usage","Plans de travail libres","Épices et condiments triés","Tiroirs avec séparateurs","Frigo propre et ordonné"] },
  { id: "chambre",   icon: "🛏️", label: "Chambre",       tasks: ["Lit fait chaque matin","Dressing trié par couleur / type","Rien sous le lit","Table de nuit minimaliste","Vêtements hors saison stockés"] },
  { id: "sdb",       icon: "🚿", label: "Salle de bain", tasks: ["Produits périmés jetés","Dessous de lavabo ordonné","Serviettes pliées et rangées","Comptoir libéré","Trousse de secours accessible"] },
  { id: "bureau",    icon: "💻", label: "Bureau",         tasks: ["Bureau dégagé à la fin de la journée","Câbles organisés","Documents classés","Fournitures regroupées","Rien au sol"] },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Composant Quiz ──────────────────────────────────────────────────
function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const choose = val => {
    const next = [...answers, val];
    if (step < QUESTIONS.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      const counts = next.reduce((acc, v) => ({ ...acc, [v]: (acc[v] || 0) + 1 }), {});
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setResult(PROFILES[winner]);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(null); };

  if (result) return (
    <div style={{ background: "#fff", border: `1.5px solid ${result.color}30`, borderRadius: 24, padding: "40px 36px", boxShadow: `0 8px 48px ${result.color}14`, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>{result.emoji}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: result.color, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Votre profil</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: TEXT, marginBottom: 16 }}>{result.name}</h3>
      <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 20, maxWidth: 480, margin: "0 auto 20px" }}>{result.desc}</p>
      <div style={{ background: `${result.color}0d`, border: `1px solid ${result.color}25`, borderRadius: 16, padding: "18px 20px", marginBottom: 28, textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: result.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>💡 Notre conseil pour vous</div>
        <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.7 }}>{result.conseil}</p>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 6px 24px ${T}35` }}>
          Réserver mon diagnostic gratuit →
        </Link>
        <button onClick={reset} style={{ padding: "14px 22px", borderRadius: 30, border: `1.5px solid rgba(100,116,139,0.3)`, background: "transparent", color: MUTED, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Refaire le quiz
        </button>
      </div>
    </div>
  );

  const q = QUESTIONS[step];
  const pct = Math.round((step / QUESTIONS.length) * 100);

  return (
    <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 24, padding: "36px 32px", boxShadow: `0 4px 32px ${T}08` }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>Question {step + 1} / {QUESTIONS.length}</span>
        <div style={{ flex: 1, height: 4, background: "#E2E8F0", borderRadius: 2, margin: "0 16px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T}, ${P})`, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
        <span style={{ fontSize: 12, color: T, fontWeight: 700 }}>{pct}%</span>
      </div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 24, lineHeight: 1.4 }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => choose(opt.val)}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 14, border: `1.5px solid rgba(13,169,164,0.15)`, background: "#FAFBFC", cursor: "pointer", textAlign: "left", fontSize: 15, color: TEXT, fontWeight: 500, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.background = `${T}08`; e.currentTarget.style.color = TEXT; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(13,169,164,0.15)"; e.currentTarget.style.background = "#FAFBFC"; }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: `${T}12`, border: `1px solid ${T}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T, flexShrink: 0 }}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Checklist interactive ───────────────────────────────────────────
function Checklist() {
  const [checked, setChecked] = useState({});
  const [activeRoom, setActiveRoom] = useState("entree");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jmtd_checklist");
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (roomId, taskIdx) => {
    const key = `${roomId}_${taskIdx}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    try { localStorage.setItem("jmtd_checklist", JSON.stringify(next)); } catch {}
  };

  const room = ROOMS.find(r => r.id === activeRoom);
  const totalTasks = ROOMS.reduce((a, r) => a + r.tasks.length, 0);
  const totalDone  = Object.values(checked).filter(Boolean).length;
  const globalPct  = Math.round((totalDone / totalTasks) * 100);

  const roomPct = r => {
    const done = r.tasks.filter((_, i) => checked[`${r.id}_${i}`]).length;
    return Math.round((done / r.tasks.length) * 100);
  };

  return (
    <div style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.12)`, borderRadius: 24, overflow: "hidden", boxShadow: `0 4px 32px ${T}08` }}>
      {/* Global progress header */}
      <div style={{ padding: "24px 28px", background: `linear-gradient(135deg, ${T}10, ${P}08)`, borderBottom: `1px solid ${T}15` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Ma progression globale</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{totalDone} / {totalTasks} tâches complétées</div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Cormorant Garamond', Georgia, serif", color: T }}>{globalPct}%</div>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.6)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${globalPct}%`, background: `linear-gradient(90deg, ${T}, ${P})`, borderRadius: 4, transition: "width 0.5s ease" }} />
        </div>
      </div>

      <div className="checklist-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
        {/* Rooms list */}
        <div className="checklist-rooms" style={{ borderRight: `1px solid rgba(13,169,164,0.1)`, padding: "12px 0" }}>
          {ROOMS.map(r => {
            const pct = roomPct(r);
            const isActive = r.id === activeRoom;
            return (
              <button key={r.id} onClick={() => setActiveRoom(r.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px", background: isActive ? `${T}0d` : "transparent", border: "none", borderLeft: `3px solid ${isActive ? T : "transparent"}`, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? T : TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</div>
                  <div style={{ marginTop: 4, height: 3, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? T : `${T}88`, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                </div>
                {pct === 100 && <span style={{ fontSize: 16, flexShrink: 0 }}>✅</span>}
              </button>
            );
          })}
        </div>

        {/* Tasks */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>{room.icon}</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>{room.label}</div>
            <div style={{ marginLeft: "auto", fontSize: 12, color: MUTED }}>
              {room.tasks.filter((_, i) => checked[`${room.id}_${i}`]).length} / {room.tasks.length}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {room.tasks.map((task, i) => {
              const done = !!checked[`${room.id}_${i}`];
              return (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, background: done ? `${T}08` : "#FAFBFC", border: `1px solid ${done ? `${T}25` : "rgba(226,232,240,0.8)"}`, cursor: "pointer", transition: "all 0.2s" }}>
                  <input type="checkbox" checked={done} onChange={() => toggle(room.id, i)}
                    style={{ width: 18, height: 18, accentColor: T, flexShrink: 0, cursor: "pointer" }} />
                  <span style={{ fontSize: 14, color: done ? MUTED : TEXT, textDecoration: done ? "line-through" : "none", fontWeight: done ? 400 : 500 }}>
                    {task}
                  </span>
                  {done && <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ─────────────────────────────────────────────────
export default function CoachingPage() {
  useReveal();
  const [activeCat, setActiveCat] = useState(0);

  return (
    <>
      {/* Hero */}
      <section className="inner-hero" style={{ background: "#fff", padding: "88px 24px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: "5%",  width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}12, transparent 70%)`, filter: "blur(70px)", animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${P}09, transparent 70%)`,  filter: "blur(70px)", animation: "floatOrbSlow 18s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${P}10`, border: `1px solid ${P}28`, borderRadius: 30, padding: "6px 18px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: P, textTransform: "uppercase", letterSpacing: 1.5 }}>✨ Méthode Marie Kondo</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 700, color: TEXT, lineHeight: 1.15, marginBottom: 20 }}>
            Transformez votre espace,<br />
            <span style={{ color: P }}>transformez votre vie</span>
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            Découvrez votre profil rangement, suivez vos progrès pièce par pièce, et laissez notre coach vous accompagner vers un intérieur qui vous ressemble vraiment.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#quiz" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 8px 32px ${T}40` }}>
              Faire mon quiz →
            </a>
            <a href="#checklist" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, border: `1.5px solid ${T}40`, color: T, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
              Ma checklist
            </a>
          </div>
        </div>
      </section>

      {/* Les 5 catégories KonMari */}
      <section className="main-section" style={{ background: "#F8FAFB", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>La méthode KonMari</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              5 catégories, dans cet ordre précis
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 540, margin: "0 auto" }}>
              Marie Kondo a découvert que l'ordre des catégories n'est pas anodin. Il est conçu pour affûter progressivement votre sensibilité à la joie.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
            {KONMARI.map((cat, i) => (
              <button key={i} onClick={() => setActiveCat(i)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 30, border: `1.5px solid ${activeCat === i ? cat.color : "rgba(13,169,164,0.15)"}`, background: activeCat === i ? `${cat.color}12` : "#fff", color: activeCat === i ? cat.color : MUTED, fontWeight: activeCat === i ? 700 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
                <span>{cat.icon}</span> {cat.label}
                {activeCat === i && <span style={{ fontSize: 10, background: cat.color, color: "#fff", borderRadius: 10, padding: "2px 7px", fontWeight: 700 }}>{cat.num}</span>}
              </button>
            ))}
          </div>

          {/* Active cat detail */}
          {(() => {
            const cat = KONMARI[activeCat];
            return (
              <div style={{ background: "#fff", border: `1.5px solid ${cat.color}25`, borderRadius: 24, padding: "36px 40px", boxShadow: `0 4px 32px ${cat.color}0d`, display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: `${cat.color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0 }}>
                  {cat.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Catégorie {cat.num}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: TEXT, marginBottom: 20 }}>{cat.label}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {cat.tips.map((tip, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${cat.color}18`, border: `1px solid ${cat.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: cat.color, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" className="main-section" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${P}10`, border: `1px solid ${P}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: P, textTransform: "uppercase", letterSpacing: 1.5 }}>Quiz · 5 questions</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Quel est votre profil rangement ?
            </h2>
            <p style={{ fontSize: 15, color: MUTED }}>En 2 minutes, découvrez votre style et nos recommandations personnalisées.</p>
          </div>
          <Quiz />
        </div>
      </section>

      {/* Checklist */}
      <section id="checklist" className="main-section" style={{ background: "#F8FAFB", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T}10`, border: `1px solid ${T}28`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 }}>Suivi de progression</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Ma checklist pièce par pièce
            </h2>
            <p style={{ fontSize: 15, color: MUTED }}>Cochez au fur et à mesure. Votre progression est sauvegardée automatiquement.</p>
          </div>
          <Checklist />
        </div>
      </section>

      {/* CTA final */}
      <section className="main-section" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="reveal" style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}22`, borderRadius: 28, padding: "52px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗂️</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: TEXT, marginBottom: 12 }}>
              Prêt·e pour la vraie transformation ?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 32 }}>
              Le quiz et la checklist sont un bon début. Mais rien ne remplace l'œil expert d'un coach pour vous guider pas à pas dans votre propre espace.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 8px 32px ${T}40` }}>
                Réserver mon diagnostic gratuit →
              </Link>
              <Link href="/coach" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 24px", borderRadius: 30, border: `1.5px solid ${T}40`, color: T, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
                Voir les formules
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
