/**
 * /herb-blog — PIXIE's PIX
 * Public page: herbal gardening & nature blog by PIXIE (Jane Burton)
 * + her curated GPM FP streaming playlist (2hr, her selections).
 *
 * Server component: fetches published PIXIE assets from Supabase.
 */
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PIXIE's PIX | G Putnam Music",
  description: "Herbal gardening, nature writing, and PIXIE's curated GPM FP streaming playlist — by Jane Burton.",
};

// Server-side anon read (matches RLS: brand='PIXIE' AND is_published=true)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
  file_url: string;
  uploaded_at: string;
}

async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const supabase = getSupabase();
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
  const { data } = await supabase
    .from('creator_assets')
    .select('id, label, file_url, uploaded_at')
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
      <Header />

      <main className="min-h-screen bg-[#1a1207] text-white">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#2d3a1e] to-[#1a1207] py-16 px-4 text-center border-b border-white/10">
          <p className="text-[#a8cc7f] text-xs uppercase tracking-[0.3em] mb-3">by Jane Burton</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            🌿 PIXIE&apos;s PIX
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            Herbal gardening, nature, and the quiet wisdom of growing things.
            Plus PIXIE&apos;s personally curated GPM FP streaming playlist — two hours of hand-picked tracks.
          </p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* ── GPM FP Playlist ── */}
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
                <PlaylistPlayer fileUrl={playlist.file_url} />
              </div>
            ) : (
              <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                <p className="text-white/30 text-sm">PIXIE&apos;s playlist is coming soon…</p>
              </div>
            )}
          </section>

          {/* ── Blog Posts ── */}
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
        </div>
      </main>

      <Footer />
    </>
  );
}

// ----------------------------------------------------------------
// Blog card (fetches text content from storage URL)
// ----------------------------------------------------------------
async function BlogCard({ post }: { post: BlogPost }) {
  let content = '';
  try {
    const res = await fetch(post.file_url, { next: { revalidate: 300 } });
    if (res.ok) {
      const raw = await res.text();
      // Posts are stored as JSON: { title, content }
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

// ----------------------------------------------------------------
// Playlist player: delegates to client component for dynamic loading
// ----------------------------------------------------------------
import PixiePlaylistViewerClient from './PixiePlaylistViewerClient';

function PlaylistPlayer({ fileUrl }: { fileUrl: string }) {
  return (
    <div className="space-y-2">
      <p className="text-white/40 text-xs mb-3">
        2-hour curated stream — PIXIE&apos;s personal selections.
      </p>
      <PixiePlaylistViewerClient fileUrl={fileUrl} />
    </div>
  );
}