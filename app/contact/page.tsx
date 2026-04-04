'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Status = 'idle' | 'sending' | 'ok' | 'error';

const SUBJECTS = [
  'Sync Licensing Inquiry',
  'General Question',
  'Press / Media',
  'Collaboration',
  'Sponsorship (KUB / KEZ)',
  'Other',
];

export default function ContactPage() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<Status>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrMsg('');
    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, subject, message }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? 'Something went wrong');
      setStatus('ok');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send';
      setErrMsg(msg);
      setStatus('error');
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-amber-400 pt-24 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Contact G Putnam Music</h1>
          <p className="text-amber-200 mb-8">
            Reach out for licensing, collaboration, press inquiries, or general questions.
          </p>

          {status === 'ok' ? (
            <div className="bg-green-950/60 border border-green-700/50 rounded-xl p-8 text-center space-y-3">
              <div className="text-4xl">✅</div>
              <p className="text-green-300 font-semibold text-lg">Message received!</p>
              <p className="text-green-200 text-sm">
                We&apos;ll follow up at <strong>{email}</strong> soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-900 border border-amber-800/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-amber-800/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-300 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-gray-900 border border-amber-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                >
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-300 mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-gray-900 border border-amber-800/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="Tell us what's on your mind…"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm">{errMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-full transition-colors"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              <p className="text-center text-gray-500 text-xs mt-2">
                Or email directly:{' '}
                <a href="mailto:Gputnam@gputnammusic.com" className="text-amber-600 underline">
                  Gputnam@gputnammusic.com
                </a>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

