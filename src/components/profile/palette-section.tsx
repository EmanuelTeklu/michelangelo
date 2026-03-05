import type { TasteProfile } from '@/lib/types'

interface PaletteSectionProps {
  readonly palette: TasteProfile['palette']
}

function ColorSwatch({
  label,
  color,
  role,
}: {
  readonly label: string
  readonly color: string
  readonly role: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 flex-shrink-0 border border-border"
        style={{ backgroundColor: color }}
      />
      <div className="flex flex-col">
        <span className="font-mono text-xs font-medium text-foreground">
          {label}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {color}
        </span>
        <span className="text-[10px] text-muted-foreground">{role}</span>
      </div>
    </div>
  )
}

const ACCENT_ROLES: Record<string, string> = {
  primary: 'action, focus',
  armed: 'urgency, armed status',
  ai: 'AI/automated elements',
  success: 'confirmed, covered',
  destructive: 'alerts, uncovered',
  info: 'informational',
}

const BASE_ROLES: Record<string, string> = {
  background: 'page background',
  surface: 'card/panel surfaces',
  text: 'primary text color',
}

export function PaletteSection({ palette }: PaletteSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Base
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(palette.base).map(([key, color]) => (
            <ColorSwatch
              key={key}
              label={key}
              color={color}
              role={BASE_ROLES[key] ?? key}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Accents
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(palette.accents).map(([key, color]) => (
            <ColorSwatch
              key={key}
              label={key}
              color={color}
              role={ACCENT_ROLES[key] ?? key}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Rules
        </h3>
        <div className="flex flex-col gap-1.5">
          {palette.rules.map((rule) => (
            <span key={rule} className="font-mono text-xs text-foreground/70">
              {rule}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
