import { serverGet, serverSet } from "../../../lib/server-store";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prenom, nom, tel, email, service, zone, message } = body;

    // ── 0. Validation serveur (ne jamais faire confiance au client) ──
    const cleanNom = `${prenom || ""} ${nom || ""}`.trim();
    const cleanTel = String(tel || "").trim();
    if (cleanNom.length < 2) {
      return Response.json({ ok: false, error: "Nom requis." }, { status: 400 });
    }
    const digits = cleanTel.replace(/[^0-9+]/g, "");
    if (digits.length < 8 || digits.length > 20) {
      return Response.json({ ok: false, error: "Téléphone invalide." }, { status: 400 });
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email).trim())) {
      return Response.json({ ok: false, error: "Email invalide." }, { status: 400 });
    }

    // ── 1. Sauvegarde du devis côté serveur ──
    const existing = serverGet("jmtd_quotes", []);
    const newQuote = {
      id: `q${Date.now()}`,
      date: Date.now(),
      status: "nouveau",
      name: `${prenom} ${nom}`.trim(),
      phone: tel,
      email: email || "",
      service: service || "",
      zone: zone || "",
      message: message || "",
    };
    serverSet("jmtd_quotes", [newQuote, ...existing]);

    // ── 2. Notification email (Resend) ──
    if (process.env.RESEND_API_KEY) {
      try {
        const serviceLabels = {
          entretien: "🏠 Entretien & Nettoyage",
          repas:     "🍽️ Préparation de repas",
          courses:   "🛒 Livraison de courses",
          assistance:"📋 Assistance administrative",
          rangement: "🗂️ Coach en rangement",
          jardinage: "🌿 Entretien extérieur & jardinage",
          conciergerie: "🔑 Conciergerie locative (B2B)",
        };
        const serviceLabel = serviceLabels[service] || service || "Non précisé";

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "notifications@jmtd.fr",
            to: ["contact@jmtd.fr"],
            reply_to: email || undefined,
            subject: `📩 Nouveau devis — ${prenom} ${nom} (${serviceLabel})`,
            html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f8fafb; margin: 0; padding: 20px; }
  .card { background: #fff; border-radius: 16px; max-width: 560px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0DA9A4, #D4197A); padding: 28px 32px; }
  .header h1 { color: #fff; font-size: 20px; margin: 0; }
  .header p  { color: rgba(255,255,255,0.8); font-size: 13px; margin: 4px 0 0; }
  .body { padding: 28px 32px; }
  .row { margin-bottom: 16px; }
  .label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .value { font-size: 15px; color: #1a2d3d; font-weight: 600; }
  .msg { background: #f8fafb; border-left: 3px solid #0DA9A4; border-radius: 0 8px 8px 0; padding: 12px 16px; font-size: 14px; color: #64748b; line-height: 1.7; }
  .footer { background: #f8fafb; padding: 16px 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  .badge { display: inline-block; background: rgba(13,169,164,0.12); border: 1px solid rgba(13,169,164,0.25); color: #0DA9A4; border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 700; }
</style></head>
<body>
  <div class="card">
    <div class="header">
      <h1>📩 Nouvelle demande de devis</h1>
      <p>Reçue le ${new Date().toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
    </div>
    <div class="body">
      <div class="row">
        <div class="label">Client</div>
        <div class="value">${prenom} ${nom}</div>
      </div>
      <div class="row">
        <div class="label">Téléphone</div>
        <div class="value"><a href="tel:${tel}" style="color:#0DA9A4;text-decoration:none;">${tel}</a></div>
      </div>
      ${email ? `<div class="row"><div class="label">Email</div><div class="value"><a href="mailto:${email}" style="color:#0DA9A4;text-decoration:none;">${email}</a></div></div>` : ""}
      <div class="row">
        <div class="label">Prestation souhaitée</div>
        <div class="value"><span class="badge">${serviceLabel}</span></div>
      </div>
      ${zone ? `<div class="row"><div class="label">Commune</div><div class="value">📍 ${zone}</div></div>` : ""}
      ${message ? `<div class="row"><div class="label">Message</div><div class="msg">${message.replace(/\n/g, "<br>")}</div></div>` : ""}
      <div style="margin-top:24px;text-align:center;">
        <a href="https://jmtd.fr/admin" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#0DA9A4,#D4197A);color:#fff;border-radius:30px;text-decoration:none;font-weight:700;font-size:14px;">
          Voir dans l'admin J'MTD →
        </a>
      </div>
    </div>
    <div class="footer">J'MTD · Rivière-Salée, Martinique · jmtd.fr</div>
  </div>
</body>
</html>`,
          }),
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr.message);
        // On ne bloque pas si l'email échoue
      }
    }

    return Response.json({ ok: true, id: newQuote.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
