"use client";
import { useState } from "react";
import Link from "next/link";
import { SERVICES, FONDATRICE, ADDRESS, SIRET, EMAIL, PHONE, DECLARATION_SAP, TUTELLE_SAP, TEAL_TEXT } from "../../lib/data";

const T = "#0DA9A4", P = "#D4197A", TEXT = "#1A2D3D", MUTED = "#64748B", EMERALD = "#10B981";
const eur = (n) => (Number(n) || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const fmtD = (ts) => new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
const SERVICE_LABELS = Object.fromEntries(SERVICES.map(s => [s.id, `${s.icon} ${s.title}`]));
const inp = { width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid rgba(13,169,164,0.2)", background: "#FAFBFC", color: TEXT, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

export default function EspaceClientPage() {
  const [form, setForm] = useState({ nom: "", tel: "" });
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/espace-client", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.ok) {
        setData(json);
        const yrs = json.interventions.map(i => new Date(i.date).getFullYear());
        if (yrs.length) setYear(Math.max(...yrs));
      } else setErr(json.error || "Erreur, réessayez.");
    } catch { setErr("Connexion impossible. Réessayez."); }
    setLoading(false);
  };

  const years = data ? Array.from(new Set(data.interventions.map(i => new Date(i.date).getFullYear()))).sort((a, b) => b - a) : [];
  const yInters = data ? data.interventions.filter(i => new Date(i.date).getFullYear() === year) : [];
  const regle = yInters.filter(i => i.regle);
  const totalMontant = regle.reduce((a, i) => a + (i.montant || 0), 0);
  const totalHeures = regle.reduce((a, i) => a + (Number(i.heures) || 0), 0);
  const credit = Math.round(totalMontant * 0.5 * 100) / 100;

  return (
    <>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @media (max-width:640px){ .ec-section{padding:40px 16px 70px !important} }
      `}</style>

      <section style={{ background: "linear-gradient(160deg, #EFF9F8, #fff)", padding: "60px 24px 30px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: "10%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${T}18, transparent 70%)`, filter: "blur(46px)", animation: "floatOrb 13s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ maxWidth: 620, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${T}30`, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1.4 }}>Espace client</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 4.5vw, 44px)", fontWeight: 700, color: TEXT, marginBottom: 12 }}>
            Votre suivi J'MTD
          </h1>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>
            Consultez vos interventions et téléchargez votre attestation fiscale crédit d'impôt.
          </p>
        </div>
      </section>

      <section className="ec-section" style={{ background: "#fff", padding: "20px 24px 90px" }}>
        <div style={{ maxWidth: data ? 860 : 440, margin: "0 auto" }}>

          {!data ? (
            <form onSubmit={submit} style={{ background: "#fff", border: `1px solid rgba(13,169,164,0.14)`, borderRadius: 22, padding: "32px 30px", boxShadow: `0 6px 30px ${T}0d` }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: TEXT, marginBottom: 6 }}>Accéder à mon dossier</h2>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 22 }}>Identifiez-vous avec le nom et le téléphone communiqués à J'MTD.</p>
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="ec-nom" style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Nom de famille</label>
                <input id="ec-nom" style={inp} value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Dupont" required />
              </div>
              <div style={{ marginBottom: 22 }}>
                <label htmlFor="ec-tel" style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Téléphone</label>
                <input id="ec-tel" style={inp} value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="0596 XX XX XX" type="tel" required />
              </div>
              {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{err}</div>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", borderRadius: 30, fontSize: 15, fontWeight: 700, color: "#fff", border: "none", cursor: loading ? "wait" : "pointer", background: `linear-gradient(135deg, ${T}, ${P})`, boxShadow: `0 6px 22px ${T}3a` }}>
                {loading ? "Vérification…" : "Accéder à mon dossier →"}
              </button>
              <p style={{ fontSize: 11.5, color: "#94A3B8", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
                Un souci d'accès ? Appelez-nous au <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{ color: TEAL_TEXT, fontWeight: 700 }}>{PHONE}</a>
              </p>
            </form>
          ) : (
            <div>
              <button onClick={() => { setData(null); setForm({ nom: "", tel: "" }); }} style={{ background: "none", border: "none", color: TEAL_TEXT, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16, padding: 0 }}>← Se déconnecter</button>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT, margin: 0 }}>Bonjour {data.client.prenom} 👋</h2>
                  <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{data.client.commune}</p>
                </div>
                {years.length > 0 && (
                  <select value={year} onChange={e => setYear(+e.target.value)} style={{ ...inp, width: "auto", padding: "10px 14px" }}>
                    {years.map(y => <option key={y} value={y}>Année {y}</option>)}
                  </select>
                )}
              </div>

              {/* Totaux */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 22 }}>
                <StatCard label="Interventions" value={yInters.length} color={TEAL_TEXT} />
                <StatCard label="Heures" value={`${totalHeures} h`} color="#8B5CF6" />
                <StatCard label="Total réglé" value={eur(totalMontant)} color={TEXT} />
                <StatCard label="Crédit d'impôt 50%" value={eur(credit)} color={EMERALD} />
              </div>

              {regle.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <button onClick={() => downloadAttestation(data.client, regle, year, { totalHeures, totalMontant, credit })}
                    style={{ padding: "13px 26px", borderRadius: 30, background: `linear-gradient(135deg, ${T}, ${P})`, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 6px 22px ${T}3a` }}>
                    🧾 Télécharger mon attestation fiscale {year}
                  </button>
                </div>
              )}

              {/* Interventions */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Mes interventions {year}</h3>
              {yInters.length === 0 ? (
                <div style={{ background: "#F8FAFB", border: "1px solid rgba(13,169,164,0.1)", borderRadius: 16, padding: "36px", textAlign: "center", color: MUTED, fontSize: 14 }}>Aucune intervention enregistrée pour {year}.</div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid rgba(13,169,164,0.12)", borderRadius: 16, overflow: "hidden" }}>
                  {yInters.map((i, idx) => (
                    <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: idx < yInters.length - 1 ? "1px solid rgba(13,169,164,0.08)" : "none" }}>
                      <span style={{ fontSize: 12.5, color: MUTED, width: 82, flexShrink: 0 }}>{fmtD(i.date)}</span>
                      <span style={{ fontSize: 13.5, color: TEXT, flex: 1 }}>{SERVICE_LABELS[i.service] || i.service}</span>
                      <span style={{ fontSize: 12.5, color: MUTED, width: 54, textAlign: "right" }}>{i.heures} h</span>
                      <span style={{ fontSize: 13.5, color: TEXT, fontWeight: 700, width: 80, textAlign: "right" }}>{eur(i.montant)}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, width: 66, textAlign: "center", color: i.regle ? EMERALD : "#F59E0B" }}>{i.regle ? "✓ Réglé" : "À régler"}</span>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 14 }}>L'attestation reprend uniquement les sommes effectivement réglées sur l'année.</p>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link href="/" style={{ fontSize: 13, color: MUTED, textDecoration: "none" }}>← Retour au site J'MTD</Link>
          </div>
        </div>
      </section>
    </>
  );

  function downloadAttestation(client, inters, yr, totals) {
    const parPresta = {};
    inters.forEach(i => { parPresta[i.service] = (parPresta[i.service] || 0) + (i.montant || 0); });
    const lignes = Object.entries(parPresta).map(([s, m]) => `<tr><td>${SERVICE_LABELS[s] || s}</td><td style="text-align:right">${eur(m)}</td></tr>`).join("");
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Attestation fiscale ${yr} — ${client.prenom} ${client.nom}</title>
<style>@page{margin:22mm}body{font-family:Georgia,serif;color:#1a2d3d;line-height:1.6;font-size:14px;max-width:720px;margin:0 auto;padding:20px}.head{display:flex;justify-content:space-between;border-bottom:3px solid #0DA9A4;padding-bottom:16px;margin-bottom:26px}.brand{font-size:26px;font-weight:800;color:#0DA9A4}.brand span{color:#D4197A}.meta{font-size:11px;color:#555;text-align:right}h1{font-size:19px;text-align:center;margin:26px 0 8px}.sub{text-align:center;font-size:12px;color:#666;margin-bottom:28px}.box{border:1px solid #ddd;border-radius:8px;padding:14px 18px;margin-bottom:20px}.box b{display:inline-block;min-width:110px;color:#555;font-weight:normal;font-size:12px}table{width:100%;border-collapse:collapse;margin:14px 0}td,th{padding:8px 10px;border-bottom:1px solid #eee;font-size:13px}th{text-align:left;color:#555;font-size:11px;text-transform:uppercase}.total{font-size:16px;font-weight:800}.credit{background:#0DA9A410;border:1px solid #0DA9A430;border-radius:8px;padding:14px 18px;margin:18px 0;text-align:center;font-size:15px}.legal{font-size:11px;color:#666;line-height:1.7;margin-top:22px}.sign{margin-top:40px;display:flex;justify-content:space-between;align-items:flex-end}.print-btn{position:fixed;top:16px;right:16px;padding:12px 22px;background:#0DA9A4;color:#fff;border:none;border-radius:30px;font-size:14px;font-weight:700;cursor:pointer;font-family:sans-serif}@media print{.print-btn{display:none}body{padding:0}}</style></head><body>
<button class="print-btn" onclick="window.print()">🖨️ Imprimer / PDF</button>
<div class="head"><div><div class="brand">J'<span>m</span>TD</div><div style="font-size:11px;color:#666;margin-top:4px">Services à la Personne · Martinique</div></div><div class="meta">${ADDRESS}<br>SIREN ${SIRET}<br>Déclaration ${DECLARATION_SAP}<br>${TUTELLE_SAP}<br>${PHONE} · ${EMAIL}</div></div>
<h1>Attestation fiscale annuelle</h1><div class="sub">Services à la Personne — Année ${yr}<br>Article 199 sexdecies du Code général des impôts</div>
<div class="box"><div><b>Délivrée à :</b> ${client.prenom} ${client.nom}</div>${client.adresse ? `<div><b>Adresse :</b> ${client.adresse}${client.commune ? ", " + client.commune : ""}</div>` : (client.commune ? `<div><b>Commune :</b> ${client.commune}</div>` : "")}</div>
<p>Je soussignée <b>${FONDATRICE}</b>, représentant l'organisme <b>J'MTD</b>, déclaré au titre des Services à la Personne sous le numéro <b>${DECLARATION_SAP}</b>, atteste que la personne désignée ci-dessus a versé au cours de l'année <b>${yr}</b> la somme indiquée ci-dessous, en règlement de prestations de services à la personne réalisées à son domicile.</p>
<table><thead><tr><th>Prestation</th><th style="text-align:right">Montant réglé</th></tr></thead><tbody>${lignes}</tbody><tfoot><tr><td class="total">Total versé en ${yr}</td><td class="total" style="text-align:right">${eur(totals.totalMontant)}</td></tr></tfoot></table>
<div style="font-size:12px;color:#666">Soit ${totals.totalHeures} heures d'intervention sur l'année.</div>
<div class="credit">Montant ouvrant droit au <b>crédit d'impôt de 50 %</b> : <b>${eur(totals.credit)}</b></div>
<div class="legal">Cette attestation est à conserver et à joindre à votre déclaration de revenus. Le crédit d'impôt est égal à 50 % des sommes versées, dans la limite des plafonds annuels fixés par l'article 199 sexdecies du CGI.</div>
<div class="sign"><div style="font-size:12px;color:#666">Fait à Rivière-Salée,<br>le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</div><div style="text-align:center;font-size:12px"><div style="border-top:1px solid #999;padding-top:6px;width:180px">${FONDATRICE}<br><span style="color:#666">J'MTD</span></div></div></div>
</body></html>`;
    const w = window.open("", "_blank", "width=820,height=900");
    if (!w) { alert("Autorisez les fenêtres pop-up pour télécharger l'attestation."); return; }
    w.document.write(html); w.document.close();
  }
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#F8FAFB", border: "1px solid rgba(13,169,164,0.1)", borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ fontSize: 10.5, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 21, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}
