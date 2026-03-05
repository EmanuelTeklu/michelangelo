import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LibraryCard } from "@/components/library/library-card";
import { getLibrary, removeLibraryItem } from "@/lib/store";
import type { LibraryItem } from "@/lib/types";

export function LibraryPage() {
  const navigate = useNavigate();
  const [library, setLibrary] = useState<readonly LibraryItem[]>(() =>
    getLibrary(),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleDelete(id: string) {
    const updated = removeLibraryItem(id);
    setLibrary(updated);
    if (expandedId === id) {
      setExpandedId(null);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Parts Library
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="font-mono text-[11px] text-muted-foreground">
            {library.length} extraction{library.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/extract")}
          className="font-mono text-xs"
        >
          New Extraction
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {library.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-sm text-muted-foreground">
                No extractions yet.
              </p>
              <button
                onClick={() => navigate("/extract")}
                className="mt-2 font-mono text-xs text-primary hover:underline"
              >
                Extract your first design
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {library.map((item) => (
              <LibraryCard
                key={item.id}
                item={item}
                isExpanded={expandedId === item.id}
                onToggle={() => handleToggle(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
