import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SOURCES = [
  "https://www.servicesalapersonne.gouv.fr/",
  "https://www.servicesalapersonne.gouv.fr/actualites",
  "https://www.servicesalapersonne.gouv.fr/particuliers-employeurs/formalites",
];

function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function fetchSource(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JMTD-Veille-SAP/1.0; +https://jmtd.fr)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    return stripHtml(html).substring(0, 4000);
  } catch {
    return null;
  }
}

export async function GET() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { success: false, error: "ANTHROPIC_API_KEY manquante. Configurez-la dans les variables d'environnement Vercel." },
      { status: 500 }
    );
  }

  const results = await Promise.allSettled(SOURCES.map(fetchSource));
  const contents = results
    .map((r, i) => r.status === "fulfilled" && r.value ? `=== Source: ${SOURCES[i]} ===\n${r.value}` : null)
    .filter(Boolean)
    .join("\n\n");

  if (!contents) {
    return Response.json({ success: false, error: "Impossible de joindre les sources. Vérifiez la connexion." }, { status: 503 });
  }

  const systemPrompt = `Tu es un assistant juridique et réglementaire spécialisé dans les services à la personne en France (secteur SAP).
Tu travailles pour J'MTD, une société de services à la personne agréée SAP basée à Rivière-Salée, Martinique (DOM).
Ton rôle : analyser le contenu du site servicesalapersonne.gouv.fr et identifier toutes les informations importantes pour cette entreprise.
Sois précis, concis, et orienté action pratique pour un prestataire SAP de petite taille.`;

  const userPrompt = `Analyse ce contenu du site officiel servicesalapersonne.gouv.fr et identifie les actualités, réglementations et informations importantes pour J'MTD.

${contents}

Réponds UNIQUEMENT avec du JSON valide (pas de markdown, pas de \`\`\`), exactement dans ce format :
{
  "synthese": "Résumé global en 2-3 phrases de l'état réglementaire du secteur SAP",
  "alerte": null,
  "items": [
    {
      "id": "1",
      "titre": "Titre court et informatif",
      "resume": "Explication claire en 2-3 phrases, avec l'impact concret pour J'MTD",
      "categorie": "juridique",
      "importance": "haute",
      "action": "Ce que J'MTD doit faire ou surveiller concrètement",
      "source_label": "servicesalapersonne.gouv.fr"
    }
  ],
  "date_analyse": "${new Date().toISOString()}"
}

Catégories possibles : juridique, fiscal, social, pratique, general
Importance possible : haute, moyenne, faible
Identifie entre 4 et 8 éléments pertinents. Si pas d'actualités récentes détectées, fournis les points réglementaires clés permanents (agrément SAP, crédit d'impôt, CESU, droits employeurs, obligations déclaratives).
Le champ "alerte" doit être null ou une string courte signalant une urgence réglementaire.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText = message.content[0].text.trim();
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    const jsonStr = rawText.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonStr);

    return Response.json({
      success: true,
      ...data,
      fetched_at: new Date().toISOString(),
      sources: SOURCES,
      tokens_used: message.usage?.input_tokens + message.usage?.output_tokens,
    });
  } catch (err) {
    return Response.json({ success: false, error: `Erreur analyse IA : ${err.message}` }, { status: 500 });
  }
}
