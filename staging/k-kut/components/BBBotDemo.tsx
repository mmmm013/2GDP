"use client";

import { useState } from "react";

export default function BBBotDemo() {
  const [step, setStep] = useState(1);
  const [sentiment, setSentiment] = useState<string | null>(null);

  const sentiments = ["Love", "Miss You", "Proud", "Grief"];

  return (
    <div className="bg-black text-white p-6 rounded-xl border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">
        BB BOT Demo — 4PE Flow
      </h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <p className="mb-3 text-gray-300">
            What are you feeling?
          </p>
          <div className="flex gap-2 flex-wrap">
            {sentiments.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSentiment(s);
                  setStep(2);
                }}
                className="px-3 py-1 bg-white text-black rounded"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <p className="mb-3 text-gray-300">
            BB BOT is building your moment...
          </p>
          <button
            onClick={() => setStep(3)}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <p className="mb-3 text-gray-300">
            Choose your version ({sentiment})
          </p>
          <div className="space-y-2">
            <div className="p-3 border border-gray-700 rounded">
              Option 1 — Soft
            </div>
            <div className="p-3 border border-gray-700 rounded">
              Option 2 — Cinematic
            </div>
            <div className="p-3 border border-gray-700 rounded">
              Option 3 — Intimate
            </div>
          </div>
        </div>
      )}
    </div>
  );
}