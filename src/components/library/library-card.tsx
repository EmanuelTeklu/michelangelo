import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LibraryItem } from "@/lib/types";

interface LibraryCardProps {
  readonly item: LibraryItem;
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
  readonly onDelete: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LibraryCard({
  item,
  isExpanded,
  onToggle,
  onDelete,
}: LibraryCardProps) {
  return (
    <div className="border border-border bg-card">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/50"
      >
        {/* Domain indicator */}
        <div className="flex h-10 w-10 items-center justify-center bg-secondary">
          <span className="font-mono text-[10px] font-medium text-primary">
            {item.domain.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {item.domain}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {formatDate(item.extractedAt)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[9px]">
            {item.colorCount} colors
          </Badge>
          <Badge variant="secondary" className="font-mono text-[9px]">
            {item.fontCount} fonts
          </Badge>
          <Badge variant="secondary" className="font-mono text-[9px]">
            {item.componentCount} nodes
          </Badge>
        </div>

        <span className="text-xs text-muted-foreground">
          {isExpanded ? "\u25B4" : "\u25BE"}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 py-4">
          {/* URL */}
          <div className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Source URL
            </span>
            <p className="mt-1 font-mono text-xs text-foreground/70">
              {item.url}
            </p>
          </div>

          {/* Colors preview */}
          <div className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Palette
            </span>
            <div className="mt-2 flex gap-1">
              {item.result.surface.colors.map((color) => (
                <div
                  key={`${color.hex}-${color.name}`}
                  className="h-6 w-6 border border-border"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name}: ${color.hex}`}
                />
              ))}
            </div>
          </div>

          {/* Fonts preview */}
          <div className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Typography
            </span>
            <div className="mt-1 flex flex-wrap gap-2">
              {item.result.surface.fonts.map((font) => (
                <span
                  key={`${font.family}-${font.weight}`}
                  className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground"
                >
                  {font.family} ({font.weight})
                </span>
              ))}
            </div>
          </div>

          {/* Feel summary */}
          <div className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Feel
            </span>
            <div className="mt-1 flex items-center gap-4">
              <span className="font-mono text-[10px] text-muted-foreground">
                Density: {item.result.feel.density}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                Rhythm: {item.result.feel.rhythm}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                Hierarchy: {item.result.feel.hierarchy}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="font-mono text-xs text-muted-foreground hover:text-destructive"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
