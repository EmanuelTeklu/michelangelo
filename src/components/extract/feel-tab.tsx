import type { FeelAnalysis } from "@/lib/types";

interface FeelTabProps {
  readonly feel: FeelAnalysis;
}

function MetricBar({
  label,
  value,
}: {
  readonly label: string;
  readonly value: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-foreground">{label}</span>
        <span className="font-mono text-xs text-primary">{clamped}/100</span>
      </div>
      <div className="h-2 w-full bg-secondary">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function FeelTab({ feel }: FeelTabProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Metrics */}
      <div>
        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Ratings
        </h3>
        <div className="flex flex-col gap-4">
          <MetricBar label="Density" value={feel.density} />
          <MetricBar label="Rhythm" value={feel.rhythm} />
          <MetricBar label="Hierarchy" value={feel.hierarchy} />
        </div>
      </div>

      {/* Summary */}
      <div>
        <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Analysis
        </h3>
        <p className="text-sm leading-relaxed text-foreground/80">
          {feel.summary}
        </p>
      </div>

      {/* Keywords */}
      <div>
        <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {feel.keywords.map((keyword) => (
            <span
              key={keyword}
              className="border border-border bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
