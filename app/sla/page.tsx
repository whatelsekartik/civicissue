import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Clock3, MapPinned, ShieldCheck } from "lucide-react";
import { getPlatformStats, getZoneHeatmap } from "@/lib/queries/analytics";
import { formatNumber } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Service performance", description: "Public, privacy-safe civic issue service performance." };
export const dynamic = "force-dynamic";

export default async function SlaPage() {
  const [stats, wards] = await Promise.all([getPlatformStats(), getZoneHeatmap()]);
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-terra-700"><ShieldCheck className="h-4 w-4" aria-hidden /> Public accountability</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Service performance</h1>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">A privacy-safe view of how public civic reports are being handled. Figures are aggregated; individual reporters and exact private locations are never included.</p>
    <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Service performance summary">
      <Metric label="Resolution rate" value={`${Math.round(stats.resolutionRate * 100)}%`} note={`${formatNumber(stats.totalResolved)} completed reports`} />
      <Metric label="Average resolution" value={`${stats.avgResolutionDays} days`} note="Across completed public reports" icon={<Clock3 className="h-4 w-4" />} />
      <Metric label="Currently overdue" value={formatNumber(stats.overdueOpen)} note="Open reports past their target" danger icon={<AlertTriangle className="h-4 w-4" />} />
      <Metric label="Open reports" value={formatNumber(stats.activeIssues)} note={`${formatNumber(stats.criticalOpen)} critical`} icon={<MapPinned className="h-4 w-4" />} />
    </section>
    <section className="mt-9 rounded-2xl border border-line bg-surface p-5 shadow-card"><h2 className="text-lg font-bold text-ink">Ward and locality workload</h2><p className="mt-1 text-xs text-ink-muted">Counts are grouped by the approximate zone or locality selected in a report.</p><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[440px] text-left text-sm"><thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted"><tr><th className="pb-3 font-semibold">Ward / locality</th><th className="pb-3 text-right font-semibold">Reported</th><th className="pb-3 text-right font-semibold">Open</th><th className="pb-3 text-right font-semibold">Road-related</th></tr></thead><tbody>{wards.map((ward) => <tr key={ward.zone} className="border-b border-line/70 last:border-0"><td className="py-3 font-semibold text-ink">{ward.zone}</td><td className="py-3 text-right tabular-nums">{formatNumber(ward.total)}</td><td className="py-3 text-right tabular-nums text-terra-700">{formatNumber(ward.open)}</td><td className="py-3 text-right tabular-nums">{formatNumber(ward.road)}</td></tr>)}</tbody></table></div></section>
    <p className="mt-6 text-sm text-ink-muted">Need a more detailed view? <Link href="/map" className="font-semibold text-terra-700 underline">Explore public reports on the map</Link>.</p>
  </div>;
}

function Metric({ label, value, note, icon, danger }: { label: string; value: string; note: string; icon?: React.ReactNode; danger?: boolean }) {
  return <div className="rounded-2xl border border-line bg-surface p-4 shadow-card"><p className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">{icon}{label}</p><p className={`mt-2 text-2xl font-bold ${danger ? "text-alert" : "text-ink"}`}>{value}</p><p className="mt-1 text-[11px] text-ink-muted">{note}</p></div>;
}
