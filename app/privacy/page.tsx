import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | G Putnam Music',
  description: 'Privacy Policy for G Putnam Music LLC',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-6">Last updated: February 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="text-gray-300 leading-relaxed">
          G Putnam Music LLC (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates gputnammusic.com. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information when you visit our
          website or use our services, including SMS messaging.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Personal information you voluntarily provide (name, email, phone number)</li>
          <li>Information collected automatically (IP address, browser type, device info)</li>
          <li>Usage data and analytics</li>
          <li>SMS opt-in data and messaging preferences</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>To provide and maintain our services</li>
          <li>To send transactional and promotional SMS messages (with consent)</li>
          <li>To improve our platform and user experience</li>
          <li>To communicate updates about our music platform</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. SMS Messaging</h2>
        <p className="text-gray-300 leading-relaxed">
          By opting in to our SMS service, you consent to receive text messages from G Putnam Music.
          Message frequency varies. Message and data rates may apply. You can opt out at any time by
          replying STOP. For help, reply HELP or contact us at the information below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
        <p className="text-gray-300 leading-relaxed">
          We do not sell your personal information. We may share data with trusted service providers
          who assist in operating our platform, subject to confidentiality agreements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
        <p className="text-gray-300 leading-relaxed">
          We implement appropriate technical and organizational measures to protect your personal
          information against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
        <p className="text-gray-300 leading-relaxed">
          You may request access to, correction of, or deletion of your personal data by contacting
          us. You may also opt out of marketing communications at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
        <p className="text-gray-300 leading-relaxed">
          G Putnam Music LLC<br />
          Email: reachus@gputnammusic.com<br />
          Website: gputnammusic.com
        </p>
      </section>

      <section className="mt-12 pt-8 border-t border-gray-800">
        <p className="text-gray-400 text-sm">
          Please also review our{' '}
          <Link href="/terms" className="text-blue-400 underline hover:text-blue-300">
            Terms of Service
          </Link>.
        </p>
      </section>
    </div>
  );
}
