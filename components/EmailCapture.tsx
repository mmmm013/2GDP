'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

/**
 * EMAIL CAPTURE — Streamer Acquisition Engine
 * Lightweight email signup for free listeners
 * Stores to Supabase 'email_subscribers' table
 * GPM branded, mobile-first, integrated into homepage
 */
export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      // Check for duplicate
      const { data: existing } = await supabase
        .from('email_subscribers')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        setStatus('success');
        return; // Already subscribed, show success silently
      }

      const { error } = await supabase
        .from('email_subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          source: 'homepage',
          subscribed_at: new Date().toISOString(),
        });

      if (error) throw error;
      setStatus('success');
      setEmail('');
    } catch {
      setErrorMsg('Something went wrong. Try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="bg-gradient-to-b from-neutral-950 to-black py-12 px-4 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-green-400 mb-3">
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-bold">You're in.</span>
          </div>
          <p className="text-white/50 text-sm">
            Welcome to the GPM community. Fresh drops and exclusive streams heading your way.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-neutral-950 to-black py-12 px-4 border-t border-white/5">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-[#C8A882]" />
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Get Free Drops & Exclusive Streams
          </h3>
        </div>
        <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
          Join 1,000+ GPMC tracks. Be first to hear new releases, get free downloads, and unlock early access.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#C8A882]/60 focus:ring-1 focus:ring-[#C8A882]/30 transition"
            disabled={status === 'loading'}
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-[#C8A882] text-black font-bold text-sm tracking-wider rounded-full hover:bg-[#d4b896] transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'STREAM FREE'
            )}
          </button>
        </form>
        {status === 'error' && errorMsg && (
          <p className="text-red-400 text-xs mt-3">{errorMsg}</p>
        )}
        <p className="text-white/20 text-[10px] mt-4">
          No spam. Unsubscribe anytime. 100% human created.
        </p>
      </div>
    </section>
  );
}
