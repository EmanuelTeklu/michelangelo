// ─── Request / Response ───────────────────────────────────────────

export type Viewport = "mobile" | "tablet" | "desktop";

export interface ExtractRequest {
  readonly url: string;
  readonly viewport?: Viewport;
}

export interface ExtractResponse {
  readonly url: string;
  readonly domain: string;
  readonly extractedAt: string;
  readonly outputDir: string;
  readonly surface: SurfaceData;
  readonly structure: StructureData;
  readonly behavior: BehaviorData;
  readonly feel: FeelData;
  readonly screenshots: ReadonlyMap<Viewport, string> | Record<Viewport, string>;
}

export interface ExtractionError {
  readonly error: string;
  readonly url: string;
  readonly stage: string;
}

// ─── Surface Layer ────────────────────────────────────────────────

export interface ColorToken {
  readonly value: string;
  readonly count: number;
  readonly context: ReadonlyArray<string>;
}

export interface FontToken {
  readonly family: string;
  readonly sizes: ReadonlyArray<string>;
  readonly weights: ReadonlyArray<string>;
  readonly lineHeights: ReadonlyArray<string>;
  readonly count: number;
}

export interface SurfaceData {
  readonly colors: ReadonlyArray<ColorToken>;
  readonly fonts: ReadonlyArray<FontToken>;
  readonly spacing: ReadonlyArray<{ readonly value: string; readonly count: number }>;
  readonly borderRadius: ReadonlyArray<{ readonly value: string; readonly count: number }>;
  readonly shadows: ReadonlyArray<{ readonly value: string; readonly count: number }>;
}

// ─── Structure Layer ──────────────────────────────────────────────

export interface ComponentNode {
  readonly tag: string;
  readonly classes: ReadonlyArray<string>;
  readonly layout: "flex" | "grid" | "block" | "inline" | "other";
  readonly dimensions: { readonly width: number; readonly height: number };
  readonly children: ReadonlyArray<ComponentNode>;
}

export interface RepeatingPattern {
  readonly selector: string;
  readonly count: number;
  readonly type: string;
}

export interface GridAnalysis {
  readonly columns: number;
  readonly gap: string;
  readonly alignment: string;
}

export interface StructureData {
  readonly tree: ComponentNode;
  readonly repeatingPatterns: ReadonlyArray<RepeatingPattern>;
  readonly gridAnalysis: ReadonlyArray<GridAnalysis>;
  readonly totalElements: number;
  readonly maxDepth: number;
}

// ─── Behavior Layer ───────────────────────────────────────────────

export interface TransitionInfo {
  readonly selector: string;
  readonly property: string;
  readonly duration: string;
  readonly timingFunction: string;
  readonly delay: string;
}

export interface AnimationInfo {
  readonly selector: string;
  readonly name: string;
  readonly duration: string;
  readonly timingFunction: string;
  readonly iterationCount: string;
}

export interface TransformInfo {
  readonly selector: string;
  readonly value: string;
}

export interface BehaviorData {
  readonly transitions: ReadonlyArray<TransitionInfo>;
  readonly animations: ReadonlyArray<AnimationInfo>;
  readonly transforms: ReadonlyArray<TransformInfo>;
  readonly totalAnimated: number;
}

// ─── Feel Layer ───────────────────────────────────────────────────

export interface FeelData {
  readonly density: string;
  readonly rhythm: string;
  readonly hierarchy: string;
  readonly whitespace: string;
  readonly aestheticCharacter: string;
  readonly rawAnalysis: string;
}

// ─── Viewport Config ──────────────────────────────────────────────

export interface ViewportConfig {
  readonly name: Viewport;
  readonly width: number;
  readonly height: number;
}

export const VIEWPORT_CONFIGS: ReadonlyArray<ViewportConfig> = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const;
