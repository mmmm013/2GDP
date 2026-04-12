import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | G Putnam Music',
  description: 'Terms of Service for G Putnam Music LLC',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-6">Last updated: February 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-300 leading-relaxed">
          By accessing or using gputnammusic.com (&quot;the Site&quot;) operated by G Putnam Music LLC,
          you agree to be bound by these Terms of Service. If you do not agree to these terms,
          please do not use the Site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
        <p className="text-gray-300 leading-relaxed">
          G Putnam Music LLC provides a music streaming platform, artist pages, playlists,
          and related services including optional SMS messaging features. We reserve the right
          to modify, suspend, or discontinue any part of the service at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. User Conduct</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>You agree not to use the Site for any unlawful purpose</li>
          <li>You will not attempt to gain unauthorized access to any part of the service</li>
          <li>You will not interfere with or disrupt the Site or its servers</li>
          <li>You will not reproduce, distribute, or create derivative works from our content without permission</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
        <p className="text-gray-300 leading-relaxed">
          All content on the Site, including music, artwork, text, logos, and software, is the
          property of G Putnam Music LLC or its licensors and is protected by copyright and
          intellectual property laws. You may not use any content without prior written consent.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. SMS Messaging Terms</h2>
        <p className="text-gray-300 leading-relaxed">
          By opting in to our SMS service, you consent to receive text messages from G Putnam Music.
          Message frequency varies. Message and data rates may apply. You can opt out at any time by
          replying STOP. For help, reply HELP or contact us at the information below.
          Carriers are not liable for delayed or undelivered messages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Payments and Purchases</h2>
        <p className="text-gray-300 leading-relaxed">
          Certain features or products may require payment. All payments are processed through
          third-party providers (e.g., Stripe). You agree to provide accurate billing information.
          All sales are final unless otherwise stated.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Disclaimers</h2>
        <p className="text-gray-300 leading-relaxed">
          The Site and its content are provided &quot;as is&quot; without warranties of any kind,
          either express or implied. G Putnam Music LLC does not guarantee that the service will
          be uninterrupted, error-free, or free of harmful components.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
        <p className="text-gray-300 leading-relaxed">
          To the fullest extent permitted by law, G Putnam Music LLC shall not be liable for any
          indirect, incidental, special, or consequential damages arising from your use of the Site
          or services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
        <p className="text-gray-300 leading-relaxed">
          We reserve the right to update these Terms of Service at any time. Changes will be
          posted on this page with an updated effective date. Continued use of the Site after
          changes constitutes acceptance of the revised terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
        <p className="text-gray-300 leading-relaxed">
          G Putnam Music LLC<br />
          Email: reachus@gputnammusic.com<br />
          Website: gputnammusic.com
        </p>
      </section>

      <section className="mt-12 pt-8 border-t border-gray-800">
        <p className="text-gray-400 text-sm">
          Please also review our{' '}
          <Link href="/privacy" className="text-blue-400 underline hover:text-blue-300">
            Privacy Policy
          </Link>.
        </p>
      </section>
    </div>
  );
}
