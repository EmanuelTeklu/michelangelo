import type {
  TasteProfile,
  SurfaceData,
  ResolvedTokens,
  ResolvedColorTokens,
  ResolvedTypographyTokens,
  ResolvedSpacingTokens,
  ResolvedBehaviorTokens,
  ConflictResolution,
  ExtractionData,
} from "../types.js";

// ─── Constants ─────────────────────────────────────────────────────

const TASTE_COLOR_MAP: Readonly<Record<string, string>> = {
  dark: "#0a0a0a",
  "muted-dark": "#1a1a2e",
  "high-contrast-white": "#f0f0f0",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
};

const DEFAULT_COLORS: ResolvedColorTokens = {
  background: "#0a0a0a",
  surface: "#1a1a2e",
  text: "#f0f0f0",
  primary: "#eab308",
  secondary: "#a855f7",
  accent: "#3b82f6",
  border: "#2a2a3e",
  muted: "#6b7280",
};

const DEFAULT_TYPOGRAPHY: ResolvedTypographyTokens = {
  fontData: "DM Mono",
  fontUi: "DM Sans",
  sizeXs: "0.75rem",
  sizeSm: "0.875rem",
  sizeBase: "1rem",
  sizeLg: "1.125rem",
  sizeXl: "1.5rem",
  weightNormal: "400",
  weightMedium: "500",
  weightBold: "700",
  lineHeight: "1.5",
};

const DEFAULT_SPACING: ResolvedSpacingTokens = {
  unit: 4,
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  gap: "1rem",
  padding: "1rem",
  borderRadius: "0.5rem",
};

const DEFAULT_BEHAVIOR: ResolvedBehaviorTokens = {
  transitionDuration: "150ms",
  transitionTiming: "ease-in-out",
  hoverScale: "1.02",
  hoverOpacity: "0.8",
};

// ─── Resolution State ──────────────────────────────────────────────

interface ResolutionContext {
  readonly conflicts: ConflictResolution[];
  readonly profile: TasteProfile;
  readonly surfaceSource: ExtractionData | null;
  readonly structureSource: ExtractionData | null;
  readonly behaviorSource: ExtractionData | null;
  readonly feelSource: ExtractionData | null;
}

// ─── Color Resolution ──────────────────────────────────────────────

function resolveColors(ctx: ResolutionContext): ResolvedColorTokens {
  const { profile, surfaceSource } = ctx;

  // Start with taste profile colors (priority 1: taste profile wins)
  const background =
    TASTE_COLOR_MAP[profile.palette.base.background] ??
    DEFAULT_COLORS.background;
  const surface =
    TASTE_COLOR_MAP[profile.palette.base.surface] ?? DEFAULT_COLORS.surface;
  const text =
    TASTE_COLOR_MAP[profile.palette.base.text] ?? DEFAULT_COLORS.text;
  const primary =
    TASTE_COLOR_MAP[profile.palette.accents.primary] ?? DEFAULT_COLORS.primary;

  // If surface source has competing colors, log the resolution
  if (surfaceSource !== null) {
    const extractedBg = findDominantColor(surfaceSource.surface, "background");
    if (extractedBg !== null && extractedBg !== background) {
      ctx.conflicts.push({
        property: "colors.background",
        sourceA: { id: "taste-profile", value: background },
        sourceB: { id: surfaceSource.id, value: extractedBg },
        resolvedBy: "taste-profile",
        resolvedValue: background,
        explanation:
          "Taste profile specifies dark background; overrides extracted surface color",
      });
    }
  }

  const secondary =
    TASTE_COLOR_MAP[profile.palette.accents.ai] ?? DEFAULT_COLORS.secondary;
  const accent =
    TASTE_COLOR_MAP[profile.palette.accents.info] ?? DEFAULT_COLORS.accent;

  return {
    background,
    surface,
    text,
    primary,
    secondary,
    accent,
    border: DEFAULT_COLORS.border,
    muted: DEFAULT_COLORS.muted,
  };
}

function findDominantColor(
  surfaceData: SurfaceData,
  _context: string,
): string | null {
  if (surfaceData.colors.length === 0) {
    return null;
  }
  // Return the color with the highest count
  const sorted = [...surfaceData.colors].sort((a, b) => b.count - a.count);
  return sorted[0]?.value ?? null;
}

// ─── Typography Resolution ─────────────────────────────────────────

function resolveTypography(ctx: ResolutionContext): ResolvedTypographyTokens {
  const { profile, surfaceSource } = ctx;

  // Taste profile specifies font families
  const fontData = profile.typography.fonts.data ?? DEFAULT_TYPOGRAPHY.fontData;
  const fontUi = profile.typography.fonts.ui ?? DEFAULT_TYPOGRAPHY.fontUi;

  // Extract sizes from surface source if available
  let sizes = { ...DEFAULT_TYPOGRAPHY };
  if (surfaceSource !== null && surfaceSource.surface.fonts.length > 0) {
    const extractedSizes = extractFontSizes(surfaceSource.surface);
    if (extractedSizes !== null) {
      // Structure constrains surface: use extracted sizes if they match density
      const densityConflict = checkDensityConflict(extractedSizes, ctx);
      sizes = densityConflict ?? { ...DEFAULT_TYPOGRAPHY, ...extractedSizes };
    }
  }

  return { ...sizes, fontData, fontUi };
}

function extractFontSizes(
  surface: SurfaceData,
): Partial<ResolvedTypographyTokens> | null {
  if (surface.fonts.length === 0) {
    return null;
  }
  const allSizes = surface.fonts.flatMap((f) => f.sizes);
  if (allSizes.length === 0) {
    return null;
  }
  const numericSizes = allSizes
    .map((s) => parseFloat(s))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  if (numericSizes.length < 2) {
    return null;
  }

  return {
    sizeXs: `${numericSizes[0]}px`,
    sizeSm: `${numericSizes[Math.floor(numericSizes.length * 0.25)]}px`,
    sizeBase: `${numericSizes[Math.floor(numericSizes.length * 0.5)]}px`,
    sizeLg: `${numericSizes[Math.floor(numericSizes.length * 0.75)]}px`,
    sizeXl: `${numericSizes[numericSizes.length - 1]}px`,
  };
}

function checkDensityConflict(
  extractedSizes: Partial<ResolvedTypographyTokens>,
  ctx: ResolutionContext,
): ResolvedTypographyTokens | null {
  const { profile, surfaceSource } = ctx;
  if (profile.spacing.density !== "high") {
    return null;
  }
  // High density preference: if extracted base size > 18px, scale down
  const baseSize = parseFloat(extractedSizes.sizeBase ?? "16");
  if (baseSize > 18) {
    ctx.conflicts.push({
      property: "typography.sizeBase",
      sourceA: { id: "taste-profile", value: "high-density" },
      sourceB: { id: surfaceSource?.id ?? "unknown", value: `${baseSize}px` },
      resolvedBy: "feel-guides",
      resolvedValue: "16px",
      explanation:
        "High-density taste profile requires smaller base font; scaled down extracted size",
    });
    return { ...DEFAULT_TYPOGRAPHY, ...extractedSizes, sizeBase: "16px" };
  }
  return null;
}

// ─── Spacing Resolution ────────────────────────────────────────────

function resolveSpacing(ctx: ResolutionContext): ResolvedSpacingTokens {
  const { profile, structureSource, surfaceSource } = ctx;

  const borderRadius =
    profile.spacing["border-radius"] ?? DEFAULT_SPACING.borderRadius;

  // If structure source defines grid gaps, those constrain spacing
  let gap = DEFAULT_SPACING.gap;
  let padding = DEFAULT_SPACING.padding;

  if (
    structureSource !== null &&
    structureSource.structure.gridAnalysis.length > 0
  ) {
    const gridGap = structureSource.structure.gridAnalysis[0]?.gap;
    if (gridGap) {
      gap = gridGap;

      // Check if surface source has conflicting spacing
      if (surfaceSource !== null && surfaceSource.surface.spacing.length > 0) {
        const surfaceSpacing = surfaceSource.surface.spacing[0]?.value;
        if (surfaceSpacing && surfaceSpacing !== gridGap) {
          ctx.conflicts.push({
            property: "spacing.gap",
            sourceA: { id: structureSource.id, value: gridGap },
            sourceB: { id: surfaceSource.id, value: surfaceSpacing },
            resolvedBy: "structure-constrains-surface",
            resolvedValue: gridGap,
            explanation:
              "Structure's grid gap takes precedence over surface's spacing token",
          });
        }
      }
    }
  }

  // High density: tighten padding
  if (profile.spacing.density === "high") {
    padding = "0.75rem";
  }

  return { ...DEFAULT_SPACING, gap, padding, borderRadius };
}

// ─── Behavior Resolution ───────────────────────────────────────────

function resolveBehavior(ctx: ResolutionContext): ResolvedBehaviorTokens {
  const { behaviorSource, feelSource } = ctx;

  let result = { ...DEFAULT_BEHAVIOR };

  // Behavior inherits from source (priority 3)
  if (
    behaviorSource !== null &&
    behaviorSource.behavior.transitions.length > 0
  ) {
    const firstTransition = behaviorSource.behavior.transitions[0];
    if (firstTransition) {
      result = {
        ...result,
        transitionDuration: firstTransition.duration,
        transitionTiming: firstTransition.timingFunction,
      };
    }
  }

  // Feel guides ambiguity (priority 4): if feel says "snappy", cap duration
  if (feelSource !== null) {
    const feelRhythm = feelSource.feel.rhythm.toLowerCase();
    if (feelRhythm.includes("fast") || feelRhythm.includes("snappy")) {
      const currentMs = parseFloat(result.transitionDuration);
      if (!isNaN(currentMs) && currentMs > 200) {
        ctx.conflicts.push({
          property: "behavior.transitionDuration",
          sourceA: {
            id: behaviorSource?.id ?? "default",
            value: result.transitionDuration,
          },
          sourceB: { id: feelSource.id, value: "fast/snappy rhythm" },
          resolvedBy: "feel-guides",
          resolvedValue: "150ms",
          explanation:
            "Feel layer indicates fast rhythm; capping transition duration at 150ms",
        });
        result = { ...result, transitionDuration: "150ms" };
      }
    }
  }

  return result;
}

// ─── Public API ────────────────────────────────────────────────────

export interface ResolverResult {
  readonly tokens: ResolvedTokens;
  readonly conflicts: ReadonlyArray<ConflictResolution>;
}

export function resolveTokens(
  profile: TasteProfile,
  sources: {
    readonly surface: ExtractionData | null;
    readonly structure: ExtractionData | null;
    readonly behavior: ExtractionData | null;
    readonly feel: ExtractionData | null;
  },
): ResolverResult {
  const conflicts: ConflictResolution[] = [];

  const ctx: ResolutionContext = {
    conflicts,
    profile,
    surfaceSource: sources.surface,
    structureSource: sources.structure,
    behaviorSource: sources.behavior,
    feelSource: sources.feel,
  };

  const colors = resolveColors(ctx);
  const typography = resolveTypography(ctx);
  const spacing = resolveSpacing(ctx);
  const behavior = resolveBehavior(ctx);

  // Log all resolutions
  for (const conflict of conflicts) {
    console.log(
      `[resolver] Conflict on '${conflict.property}': ` +
        `${conflict.sourceA.id}(${conflict.sourceA.value}) vs ${conflict.sourceB.id}(${conflict.sourceB.value}) ` +
        `-> resolved by ${conflict.resolvedBy}: ${conflict.resolvedValue}`,
    );
  }

  return {
    tokens: { colors, typography, spacing, behavior },
    conflicts,
  };
}
