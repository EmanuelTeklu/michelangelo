import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SurfaceTab } from "@/components/extract/surface-tab";
import { StructureTab } from "@/components/extract/structure-tab";
import { BehaviorTab } from "@/components/extract/behavior-tab";
import { FeelTab } from "@/components/extract/feel-tab";
import { extractAesthetics, ExtractionError } from "@/lib/api";
import { addLibraryItem } from "@/lib/store";
import type { ExtractionResult, ExtractionStatus } from "@/lib/types";

function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ExtractPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ExtractionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = useCallback(async () => {
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (including http:// or https://)");
      return;
    }

    setStatus("extracting");
    setError(null);
    setResult(null);
    setProgress(10);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const data = await extractAesthetics({ url });
      clearInterval(progressInterval);
      setProgress(100);
      setResult(data);
      setStatus("done");
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setStatus("error");
      if (err instanceof ExtractionError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during extraction.");
      }
    }
  }, [url]);

  const handleSaveToLibrary = useCallback(() => {
    if (result === null) return;
    addLibraryItem(url, result);
    navigate("/library");
  }, [result, url, navigate]);

  const handleUseInSession = useCallback(() => {
    if (result === null) return;
    addLibraryItem(url, result);
    navigate("/");
  }, [result, url, navigate]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Extract Aesthetics
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-[11px] text-muted-foreground">
            Pull design DNA from any URL
          </span>
        </div>
      </div>

      {/* URL Input */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            URL
          </span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && status !== "extracting") {
                handleExtract();
              }
            }}
            placeholder="https://example.com"
            disabled={status === "extracting"}
            className="flex-1 border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
          <Button
            size="sm"
            onClick={handleExtract}
            disabled={status === "extracting" || url.trim().length === 0}
            className="font-mono text-xs"
          >
            {status === "extracting" ? "Extracting..." : "Extract"}
          </Button>
        </div>
      </div>

      {/* Progress */}
      {status === "extracting" && (
        <div className="border-b border-border px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">
              Status: Extracting...
            </span>
            <Progress value={progress} className="flex-1" />
            <span className="font-mono text-[10px] text-primary">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && error !== null && (
        <div className="border-b border-destructive/30 bg-destructive/5 px-6 py-3">
          <p className="font-mono text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Idle state validation error */}
      {status === "idle" && error !== null && (
        <div className="border-b border-destructive/30 bg-destructive/5 px-6 py-3">
          <p className="font-mono text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Results */}
      {status === "done" && result !== null && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="surface" className="flex flex-1 flex-col">
            <div className="border-b border-border px-6">
              <TabsList className="h-10 bg-transparent p-0">
                <TabsTrigger
                  value="surface"
                  className="font-mono text-xs data-[state=active]:bg-secondary data-[state=active]:text-primary"
                >
                  Surface
                </TabsTrigger>
                <TabsTrigger
                  value="structure"
                  className="font-mono text-xs data-[state=active]:bg-secondary data-[state=active]:text-primary"
                >
                  Structure
                </TabsTrigger>
                <TabsTrigger
                  value="behavior"
                  className="font-mono text-xs data-[state=active]:bg-secondary data-[state=active]:text-primary"
                >
                  Behavior
                </TabsTrigger>
                <TabsTrigger
                  value="feel"
                  className="font-mono text-xs data-[state=active]:bg-secondary data-[state=active]:text-primary"
                >
                  Feel
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <TabsContent value="surface" className="mt-0">
                <SurfaceTab surface={result.surface} />
              </TabsContent>
              <TabsContent value="structure" className="mt-0">
                <StructureTab tree={result.structure.tree} />
              </TabsContent>
              <TabsContent value="behavior" className="mt-0">
                <BehaviorTab animations={result.behavior.animations} />
              </TabsContent>
              <TabsContent value="feel" className="mt-0">
                <FeelTab feel={result.feel} />
              </TabsContent>
            </div>
          </Tabs>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-border px-6 py-3">
            <Button
              size="sm"
              onClick={handleSaveToLibrary}
              className="font-mono text-xs"
            >
              Save to Library
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleUseInSession}
              className="font-mono text-xs"
            >
              Use in Current Session
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {status === "idle" && error === null && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="font-mono text-sm text-muted-foreground">
              Enter a URL above to extract design aesthetics
            </p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground/60">
              Colors, fonts, spacing, component structure, animations, and AI
              analysis
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
