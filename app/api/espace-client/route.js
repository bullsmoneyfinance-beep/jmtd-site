import { serverGet } from "../../../lib/server-store";

const digits = (s) => (s || "").replace(/\D/g, "");
const norm = (s) => (s || "").trim().toLowerCase();

// Authentifie un client par nom + téléphone et ne renvoie QUE ses données.
export async function POST(request) {
  try {
    const { nom, tel } = await request.json();
    if (!nom || !tel) return Response.json({ ok: false, error: "Champs manquants" }, { status: 400 });

    const clients = serverGet("jmtd_clients", []);
    const telD = digits(tel);
    const client = clients.find(c => norm(c.nom) === norm(nom) && digits(c.tel) && digits(c.tel) === telD);
    if (!client) return Response.json({ ok: false, error: "Aucun dossier trouvé. Vérifiez votre nom et votre numéro." }, { status: 404 });

    const inters = serverGet("jmtd_interventions", [])
      .filter(i => i.clientId === client.id)
      .sort((a, b) => b.date - a.date)
      .map(({ id, date, service, heures, taux, montant, regle }) => ({ id, date, service, heures, taux, montant, regle }));

    return Response.json({
      ok: true,
      client: { prenom: client.prenom, nom: client.nom, commune: client.commune || "", adresse: client.adresse || "" },
      interventions: inters,
    });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
