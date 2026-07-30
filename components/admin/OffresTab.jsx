"use client";
import { useState, useEffect } from "react";
import { load, save } from "../../lib/storage";
import { DEFAULT_OFFERS, CONTRATS } from "../../app/recrutement/offersData";
import { AMBER, PINK, EMERALD } from "../../lib/data";

const T = AMBER, P = PINK;
const GREY = "#64748B";

const inp = { width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#F8FAFC", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
const lbl = { fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.6, display: "block", marginBottom: 6 };
const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 20px" };

// Postes proposés (id stocké dans l'offre → libellé lisible)
const POSTES = [
  { id: "menage", label: "Aide ménagère" },
  { id: "repas", label: "Préparation repas" },
  { id: "courses", label: "Livraison courses" },
  { id: "assistance", label: "Assistance admin" },
  { id: "rangement", label: "Coach rangement" },
];
const POSTE_LABELS = Object.fromEntries(POSTES.map(p => [p.id, p.label]));

const EMPTY_OFFER = {
  titre: "",
  contrat: CONTRATS[0],
  poste: "menage",
  lieu: "",
  horaires: "",
  prisePoste: "",
  urgent: false,
  statut: "active",
  datePosted: "",
  validThrough: "",
  description: "",
  profil: [],
  evolution: "",
};

// Slug minuscule sans accents pour l'id d'une offre
function slugify(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function OffresTab() {
  const [offers, setOffers] = useState([]);
  const [modal, setModal] = useState(null); // null | { mode, data }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await load("jmtd_offers", DEFAULT_OFFERS);
      setOffers(Array.isArray(data) ? data : DEFAULT_OFFERS);
      setLoading(false);
    })();
  }, []);

  const persist = async (next) => { setOffers(next); await save("jmtd_offers", next); };

  const saveOffer = async (form) => {
    if (modal.mode === "add") {
      const id = `${slugify(form.titre) || "offre"}-${offers.length + 1}`;
      await persist([{ ...form, id, createdAt: Date.now() }, ...offers]);
    } else {
      await persist(offers.map(o => (o.id === modal.data.id ? { ...o, ...form } : o)));
    }
    setModal(null);
  };

  const toggleStatut = async (id) => {
    await persist(offers.map(o => (o.id === id ? { ...o, statut: o.statut === "active" ? "pourvue" : "active" } : o)));
  };

  const deleteOffer = async (id) => {
    if (!confirm("Supprimer définitivement cette offre d'emploi ?")) return;
    await persist(offers.filter(o => o.id !== id));
  };

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#475569" }}>Chargement…</div>;

  const activeCount = offers.filter(o => o.statut === "active").length;

  return (
    <div style={{ animation: "slideIn 0.25s ease" }}>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Offres d'emploi</h1>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>{offers.length} offre{offers.length !== 1 ? "s" : ""} · {activeCount} active{activeCount !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setModal({ mode: "add", data: EMPTY_OFFER })}
          style={{ padding: "10px 18px", borderRadius: 10, background: `linear-gradient(135deg,${T},${P})`, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + Nouvelle offre
        </button>
      </div>

      {/* Encart d'info */}
      <div style={{ ...card, marginBottom: 20, background: `linear-gradient(135deg, ${T}12, ${P}08)`, border: `1px solid ${T}25`, fontSize: 12.5, color: "#94A3B8", lineHeight: 1.5 }}>
        ℹ️ Ces offres s'affichent sur la page publique <strong style={{ color: "#F8FAFC" }}>/recrutement</strong> et alimentent les données structurées <strong style={{ color: "#F8FAFC" }}>Google for Jobs</strong>.
      </div>

      {/* Liste des offres */}
      {offers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", color: "#475569" }}>
          <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.5 }}>📋</div>
          <p style={{ fontSize: 16, marginBottom: 8 }}>Aucune offre d'emploi publiée.</p>
          <button onClick={() => setModal({ mode: "add", data: EMPTY_OFFER })} style={{ marginTop: 8, padding: "10px 20px", borderRadius: 10, background: `${T}18`, border: `1px solid ${T}33`, color: T, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Publier votre première offre</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {offers.map(o => (
            <OfferCard
              key={o.id}
              offer={o}
              onEdit={() => setModal({ mode: "edit", data: o })}
              onToggle={() => toggleStatut(o.id)}
              onDelete={() => deleteOffer(o.id)}
            />
          ))}
        </div>
      )}

      {/* Modale add/edit */}
      {modal && <OfferModal modal={modal} onClose={() => setModal(null)} onSave={saveOffer} />}
    </div>
  );
}

function OfferCard({ offer, onEdit, onToggle, onDelete }) {
  const active = offer.statut === "active";
  const subline = [offer.contrat, offer.lieu, offer.horaires].filter(Boolean).join(" · ");
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{offer.titre || "(Sans titre)"}</span>
            <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: active ? `${EMERALD}18` : "rgba(255,255,255,0.06)", border: `1px solid ${active ? `${EMERALD}44` : "rgba(255,255,255,0.12)"}`, color: active ? EMERALD : GREY }}>
              {active ? "Active" : "Pourvue"}
            </span>
            {offer.urgent && (
              <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: `${P}1f`, border: `1px solid ${P}55`, color: P }}>URGENT</span>
            )}
          </div>
          <div style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 8 }}>{subline || "—"}</div>
          <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 6 }}>Poste : {POSTE_LABELS[offer.poste] || offer.poste || "—"}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={onEdit} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94A3B8", fontSize: 12, cursor: "pointer" }}>✏️ Modifier</button>
          <button onClick={onToggle} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: `1px solid ${active ? "rgba(255,255,255,0.12)" : `${EMERALD}44`}`, color: active ? GREY : EMERALD, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {active ? "Marquer pourvue" : "Réactiver"}
          </button>
          <button onClick={onDelete} style={{ padding: "7px 12px", borderRadius: 8, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

function OfferModal({ modal, onClose, onSave }) {
  const init = modal.data;
  const [f, setF] = useState({
    ...init,
    profil: (init.profil || []).join("\n"),
    datePosted: init.datePosted || new Date().toISOString().slice(0, 10),
    validThrough: init.validThrough || "",
  });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));

  const submit = () => {
    if (!f.titre.trim()) { setErr("Le titre de l'offre est obligatoire."); return; }
    onSave({
      ...f,
      titre: f.titre.trim(),
      profil: f.profil.split("\n").map(l => l.trim()).filter(Boolean),
    });
  };

  return (
    <Overlay onClose={onClose}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F8FAFC", margin: "0 0 20px" }}>{modal.mode === "add" ? "Nouvelle offre d'emploi" : "Modifier l'offre"}</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Titre de l'offre *</label>
        <input style={inp} value={f.titre} onChange={(e) => { setF(s => ({ ...s, titre: e.target.value })); if (err) setErr(""); }} placeholder="Aide ménagère — Nettoyage de locaux" />
        {err && <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>{err}</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={lbl}>Contrat</label>
          <select style={inp} value={f.contrat} onChange={set("contrat")}>
            {CONTRATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Poste</label>
          <select style={inp} value={f.poste} onChange={set("poste")}>
            {POSTES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Lieu</label>
        <input style={inp} value={f.lieu} onChange={set("lieu")} placeholder="Le Lamentin (quartier Jeanne d'Arc)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={lbl}>Horaires</label>
          <input style={inp} value={f.horaires} onChange={set("horaires")} placeholder="Du lundi au vendredi, 8h–9h" />
        </div>
        <div>
          <label style={lbl}>Prise de poste</label>
          <input style={inp} value={f.prisePoste} onChange={set("prisePoste")} placeholder="Dès le mois d'août" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={lbl}>Date de publication</label>
          <input type="date" style={inp} value={f.datePosted} onChange={set("datePosted")} />
        </div>
        <div>
          <label style={lbl}>Valable jusqu'au</label>
          <input type="date" style={inp} value={f.validThrough} onChange={set("validThrough")} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94A3B8", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
          <input type="checkbox" checked={f.urgent} onChange={(e) => setF(s => ({ ...s, urgent: e.target.checked }))} style={{ accentColor: P, width: 16, height: 16 }} />
          Offre urgente
        </label>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={lbl}>Statut</label>
          <select style={inp} value={f.statut} onChange={set("statut")}>
            <option value="active">Active</option>
            <option value="pourvue">Pourvue</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Description</label>
        <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={f.description} onChange={set("description")} placeholder="Présentation du poste et des missions…" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Profil recherché (une ligne = un critère)</label>
        <textarea style={{ ...inp, minHeight: 90, resize: "vertical" }} value={f.profil} onChange={set("profil")} placeholder={"Véhiculé(e)\nSérieux(se) et ponctuel(le)\nExpérience appréciée"} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={lbl}>Évolution / perspectives</label>
        <textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={f.evolution} onChange={set("evolution")} placeholder="Possibilité d'autres prestations sur le secteur…" />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Annuler</button>
        <button onClick={submit} style={{ padding: "10px 22px", borderRadius: 10, background: `linear-gradient(135deg,${T},${P})`, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Enregistrer</button>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(4,10,18,0.7)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0e2235", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "28px 30px", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        {children}
      </div>
    </div>
  );
}
