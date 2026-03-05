import type { ExtractionSurface } from "@/lib/types";

interface SurfaceTabProps {
  readonly surface: ExtractionSurface;
}

export function SurfaceTab({ surface }: SurfaceTabProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Color Swatches */}
      <div>
        <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Colors ({surface.colors.length})
        </h3>
        <div className="flex flex-wrap gap-3">
          {surface.colors.map((color) => (
            <div
              key={`${color.hex}-${color.name}`}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="h-12 w-12 border border-border"
                style={{ backgroundColor: color.hex }}
              />
              <span className="font-mono text-[10px] text-foreground">
                {color.hex}
              </span>
              <span className="max-w-[60px] truncate text-center font-mono text-[9px] text-muted-foreground">
                {color.name}
              </span>
            </div>
          ))}
        </div>
        {surface.colors.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {surface.colors.map((color) => (
              <span
                key={`usage-${color.hex}-${color.name}`}
                className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground"
              >
                {color.name}: {color.usage}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Font Samples */}
      <div>
        <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Fonts ({surface.fonts.length})
        </h3>
        <div className="flex flex-col gap-2">
          {surface.fonts.map((font) => (
            <div
              key={`${font.family}-${font.weight}`}
              className="flex items-center gap-4 border border-border bg-card px-4 py-3"
            >
              <span
                className="text-lg text-foreground"
                style={{
                  fontFamily: font.family,
                  fontWeight: font.weight,
                }}
              >
                Aa Bb Cc 123
              </span>
              <div className="ml-auto flex flex-col items-end gap-0.5">
                <span className="font-mono text-xs text-foreground">
                  {font.family}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {font.weight} -- {font.usage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing Scale */}
      <div>
        <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Spacing Scale ({surface.spacing.length})
        </h3>
        <div className="flex flex-col gap-2">
          {surface.spacing.map((space) => (
            <div
              key={space.label}
              className="flex items-center gap-4"
            >
              <span className="w-16 font-mono text-[11px] text-muted-foreground">
                {space.label}
              </span>
              <div
                className="h-3 bg-primary/30"
                style={{ width: space.value }}
              />
              <span className="font-mono text-[11px] text-foreground">
                {space.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
