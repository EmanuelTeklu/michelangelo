import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HistoryRow } from "@/components/history/history-row";
import { getHistory, clearHistory } from "@/lib/store";
import type { EvalRecord } from "@/lib/types";

export function HistoryPage() {
  const [history, setHistory] = useState<readonly EvalRecord[]>(() =>
    getHistory(),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleClear() {
    clearHistory();
    setHistory([]);
    setExpandedId(null);
  }

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Decision History
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="font-mono text-[11px] text-muted-foreground">
            {history.length} evaluations
          </span>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="font-mono text-xs text-muted-foreground hover:text-destructive"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {history.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-sm text-muted-foreground">
              No evaluations yet. Start an eval session to build history.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((record) => (
              <HistoryRow
                key={record.id}
                record={record}
                isExpanded={expandedId === record.id}
                onToggle={() => handleToggle(record.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
