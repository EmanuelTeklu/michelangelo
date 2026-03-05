import type { TasteProfile } from '@/lib/types'

interface SpacingSectionProps {
  readonly spacing: TasteProfile['spacing']
}

const RHYTHM_STEPS = [4, 8, 12, 16, 24, 32, 48, 64]

export function SpacingSection({ spacing }: SpacingSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-8">
        <div>
          <h3 className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Density
          </h3>
          <span className="font-mono text-sm text-primary">
            {spacing.density}
          </span>
        </div>
        <div>
          <h3 className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Border Radius
          </h3>
          <span className="font-mono text-sm text-primary">
            {spacing.borderRadius}
          </span>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Visual Rhythm
        </h3>
        <div className="flex items-end gap-4">
          {RHYTHM_STEPS.map((px) => (
            <div key={px} className="flex flex-col items-center gap-2">
              <div
                className="bg-primary/30 border border-primary/20"
                style={{ width: `${px}px`, height: `${px}px` }}
              />
              <span className="font-mono text-[10px] text-muted-foreground">
                {px}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Gap Comparison
        </h3>
        <div className="space-y-4">
          <div>
            <span className="mb-2 block font-mono text-[10px] text-muted-foreground">
              12px gap (within sections)
            </span>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 flex-1 border border-border bg-secondary"
                />
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block font-mono text-[10px] text-muted-foreground">
              24px gap (between sections)
            </span>
            <div className="flex gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 flex-1 border border-border bg-secondary"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Rules
        </h3>
        <div className="flex flex-col gap-1.5">
          {spacing.rules.map((rule) => (
            <span key={rule} className="font-mono text-xs text-foreground/70">
              {rule}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
