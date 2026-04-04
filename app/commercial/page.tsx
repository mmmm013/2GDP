'use client';

/**
 * /commercial — GPMCC SFW Certification Catalog
 *
 * GPMCC (G Putnam Music Commercial Catalog) — the commercially cleared,
 * safe-for-work certified tier of the GPM catalog.
 *
 * Queries `msj_tv_thoroughbreds` for all tracks with `gpmcc_sfw = true`
 * and presents them for executive/commercial licensing.
 */

import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import Link from 'next/link';
import { BadgeCheck, Tv, ShoppingCart, Play, Building2, Briefcase, ExternalLink } from 'lucide-react';

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
        .not('audio_url', 'is', null);

      if (error) {
        console.error('[GPMCC] Error loading SFW catalog', error);
      } else {
        setTracks((data as CommercialTrack[]) ?? []);
      }
      setLoading(false);
    };

    loadTracks();
  }, []);

  const handlePlay = (track: CommercialTrack) => {
    if (!track.audio_url) return;
    const playEvent = new CustomEvent('play-track', {
      detail: {
        title: track.title || 'Unknown Track',
        artist: track.artist || 'Michael Scherer',
        url: track.audio_url,
        moodTheme: { primary: '#1d4ed8' },
        meta: {
          tv_network: track.tv_network,
          tv_show: track.tv_show,
          gpmcc_sfw: track.gpmcc_sfw,
          lemon_squeezy_url: track.lemon_squeezy_url,
          sync_tier: track.sync_tier,
        },
      },
    });
    window.dispatchEvent(playEvent);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#0a0f1e] text-white">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="w-full border-b border-blue-900/40 bg-gradient-to-b from-[#0d1533] to-[#0a0f1e] py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* GPMCC badge row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 px-3 py-1 text-xs font-black tracking-widest text-blue-300 uppercase">
              <BadgeCheck className="w-3.5 h-3.5" />
              GPMCC SFW Certified
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white/50 uppercase">
              <Building2 className="w-3 h-3" />
              Commercial Catalog
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            GPMCC — Commercial Catalog
          </h1>

          <p className="text-base text-neutral-300 max-w-3xl leading-relaxed">
            The <strong className="text-white">GPMCC SFW</strong> (Safe-For-Work) certification marks tracks
            cleared for executive-level commercial deployment. No explicit language, no unexpected content
            transitions — every asset in this catalog is boardroom-safe, broadcast-ready, and approved
            for professional environments.
          </p>

          {/* What GPMCC SFW means */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-semibold">Boardroom Safe</h3>
              <p className="text-xs text-neutral-400">Cleared for executive pitches, client decks, and leadership-level presentations.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
              <Tv className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-semibold">Broadcast Ready</h3>
              <p className="text-xs text-neutral-400">Masters available in broadcast-spec WAV/AIFF with cue sheets on request.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-semibold">One-Time License</h3>
              <p className="text-xs text-neutral-400">Single master purchase for professional use. No recurring fees, no surprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRACK LIST ───────────────────────────────────────────────────── */}
      <section className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">
            SFW Certified Tracks
          </h2>
          <Link
            href="/scherer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold tracking-wider uppercase transition-colors"
          >
            Full MSJ Anthology <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-neutral-400">Loading GPMCC certified catalog…</p>
        )}

        {!loading && tracks.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center space-y-2">
            <BadgeCheck className="w-8 h-8 text-blue-400/50 mx-auto" />
            <p className="text-sm text-neutral-400 font-semibold">No GPMCC SFW tracks registered yet.</p>
            <p className="text-xs text-neutral-500">
              Once tracks are tagged <code className="bg-white/10 px-1 rounded">gpmcc_sfw = true</code> in Supabase they will appear here automatically.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex flex-col md:flex-row md:items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-4 hover:border-blue-500/30 transition-colors"
            >
              {/* Play button */}
              <button
                onClick={() => handlePlay(track)}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-500/20 hover:bg-blue-500/40 flex items-center justify-center transition-colors"
                aria-label={`Play ${track.title}`}
              >
                <Play className="w-4 h-4 text-blue-300 ml-0.5" />
              </button>

              {/* Track info */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold truncate">{track.title || 'Untitled Track'}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-black text-blue-300 border border-blue-400/20">
                    <BadgeCheck className="w-3 h-3" />
                    GPMCC SFW
                  </span>
                  {track.sync_tier && (
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase">{track.sync_tier}</span>
                  )}
                </div>

                {track.tv_network && track.tv_show ? (
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <Tv className="w-3 h-3 flex-shrink-0" />
                    {track.tv_network} · {track.tv_show}
                    {track.tv_region ? ` · ${track.tv_region}` : ''}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-500">TV sync-ready · Commercial use cleared</p>
                )}

                {track.tv_spot_description && (
                  <p className="text-[11px] text-neutral-500">{track.tv_spot_description}</p>
                )}
                {track.composition_story && (
                  <p className="text-[11px] text-neutral-400 line-clamp-2">{track.composition_story}</p>
                )}
              </div>

              {/* CTA */}
              {track.lemon_squeezy_url && (
                <a
                  href={track.lemon_squeezy_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-500 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  License
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────────────── */}
      <section className="w-full bg-gradient-to-r from-blue-950 to-[#0a0f1e] border-t border-blue-900/30 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
            GPMCC · G Putnam Music Commercial Catalog
          </p>
          <h2 className="text-2xl font-black text-white">
            Need a custom license or stems?
          </h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-xl mx-auto">
            Reach out via the contact page for broadcast-spec WAV, stems, cue sheets, or bulk licensing.
            The full Michael Scherer anthology — including TV Thoroughbreds — is available for professional sync.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-wider hover:bg-blue-500 transition-colors"
            >
              Contact for Licensing
            </Link>
            <Link
              href="/scherer"
              className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-full font-black uppercase tracking-wider hover:bg-white/20 transition-colors"
            >
              Full MSJ Anthology →
            </Link>
          </div>
        </div>
      </section>

      <GlobalPlayer />
      <Footer />
    </main>
  );
}
