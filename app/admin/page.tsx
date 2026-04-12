import AdminUpload from '@/components/AdminUpload';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#2d1b18] p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center py-6 border-b border-white/10 mb-8">
          <h1 className="text-xl font-bold text-white tracking-widest">GPM <span className="text-[#FFD54F]">COMMAND</span></h1>
          <Link href="/" className="text-xs text-[#FFD54F] hover:underline opacity-50 hover:opacity-100">← Back to Flagship</Link>
        </div>
        
        <AdminUpload />

        <div className="mt-8 border-t border-white/10 pt-6">
          <h2 className="text-xs font-bold text-[#FFD54F] tracking-widest mb-3">DMAIC CONTROL</h2>
          <Link
            href="/admin/audio-health"
            className="inline-block text-xs text-white/70 hover:text-[#FFD54F] border border-white/10 hover:border-[#FFD54F]/40 rounded px-4 py-2 transition-colors"
          >
            📊 Audio Health Dashboard →
          </Link>
        </div>

        <div className="mt-8 text-center text-white/20 text-xs font-mono">
          System Authority: G. Putnam & M. Clay<br/>
          Six Sigma Control Active
        </div>
      </div>
    </main>
  );
}
