import type { TasteProfile } from '@/lib/types'

interface PrinciplesSectionProps {
  readonly principles: TasteProfile['principles']
}

export function PrinciplesSection({ principles }: PrinciplesSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Identity
        </h3>
        <p className="text-sm leading-relaxed text-foreground/90">
          {principles.identity}
        </p>
      </div>

      <div>
        <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Themes
        </h3>
        <div className="flex flex-wrap gap-2">
          {principles.themes.map((theme) => (
            <span
              key={theme}
              className="border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-foreground/80"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Values
        </h3>
        <div className="flex flex-wrap gap-2">
          {principles.values.map((value) => (
            <span
              key={value}
              className="border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono text-xs text-primary"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
