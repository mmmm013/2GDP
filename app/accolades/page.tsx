import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';

export default function AccoladesPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B]">
      <Header />
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase text-[#8B4513] mb-8 tracking-tighter">
          Accolades
        </h1>
        <p className="text-xl font-serif italic text-[#5D4037]/80 mb-12 leading-relaxed">
          Recognition, placements, and milestones of G Putnam Music.
        </p>
        <p className="opacity-50 text-sm uppercase tracking-widest">Coming soon — stay tuned.</p>
      </section>
      <Footer />
      <GlobalPlayer />
    </main>
  );
}
