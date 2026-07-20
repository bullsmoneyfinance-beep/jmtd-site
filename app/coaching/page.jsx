"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import Icon, { IconTile } from "../../components/Icon";

const T = "#0DA9A4";
const P = "#D4197A";
const OCEAN = "#12B5B0";
const TEXT = "#1A2D3D";
const MUTED = "#64748B";
const WARM = "#FFF8F4";

/* ── Imagerie Martinique / tropical-premium (Unsplash) ── */
const IMG = {
  heroBg:   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1000&fit=crop&auto=format&q=80", // lagon turquoise
  palmLeaf: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&h=1100&fit=crop&auto=format&q=80",  // frondes de palmier
};

/* Parallax générique — piloté par [data-parallax] (voir globals.css .parallax) */
function useParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!layers.length) return;
    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      layers.forEach(el => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        const r = el.getBoundingClientRect();
        const offset = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      });
      raf = null;
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

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
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: result.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}><Icon name="conseils" size={15} color={result.color} /> Notre conseil pour vous</div>
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
                {pct === 100 && <Icon name="checkCircle" size={17} color={T} style={{ flexShrink: 0 }} />}
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
                  {done && <Icon name="check" size={16} color={T} strokeWidth={2.5} style={{ marginLeft: "auto" }} />}
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
  useParallax();
  const [activeCat, setActiveCat] = useState(0);

  return (
    <div style={{ background: "#fff", overflowX: "hidden" }}>
      {/* ════════════════════════════════
          HERO — immersif, touche tropicale
          ════════════════════════════════ */}
      <section className="inner-hero" style={{ position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${WARM} 0%, #EAF7F6 100%)`, padding: "clamp(88px, 12vw, 128px) 24px clamp(76px, 9vw, 100px)", textAlign: "center" }}>
        {/* Calque photo tropical (parallax profond) */}
        <div aria-hidden data-parallax="0.16" className="parallax" style={{ position: "absolute", top: "-22%", left: 0, right: 0, height: "144%", zIndex: 0 }}>
          <img src={IMG.heroBg} alt="" width={1600} height={1000} loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.20 }} />
        </div>
        {/* Frondes de palmier — profondeur */}
        <div aria-hidden data-parallax="0.06" className="parallax hide-mobile" style={{ position: "absolute", top: "-10%", left: "-6%", width: "clamp(240px, 30vw, 480px)", height: "120%", zIndex: 0, pointerEvents: "none" }}>
          <img src={IMG.palmLeaf} alt="" width={900} height={1100} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, mixBlendMode: "multiply", maskImage: "linear-gradient(to right, #000 30%, transparent 92%)", WebkitMaskImage: "linear-gradient(to right, #000 30%, transparent 92%)" }} />
        </div>
        {/* Voile dégradé — lisibilité */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(255,248,244,0.92) 0%, rgba(244,250,247,0.84) 55%, rgba(234,247,246,0.72) 100%)" }} />
        <div aria-hidden style={{ position: "absolute", top: -80, right: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}12, transparent 70%)`, animation: "floatOrb 14s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, left: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${P}09, transparent 70%)`, animation: "floatOrb 18s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 1 }} />

        <Reveal style={{ maxWidth: 740, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: P, display: "inline-flex", alignItems: "center", gap: 7 }}><Icon name="sparkles" size={15} color={P} /> Méthode Marie Kondo</div>
          <h1 className="display" style={{ fontSize: "clamp(32px, 4.8vw, 56px)", lineHeight: 1.12, marginBottom: 20, letterSpacing: -1 }}>
            Transformez votre espace,<br />
            <span style={{ background: `linear-gradient(120deg, ${P}, ${OCEAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>transformez votre vie</span>
          </h1>
          <p style={{ fontSize: 16.5, color: MUTED, lineHeight: 1.8, marginBottom: 36, maxWidth: 580, margin: "0 auto 36px" }}>
            Découvrez votre profil rangement, suivez vos progrès pièce par pièce, et laissez notre coach vous accompagner vers un intérieur qui vous ressemble vraiment.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#quiz" className="btn-gradient" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 30px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 10px 34px ${T}44`, border: "none" }}>
              Faire mon quiz →
            </a>
            <a href="#checklist" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 30, border: `1.5px solid ${T}40`, color: T, textDecoration: "none", fontSize: 15, fontWeight: 600, background: "rgba(255,255,255,0.85)" }}>
              Ma checklist
            </a>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════
          LES 5 CATÉGORIES KONMARI
          ════════════════════════════════ */}
      <section className="main-section" style={{ background: "#F8FAFB", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>La méthode KonMari</div>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.6vw, 40px)", marginBottom: 12 }}>
              5 catégories, dans cet ordre précis
            </h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              Marie Kondo a découvert que l&apos;ordre des catégories n&apos;est pas anodin. Il est conçu pour affûter progressivement votre sensibilité à la joie.
            </p>
          </Reveal>

          {/* Tabs */}
          <Reveal delay={80} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
            {KONMARI.map((cat, i) => (
              <button key={i} onClick={() => setActiveCat(i)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 30, border: `1.5px solid ${activeCat === i ? cat.color : "rgba(13,169,164,0.15)"}`, background: activeCat === i ? `${cat.color}12` : "#fff", color: activeCat === i ? cat.color : MUTED, fontWeight: activeCat === i ? 700 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
                <span>{cat.icon}</span> {cat.label}
                {activeCat === i && <span style={{ fontSize: 10, background: cat.color, color: "#fff", borderRadius: 10, padding: "2px 7px", fontWeight: 700 }}>{cat.num}</span>}
              </button>
            ))}
          </Reveal>

          {/* Active cat detail */}
          {(() => {
            const cat = KONMARI[activeCat];
            return (
              <div className="konmari-detail lift" style={{ background: "#fff", border: `1.5px solid ${cat.color}25`, borderRadius: 24, padding: "36px 40px", boxShadow: `0 8px 40px ${cat.color}12`, display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>
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

      {/* ════════════════════════════════
          QUIZ
          ════════════════════════════════ */}
      <section id="quiz" className="main-section" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="eyebrow" style={{ justifyContent: "center", color: P }}>Quiz · 5 questions</div>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.6vw, 40px)", marginBottom: 12 }}>
              Quel est votre profil rangement ?
            </h2>
            <p style={{ fontSize: 15, color: MUTED }}>En 2 minutes, découvrez votre style et nos recommandations personnalisées.</p>
          </Reveal>
          <Reveal delay={100}><Quiz /></Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          CHECKLIST
          ════════════════════════════════ */}
      <section id="checklist" className="main-section" style={{ background: "#F8FAFB", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Suivi de progression</div>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.6vw, 40px)", marginBottom: 12 }}>
              Ma checklist pièce par pièce
            </h2>
            <p style={{ fontSize: 15, color: MUTED }}>Cochez au fur et à mesure. Votre progression est sauvegardée automatiquement.</p>
          </Reveal>
          <Reveal delay={100}><Checklist /></Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA FINAL
          ════════════════════════════════ */}
      <section className="main-section" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Reveal className="lift" style={{ background: `linear-gradient(135deg, ${T}10, ${P}08)`, border: `1px solid ${T}22`, borderRadius: 28, padding: "56px 40px", textAlign: "center", boxShadow: "0 20px 60px rgba(13,169,164,0.10)" }}>
            <IconTile name="rangement" size={64} icon={32} from={T} to={P} radius={20} style={{ margin: "0 auto 20px" }} />
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.4vw, 38px)", marginBottom: 12 }}>
              Prêt·e pour la vraie transformation ?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, marginBottom: 32 }}>
              Le quiz et la checklist sont un bon début. Mais rien ne remplace l&apos;œil expert d&apos;un coach pour vous guider pas à pas dans votre propre espace.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-gradient" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 30px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: `0 10px 34px ${T}44`, border: "none" }}>
                Réserver mon diagnostic gratuit →
              </Link>
              <Link href="/coach" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 24px", borderRadius: 30, border: `1.5px solid ${T}40`, color: T, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
                Voir les formules
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Responsive (mobile safety) ── */}
      <style>{`
        @media (max-width: 640px) {
          .konmari-detail { grid-template-columns: 1fr !important; gap: 20px !important; padding: 28px 24px !important; }
        }
      `}</style>
    </div>
  );
}
