import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  getSessions,
  createSession,
  deleteSession,
  getActiveSessionId,
  setActiveSession,
} from '@/lib/store'
import type { Session } from '@/lib/types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SessionsPage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<readonly Session[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    setSessions(getSessions())
    setActiveId(getActiveSessionId())
  }, [])

  function handleCreate() {
    if (newName.trim().length === 0) return
    const session = createSession(newName.trim())
    setSessions(getSessions())
    setActiveId(session.id)
    setNewName('')
    setIsCreating(false)
    navigate('/')
  }

  function handleActivate(sessionId: string) {
    setActiveSession(sessionId)
    setActiveId(sessionId)
  }

  function handleDelete(sessionId: string) {
    deleteSession(sessionId)
    setSessions(getSessions())
    setActiveId(getActiveSessionId())
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Sessions
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="font-mono text-[11px] text-muted-foreground">
            {sessions.length} sessions
          </span>
        </div>
        {!isCreating && (
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            className="font-mono text-xs"
          >
            New Session
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isCreating && (
          <div className="mb-4 flex items-center gap-3 border border-primary/30 bg-primary/5 px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Name
            </span>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') {
                  setIsCreating(false)
                  setNewName('')
                }
              }}
              placeholder="e.g. Styling IronWatch — Sidebar"
              autoFocus
              className="flex-1 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={newName.trim().length === 0}
              className="font-mono text-xs"
            >
              Create
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsCreating(false)
                setNewName('')
              }}
              className="font-mono text-xs"
            >
              Cancel
            </Button>
          </div>
        )}

        {sessions.length === 0 && !isCreating ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-sm text-muted-foreground">
                No sessions yet.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-2 font-mono text-xs text-primary hover:underline"
              >
                Create your first session
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((session) => {
              const isActive = session.id === activeId

              return (
                <div
                  key={session.id}
                  className={`flex items-center gap-4 border px-4 py-3 transition-colors ${
                    isActive
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-card hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {session.name}
                      </span>
                      {isActive && (
                        <Badge
                          variant="default"
                          className="font-mono text-[9px]"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {formatDate(session.createdAt)}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {session.evaluationCount} evals
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActivate(session.id)}
                        className="font-mono text-xs"
                      >
                        Activate
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(session.id)}
                      className="font-mono text-xs text-muted-foreground hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
