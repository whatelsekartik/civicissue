import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lightweight, unauthenticated readiness probe. Do not expose secrets here. */
export async function GET() {
  const started = Date.now();
  try {
    const db = await getDb();
    await db.run("select 1");
    return Response.json({ status: "ok", database: "ok", timestamp: new Date().toISOString(), latencyMs: Date.now() - started }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "degraded", database: "unavailable", timestamp: new Date().toISOString() }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
