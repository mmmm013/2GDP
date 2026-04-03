'use client';

import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import { Bot, Tv, BadgeCheck, ShoppingCart } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface SchererTrack {
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

export default function SchererPage() {
  const [tracks, setTracks] = useState<SchererTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      const { data, error } = await supabase
        .from('msj_tv_thoroughbreds')
        .select('*')
        .not('audio_url', 'is', null)
        .limit(10);

      if (error) {
        console.error('[MSJ-BOT] Error loading Scherer tracks', error);
      } else {
        setTracks(data as SchererTrack[]);
      }
      setLoading(false);
    };

    loadTracks();
  }, []);

  const handlePlay = (track: SchererTrack) => {
    if (!track.audio_url) return;

    const playEvent = new CustomEvent('play-track', {
      detail: {
        title: track.title || 'Unknown Track',
        artist: track.artist || 'Michael Scherer',
        url: track.audio_url,
        moodTheme: { primary: '#8B4513' },
        meta: {
          tv_network: track.tv_network,
          tv_show: track.tv_show,
          gpmcc_sfw: track.gpmcc_sfw,
          lemon_squeezy_url: track.lemon_squeezy_url,
          composition_story: track.composition_story,
          sync_tier: track.sync_tier,
        },
      },
    });

    window.dispatchEvent(playEvent);
  };

  return (
    <main className="min-h-screen flex flex-col text-white bg-black">
      <Header />

      <section className="relative flex-1 max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Product description */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-600/20 px-3 py-1 text-xs font-semibold text-amber-200">
            <Bot className="w-4 h-4" />
            MSJ-BOT · Librarian of the TV Assets
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            The MSJ Anthology: TV Sync &amp; Beyond
          </h1>
          <p className="text-sm text-neutral-300 max-w-3xl">
            Go beyond the genre. This collection features the definitive Michael Scherer catalog,
            including 5 Thoroughbreds currently featured on national U.S. television. Curated by
            the MSJ-BOT, this set delivers more than just Jazz—it provides a sophisticated,
            high-fidelity atmosphere for professional environments, creative synchronization, and
            deep focus. From broadcast-ready masters to situational &quot;Blasts,&quot; this is the sound of
            verified success. Slick. Certain. Sovereign.
          </p>
        </div>

        {/* Sync terms / SFW */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 text-sm space-y-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Tv className="w-4 h-4" />
              Professional Sync &amp; Utility
            </h2>
            <p>
              One-time master purchase for professional use. Broadcast-ready WAV/AIFF, stems where
              available, cue sheets on request.
            </p>
            <p>
              Ideal for TV promos, trailers, on-air branding, executive decks, and production
              environments that need instant credibility.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 text-sm space-y-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              GPMCC SFW Certified
            </h2>
            <p>
              All tracks in this Anthology are cleared for executive-safe, workplace-safe
              presentation. No explicit language, no surprise content swings.
            </p>
            <p>
              Perfect for boardrooms, client pitches, and leadership-level communications.
            </p>
          </div>
        </div>

        {/* Track list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Featured TV Thoroughbreds</h2>
            <span className="text-xs text-neutral-400">
              Curated by MSJ-BOT · {tracks.length} active TV assets
            </span>
          </div>

          {loading && (
            <p className="text-sm text-neutral-400">
              MSJ-BOT is fetching the current TV placements…
            </p>
          )}

          {!loading && tracks.length === 0 && (
            <p className="text-sm text-neutral-400">
              No Scherer TV assets are registered yet. Once the 5 Thoroughbreds are tagged in
              Supabase, they will appear here automatically.
            </p>
          )}

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
                      className="text-sm font-semibold hover:underline"
                    >
                      {track.title || 'Untitled Track'}
                    </button>
                    {track.gpmcc_sfw && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        <BadgeCheck className="w-3 h-3" />
                        SFW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">
                    {track.tv_network && track.tv_show
                      ? `Currently featured on ${track.tv_network} · ${track.tv_show}${
                          track.tv_region ? ` · ${track.tv_region}` : ''
                        }`
                      : 'TV sync-ready asset'}
                  </p>
                  {track.tv_spot_description && (
                    <p className="text-[11px] text-neutral-400">
                      {track.tv_spot_description}
                    </p>
                  )}
                  {track.composition_story && (
                    <p className="text-[11px] text-neutral-300 line-clamp-2">
                      {track.composition_story}
                    </p>
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
                      className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black hover:bg-amber-400 transition"
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
      </section>

      {/* MSJ EMERGENCY SUPPORT SPOTLIGHT */}
      <section className="w-full bg-gradient-to-r from-red-950 to-zinc-900 border-t border-red-800/30 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400 mb-2">Artist Support</p>
          <h2 className="text-3xl font-black text-white mb-3">Michael Is Fighting Hard.</h2>
          <p className="text-base text-white/70 leading-relaxed mb-6 max-w-xl mx-auto">
            40+ TV placements. A catalog built over decades. Right now, Michael Scherer is facing
            serious personal hardship. Every stream, every share, every dollar of support goes
            directly toward keeping this music — and this artist — standing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/gift"
              className="bg-red-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-wider hover:bg-red-500 transition-colors shadow-xl"
            >
              ❤️ Support Michael Now
            </a>
            <a
              href="/join"
              className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-full font-black uppercase tracking-wider hover:bg-white/20 transition-colors"
            >
              Join as a KUB →
            </a>
          </div>
        </div>
      </section>

      <GlobalPlayer />
      <Footer />
    </main>
  );
}
