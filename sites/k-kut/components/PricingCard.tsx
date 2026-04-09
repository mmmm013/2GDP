import NotifyForm from "./NotifyForm";
import Link from "next/link";

export type PlanStatus = "live" | "rolling-out";

interface PricingCardProps {
  level: string;
  action: string;
  price: string;
  tagline: string;
  status: PlanStatus;
  popular?: boolean;
  checkoutPath?: string;
}

export default function PricingCard({
  level,
  action,
  price,
  tagline,
  status,
  popular = false,
  checkoutPath,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col gap-6 rounded-sm border p-6 md:p-8 transition-all duration-300 ${
        popular
          ? "border-[var(--accent)] bg-[var(--surface)] accent-glow"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-bright)]"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-[var(--accent)] text-[var(--bg)] rounded-sm">
          Most Popular
        </span>
      )}

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">
          {action}
        </p>
        <h3 className="text-xl font-semibold text-[var(--text)]">{level}</h3>
        <p className="text-3xl font-bold mt-2 text-[var(--text)]">
          {price}
          <span className="text-sm font-normal text-[var(--text-muted)]"> / mo</span>
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">{tagline}</p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            status === "live" ? "bg-[var(--accent)] animate-pulse" : "bg-[var(--text-subtle)]"
          }`}
        />
        <span className="text-xs text-[var(--text-muted)]">
          {status === "live" ? "Live" : "Coming back online"}
        </span>
      </div>

      {/* CTA */}
      {status === "live" && checkoutPath ? (
        <Link
          href={checkoutPath}
          className="block text-center py-2.5 text-xs font-semibold uppercase tracking-widest bg-[var(--accent)] text-[var(--bg)] hover:opacity-90 transition-opacity rounded-sm"
        >
          Get {level}
        </Link>
      ) : (
        <NotifyForm plan={level} />
      )}
    </div>
  );
}
