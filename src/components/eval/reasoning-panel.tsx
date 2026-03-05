import { Separator } from '@/components/ui/separator'

interface ReasoningPanelProps {
  readonly mechanism: string
  readonly reasoning: string
}

export function ReasoningPanel({ mechanism, reasoning }: ReasoningPanelProps) {
  return (
    <div className="border border-border bg-card px-5 py-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Mechanism
        </span>
        <span className="font-mono text-xs text-primary">{mechanism}</span>
      </div>
      <Separator className="my-2" />
      <div className="flex items-start gap-2">
        <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Reasoning
        </span>
        <p className="text-sm leading-relaxed text-foreground/80">
          {reasoning}
        </p>
      </div>
    </div>
  )
}
