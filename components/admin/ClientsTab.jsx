"use client";
import { useState, useEffect } from "react";
import { load, save } from "../../lib/storage";
import { SERVICES, AMBER, PINK, EMERALD } from "../../lib/data";
import { buildAttestationHtml, buildFactureHtml, openPrintWindow } from "../../lib/documents";

const T = AMBER, P = PINK;
const eur = (n) => (Number(n) || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const fmtD = (ts) => new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
const SERVICE_LABELS = Object.fromEntries(SERVICES.map(s => [s.id, `${s.icon} ${s.title}`]));

const inp = { width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#F8FAFC", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
const lbl = { fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.6, display: "block", marginBottom: 6 };
const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 20px" };

const EMPTY_CLIENT = { prenom: "", nom: "", adresse: "", commune: "", tel: "", email: "", tauxDefaut: 32, prestations: [], note: "" };
const EMPTY_INTER = { date: "", service: "entretien", heures: 2, taux: 32, regle: true };

export default function ClientsTab() {
  const [clients, setClients] = useState([]);
  const [inters, setInters] = useState([]);
  const [factures, setFactures] = useState([]);
  const [selId, setSelId] = useState(null);
  const [clientModal, setClientModal] = useState(null); // null | {mode,data}
  const [interModal, setInterModal] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, i, f] = await Promise.all([load("jmtd_clients", []), load("jmtd_interventions", []), load("jmtd_factures", [])]);
      setClients(c); setInters(i); setFactures(f); setLoading(false);
    })();
  }, []);

  const persistClients = async (next) => { setClients(next); await save("jmtd_clients", next); };
  const persistInters = async (next) => { setInters(next); await save("jmtd_interventions", next); };
  const persistFactures = async (next) => { setFactures(next); await save("jmtd_factures", next); };

  // Génère une facture pour les interventions d'une année et l'imprime
  const genFacture = async (client, yInters, yr) => {
    if (yInters.length === 0) return;
    const seq = factures.filter(f => f.year === yr).length + 1;
    const numero = `F-${yr}-${String(seq).padStart(3, "0")}`;
    const total = Math.round(yInters.reduce((a, i) => a + (i.montant || 0), 0) * 100) / 100;
    const record = { id: `fac_${Date.now()}`, numero, clientId: client.id, clientNom: `${client.prenom} ${client.nom}`, year: yr, date: Date.now(), total, interIds: yInters.map(i => i.id) };
    await persistFactures([record, ...factures]);
    openPrintWindow(
      buildFactureHtml({ client, inters: yInters, numero, serviceLabels: SERVICE_LABELS }),
      "Autorisez les fenêtres pop-up pour générer la facture."
    );
  };

  const saveClient = async (form) => {
    if (clientModal.mode === "add") {
      await persistClients([...clients, { ...form, id: `cli_${Date.now()}`, createdAt: Date.now() }]);
    } else {
      await persistClients(clients.map(c => c.id === clientModal.data.id ? { ...c, ...form } : c));
    }
    setClientModal(null);
  };
  const deleteClient = async (id) => {
    await persistClients(clients.filter(c => c.id !== id));
    await persistInters(inters.filter(i => i.clientId !== id));
    setSelId(null);
  };
  const addInter = async (form) => {
    const montant = Math.round((Number(form.heures) || 0) * (Number(form.taux) || 0) * 100) / 100;
    await persistInters([{ ...form, id: `int_${Date.now()}`, clientId: selId, date: form.date ? new Date(form.date).getTime() : Date.now(), montant }, ...inters]);
    setInterModal(null);
  };
  const delInter = async (id) => persistInters(inters.filter(i => i.id !== id));

  const sel = clients.find(c => c.id === selId);
  const selInters = inters.filter(i => i.clientId === selId).sort((a, b) => b.date - a.date);

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#475569" }}>Chargement…</div>;

  return (
    <div style={{ animation: "slideIn 0.25s ease" }}>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Clients</h1>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>{clients.length} client{clients.length !== 1 ? "s" : ""} · attestations fiscales crédit d'impôt</p>
        </div>
        <button onClick={() => setClientModal({ mode: "add", data: EMPTY_CLIENT })}
          style={{ padding: "10px 18px", borderRadius: 10, background: `linear-gradient(135deg,${T},${P})`, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + Nouveau client
        </button>
      </div>

      {/* Détail client sélectionné */}
      {sel ? (
        <ClientDetail
          client={sel} inters={selInters} year={year} setYear={setYear}
          factures={factures.filter(f => f.clientId === sel.id)}
          onBack={() => setSelId(null)}
          onEdit={() => setClientModal({ mode: "edit", data: sel })}
          onDelete={() => deleteClient(sel.id)}
          onAddInter={() => setInterModal({ ...EMPTY_INTER, taux: sel.tauxDefaut || 32 })}
          onDelInter={delInter}
          onFacture={(yInters) => genFacture(sel, yInters, year)}
        />
      ) : (
        <ClientList clients={clients} inters={inters} onSelect={setSelId} onAdd={() => setClientModal({ mode: "add", data: EMPTY_CLIENT })} />
      )}

      {/* Modale client */}
      {clientModal && <ClientModal modal={clientModal} onClose={() => setClientModal(null)} onSave={saveClient} />}
      {/* Modale intervention */}
      {interModal && <InterModal init={interModal} onClose={() => setInterModal(null)} onSave={addInter} />}
    </div>
  );
}

function ClientList({ clients, inters, onSelect, onAdd }) {
  if (clients.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 24px", color: "#475569" }}>
      <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.5 }}>🏘️</div>
      <p style={{ fontSize: 16, marginBottom: 8 }}>Aucun client enregistré.</p>
      <button onClick={onAdd} style={{ marginTop: 8, padding: "10px 20px", borderRadius: 10, background: `${T}18`, border: `1px solid ${T}33`, color: T, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Ajouter votre premier client</button>
    </div>
  );
  const yearNow = new Date().getFullYear();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
      {clients.map(c => {
        const ci = inters.filter(i => i.clientId === c.id);
        const totalYear = ci.filter(i => new Date(i.date).getFullYear() === yearNow && i.regle).reduce((a, i) => a + (i.montant || 0), 0);
        return (
          <div key={c.id} onClick={() => onSelect(c.id)}
            style={{ ...card, cursor: "pointer", transition: "border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${T}55`}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: "#F8FAFC" }}>{c.prenom} {c.nom}</div>
              <span style={{ fontSize: 11, color: "#64748B" }}>{ci.length} interv.</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>📍 {c.commune || "—"}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {(c.prestations || []).slice(0, 3).map(p => (
                <span key={p} style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10.5, background: `${T}12`, border: `1px solid ${T}25`, color: T }}>{SERVICE_LABELS[p] || p}</span>
              ))}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "#94A3B8" }}>
              {yearNow} réglé : <strong style={{ color: EMERALD }}>{eur(totalYear)}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ClientDetail({ client, inters, year, setYear, factures, onBack, onEdit, onDelete, onAddInter, onDelInter, onFacture }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const years = Array.from(new Set(inters.map(i => new Date(i.date).getFullYear()))).sort((a, b) => b - a);
  if (!years.includes(year)) years.unshift(year);
  const yearInters = inters.filter(i => new Date(i.date).getFullYear() === year);
  const regleInters = yearInters.filter(i => i.regle);
  const totalHeures = regleInters.reduce((a, i) => a + (Number(i.heures) || 0), 0);
  const totalMontant = regleInters.reduce((a, i) => a + (i.montant || 0), 0);
  const credit = Math.round(totalMontant * 0.5 * 100) / 100;
  const yearFactures = (factures || []).filter(f => f.year === year);

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: T, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16, padding: 0 }}>← Retour à la liste</button>

      {/* Fiche */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F8FAFC" }}>{client.prenom} {client.nom}</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12.5, color: "#94A3B8", marginTop: 8 }}>
              {client.adresse && <span>🏠 {client.adresse}</span>}
              <span>📍 {client.commune || "—"}</span>
              {client.tel && <span>📞 {client.tel}</span>}
              {client.email && <span>✉️ {client.email}</span>}
              <span>💶 Taux : {eur(client.tauxDefaut)}/h</span>
            </div>
            {client.note && <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 8, fontStyle: "italic" }}>{client.note}</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onEdit} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94A3B8", fontSize: 12, cursor: "pointer" }}>✏️ Modifier</button>
            {confirmDel ? (
              <button onClick={onDelete} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#EF4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Confirmer ?</button>
            ) : (
              <button onClick={() => setConfirmDel(true)} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748B", fontSize: 12, cursor: "pointer" }}>🗑️</button>
            )}
          </div>
        </div>
      </div>

      {/* Bandeau année + totaux + attestation */}
      <div style={{ ...card, marginBottom: 16, background: `linear-gradient(135deg, ${T}12, ${P}08)`, border: `1px solid ${T}25` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={lbl}>Année fiscale</span>
            <select value={year} onChange={e => setYear(+e.target.value)} style={{ ...inp, width: "auto", padding: "8px 12px" }}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Stat label="Heures réglées" value={`${totalHeures} h`} />
            <Stat label="Total réglé" value={eur(totalMontant)} color="#F8FAFC" />
            <Stat label="Crédit d'impôt 50%" value={eur(credit)} color={EMERALD} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => onFacture(yearInters)}
              disabled={yearInters.length === 0}
              style={{ padding: "11px 18px", borderRadius: 10, background: yearInters.length ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${yearInters.length ? `${T}44` : "rgba(255,255,255,0.08)"}`, color: yearInters.length ? T : "#475569", fontWeight: 700, fontSize: 13, cursor: yearInters.length ? "pointer" : "not-allowed" }}>
              📄 Facture {year}
            </button>
            <button
              onClick={() => openPrintWindow(
                buildAttestationHtml({ client, inters: regleInters, year, totals: { totalHeures, totalMontant, credit }, serviceLabels: SERVICE_LABELS }),
                "Autorisez les fenêtres pop-up pour générer l'attestation."
              )}
              disabled={regleInters.length === 0}
              style={{ padding: "11px 20px", borderRadius: 10, background: regleInters.length ? `linear-gradient(135deg,${T},${P})` : "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: regleInters.length ? "pointer" : "not-allowed", opacity: regleInters.length ? 1 : 0.5 }}>
              🧾 Attestation {year}
            </button>
          </div>
        </div>
        {yearFactures.length > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>Factures émises :</span>
            {yearFactures.map(f => (
              <span key={f.id} style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "3px 9px" }}>{f.numero} · {eur(f.total)}</span>
            ))}
          </div>
        )}
      </div>

      {/* Interventions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8" }}>Interventions {year} — {yearInters.length}</span>
        <button onClick={onAddInter} style={{ padding: "8px 14px", borderRadius: 8, background: `${T}15`, border: `1px solid ${T}33`, color: T, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Ajouter une intervention</button>
      </div>
      {yearInters.length === 0 ? (
        <div style={{ ...card, textAlign: "center", color: "#475569", fontSize: 13, padding: "32px" }}>Aucune intervention enregistrée pour {year}.</div>
      ) : (
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          {yearInters.sort((a, b) => b.date - a.date).map((i, idx) => (
            <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderBottom: idx < yearInters.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <span style={{ fontSize: 12, color: "#64748B", width: 82, flexShrink: 0 }}>{fmtD(i.date)}</span>
              <span style={{ fontSize: 12.5, color: "#F8FAFC", flex: 1 }}>{SERVICE_LABELS[i.service] || i.service}</span>
              <span style={{ fontSize: 12, color: "#94A3B8", width: 60, textAlign: "right" }}>{i.heures} h</span>
              <span style={{ fontSize: 12.5, color: "#F8FAFC", fontWeight: 700, width: 80, textAlign: "right" }}>{eur(i.montant)}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, width: 70, textAlign: "center", color: i.regle ? EMERALD : "#F59E0B" }}>{i.regle ? "✓ Réglé" : "À régler"}</span>
              <button onClick={() => onDelInter(i.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 13 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontSize: 11.5, color: "#475569", marginTop: 12 }}>Seules les interventions marquées « Réglé » sont comptées dans l'attestation fiscale (sommes effectivement versées).</p>
    </div>
  );
}

function Stat({ label, value, color = "#94A3B8" }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function ClientModal({ modal, onClose, onSave }) {
  const [f, setF] = useState(modal.data);
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));
  const togglePresta = (id) => setF(s => ({ ...s, prestations: s.prestations.includes(id) ? s.prestations.filter(x => x !== id) : [...s.prestations, id] }));
  const valid = f.prenom.trim() && f.nom.trim();
  return (
    <Overlay onClose={onClose}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F8FAFC", margin: "0 0 20px" }}>{modal.mode === "add" ? "Nouveau client" : "Modifier le client"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><label style={lbl}>Prénom *</label><input style={inp} value={f.prenom} onChange={set("prenom")} /></div>
        <div><label style={lbl}>Nom *</label><input style={inp} value={f.nom} onChange={set("nom")} /></div>
      </div>
      <div style={{ marginBottom: 12 }}><label style={lbl}>Adresse</label><input style={inp} value={f.adresse} onChange={set("adresse")} placeholder="12 rue des Alizés" /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><label style={lbl}>Commune</label><input style={inp} value={f.commune} onChange={set("commune")} placeholder="Rivière-Salée" /></div>
        <div><label style={lbl}>Téléphone</label><input style={inp} value={f.tel} onChange={set("tel")} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><label style={lbl}>Email</label><input style={inp} value={f.email} onChange={set("email")} /></div>
        <div><label style={lbl}>Taux horaire par défaut (€)</label><input type="number" style={inp} value={f.tauxDefaut} onChange={set("tauxDefaut")} /></div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Prestations</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => togglePresta(s.id)} type="button"
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: `1px solid ${f.prestations.includes(s.id) ? T : "rgba(255,255,255,0.12)"}`, background: f.prestations.includes(s.id) ? `${T}1f` : "rgba(255,255,255,0.03)", color: f.prestations.includes(s.id) ? T : "#94A3B8" }}>
              {s.icon} {s.title}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}><label style={lbl}>Note interne</label><textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={f.note} onChange={set("note")} /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Annuler</button>
        <button onClick={() => valid && onSave(f)} disabled={!valid} style={{ padding: "10px 22px", borderRadius: 10, background: valid ? `linear-gradient(135deg,${T},${P})` : "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.5 }}>Enregistrer</button>
      </div>
    </Overlay>
  );
}

function InterModal({ init, onClose, onSave }) {
  const [f, setF] = useState({ ...init, date: init.date || new Date().toISOString().slice(0, 10) });
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));
  const montant = (Number(f.heures) || 0) * (Number(f.taux) || 0);
  return (
    <Overlay onClose={onClose}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F8FAFC", margin: "0 0 20px" }}>Nouvelle intervention</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><label style={lbl}>Date</label><input type="date" style={inp} value={f.date} onChange={set("date")} /></div>
        <div><label style={lbl}>Prestation</label>
          <select style={inp} value={f.service} onChange={set("service")}>
            {SERVICES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.title}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><label style={lbl}>Heures</label><input type="number" step="0.5" style={inp} value={f.heures} onChange={set("heures")} /></div>
        <div><label style={lbl}>Taux (€/h)</label><input type="number" style={inp} value={f.taux} onChange={set("taux")} /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94A3B8" }}>
          <input type="checkbox" checked={f.regle} onChange={e => setF(s => ({ ...s, regle: e.target.checked }))} style={{ accentColor: T, width: 16, height: 16 }} />
          Intervention réglée
        </label>
        <span style={{ fontSize: 15, fontWeight: 800, color: T }}>Montant : {eur(montant)}</span>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Annuler</button>
        <button onClick={() => onSave(f)} style={{ padding: "10px 22px", borderRadius: 10, background: `linear-gradient(135deg,${T},${P})`, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Ajouter</button>
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

