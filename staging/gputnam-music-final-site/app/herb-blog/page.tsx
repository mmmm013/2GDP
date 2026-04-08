/**
 * /herb-blog — PIXIE's PIX
 * Public page: herbal gardening & nature blog by PIXIE (Herb Blogger)
 * + her curated GPM FP streaming playlist (2hr, her selections).
 *
 * Self-contained for staging/gputnam-music-final-site.
 * Server component: fetches published PIXIE assets from Supabase.
 * Audio served via /api/stream-asset (signed URL — no raw storage paths exposed).
 */
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "PIXIE's PIX | G Putnam Music",
  description:
    "Herbal gardening, nature writing, and PIXIE's curated GPM FP streaming playlist.",
};

// Use canonical env var — no hardcoded project URLs.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

const CATEGORIES = ['All', 'Herb Lore', 'Garden Diary', 'Plant Medicine', 'Nature Notes', 'Seasonal'];

function getSupabase() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!SUPABASE_URL || !key) return null;
  return createClient(SUPABASE_URL, key);
}

interface BlogPost {
  id: string;
  label: string;
  file_url: string;
  uploaded_at: string;
  meta: Record<string, string>;
}

interface PlaylistAsset {
  id: string;
  label: string;
  uploaded_at: string;
}

async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('creator_assets')
    .select('id, label, file_url, uploaded_at, meta')
    .eq('brand', 'PIXIE')
    .eq('scope', 'HERB_BLOG')
    .eq('is_published', true)
    .order('uploaded_at', { ascending: false });
  return (data as BlogPost[]) ?? [];
}

async function fetchPublishedPlaylist(): Promise<PlaylistAsset | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('creator_assets')
    .select('id, label, uploaded_at')
    .eq('brand', 'PIXIE')
    .eq('scope', 'GPM_FP_PLAYLIST')
    .eq('is_published', true)
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .single();
  return (data as PlaylistAsset) ?? null;
}

export default async function HerbBlogPage() {
  const [posts, playlist] = await Promise.all([
    fetchPublishedPosts(),
    fetchPublishedPlaylist(),
  ]);

  return (
    <>
      {/* Minimal header */}
      <header className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-[#C8A882] font-black text-sm tracking-[0.2em] uppercase hover:text-white transition-colors">
          ← G Putnam Music
        </Link>
        <span className="text-white/30 text-xs">🌿 PIXIE&apos;s PIX</span>
      </header>

      <main className="min-h-screen bg-[#1a1207] text-white">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#2d3a1e] to-[#1a1207] py-16 px-4 text-center border-b border-white/10">
          <p className="text-[#a8cc7f] text-xs uppercase tracking-[0.3em] mb-3">by PIXIE · GPM Creator</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            🌿 PIXIE&apos;s PIX
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed mb-5">
            Herbal gardening, the quiet wisdom of growing things, and nature in its truest form.
            Plus PIXIE&apos;s personally curated GPM FP streaming playlist — two hours of hand-picked tracks.
          </p>

          {/* Personal bio */}
          <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-6 py-4 max-w-lg text-left">
            <p className="text-[#a8cc7f] text-xs font-bold uppercase tracking-widest mb-1">About PIXIE</p>
            <p className="text-white/60 text-sm leading-relaxed">
              PIXIE — the herb blogger of the GPMC family — tends herbs, follows seasons, and writes about the living world
              with the same precision she brings to music curation. Every post here is her own hand.
            </p>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/40 hover:text-[#a8cc7f] hover:border-[#a8cc7f]/30 cursor-pointer transition-all"
              >
                {cat}
              </span>
            ))}
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* GPM FP Playlist */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-[#FFD54F] mb-4 flex items-center gap-2">
              🎵 PIXIE&apos;s GPM FP Playlist
            </h2>

            {playlist ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-[#a8cc7f] font-semibold mb-1">{playlist.label}</p>
                <p className="text-white/40 text-xs mb-4">
                  Last updated {new Date(playlist.uploaded_at).toLocaleDateString()}
                </p>
                <p className="text-white/40 text-xs mb-3">
                  2-hour curated stream — PIXIE&apos;s personal selections.
                </p>
                <audio
                  controls
                  src={`/api/stream-asset?id=${playlist.id}`}
                  className="w-full rounded-lg"
                  style={{ accentColor: '#a8cc7f' }}
                />
              </div>
            ) : (
              <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                <p className="text-white/30 text-sm">PIXIE&apos;s playlist is coming soon…</p>
              </div>
            )}
          </section>

          {/* Blog Posts */}
          <section>
            <h2 className="text-xl font-bold text-[#a8cc7f] mb-6 flex items-center gap-2">
              🌱 From the Garden
            </h2>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/20 text-sm">The first post is sprouting… check back soon.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>

          {/* DMAIC Feedback */}
          <section className="mt-14 mb-4">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-2">🔄 DMAIC · Continuous Improvement</p>
              <p className="text-white/50 text-sm mb-4 max-w-md mx-auto">
                We improve PIXIE&apos;s PIX based on what you find useful. Share what you&apos;d love to see more of.
              </p>
              <a
                href="mailto:feedback@gputnammusic.com?subject=PIXIE%27s%20PIX%20feedback"
                className="inline-block px-6 py-2 rounded-lg bg-[#a8cc7f]/10 border border-[#a8cc7f]/20 text-[#a8cc7f] text-sm font-semibold hover:bg-[#a8cc7f]/20 transition-all"
              >
                📬 Share your thoughts
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 px-4 py-6 text-center text-white/20 text-xs">
        © G Putnam Music · All rights reserved
      </footer>
    </>
  );
}

// Blog card (fetches text content from storage URL)
async function BlogCard({ post }: { post: BlogPost }) {
  let content = '';
  try {
    const res = await fetch(post.file_url, { next: { revalidate: 300 } });
    if (res.ok) {
      const raw = await res.text();
      try {
        const parsed = JSON.parse(raw) as { title: string; content: string };
        content = parsed.content;
      } catch {
        content = raw;
      }
    }
  } catch {
    content = '';
  }

  return (
    <article className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
      <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
        🌿 {new Date(post.uploaded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <h3 className="text-lg font-bold text-[#a8cc7f] mb-3">{post.label}</h3>
      {content ? (
        <p className="text-white/60 leading-relaxed whitespace-pre-wrap text-sm">{content}</p>
      ) : (
        <p className="text-white/30 text-sm italic">Content loading…</p>
      )}
    </article>
  );
}
