'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';

export default function Artists() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B]">
      <Header />
      <div className="p-8 text-center space-y-4">
        <h1 className="text-4xl font-black uppercase text-[#8B4513]">GPM Artists</h1>
        <p className="opacity-60">The roster is loading...</p>
        <div className="grid gap-4 md:grid-cols-2 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#3E2723]/10">
            <h2 className="font-bold text-xl">Michael Scherer</h2>
            <p className="text-xs uppercase opacity-50">Jazz Master</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#3E2723]/10">
            <h2 className="font-bold text-xl">Kleigh</h2>
            <p className="text-xs uppercase opacity-50">Pop / Avant-Garde</p>
          </div>
        </div>
      </div>
      <Footer />
      <GlobalPlayer />
    </main>
  );
}
