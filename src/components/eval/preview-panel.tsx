import type { ScaleMode } from '@/lib/types'

interface PreviewPanelProps {
  readonly label: string
  readonly html: string
  readonly scale: ScaleMode
  readonly accentClass?: string
}

const SCALE_DIMENSIONS: Record<ScaleMode, { width: string; height: string }> = {
  component: { width: '100%', height: '300px' },
  section: { width: '100%', height: '500px' },
  page: { width: '100%', height: '700px' },
}

export function PreviewPanel({
  label,
  html,
  scale,
  accentClass = 'text-muted-foreground',
}: PreviewPanelProps) {
  const dimensions = SCALE_DIMENSIONS[scale]

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span
          className={`font-mono text-xs font-medium uppercase tracking-wider ${accentClass}`}
        >
          {label}
        </span>
      </div>
      <div
        className="overflow-hidden border border-border bg-[#0a0a0a]"
        style={{ height: dimensions.height }}
      >
        <iframe
          srcDoc={html}
          title={label}
          className="h-full w-full border-0"
          sandbox="allow-same-origin"
          style={{ width: dimensions.width }}
        />
      </div>
    </div>
  )
}
