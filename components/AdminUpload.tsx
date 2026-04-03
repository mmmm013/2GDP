"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Upload, Music, Mic2, Save, Users } from 'lucide-react';

export default function AdminUpload() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [vocalist, setVocalist] = useState('KLEIGH'); // Default
  const [bpm, setBpm] = useState('');
  const [context, setContext] = useState('Run'); 
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file || !title) {
      setMessage('Error: Missing File or Title');
      return;
    }
    setLoading(true);
    setMessage('Uploading Audio Asset...');
    const supabase = createClient();
    try {
      // 1. Upload File to Storage
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_').toLowerCase()}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('songs')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('songs')
        .getPublicUrl(filename);

      // 3. Register Asset in Database
      setMessage('Registering Metadata...');
      const { error: dbError } = await supabase
        .from('songs')
        .insert({
          title: title,
          artist: vocalist, 
          bpm: parseInt(bpm) || 0,
          functional_contexts: [context.toLowerCase()],
          audio_url: publicUrl,
          patent_license_tier: 'standard_sync'
        });

      if (dbError) throw dbError;

      setMessage(`SUCCESS: ${title} by ${vocalist} is Live.`);
      setTitle('');
      setFile(null);
    } catch (error: any) {
      setMessage(`FAILED: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1a100e] border border-[#FFD54F]/20 p-8 rounded-xl mt-10 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#FFD54F] flex items-center gap-2">
          <Upload /> GPM Ingestion
        </h2>
        <span className="text-xs text-white/30 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
          Auth: Michael Clay / GP
        </span>
      </div>

      <div className="space-y-4">
        
        {/* Row 1: Title & Vocalist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase text-white/50 mb-1">Track Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/10 p-3 rounded text-[#D7CCC8] focus:border-[#FFD54F] outline-none"
              placeholder="Track Name"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-white/50 mb-1">Vocalist (Roster)</label>
            <div className="relative">
              <Users size={16} className="absolute left-3 top-3.5 text-white/30"/>
              <select 
                value={vocalist}
                onChange={(e) => setVocalist(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-3 pl-10 rounded text-[#D7CCC8] appearance-none"
              >
                <option value="KLEIGH">KLEIGH</option>
                <option value="Michael Clay">Michael Clay (Instro)</option>
                <option value="Michael Scherer">Michael Scherer</option>
                <option value="Wounded & Willing">Wounded & Willing</option>
              <option value="Elliot Sedgwick">Elliot Sedgwick</option>
              <option value="Ashleigh Brucker">Ashleigh Brucker</option>
              <option value="Cindy Youngren">Cindy Youngren</option>
              <option value="NATU Visinia">NATU Visinia</option>
              <option value="Elle Christine">Elle Christine</option>
              <option value="Emily Hope">Emily Hope</option>
              <option value="Clayton Michael Gunn">Clayton Michael Gunn</option>
              <option value="Lilli O'Dowd">Lilli O&apos;Dowd</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: BPM & Context */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase text-white/50 mb-1">BPM</label>
            <input 
              type="number" 
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 p-3 rounded text-[#D7CCC8]"
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-white/50 mb-1">Feeling Box</label>
            <select 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full bg-black/40 border border-white/10 p-3 rounded text-[#D7CCC8]"
            >
              <option>Run</option>
              <option>Focus</option>
              <option>Party</option>
              <option>Sexy</option>
              <option>Bot</option>
              <option>Human</option>
            </select>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-[#FFD54F]/50 transition-colors bg-black/20">
          <input 
            type="file" 
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden" 
            id="audio-upload"
          />
          <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <Music className="text-white/30" size={32} />
            <span className="text-sm text-[#FFD54F] font-bold">
              {file ? file.name : "Click to Select Audio File"}
            </span>
            <span className="text-xs text-white/40">MP3 / WAV • Auto-renaming active</span>
          </label>
        </div>

        {/* Submit */}
        <button 
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-[#FFD54F] text-[#3E2723] font-bold py-4 rounded hover:bg-[#FFCA28] transition-colors flex justify-center gap-2 items-center shadow-lg"
        >
          {loading ? "Ingesting..." : <><Save size={18}/> PUBLISH TO DATABASE</>}
        </button>

        {/* Log */}
        {message && (
          <div className="p-3 bg-black/50 text-xs font-mono text-center text-white/70 rounded border border-white/5">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
