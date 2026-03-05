export type ScaleMode = "component" | "section" | "page";

export type EvalDecision =
  | "accept-current"
  | "accept-proposed"
  | "modify"
  | "skip";

export interface Scenario {
  readonly id: string;
  readonly name: string;
  readonly componentTarget: string;
  readonly currentHtml: string;
  readonly proposedHtml: string;
  readonly mechanism: string;
  readonly reasoning: string;
}

export interface EvalRecord {
  readonly id: string;
  readonly scenarioId: string;
  readonly scenarioName: string;
  readonly componentTarget: string;
  readonly decision: EvalDecision;
  readonly notes: string | null;
  readonly currentHtml: string;
  readonly proposedHtml: string;
  readonly timestamp: string;
  readonly sessionId: string;
}

export interface Session {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly evaluationCount: number;
}

export interface TasteProfile {
  readonly principles: {
    readonly identity: string;
    readonly themes: readonly string[];
    readonly values: readonly string[];
  };
  readonly palette: {
    readonly base: Record<string, string>;
    readonly accents: Record<string, string>;
    readonly rules: readonly string[];
  };
  readonly typography: {
    readonly fonts: Record<string, string>;
    readonly rules: readonly string[];
  };
  readonly spacing: {
    readonly density: string;
    readonly borderRadius: string;
    readonly rules: readonly string[];
  };
  readonly antiPatterns: readonly string[];
}

// --- Extraction types ---

export interface ColorSwatch {
  readonly hex: string;
  readonly name: string;
  readonly usage: string;
}

export interface FontSample {
  readonly family: string;
  readonly weight: string;
  readonly usage: string;
}

export interface SpacingValue {
  readonly label: string;
  readonly value: string;
}

export interface ComponentNode {
  readonly name: string;
  readonly type: string;
  readonly children: readonly ComponentNode[];
}

export interface AnimationProperty {
  readonly property: string;
  readonly duration: string;
  readonly easing: string;
  readonly trigger: string;
}

export interface FeelAnalysis {
  readonly density: number;
  readonly rhythm: number;
  readonly hierarchy: number;
  readonly summary: string;
  readonly keywords: readonly string[];
}

export interface ExtractionSurface {
  readonly colors: readonly ColorSwatch[];
  readonly fonts: readonly FontSample[];
  readonly spacing: readonly SpacingValue[];
}

export interface ExtractionStructure {
  readonly tree: readonly ComponentNode[];
}

export interface ExtractionBehavior {
  readonly animations: readonly AnimationProperty[];
}

export interface ExtractionResult {
  readonly surface: ExtractionSurface;
  readonly structure: ExtractionStructure;
  readonly behavior: ExtractionBehavior;
  readonly feel: FeelAnalysis;
}

export type ExtractionStatus = "idle" | "extracting" | "done" | "error";

export interface LibraryItem {
  readonly id: string;
  readonly url: string;
  readonly domain: string;
  readonly extractedAt: string;
  readonly result: ExtractionResult;
  readonly colorCount: number;
  readonly fontCount: number;
  readonly componentCount: number;
}

export interface PartSource {
  readonly libraryItemId: string;
  readonly domain: string;
  readonly category: "surface" | "structure" | "behavior" | "feel";
  readonly label: string;
}
