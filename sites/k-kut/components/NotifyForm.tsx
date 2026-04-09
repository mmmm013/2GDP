"use client";

import { useState } from "react";

interface NotifyFormProps {
  plan?: string;
}

export default function NotifyForm({ plan = "" }: NotifyFormProps) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState(plan);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, note }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("You're on the list. We'll reach out when your Action goes live.");
        setEmail("");
        setNote("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-[var(--accent)] bg-[var(--accent-glow)] p-4 text-center">
        <p className="text-sm text-[var(--accent)]">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md">
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-sm px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
          Desired Plan (optional)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. mK Single"
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-sm px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-2.5 text-xs font-semibold uppercase tracking-widest border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm"
      >
        {status === "loading" ? "Sending..." : "Get Notified"}
      </button>
    </form>
  );
}
