import { useState, useCallback } from "react";
import { Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ScaleMode, PartSource, LibraryItem } from "@/lib/types";
import { getLibrary } from "@/lib/store";

interface PreviewPanelProps {
  readonly label: string;
  readonly html: string;
  readonly scale: ScaleMode;
  readonly accentClass?: string;
  readonly partSources?: readonly PartSource[];
  readonly onSwapPart?: (
    category: PartSource["category"],
    libraryItemId: string,
  ) => void;
}

const SCALE_DIMENSIONS: Record<
  ScaleMode,
  { readonly width: string; readonly height: string }
> = {
  component: { width: "100%", height: "300px" },
  section: { width: "100%", height: "500px" },
  page: { width: "100%", height: "700px" },
};

const CATEGORY_LABELS: Record<PartSource["category"], string> = {
  surface: "Surface",
  structure: "Structure",
  behavior: "Behavior",
  feel: "Feel",
};

export function PreviewPanel({
  label,
  html,
  scale,
  accentClass = "text-muted-foreground",
  partSources = [],
  onSwapPart,
}: PreviewPanelProps) {
  const dimensions = SCALE_DIMENSIONS[scale];
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [swapCategory, setSwapCategory] =
    useState<PartSource["category"]>("surface");
  const [libraryItems, setLibraryItems] = useState<readonly LibraryItem[]>([]);

  const openSwapDrawer = useCallback(
    (category: PartSource["category"]) => {
      setSwapCategory(category);
      setLibraryItems(getLibrary());
      setIsSwapOpen(true);
    },
    [],
  );

  const handleSwapSelect = useCallback(
    (libraryItemId: string) => {
      onSwapPart?.(swapCategory, libraryItemId);
      setIsSwapOpen(false);
    },
    [swapCategory, onSwapPart],
  );

  const iframeElement = (
    <iframe
      srcDoc={html}
      title={label}
      className="h-full w-full border-0"
      sandbox="allow-same-origin allow-scripts"
      style={{ width: dimensions.width }}
    />
  );

  return (
    <>
      <div className="flex flex-1 flex-col gap-2">
        {/* Header with label and fullscreen button */}
        <div className="flex items-center justify-between px-1">
          <span
            className={`font-mono text-xs font-medium uppercase tracking-wider ${accentClass}`}
          >
            {label}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsFullscreen(true)}
            className="text-muted-foreground hover:text-foreground"
            title="Fullscreen"
          >
            <Maximize2 size={12} />
          </Button>
        </div>

        {/* Live interactive iframe */}
        <div
          className="overflow-auto border border-border bg-[#0a0a0a]"
          style={{ height: dimensions.height }}
        >
          {iframeElement}
        </div>

        {/* Parts manifest */}
        {partSources.length > 0 && (
          <div className="flex flex-col gap-1 px-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Parts Manifest
            </span>
            <div className="flex flex-wrap gap-1">
              {partSources.map((source) => (
                <div
                  key={`${source.libraryItemId}-${source.category}`}
                  className="flex items-center gap-1 border border-border bg-secondary px-1.5 py-0.5"
                >
                  <span className="font-mono text-[9px] text-primary">
                    {CATEGORY_LABELS[source.category]}
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {source.domain}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Swap Part button */}
        {onSwapPart !== undefined && (
          <div className="flex gap-1 px-1">
            {(
              ["surface", "structure", "behavior", "feel"] as const
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => openSwapDrawer(cat)}
                className="flex items-center gap-1 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <RefreshCw size={8} />
                Swap {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="flex h-[90vh] max-w-[90vw] flex-col gap-0 border-border bg-background p-0">
          <DialogTitle className="flex items-center justify-between border-b border-border px-4 py-2">
            <span
              className={`font-mono text-xs font-medium uppercase tracking-wider ${accentClass}`}
            >
              {label}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsFullscreen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Minimize2 size={12} />
            </Button>
          </DialogTitle>
          <div className="flex-1 overflow-auto bg-[#0a0a0a]">
            <iframe
              srcDoc={html}
              title={`${label} fullscreen`}
              className="h-full w-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Swap Part drawer */}
      <Sheet open={isSwapOpen} onOpenChange={setIsSwapOpen}>
        <SheetContent className="border-border bg-background">
          <SheetHeader>
            <SheetTitle className="font-mono text-sm">
              Swap {CATEGORY_LABELS[swapCategory]} Part
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-2 overflow-auto">
            {libraryItems.length === 0 ? (
              <p className="font-mono text-xs text-muted-foreground">
                No library items. Extract a design first.
              </p>
            ) : (
              libraryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSwapSelect(item.id)}
                  className="flex items-center gap-3 border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <div className="flex h-8 w-8 items-center justify-center bg-secondary">
                    <span className="font-mono text-[10px] text-primary">
                      {item.domain.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-foreground">
                      {item.domain}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {item.colorCount} colors, {item.fontCount} fonts
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
