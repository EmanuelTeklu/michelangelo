export type ScaleMode = 'component' | 'section' | 'page'

export type EvalDecision = 'accept-current' | 'accept-proposed' | 'modify' | 'skip'

export interface Scenario {
  readonly id: string
  readonly name: string
  readonly componentTarget: string
  readonly currentHtml: string
  readonly proposedHtml: string
  readonly mechanism: string
  readonly reasoning: string
}

export interface EvalRecord {
  readonly id: string
  readonly scenarioId: string
  readonly scenarioName: string
  readonly componentTarget: string
  readonly decision: EvalDecision
  readonly notes: string | null
  readonly currentHtml: string
  readonly proposedHtml: string
  readonly timestamp: string
  readonly sessionId: string
}

export interface Session {
  readonly id: string
  readonly name: string
  readonly createdAt: string
  readonly evaluationCount: number
}

export interface TasteProfile {
  readonly principles: {
    readonly identity: string
    readonly themes: readonly string[]
    readonly values: readonly string[]
  }
  readonly palette: {
    readonly base: Record<string, string>
    readonly accents: Record<string, string>
    readonly rules: readonly string[]
  }
  readonly typography: {
    readonly fonts: Record<string, string>
    readonly rules: readonly string[]
  }
  readonly spacing: {
    readonly density: string
    readonly borderRadius: string
    readonly rules: readonly string[]
  }
  readonly antiPatterns: readonly string[]
}
