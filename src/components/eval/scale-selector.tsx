import type { ScaleMode } from '@/lib/types'

interface ScaleSelectorProps {
  readonly value: ScaleMode
  readonly onChange: (scale: ScaleMode) => void
}

const SCALES: readonly ScaleMode[] = ['component', 'section', 'page']

export function ScaleSelector({ value, onChange }: ScaleSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="mr-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Scale
      </span>
      {SCALES.map((scale) => (
        <button
          key={scale}
          onClick={() => onChange(scale)}
          className={`px-2.5 py-1 font-mono text-[11px] transition-colors ${
            value === scale
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          {scale}
        </button>
      ))}
    </div>
  )
}
