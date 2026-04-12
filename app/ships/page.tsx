'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';

export default function Ships() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B]">
      <Header />
      <div className="p-8 text-center">
        <h1 className="text-4xl font-black uppercase text-[#8B4513]">SHIPS Engine</h1>
        <p className="opacity-60 mt-4">Sponsorship & Mood Matching Platform</p>
      </div>
      <Footer />
      <GlobalPlayer />
    </main>
  );
}
