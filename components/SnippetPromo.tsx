'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// SNIPPET PROMOTIONAL PRICING
const SNIPPET_TIERS = {
  FREE: {
    name: 'Free Snippet Upload',
    price: 0,
    tracks: 1,
    description: 'Try it FREE - Upload 1 snippet to showcase your music!',
    cta: 'Get Started FREE'
  },
  THREE_PACK: {
    name: '3-Pack Bundle',
    price: 1499, // $14.99 in cents
    tracks: 3,
    description: 'Best Value! Upload 3 snippets + Featured Placement',
    cta: 'Get 3-Pack - $14.99',
    savings: '$5 OFF'
  },
  FOUR_TP: {
    name: '4TP - Four Track Power Pack',
    price: 1999, // $19.99 in cents
    tracks: 4,
    description: 'Pro Tier: 4 snippets + Priority Featured Rotation',
    cta: 'Get 4TP - $19.99',
    savings: '$10 OFF',
    badge: 'RESTORED PROMO'
  }
};

export default function SnippetPromo() {
  const [selectedTier, setSelectedTier] = useState<keyof typeof SNIPPET_TIERS>('FREE');
  const [userEmail, setUserEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showUpsell, setShowUpsell] = useState(false);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleFreeSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail) {
      setUploadStatus('Please enter your email');
      return;
    }

    setUploading(true);
    setUploadStatus('Processing your FREE snippet...');

    try {
      // Record FREE snippet claim
      const { error } = await supabase
        .from('gpmd_snippet_purchases')
        .insert({
          customer_email: userEmail,
          amount_cents: 0,
          status: 'completed'
        });

      if (error) throw error;

      setUploadStatus('Success! Check your email for upload instructions.');
      setShowUpsell(true); // Show 3-pack upsell
    } catch (error: any) {
      setUploadStatus(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePurchase = async (tier: keyof typeof SNIPPET_TIERS) => {
    const tierData = SNIPPET_TIERS[tier];
    
    setUploading(true);
    setUploadStatus(`Redirecting to checkout for ${tierData.name}...`);

    // TODO: Integrate with Stripe checkout
    // For now, just record the intent
    try {
      const { error } = await supabase
        .from('gpmd_snippet_purchases')
        .insert({
          customer_email: userEmail,
          amount_cents: tierData.price,
          status: 'pending'
        });

      if (error) throw error;

      setUploadStatus('Opening checkout...');
      // TODO: Redirect to Stripe
    } catch (error: any) {
      setUploadStatus(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gold-400 text-center mb-4">
        🎵 Snippet Upload - Showcase Your Music!
      </h1>
      <p className="text-center text-gray-300 mb-8">
        Upload short snippets (30-60 seconds) to attract new fans
      </p>

      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* FREE TIER */}
        <div className={`p-6 rounded-lg border-2 ${
          selectedTier === 'FREE' 
            ? 'border-gold-500 bg-black/50' 
            : 'border-gray-700 bg-black/30'
        } hover:border-gold-500/50 transition-all cursor-pointer`}
          onClick={() => setSelectedTier('FREE')}
        >
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm mb-3">
              100% FREE
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">
              {SNIPPET_TIERS.FREE.name}
            </h3>
            <div className="text-4xl font-bold text-gold-400 mb-4">
              FREE
            </div>
            <p className="text-gray-300 text-sm mb-4">
              {SNIPPET_TIERS.FREE.description}
            </p>
            <ul className="text-left text-sm text-gray-400 space-y-2 mb-6">
              <li>✓ 1 Snippet Upload</li>
              <li>✓ Public Showcase</li>
              <li>✓ Basic Analytics</li>
            </ul>
          </div>
        </div>

        {/* 3-PACK TIER */}
        <div className={`p-6 rounded-lg border-2 ${
          selectedTier === 'THREE_PACK' 
            ? 'border-gold-500 bg-black/50' 
            : 'border-gray-700 bg-black/30'
        } hover:border-gold-500/50 transition-all cursor-pointer relative`}
          onClick={() => setSelectedTier('THREE_PACK')}
        >
          <div className="absolute top-0 right-0 bg-gradient-to-r from-gold-500 to-amber-600 text-black px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-bold">
            {SNIPPET_TIERS.THREE_PACK.savings}
          </div>
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm mb-3">
              BEST VALUE
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">
              {SNIPPET_TIERS.THREE_PACK.name}
            </h3>
            <div className="text-4xl font-bold text-gold-400 mb-4">
              $14.99
            </div>
            <p className="text-gray-300 text-sm mb-4">
              {SNIPPET_TIERS.THREE_PACK.description}
            </p>
            <ul className="text-left text-sm text-gray-400 space-y-2 mb-6">
              <li>✓ 3 Snippet Uploads</li>
              <li>✓ Featured Placement</li>
              <li>✓ Advanced Analytics</li>
              <li>✓ Priority Support</li>
            </ul>
          </div>
        </div>

        {/* 4TP TIER (RESTORED) */}
        <div className={`p-6 rounded-lg border-2 ${
          selectedTier === 'FOUR_TP' 
            ? 'border-gold-500 bg-black/50' 
            : 'border-gray-700 bg-black/30'
        } hover:border-gold-500/50 transition-all cursor-pointer relative`}
          onClick={() => setSelectedTier('FOUR_TP')}
        >
          <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-bold">
            {SNIPPET_TIERS.FOUR_TP.badge}
          </div>
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm mb-3">
              PRO TIER
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">
              {SNIPPET_TIERS.FOUR_TP.name}
            </h3>
            <div className="text-4xl font-bold text-gold-400 mb-4">
              $19.99
            </div>
            <p className="text-gray-300 text-sm mb-4">
              {SNIPPET_TIERS.FOUR_TP.description}
            </p>
            <ul className="text-left text-sm text-gray-400 space-y-2 mb-6">
              <li>✓ 4 Snippet Uploads</li>
              <li>✓ Priority Featured Rotation</li>
              <li>✓ Premium Analytics Dashboard</li>
              <li>✓ VIP Support</li>
              <li>✓ Social Media Boost</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="max-w-2xl mx-auto bg-black/40 p-8 rounded-lg border border-gold-500/30">
        <h3 className="text-2xl font-bold text-gold-400 mb-4 text-center">
          {selectedTier === 'FREE' ? 'Claim Your Free Snippet' : `Get ${SNIPPET_TIERS[selectedTier].name}`}
        </h3>
        
        <form onSubmit={selectedTier === 'FREE' ? handleFreeSnippet : (e) => { e.preventDefault(); handlePurchase(selectedTier); }}>
          <div className="mb-4">
            <label className="block text-white mb-2">Email Address *</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-3 bg-black/50 border border-gold-500/30 rounded text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 px-6 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-bold rounded-lg hover:from-gold-600 hover:to-amber-700 disabled:opacity-50 text-lg"
          >
            {uploading ? 'Processing...' : SNIPPET_TIERS[selectedTier].cta}
          </button>
        </form>

        {uploadStatus && (
          <div className={`mt-4 p-4 rounded ${
            uploadStatus.includes('Success') 
              ? 'bg-green-900/50 text-green-200' 
              : uploadStatus.includes('Error')
              ? 'bg-red-900/50 text-red-200'
              : 'bg-blue-900/50 text-blue-200'
          }`}>
            {uploadStatus}
          </div>
        )}
      </div>

      {/* Upsell Modal (shows after FREE snippet) */}
      {showUpsell && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-black via-gray-900 to-black p-8 rounded-lg border-2 border-gold-500 max-w-md">
            <h3 className="text-3xl font-bold text-gold-400 mb-4">
              🎉 Awesome! Your Free Snippet is Ready!
            </h3>
            <p className="text-gray-300 mb-6">
              Want to showcase even more music? Upgrade to our <strong className="text-gold-400">3-Pack Bundle</strong> and save $5!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setSelectedTier('THREE_PACK'); setShowUpsell(false); }}
                className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-bold rounded-lg hover:from-gold-600 hover:to-amber-700"
              >
                Yes! Upgrade to 3-Pack - $14.99
              </button>
              <button
                onClick={() => setShowUpsell(false)}
                className="w-full py-3 px-6 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600"
              >
                No Thanks, Continue with Free
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
