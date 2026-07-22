// Génération des documents imprimables (attestation fiscale, facture)
// Point d'entrée unique pour éviter la divergence entre ClientsTab et EspaceClientClient.
import { FONDATRICE, ADDRESS, SIRET, EMAIL, PHONE, DECLARATION_SAP, TUTELLE_SAP } from "./data";

const eur = (n) => (Number(n) || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const fmtD = (ts) => new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

// Échappe les données saisies (nom/adresse client, libellés) avant injection dans le HTML imprimable
export const escHtml = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function openPrintWindow(html, popupMessage) {
  const w = window.open("", "_blank", "width=820,height=900");
  if (!w) { alert(popupMessage); return; }
  w.document.write(html);
  w.document.close();
}

// Génère le HTML de l'attestation fiscale annuelle
export function buildAttestationHtml({ client, inters, year, totals, serviceLabels }) {
  const parPresta = {};
  inters.forEach(i => { parPresta[i.service] = (parPresta[i.service] || 0) + (i.montant || 0); });
  const lignes = Object.entries(parPresta).map(([s, m]) =>
    `<tr><td>${escHtml(serviceLabels[s] || s)}</td><td style="text-align:right">${eur(m)}</td></tr>`).join("");

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Attestation fiscale ${year} — ${escHtml(client.prenom)} ${escHtml(client.nom)}</title>
<style>
  @page { margin: 22mm; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a2d3d; line-height: 1.6; font-size: 14px; max-width: 720px; margin: 0 auto; padding: 20px; }
  .head { display:flex; justify-content:space-between; border-bottom: 3px solid #0DA9A4; padding-bottom: 16px; margin-bottom: 26px; }
  .brand { font-size: 26px; font-weight: 800; color: #0DA9A4; }
  .brand span { color: #D4197A; }
  .meta { font-size: 11px; color: #555; text-align: right; }
  h1 { font-size: 19px; text-align: center; margin: 26px 0 8px; }
  .sub { text-align:center; font-size:12px; color:#666; margin-bottom: 28px; }
  .box { border: 1px solid #ddd; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; }
  .box b { display:inline-block; min-width: 130px; color:#555; font-weight:normal; font-size:12px; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0; }
  td, th { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
  th { text-align:left; color:#555; font-size:11px; text-transform:uppercase; letter-spacing:.5px; }
  .total { font-size: 16px; font-weight: 800; }
  .credit { background:#0DA9A410; border:1px solid #0DA9A430; border-radius:8px; padding:14px 18px; margin: 18px 0; text-align:center; font-size:15px; }
  .legal { font-size: 11px; color: #666; line-height: 1.7; margin-top: 22px; }
  .sign { margin-top: 40px; display:flex; justify-content:space-between; align-items:flex-end; }
  .print-btn { position: fixed; top: 16px; right: 16px; padding: 12px 22px; background: #0DA9A4; color:#fff; border:none; border-radius: 30px; font-size: 14px; font-weight:700; cursor:pointer; font-family: sans-serif; }
  @media print { .print-btn { display: none; } body { padding: 0; } }
</style></head><body>
  <button class="print-btn" onclick="window.print()">🖨️ Imprimer / PDF</button>
  <div class="head">
    <div><div class="brand">J'<span>m</span>TD</div><div style="font-size:11px;color:#666;margin-top:4px;">Services à la Personne · Martinique</div></div>
    <div class="meta">${ADDRESS}<br>SIREN ${SIRET}<br>Déclaration ${DECLARATION_SAP}<br>${TUTELLE_SAP}<br>${PHONE} · ${EMAIL}</div>
  </div>

  <h1>Attestation fiscale annuelle</h1>
  <div class="sub">Services à la Personne — Année ${year}<br>Article 199 sexdecies du Code général des impôts</div>

  <div class="box">
    <div><b>Délivrée à :</b> ${escHtml(client.prenom)} ${escHtml(client.nom)}</div>
    ${client.adresse ? `<div><b>Adresse :</b> ${escHtml(client.adresse)}${client.commune ? ", " + escHtml(client.commune) : ""}</div>` : (client.commune ? `<div><b>Commune :</b> ${escHtml(client.commune)}</div>` : "")}
  </div>

  <p>Je soussignée <b>${FONDATRICE}</b>, représentant l'organisme <b>J'MTD</b>, déclaré au titre des Services à la Personne sous le numéro <b>${DECLARATION_SAP}</b>, atteste que la personne désignée ci-dessus a versé au cours de l'année <b>${year}</b> la somme indiquée ci-dessous, en règlement de prestations de services à la personne réalisées à son domicile.</p>

  <table>
    <thead><tr><th>Prestation</th><th style="text-align:right">Montant réglé</th></tr></thead>
    <tbody>${lignes}</tbody>
    <tfoot><tr><td class="total">Total versé en ${year}</td><td class="total" style="text-align:right">${eur(totals.totalMontant)}</td></tr></tfoot>
  </table>
  <div style="font-size:12px;color:#666;">Soit ${totals.totalHeures} heures d'intervention sur l'année.</div>

  <div class="credit">
    Montant ouvrant droit au <b>crédit d'impôt de 50 %</b> : <b>${eur(totals.credit)}</b>
  </div>

  <div class="legal">
    Cette attestation est à conserver et à joindre à votre déclaration de revenus. Le crédit d'impôt est égal à 50 % des sommes versées, dans la limite des plafonds annuels fixés par l'article 199 sexdecies du CGI. Elle ne préjuge pas de votre situation fiscale personnelle, appréciée par l'administration.
  </div>

  <div class="sign">
    <div style="font-size:12px;color:#666;">Fait à Rivière-Salée,<br>le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</div>
    <div style="text-align:center;font-size:12px;"><div style="border-top:1px solid #999;padding-top:6px;width:180px;">${FONDATRICE}<br><span style="color:#666;">J'MTD</span></div></div>
  </div>
</body></html>`;
}

// Génère le HTML de la facture
export function buildFactureHtml({ client, inters, numero, serviceLabels }) {
  const sorted = [...inters].sort((a, b) => a.date - b.date);
  const lignes = sorted.map(i =>
    `<tr>
      <td>${fmtD(i.date)}</td>
      <td>${escHtml(serviceLabels[i.service] || i.service)}</td>
      <td style="text-align:center">${i.heures}</td>
      <td style="text-align:right">${eur(i.taux)}</td>
      <td style="text-align:right">${eur(i.montant)}</td>
    </tr>`).join("");
  const total = Math.round(sorted.reduce((a, i) => a + (i.montant || 0), 0) * 100) / 100;
  const credit = Math.round(total * 0.5 * 100) / 100;

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Facture ${numero} — ${escHtml(client.prenom)} ${escHtml(client.nom)}</title>
<style>
  @page { margin: 20mm; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a2d3d; line-height: 1.55; font-size: 13px; max-width: 720px; margin: 0 auto; padding: 20px; }
  .head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 30px; }
  .brand { font-size: 28px; font-weight: 800; color: #0DA9A4; }
  .brand span { color: #D4197A; }
  .meta { font-size: 11px; color: #555; text-align: right; line-height: 1.7; }
  .facnum { background:#0DA9A4; color:#fff; padding: 10px 18px; border-radius: 8px; font-size: 16px; font-weight: 800; display:inline-block; }
  .parties { display:flex; justify-content:space-between; gap: 20px; margin: 20px 0 26px; }
  .party { flex:1; }
  .party h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color:#999; margin: 0 0 6px; }
  .party p { margin: 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 18px; }
  th { background:#f4f7f9; text-align:left; padding: 9px 10px; font-size: 10.5px; text-transform:uppercase; letter-spacing:.4px; color:#555; }
  td { padding: 9px 10px; border-bottom: 1px solid #eee; font-size: 12.5px; }
  .totrow td { border-top: 2px solid #0DA9A4; font-weight: 800; font-size: 15px; }
  .credit { background:#0DA9A410; border:1px solid #0DA9A430; border-radius:8px; padding:12px 16px; margin: 16px 0; font-size:13px; }
  .legal { font-size: 10.5px; color: #777; line-height: 1.7; margin-top: 22px; border-top:1px solid #eee; padding-top:14px; }
  .print-btn { position: fixed; top: 16px; right: 16px; padding: 12px 22px; background: #0DA9A4; color:#fff; border:none; border-radius: 30px; font-size: 14px; font-weight:700; cursor:pointer; }
  @media print { .print-btn { display: none; } body { padding: 0; } }
</style></head><body>
  <button class="print-btn" onclick="window.print()">🖨️ Imprimer / PDF</button>
  <div class="head">
    <div>
      <div class="brand">J'<span>m</span>TD</div>
      <div style="font-size:11px;color:#666;margin-top:4px;">Services à la Personne · Martinique</div>
    </div>
    <div class="meta">${ADDRESS}<br>SIREN ${SIRET}<br>Déclaration ${DECLARATION_SAP}<br>${PHONE} · ${EMAIL}</div>
  </div>

  <div style="margin-bottom:8px;"><span class="facnum">FACTURE ${numero}</span></div>
  <div style="font-size:12px;color:#666;">Émise le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</div>

  <div class="parties">
    <div class="party"><h3>Prestataire</h3><p><b>J'MTD</b><br>${FONDATRICE}<br>${ADDRESS}</p></div>
    <div class="party" style="text-align:right"><h3>Facturé à</h3><p><b>${escHtml(client.prenom)} ${escHtml(client.nom)}</b>${client.adresse ? "<br>" + escHtml(client.adresse) : ""}${client.commune ? "<br>" + escHtml(client.commune) : ""}</p></div>
  </div>

  <table>
    <thead><tr><th>Date</th><th>Prestation</th><th style="text-align:center">Heures</th><th style="text-align:right">Taux</th><th style="text-align:right">Montant</th></tr></thead>
    <tbody>${lignes}</tbody>
    <tfoot><tr class="totrow"><td colspan="4">TOTAL NET À PAYER</td><td style="text-align:right">${eur(total)}</td></tr></tfoot>
  </table>

  <div style="font-size:11px;color:#777;">TVA non applicable, article 293 B du Code général des impôts.</div>

  <div class="credit">
    💳 <b>Crédit d'impôt Services à la Personne :</b> cette prestation ouvre droit à un crédit d'impôt de 50 %, soit un coût réel de <b>${eur(credit)}</b> après remboursement. Éligible à l'avance immédiate du crédit d'impôt (URSSAF).
  </div>

  <div class="legal">
    Règlement à réception de facture. Prestation de services à la personne réalisée au domicile du client, déclarée sous le n° ${DECLARATION_SAP}. Une attestation fiscale annuelle récapitulative vous sera remise en janvier. En cas de retard de paiement, pénalités au taux légal en vigueur ; indemnité forfaitaire de recouvrement de 40 € (art. L441-10 et D441-5 du Code de commerce).
  </div>
</body></html>`;
}
