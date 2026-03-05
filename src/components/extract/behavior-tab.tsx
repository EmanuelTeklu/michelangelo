import type { AnimationProperty } from "@/lib/types";

interface BehaviorTabProps {
  readonly animations: readonly AnimationProperty[];
}

export function BehaviorTab({ animations }: BehaviorTabProps) {
  if (animations.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="font-mono text-sm text-muted-foreground">
          No transitions or animations detected
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 border-b border-border px-4 py-2">
        <span className="w-40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Property
        </span>
        <span className="w-24 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Duration
        </span>
        <span className="w-32 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Easing
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Trigger
        </span>
      </div>
      {animations.map((anim) => (
        <div
          key={`${anim.property}-${anim.trigger}`}
          className="flex items-center gap-4 border border-border bg-card px-4 py-3"
        >
          <span className="w-40 font-mono text-xs text-foreground">
            {anim.property}
          </span>
          <span className="w-24 font-mono text-xs text-primary">
            {anim.duration}
          </span>
          <span className="w-32 font-mono text-[11px] text-muted-foreground">
            {anim.easing}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {anim.trigger}
          </span>
        </div>
      ))}
    </div>
  );
}
