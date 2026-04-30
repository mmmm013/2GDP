"use client";

import { useState } from "react";

export default function FindMomentPage() {
  const [q, setQ] = useState("warm romantic lead-in");
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const res = await fetch(`/api/bot/moments?q=${encodeURIComponent(q)}`);
    const json = await res.json();
    setMoments(json.moments || []);
    setLoading(false);
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto", lineHeight: 1.6 }}>
      <h1>Find the exact moment you need.</h1>

      <p>
        Search warm vocal hooks, phrases, emotional moments, and song sections.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="warm romantic lead-in"
          style={{ flex: 1, padding: 12, fontSize: 16 }}
        />
        <button onClick={search} style={{ padding: "12px 20px", fontSize: 16 }}>
          Find Moments
        </button>
      </div>

      {loading && <p>Searching...</p>}

      <div style={{ marginTop: 32 }}>
        {moments.map((m) => (
          <div key={m.id} style={{ border: "1px solid #555", padding: 20, marginBottom: 16 }}>
            <h2>{m.phrase}</h2>
            <p>{m.source_title}</p>
            <p>Feel score: {m.keenness_score}</p>
            {m.audio_url && <audio controls src={m.audio_url} />}
            <div style={{ marginTop: 12 }}>
              <button>Send as HUG</button>{" "}
              <button>Use in Production</button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 40, fontSize: 14, opacity: 0.7 }}>
        Powered by GPM 4PE music operations. Final audio remains real source audio.
      </p>
    </div>
  );
}
