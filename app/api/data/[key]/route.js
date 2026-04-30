import { serverGet, serverSet } from "../../../../lib/server-store";

/**
 * GET /api/data/:key   — lire une clé
 * POST /api/data/:key  — écrire { data: [...] }
 */

export async function GET(request, { params }) {
  const { key } = params;
  const data = serverGet(key, null);
  return Response.json({ ok: true, data });
}

export async function POST(request, { params }) {
  try {
    const { key } = params;
    const body = await request.json();
    serverSet(key, body.data);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 400 });
  }
}
