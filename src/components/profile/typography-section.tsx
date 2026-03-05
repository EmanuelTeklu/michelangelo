import type { TasteProfile } from '@/lib/types'

interface TypographySectionProps {
  readonly typography: TasteProfile['typography']
}

export function TypographySection({ typography }: TypographySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Font Families
        </h3>
        <div className="space-y-6">
          {Object.entries(typography.fonts).map(([role, font]) => (
            <div key={role} className="border border-border bg-secondary p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {role}
                </span>
                <span className="font-mono text-[11px] text-primary">
                  {font}
                </span>
              </div>
              <div
                className="space-y-2"
                style={{ fontFamily: `"${font}", system-ui` }}
              >
                <p className="text-2xl font-semibold">
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-sm text-foreground/70">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz
                  0123456789
                </p>
                <div className="flex gap-6 pt-1">
                  <span className="text-sm font-light">Light 300</span>
                  <span className="text-sm font-normal">Regular 400</span>
                  <span className="text-sm font-medium">Medium 500</span>
                  <span className="text-sm font-semibold">Semibold 600</span>
                  <span className="text-sm font-bold">Bold 700</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Rules
        </h3>
        <div className="flex flex-col gap-1.5">
          {typography.rules.map((rule) => (
            <span key={rule} className="font-mono text-xs text-foreground/70">
              {rule}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
