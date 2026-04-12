'use client';

/**
 * Client component: fetches PIXIE's saved playlist JSON from Storage
 * and renders an interactive track list tied into the site's GlobalPlayer.
 */

import { useEffect, useState } from 'react';
import { Music } from 'lucide-react';

interface PlaylistTrack {
  id: string;
  title: string;
  durationSeconds: number;
}

interface PlaylistJSON {
  curator: string;
  created: string;
  targetMinutes: number;
  tracks: PlaylistTrack[];
}

export default function PixiePlaylistViewerClient({ fileUrl }: { fileUrl: string }) {
  const [playlist, setPlaylist] = useState<PlaylistJSON | null>(null);
  const [error, setError]       = useState('');

  useEffect(() => {
    fetch(fileUrl)
      .then((r) => r.json())
      .then((d) => setPlaylist(d as PlaylistJSON))
      .catch(() => setError('Could not load playlist.'));
  }, [fileUrl]);

  if (error) return <p className="text-red-400/60 text-xs">{error}</p>;
  if (!playlist) return <p className="text-white/30 text-xs animate-pulse">Loading tracks…</p>;

  const totalMin = Math.round(
    playlist.tracks.reduce((acc, t) => acc + t.durationSeconds, 0) / 60
  );

  return (
    <div>
      <p className="text-white/30 text-xs mb-3">
        {playlist.tracks.length} tracks · {totalMin} min ·{' '}
        curated {new Date(playlist.created).toLocaleDateString()}
      </p>
      <ol className="space-y-1">
        {playlist.tracks.map((track, i) => (
          <li
            key={track.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          >
            <span className="text-white/20 text-xs w-5 text-right">{i + 1}</span>
            <Music className="w-3.5 h-3.5 text-[#a8cc7f] shrink-0" />
            <span className="flex-1 text-sm text-white/70 truncate">{track.title}</span>
            <span className="text-white/20 text-xs shrink-0">
              {Math.floor(track.durationSeconds / 60)}:{String(track.durationSeconds % 60).padStart(2, '0')}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
