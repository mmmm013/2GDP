'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart, Music2, TrendingUp, DollarSign, Tv } from 'lucide-react';

interface Donation {
  id: string;
  tier: string;
  amount_cents: number;
  status: string;
  completed_at: string | null;
  donor_name: string | null;
}

interface CatalogTrack {
  id: string;
  title: string;
  tv_network: string | null;
  tv_show: string | null;
  sync_tier: string | null;
}

interface DashboardData {
  summary: {
    total_completed_donations: number;
    gross_revenue_usd: string;
    msj_share_90pct_usd: string;
    gputnam_kleigh_10pct_usd: string;
    note: string;
    generated_at: string;
  };
  catalog: CatalogTrack[];
  recent_donations: Donation[];
}

export default function MsjRevenuePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError('No access token provided. Add ?token=YOUR_TOKEN to the URL.');
      setLoading(false);
      return;
    }

    fetch(`/api/msj-revenue?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<DashboardData>;
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60 text-sm animate-pulse">Loading MSJ revenue data…</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-3">
          <p className="text-red-400 text-sm font-bold">Error</p>
          <p className="text-white/70 text-sm">{error ?? 'Unknown error'}</p>
        </div>
      </main>
    );
  }

  const { summary, catalog, recent_donations } = data;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-950 to-black border-b border-red-900/30 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center gap-2 text-red-300 text-xs font-black uppercase tracking-widest">
            <Heart className="w-3 h-3 fill-red-400" />
            KEZ PLZ — Private Revenue Dashboard
          </div>
          <h1 className="text-3xl font-black text-white">
            Michael Scherer — Revenue Transparency
          </h1>
          <p className="text-sm text-white/50">
            Generated {new Date(summary.generated_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Policy note */}
        <div className="rounded-xl bg-red-950/30 border border-red-800/30 p-4 text-sm text-red-200/80 leading-relaxed">
          <Music2 className="w-4 h-4 text-amber-400 mb-2" />
          {summary.note}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            icon={<TrendingUp className="w-4 h-4 text-amber-400" />}
            label="Donations Completed"
            value={String(summary.total_completed_donations)}
          />
          <SummaryCard
            icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
            label="Gross Revenue"
            value={`$${summary.gross_revenue_usd}`}
          />
          <SummaryCard
            icon={<Heart className="w-4 h-4 text-red-400 fill-red-400" />}
            label="MSJ Share (90%)"
            value={`$${summary.msj_share_90pct_usd}`}
            highlight
          />
          <SummaryCard
            icon={<DollarSign className="w-4 h-4 text-white/40" />}
            label="GPM + KLEIGH (10%)"
            value={`$${summary.gputnam_kleigh_10pct_usd}`}
          />
        </div>

        {/* TV Catalog */}
        {catalog.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Tv className="w-4 h-4 text-amber-400" />
              TV Thoroughbreds Catalog ({catalog.length} tracks)
            </h2>
            <div className="space-y-2">
              {catalog.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg bg-neutral-900/60 border border-white/10 px-4 py-2 text-sm"
                >
                  <span className="font-semibold">{t.title}</span>
                  <span className="text-neutral-400 text-xs">
                    {t.tv_network && t.tv_show
                      ? `${t.tv_network} · ${t.tv_show}`
                      : t.sync_tier ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent donations */}
        {recent_donations.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3">Recent Completed Donations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider">
                    <th className="py-2 text-left font-semibold">Date</th>
                    <th className="py-2 text-left font-semibold">Tier</th>
                    <th className="py-2 text-right font-semibold">Amount</th>
                    <th className="py-2 text-right font-semibold">MSJ Share</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_donations.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-2 text-neutral-400">
                        {d.completed_at
                          ? new Date(d.completed_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="py-2 capitalize">{d.tier.replace('_', ' ')}</td>
                      <td className="py-2 text-right text-emerald-400">
                        ${((d.amount_cents ?? 0) / 100).toFixed(2)}
                      </td>
                      <td className="py-2 text-right text-red-300 font-bold">
                        ${(((d.amount_cents ?? 0) * 0.9) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {recent_donations.length === 0 && (
          <p className="text-sm text-neutral-500">
            No completed donations recorded yet. Revenue will appear here as KEZ supporters come in.
          </p>
        )}

        <p className="text-xs text-white/20 text-center pt-4">
          G Putnam Music, LLC — Confidential revenue summary for Michael D. Scherer
        </p>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 space-y-2 ${
        highlight
          ? 'bg-red-950/40 border-red-700/40'
          : 'bg-neutral-900/60 border-white/10'
      }`}
    >
      {icon}
      <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black ${highlight ? 'text-red-300' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
