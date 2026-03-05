import { useState, useEffect, useCallback } from 'react'
import { PreviewPanel } from '@/components/eval/preview-panel'
import { ScaleSelector } from '@/components/eval/scale-selector'
import { ReasoningPanel } from '@/components/eval/reasoning-panel'
import { ActionBar } from '@/components/eval/action-bar'
import { MOCK_SCENARIOS } from '@/lib/mock-scenarios'
import {
  addEvalRecord,
  getActiveSession,
  incrementSessionCount,
} from '@/lib/store'
import type { EvalDecision, ScaleMode, EvalRecord } from '@/lib/types'

export function EvalPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scale, setScale] = useState<ScaleMode>('component')
  const scenario = MOCK_SCENARIOS[currentIndex] ?? null
  const activeSession = getActiveSession()
  const isComplete = scenario === null || scenario === undefined

  const handleDecision = useCallback(
    (decision: EvalDecision, notes?: string) => {
      if (isComplete || scenario === null || scenario === undefined) return

      const sessionId = activeSession?.id ?? 'unassigned'
      const record: EvalRecord = {
        id: crypto.randomUUID(),
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        componentTarget: scenario.componentTarget,
        decision,
        notes: notes ?? null,
        currentHtml: scenario.currentHtml,
        proposedHtml: scenario.proposedHtml,
        timestamp: new Date().toISOString(),
        sessionId,
      }

      addEvalRecord(record)

      if (activeSession !== null) {
        incrementSessionCount(activeSession.id)
      }

      setCurrentIndex((prev) => prev + 1)
    },
    [isComplete, scenario, activeSession]
  )

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isComplete) return

      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handleDecision('accept-current')
          break
        case 'ArrowRight':
          e.preventDefault()
          handleDecision('accept-proposed')
          break
        case 'm':
        case 'M':
          e.preventDefault()
          // ActionBar handles its own modify state
          break
        case 's':
        case 'S':
          e.preventDefault()
          handleDecision('skip')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isComplete, handleDecision])

  if (isComplete) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <span className="font-mono text-sm text-muted-foreground">
          All scenarios evaluated
        </span>
        <button
          onClick={() => setCurrentIndex(0)}
          className="font-mono text-xs text-primary hover:underline"
        >
          Restart evaluation
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Session
          </span>
          <span className="text-sm font-medium">
            {activeSession?.name ?? 'No active session'}
          </span>
          <span className="text-muted-foreground">&rsaquo;</span>
          <span className="text-sm text-foreground/80">
            {scenario.componentTarget}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-muted-foreground">
            {currentIndex + 1} / {MOCK_SCENARIOS.length}
          </span>
          <ScaleSelector value={scale} onChange={setScale} />
        </div>
      </div>

      {/* Preview panels */}
      <div className="flex flex-1 gap-px overflow-hidden bg-border p-px">
        <PreviewPanel
          label="Current"
          html={scenario.currentHtml}
          scale={scale}
        />
        <PreviewPanel
          label="Proposed"
          html={scenario.proposedHtml}
          scale={scale}
          accentClass="text-primary"
        />
      </div>

      {/* Reasoning */}
      <ReasoningPanel
        mechanism={scenario.mechanism}
        reasoning={scenario.reasoning}
      />

      {/* Actions */}
      <ActionBar onDecision={handleDecision} />
    </div>
  )
}
