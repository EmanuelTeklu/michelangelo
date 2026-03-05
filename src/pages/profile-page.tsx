import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PrinciplesSection } from "@/components/profile/principles-section";
import { PaletteSection } from "@/components/profile/palette-section";
import { TypographySection } from "@/components/profile/typography-section";
import { SpacingSection } from "@/components/profile/spacing-section";
import { AntiPatternsSection } from "@/components/profile/anti-patterns-section";
import { TASTE_PROFILE } from "@/lib/taste-profile-data";

type ProfileTab =
  | "principles"
  | "palette"
  | "typography"
  | "spacing"
  | "anti-patterns";

const TABS: readonly { id: ProfileTab; label: string }[] = [
  { id: "principles", label: "Principles" },
  { id: "palette", label: "Palette" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "anti-patterns", label: "Anti-Patterns" },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("principles");

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Taste Profile
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-[11px] text-muted-foreground">Read-only</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tab sidebar */}
        <div className="flex w-48 flex-col border-r border-border bg-[#0c0c0c] py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-left font-mono text-xs transition-colors ${
                activeTab === tab.id
                  ? "border-l-2 border-primary bg-secondary text-foreground"
                  : "border-l-2 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "principles" && (
            <PrinciplesSection principles={TASTE_PROFILE.principles} />
          )}
          {activeTab === "palette" && (
            <PaletteSection palette={TASTE_PROFILE.palette} />
          )}
          {activeTab === "typography" && (
            <TypographySection typography={TASTE_PROFILE.typography} />
          )}
          {activeTab === "spacing" && (
            <SpacingSection spacing={TASTE_PROFILE.spacing} />
          )}
          {activeTab === "anti-patterns" && (
            <AntiPatternsSection antiPatterns={TASTE_PROFILE.antiPatterns} />
          )}
        </div>
      </div>
    </div>
  );
}
