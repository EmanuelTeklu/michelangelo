interface AntiPatternsSectionProps {
  readonly antiPatterns: readonly string[]
}

export function AntiPatternsSection({
  antiPatterns,
}: AntiPatternsSectionProps) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {antiPatterns.map((pattern) => (
          <div
            key={pattern}
            className="flex items-center gap-3 border border-destructive/20 bg-destructive/5 px-4 py-2.5"
          >
            <span className="font-mono text-xs text-destructive">x</span>
            <span className="font-mono text-sm text-foreground/80">
              {pattern}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
