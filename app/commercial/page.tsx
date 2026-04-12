'use client';

import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import { BadgeCheck, ShoppingCart, Music2, Briefcase, Star } from 'lucide-react';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}

interface CommercialTrack {
  id: string;
  title: string | null;
  artist: string | null;
  audio_url: string | null;
  tv_network: string | null;
  tv_show: string | null;
  tv_spot_description: string | null;
  tv_region: string | null;
  gpmcc_sfw: boolean | null;
  composition_story: string | null;
  lemon_squeezy_url: string | null;
  sync_tier: string | null;
}

export default function CommercialPage() {
  const [tracks, setTracks] = useState<CommercialTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      const { data, error } = await getSupabase()
        .from('msj_tv_thoroughbreds')
        .select('*')
        .eq('gpmcc_sfw', true)
        .order('title', { ascending: true });

      if (error) {
        console.error('[GPMCC] Error loading SFW catalog', error);
      } else {
        setTracks((data ?? []) as CommercialTrack[]);
      }
      setLoading(false);
    };

    loadTracks();
  }, []);

  const handlePlay = (track: CommercialTrack) => {
    if (!track.audio_url) return;
    window.dispatchEvent(
      new CustomEvent('play-track', {
        detail: {
          title: track.title || 'Unknown Track',
          artist: track.artist || 'G Putnam Music',
          url: track.audio_url,
          moodTheme: { primary: '#2563eb' },
          meta: {
            tv_network: track.tv_network,
            tv_show: track.tv_show,
            gpmcc_sfw: track.gpmcc_sfw,
            lemon_squeezy_url: track.lemon_squeezy_url,
            composition_story: track.composition_story,
            sync_tier: track.sync_tier,
          },
        },
      })
    );
  };

  return (
    <main className="min-h-screen flex flex-col text-white bg-black">
      <Header />

      {/* Hero */}
      <section className="relative w-full bg-gradient-to-b from-[#0a1628] via-[#0f1f40] to-black border-b border-blue-900/30 py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-800/10 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
            <BadgeCheck className="w-3 h-3 text-blue-400" />
            GPMCC · Commercial Catalog — SFW Certified
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            The GPMCC<br />
            <span className="text-blue-400">Commercial Catalog</span>
          </h1>

          <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
            Every track in this catalog is GPMCC SFW certified — cleared for boardrooms,
            executive presentations, client pitches, and broadcast-ready commercial use.
            No surprises. No explicit content. Pure professional-grade music.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-blue-300/80 uppercase tracking-widest">
            {['SFW Certified', 'Broadcast Ready', 'Sync Licensed', 'One-Time Purchase'].map((label) => (
              <span key={label} className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white/70 leading-relaxed max-w-xl mx-auto">
            <Briefcase className="w-4 h-4 text-blue-400 mx-auto mb-2" />
            <p>
              GPMCC SFW certification means every track has been reviewed and cleared for
              executive-safe, workplace-safe presentation. Ideal for corporate environments,
              branded video, and leadership-level communications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href="#catalog"
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-wider text-base hover:bg-blue-500 transition-colors shadow-2xl shadow-blue-900/60"
            >
              Browse SFW Catalog ↓
            </a>
            <a
              href="/scherer"
              className="bg-white/10 border border-white/20 text-white px-10 py-4 rounded-full font-black uppercase tracking-wider text-base hover:bg-white/15 transition-colors"
            >
              MSJ Anthology →
            </a>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="relative flex-1 max-w-5xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-200">
            <BadgeCheck className="w-4 h-4" />
            GPMCC SFW · Certified Commercial Tracks
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            SFW Certified Tracks
          </h2>
          <p className="text-sm text-neutral-300 max-w-3xl">
            All tracks below carry GPMCC SFW certification. One-time master purchase for
            professional use. Broadcast-ready WAV/AIFF, stems where available, cue sheets on request.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 text-sm space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Commercial &amp; Corporate Use
            </h3>
            <p>
              One-time master purchase for professional use. Ideal for TV promos, executive decks,
              on-air branding, and production environments that need instant credibility.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 text-sm space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              GPMCC SFW Guarantee
            </h3>
            <p>
              No explicit language, no surprise content. Every track in this catalog is reviewed,
              cleared, and certified safe for boardrooms, pitches, and leadership communications.
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-neutral-400 py-8">Loading GPMCC SFW catalog…</p>
        )}

        {!loading && tracks.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-8 text-center space-y-3">
            <Music2 className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-sm text-neutral-400">
              No SFW-certified tracks are registered yet. Once tracks are tagged{' '}
              <code className="text-blue-300">gpmcc_sfw = true</code> in Supabase, they will
              appear here automatically.
            </p>
          </div>
        )}

        {tracks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">SFW Certified Tracks</h3>
              <span className="text-xs text-neutral-400">
                {tracks.length} track{tracks.length !== 1 ? 's' : ''} certified
              </span>
            </div>

            <div className="space-y-3">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-white/10 bg-neutral-900/60 px-4 py-3"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlay(track)}
                        className="text-sm font-semibold hover:underline text-left"
                      >
                        {track.title || 'Untitled Track'}
                      </button>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        <BadgeCheck className="w-3 h-3" />
                        SFW
                      </span>
                    </div>
                    {track.artist && (
                      <p className="text-xs text-neutral-400">{track.artist}</p>
                    )}
                    {track.tv_network && track.tv_show && (
                      <p className="text-xs text-neutral-400">
                        {track.tv_network} · {track.tv_show}
                        {track.tv_region ? ` · ${track.tv_region}` : ''}
                      </p>
                    )}
                    {track.tv_spot_description && (
                      <p className="text-[11px] text-neutral-400">{track.tv_spot_description}</p>
                    )}
                    {track.composition_story && (
                      <p className="text-[11px] text-neutral-300 line-clamp-2">{track.composition_story}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-1">
                    {track.sync_tier && (
                      <span className="text-[11px] text-neutral-400">{track.sync_tier}</span>
                    )}
                    {track.lemon_squeezy_url && (
                      <a
                        href={track.lemon_squeezy_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500 transition"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        License this track
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <GlobalPlayer />
      <Footer />
    </main>
  );
}
