import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { EvalDecision } from '@/lib/types'

interface ActionBarProps {
  readonly onDecision: (decision: EvalDecision, notes?: string) => void
  readonly disabled?: boolean
}

export function ActionBar({ onDecision, disabled = false }: ActionBarProps) {
  const [isModifying, setIsModifying] = useState(false)
  const [notes, setNotes] = useState('')

  function handleModifySubmit() {
    if (notes.trim().length === 0) return
    onDecision('modify', notes.trim())
    setNotes('')
    setIsModifying(false)
  }

  function handleModifyCancel() {
    setNotes('')
    setIsModifying(false)
  }

  if (isModifying) {
    return (
      <div className="flex items-center gap-3 border border-border bg-card px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Notes
        </span>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleModifySubmit()
            if (e.key === 'Escape') handleModifyCancel()
          }}
          placeholder="Describe the modification..."
          autoFocus
          className="flex-1 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Button
          size="sm"
          onClick={handleModifySubmit}
          disabled={notes.trim().length === 0}
          className="font-mono text-xs"
        >
          Submit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleModifyCancel}
          className="font-mono text-xs"
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 border border-border bg-card px-5 py-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDecision('accept-current')}
        disabled={disabled}
        className="font-mono text-xs"
      >
        <span className="mr-1.5 text-muted-foreground">&larr;</span>
        Accept Current
      </Button>

      <Button
        size="sm"
        onClick={() => onDecision('accept-proposed')}
        disabled={disabled}
        className="font-mono text-xs"
      >
        Accept Proposed
        <span className="ml-1.5 text-primary-foreground/60">&rarr;</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModifying(true)}
        disabled={disabled}
        className="font-mono text-xs"
      >
        <span className="mr-1.5 font-mono text-muted-foreground">M</span>
        Modify
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDecision('skip')}
        disabled={disabled}
        className="font-mono text-xs text-muted-foreground"
      >
        <span className="mr-1.5 font-mono">S</span>
        Skip
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <span className="font-mono text-[10px] text-muted-foreground">
          Shortcuts: &larr; current &middot; &rarr; proposed &middot; M modify
          &middot; S skip
        </span>
      </div>
    </div>
  )
}
