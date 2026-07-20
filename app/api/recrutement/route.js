import { serverGet, serverSet } from "../../../lib/server-store";
import { scoreCandidature } from "../../../lib/scoring";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prenom, nom, tel, email, commune, postes, experience, transport, dispo_heures, dispo_jours, situation, motivation, discretion, references, formation, infos_plus } = body;

    // ── 1. Sauvegarde candidature ──
    const existing = serverGet("jmtd_candidatures", []);
    const candidature = {
      id: `cand_${Date.now()}`,
      date: Date.now(),
      status: "nouveau",
      prenom, nom, tel, email: email || "",
      commune: commune || "",
      postes: postes || [],
      experience: experience || "",
      experience_detail: body.experience_detail || "",
      transport: transport || "",
      transport_detail: body.transport_detail || "",
      dispo_heures: dispo_heures || "",
      dispo_jours: dispo_jours || [],
      situation: situation || "",
      motivation: motivation || "",
      discretion: discretion || "",
      references: references || "",
      formation: formation || "",
      infos_plus: infos_plus || "",
    };
    serverSet("jmtd_candidatures", [candidature, ...existing]);

    // ── 2. Email de notification (Resend) ──
    if (process.env.RESEND_API_KEY) {
      try {
        const POSTE_LABELS = {
          menage: "🏠 Aide ménagère",
          repas: "🍽️ Préparation repas",
          courses: "🛒 Livraison courses",
          assistance: "📋 Assistance admin",
          rangement: "🗂️ Coach rangement",
        };
        const EXPERIENCE_LABELS = {
          aucune: "Aucune expérience (première fois)",
          moins1: "Moins d'1 an",
          "1-3": "1 à 3 ans",
          "3-5": "3 à 5 ans",
          plus5: "Plus de 5 ans",
        };
        const SITUATION_LABELS = {
          chomage: "En recherche d'emploi",
          partiel: "Temps partiel, cherche complément",
          reconversion: "En reconversion",
          retraite: "Retraité(e)",
          autre: "Autre situation",
        };

        const postesStr = (postes || []).map(p => POSTE_LABELS[p] || p).join(", ") || "Non précisé";
        const expStr = EXPERIENCE_LABELS[experience] || experience || "Non précisé";
        const situStr = SITUATION_LABELS[situation] || situation || "Non précisée";

        // Score de la candidature (modèle partagé /100 + catégorie de tri)
        const sc = scoreCandidature(candidature);
        const stars = `${sc.tier.emoji} ${sc.tier.label}`;
        const breakdownStr = sc.breakdown.map(b => `${b.label} ${b.score}/${b.max}`).join(" · ");

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "recrutement@jmtd.fr",
            to: ["contact@jmtd.fr"],
            reply_to: email || undefined,
            subject: `${sc.tier.emoji} Candidature ${sc.total}/100 — ${prenom} ${nom} (${postesStr})`,
            html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f8fafb; margin: 0; padding: 20px; }
  .card { background: #fff; border-radius: 16px; max-width: 620px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0D1B2A, #0e2235); padding: 28px 32px; }
  .header h1 { color: #fff; font-size: 20px; margin: 0 0 4px; }
  .header p  { color: rgba(255,255,255,0.6); font-size: 13px; margin: 0; }
  .score { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 16px; margin-top: 14px; font-size: 14px; color: #F8FAFC; }
  .body { padding: 28px 32px; }
  .section { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
  .section:last-of-type { border-bottom: none; }
  .sec-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
  .row { display: flex; gap: 16px; margin-bottom: 10px; }
  .label { font-size: 12px; color: #94a3b8; min-width: 130px; }
  .value { font-size: 14px; color: #1a2d3d; font-weight: 600; }
  .msg { background: #f8fafb; border-left: 3px solid #0DA9A4; border-radius: 0 8px 8px 0; padding: 12px 16px; font-size: 14px; color: #475569; line-height: 1.7; margin-top: 6px; }
  .badge { display: inline-block; background: rgba(13,169,164,0.12); border: 1px solid rgba(13,169,164,0.25); color: #0DA9A4; border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 700; margin: 2px; }
  .badge-pink { background: rgba(212,25,122,0.1); border-color: rgba(212,25,122,0.25); color: #D4197A; }
  .footer { background: #f8fafb; padding: 16px 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  .cta { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #0DA9A4, #D4197A); color: #fff; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 16px; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <h1>👤 Nouvelle candidature</h1>
    <p>Reçue le ${new Date().toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
    <div class="score">
      <strong>Score : ${sc.total}/100</strong> &nbsp;·&nbsp; ${stars} (${sc.tier.short})
      <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:6px;line-height:1.6;">${breakdownStr}</div>
    </div>
  </div>
  <div class="body">

    <div class="section">
      <div class="sec-title">👤 Identité & Contact</div>
      <div class="row"><span class="label">Candidat·e</span><span class="value">${prenom} ${nom}</span></div>
      <div class="row"><span class="label">Téléphone</span><span class="value"><a href="tel:${tel}" style="color:#0DA9A4;">${tel}</a></span></div>
      ${email ? `<div class="row"><span class="label">Email</span><span class="value"><a href="mailto:${email}" style="color:#0DA9A4;">${email}</a></span></div>` : ""}
      <div class="row"><span class="label">Commune</span><span class="value">📍 ${commune || "Non précisée"}</span></div>
      <div class="row"><span class="label">Situation</span><span class="value">${situStr}</span></div>
    </div>

    <div class="section">
      <div class="sec-title">💼 Profil</div>
      <div class="row"><span class="label">Poste(s)</span><span class="value">${postesStr}</span></div>
      <div class="row"><span class="label">Expérience</span><span class="value">${expStr}</span></div>
      ${body.experience_detail ? `<div style="margin-bottom:10px;"><div class="label" style="margin-bottom:4px;">Détail expérience</div><div class="msg">${body.experience_detail}</div></div>` : ""}
      <div class="row"><span class="label">Transport</span><span class="value">${transport || "Non précisé"}</span></div>
      <div class="row"><span class="label">Dispo. hebdo</span><span class="value">${dispo_heures || "Non précisée"}</span></div>
      <div class="row"><span class="label">Jours dispo.</span><span class="value">${(dispo_jours || []).join(", ") || "Non précisés"}</span></div>
      <div class="row"><span class="label">Références</span><span class="value">${references || "Non précisé"}</span></div>
      <div class="row"><span class="label">Formation</span><span class="value">${formation || "Non précisé"}</span></div>
    </div>

    <div class="section">
      <div class="sec-title">💬 Motivations — clé du recrutement</div>
      <div style="margin-bottom:16px;"><strong style="font-size:12px;color:#1a2d3d;">Pourquoi J'MTD ?</strong><div class="msg">${motivation || "—"}</div></div>
      <div><strong style="font-size:12px;color:#1a2d3d;">Conception de la discrétion :</strong><div class="msg">${discretion || "—"}</div></div>
    </div>

    ${infos_plus ? `<div class="section"><div class="sec-title">📝 Informations supplémentaires</div><div class="msg">${infos_plus}</div></div>` : ""}

    <a href="https://jmtd.fr/admin" class="cta">Voir dans l'admin J'MTD →</a>
  </div>
  <div class="footer">J'MTD Recrutement · Rivière-Salée, Martinique · contact@jmtd.fr</div>
</div>
</body></html>`,
          }),
        });
      } catch (emailErr) {
        console.error("Email recrutement failed:", emailErr.message);
      }
    }

    return Response.json({ ok: true, id: candidature.id });
  } catch (err) {
    console.error("Recrutement API error:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const candidatures = serverGet("jmtd_candidatures", []);
  return Response.json({ ok: true, data: candidatures });
}
