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
  readonly screenshots:
    | ReadonlyMap<Viewport, string>
    | Record<Viewport, string>;
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
  readonly spacing: ReadonlyArray<{
    readonly value: string;
    readonly count: number;
  }>;
  readonly borderRadius: ReadonlyArray<{
    readonly value: string;
    readonly count: number;
  }>;
  readonly shadows: ReadonlyArray<{
    readonly value: string;
    readonly count: number;
  }>;
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

// ─── Taste Profile ───────────────────────────────────────────────

export interface TastePrinciples {
  readonly identity: { readonly description: string };
  readonly themes: ReadonlyArray<string>;
  readonly values: ReadonlyArray<string>;
}

export interface TastePalette {
  readonly base: {
    readonly background: string;
    readonly surface: string;
    readonly text: string;
  };
  readonly accents: Readonly<Record<string, string>>;
  readonly rules: ReadonlyArray<string>;
}

export interface TasteTypography {
  readonly fonts: Readonly<Record<string, string>>;
  readonly rules: ReadonlyArray<string>;
}

export interface TasteSpacing {
  readonly density: string;
  readonly "border-radius": string;
  readonly rules: ReadonlyArray<string>;
}

export interface TasteAntiPatterns {
  readonly reject: ReadonlyArray<string>;
}

export interface TasteProfile {
  readonly principles: TastePrinciples;
  readonly palette: TastePalette;
  readonly typography: TasteTypography;
  readonly spacing: TasteSpacing;
  readonly antiPatterns: TasteAntiPatterns;
}

// ─── Recombination Engine ────────────────────────────────────────

export type TargetComponent =
  | "sidebar"
  | "card-grid"
  | "data-table"
  | "stat-bar"
  | "hero-section"
  | "nav-bar";

export interface RecombineRequest {
  readonly target: TargetComponent;
  readonly parts: {
    readonly surface?: string;
    readonly structure?: string;
    readonly behavior?: string;
    readonly feel?: string;
  };
  readonly tasteProfile?: TasteProfile;
  readonly constraints?: ReadonlyArray<string>;
}

export interface PartsManifest {
  readonly surface: {
    readonly sourceId: string;
    readonly tokensUsed: ReadonlyArray<string>;
  };
  readonly structure: {
    readonly sourceId: string;
    readonly patternsUsed: ReadonlyArray<string>;
  };
  readonly behavior: {
    readonly sourceId: string;
    readonly animationsUsed: ReadonlyArray<string>;
  };
  readonly feel: {
    readonly sourceId: string;
    readonly guidanceApplied: ReadonlyArray<string>;
  };
}

export interface ConflictResolution {
  readonly property: string;
  readonly sourceA: { readonly id: string; readonly value: string };
  readonly sourceB: { readonly id: string; readonly value: string };
  readonly resolvedBy:
    | "taste-profile"
    | "structure-constrains-surface"
    | "behavior-inherits"
    | "feel-guides";
  readonly resolvedValue: string;
  readonly explanation: string;
}

export interface RecombineResult {
  readonly code: string;
  readonly html: string;
  readonly manifest: PartsManifest;
  readonly conflicts: ReadonlyArray<ConflictResolution>;
  readonly tailwindConfig: Readonly<Record<string, unknown>>;
}

// ─── Resolved Tokens (internal to recombiner) ────────────────────

export interface ResolvedColorTokens {
  readonly background: string;
  readonly surface: string;
  readonly text: string;
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly border: string;
  readonly muted: string;
}

export interface ResolvedTypographyTokens {
  readonly fontData: string;
  readonly fontUi: string;
  readonly sizeXs: string;
  readonly sizeSm: string;
  readonly sizeBase: string;
  readonly sizeLg: string;
  readonly sizeXl: string;
  readonly weightNormal: string;
  readonly weightMedium: string;
  readonly weightBold: string;
  readonly lineHeight: string;
}

export interface ResolvedSpacingTokens {
  readonly unit: number;
  readonly xs: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly gap: string;
  readonly padding: string;
  readonly borderRadius: string;
}

export interface ResolvedBehaviorTokens {
  readonly transitionDuration: string;
  readonly transitionTiming: string;
  readonly hoverScale: string;
  readonly hoverOpacity: string;
}

export interface ResolvedTokens {
  readonly colors: ResolvedColorTokens;
  readonly typography: ResolvedTypographyTokens;
  readonly spacing: ResolvedSpacingTokens;
  readonly behavior: ResolvedBehaviorTokens;
}

export interface ComponentTemplate {
  readonly name: TargetComponent;
  readonly description: string;
  readonly generate: (tokens: ResolvedTokens) => string;
  readonly generateHtml: (tokens: ResolvedTokens) => string;
}

// ─── Extraction Loader ──────────────────────────────────────────

export interface ExtractionData {
  readonly id: string;
  readonly surface: SurfaceData;
  readonly structure: StructureData;
  readonly behavior: BehaviorData;
  readonly feel: FeelData;
}
