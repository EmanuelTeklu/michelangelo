import { Badge } from '@/components/ui/badge'
import type { EvalRecord, EvalDecision } from '@/lib/types'

interface HistoryRowProps {
  readonly record: EvalRecord
  readonly isExpanded: boolean
  readonly onToggle: () => void
}

const DECISION_CONFIG: Record<
  EvalDecision,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  'accept-current': { label: 'Kept Current', variant: 'secondary' },
  'accept-proposed': { label: 'Accepted Proposed', variant: 'default' },
  modify: { label: 'Modified', variant: 'outline' },
  skip: { label: 'Skipped', variant: 'secondary' },
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistoryRow({ record, isExpanded, onToggle }: HistoryRowProps) {
  const config = DECISION_CONFIG[record.decision]

  return (
    <div className="border border-border bg-card">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/50"
      >
        <span className="font-mono text-[11px] text-muted-foreground min-w-[120px]">
          {formatTimestamp(record.timestamp)}
        </span>
        <span className="flex-1 text-sm">{record.scenarioName}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {record.componentTarget}
        </span>
        <Badge variant={config.variant} className="font-mono text-[10px]">
          {config.label}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {isExpanded ? '\u25B4' : '\u25BE'}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 py-3">
          {record.notes !== null && (
            <div className="mb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Notes
              </span>
              <p className="mt-1 text-sm text-foreground/80">{record.notes}</p>
            </div>
          )}
          <div className="flex gap-px bg-border">
            <div className="flex-1 bg-background">
              <div className="px-2 py-1">
                <span className="font-mono text-[10px] text-muted-foreground">
                  Current
                </span>
              </div>
              <div className="h-[200px] overflow-hidden">
                <iframe
                  srcDoc={record.currentHtml}
                  title="Current preview"
                  className="h-full w-full border-0 pointer-events-none"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
            <div className="flex-1 bg-background">
              <div className="px-2 py-1">
                <span className="font-mono text-[10px] text-primary">
                  Proposed
                </span>
              </div>
              <div className="h-[200px] overflow-hidden">
                <iframe
                  srcDoc={record.proposedHtml}
                  title="Proposed preview"
                  className="h-full w-full border-0 pointer-events-none"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
