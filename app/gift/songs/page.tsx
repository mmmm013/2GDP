'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'

interface Track {
  id: string
  title: string
  artist: string
  image?: string
  duration?: number
}

export default function GiftSongsPage() {
  const searchParams = useSearchParams()
  const trackId = searchParams.get('track') ?? ''
  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(!!trackId)

  useEffect(() => {
    if (!trackId) return
    supabase
      .from('gpm_tracks')
      .select('id, title, artist, image, duration')
      .eq('id', trackId)
      .single()
      .then(({ data }) => {
        setTrack(data ?? null)
        setLoading(false)
      })
  }, [trackId])

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />

      <section className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        {/* Badge */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
            K-KUT · Song
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#C8A882]">Your Sound</h1>
          <p className="mt-3 text-white/50 max-w-sm mx-auto text-sm">
            Someone sent you a K-KUT — a curated Sweet Spot from a G Putnam Music track.
          </p>
        </div>

        {/* Track card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          {loading ? (
            <p className="text-white/40 text-sm py-8 animate-pulse">Loading track…</p>
          ) : track ? (
            <>
              {track.image ? (
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-5 shadow-lg shadow-amber-500/20"
                />
              ) : (
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-amber-500/25">
                  ♪
                </div>
              )}
              <h2 className="text-2xl font-bold text-white mb-1">{track.title}</h2>
              <p className="text-amber-400 font-medium mb-4">{track.artist}</p>
              {track.duration && (
                <p className="text-white/30 text-xs mb-4">
                  {Math.floor(track.duration / 60000)}:{String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0')}
                </p>
              )}
              <p className="text-white/50 text-sm">Your K-KUT excerpt will play once the Sweet Spot is activated.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-amber-500/25">
                ♪
              </div>
              <p className="text-white/60 text-sm mb-6">
                Your K-KUT is loading its Sweet Spot. The excerpt will play here once the track is activated.
              </p>
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse" />
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/kupid"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Get Your Own K-KUT
          </Link>
          <Link
            href="/kleigh"
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            Live Audio Vault
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
