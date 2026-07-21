export default function ProgressBar({ earned, required, label }: { earned: number; required: number; label?: string }) {
  const pct = required > 0 ? Math.min(100, Math.round((earned / required) * 100)) : 0;
  const complete = earned >= required;

  return (
    <div>
      {label && <p className="mb-1.5 text-sm text-ink/70">{label}</p>}
      <div
        role="progressbar"
        aria-valuenow={earned}
        aria-valuemin={0}
        aria-valuemax={required}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
      >
        <div
          className={`h-full rounded-full transition-all ${complete ? "bg-emerald-600" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
