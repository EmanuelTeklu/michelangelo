import type { EvalRecord, Session } from './types'

const HISTORY_KEY = 'michelangelo:history'
const SESSIONS_KEY = 'michelangelo:sessions'
const ACTIVE_SESSION_KEY = 'michelangelo:active-session'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// --- History ---

export function getHistory(): readonly EvalRecord[] {
  return readJson<EvalRecord[]>(HISTORY_KEY, [])
}

export function addEvalRecord(record: EvalRecord): readonly EvalRecord[] {
  const current = getHistory()
  const updated = [record, ...current]
  writeJson(HISTORY_KEY, updated)
  return updated
}

export function clearHistory(): void {
  writeJson(HISTORY_KEY, [])
}

// --- Sessions ---

export function getSessions(): readonly Session[] {
  return readJson<Session[]>(SESSIONS_KEY, [])
}

export function createSession(name: string): Session {
  const session: Session = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    evaluationCount: 0,
  }
  const current = getSessions()
  const updated = [session, ...current]
  writeJson(SESSIONS_KEY, updated)
  setActiveSession(session.id)
  return session
}

export function incrementSessionCount(sessionId: string): void {
  const current = getSessions()
  const updated = current.map((s) =>
    s.id === sessionId
      ? { ...s, evaluationCount: s.evaluationCount + 1 }
      : s
  )
  writeJson(SESSIONS_KEY, updated)
}

export function deleteSession(sessionId: string): void {
  const current = getSessions()
  const updated = current.filter((s) => s.id !== sessionId)
  writeJson(SESSIONS_KEY, updated)

  const active = getActiveSessionId()
  if (active === sessionId) {
    clearActiveSession()
  }
}

// --- Active Session ---

export function getActiveSessionId(): string | null {
  return localStorage.getItem(ACTIVE_SESSION_KEY)
}

export function setActiveSession(sessionId: string): void {
  localStorage.setItem(ACTIVE_SESSION_KEY, sessionId)
}

export function clearActiveSession(): void {
  localStorage.removeItem(ACTIVE_SESSION_KEY)
}

export function getActiveSession(): Session | null {
  const id = getActiveSessionId()
  if (id === null) return null
  const sessions = getSessions()
  return sessions.find((s) => s.id === id) ?? null
}
