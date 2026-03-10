import React from 'react';

// GPEx™ Component: Privacy Policy (Carrier Compliant)
// Branding: Amber/Black (GPM Flagship Standard)
// Logic: A2P 10DLC Hard-Bolt & Six Sigma Compliance

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans p-8 md:p-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-amber-500 mb-12 uppercase tracking-tighter">
          Privacy Policy | <span className="text-white">VEKTOR & G Putnam Music LLC</span>
        </h1>

        <section className="space-y-8 text-sm leading-relaxed">
          
          <div>
            <h3 className="text-white font-bold uppercase mb-2 border-b border-zinc-800 pb-2">1. Neutral Harbor Policy & Data Collection</h3>
            <p>
              At <strong>G Putnam Music LLC</strong> (and our consulting division, <strong>VEKTOR</strong>), we adhere strictly to a Neutral Harbor Policy. Your data is isolated and unblended. We collect only the precise information necessary (such as name, email, and mobile number) to execute operations and facilitate secure ingestion within our ecosystem.
            </p>
          </div>

          <div className="border-l-2 border-amber-500 pl-6 py-4 bg-zinc-900/50 my-8">
            <h2 className="text-white font-black uppercase mb-2">2. CRITICAL: Mobile Information & SMS Data Disclosure</h2>
            <p className="text-amber-200 font-medium">
              No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties under any circumstances. We do not sell, rent, or share mobile or personal data with third parties for advertising or promotional use.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase mb-2 border-b border-zinc-800 pb-2">3. Opt-In, Consent, & Telemetry</h3>
            <p>
              Consent to receive automated SMS, A2P messages, or marketing telemetry is <strong>not a condition of purchase</strong> or service. If you opt-in to our communications, you maintain total authority over your terminal.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
              <li>To opt-out of SMS routing at any time, reply <strong>STOP</strong>.</li>
              <li>For assistance, reply <strong>HELP</strong>.</li>
              <li>Message and data rates may apply. Message frequency varies.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase mb-2 border-b border-zinc-800 pb-2">4. Data Security</h3>
            <p>
              All digital assets and telemetry data are maintained in secure, air-locked servers (The Warehouse / SB) with zero-defect tolerance. Access is strictly audited and limited to authorized personnel.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold uppercase mb-2 border-b border-zinc-800 pb-2">5. Contact The Auditor</h3>
            <p>
              For inquiries regarding this policy or to request a data audit, please contact our administrative proxy at <strong>G Putnam Music LLC</strong>.
            </p>
          </div>

          <footer className="mt-24 pt-12 border-t border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-600">
            Verified Six Sigma Audit © 2026 | Principal Auditor: G. Putnam | Division: VEKTOR
          </footer>
        </section>
      </div>
    </div>
  );
}