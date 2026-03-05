import type { Page } from "playwright";
import type { SurfaceData, ColorToken, FontToken } from "../types.js";

interface RawColorEntry {
  readonly value: string;
  readonly context: string;
}

interface RawFontEntry {
  readonly family: string;
  readonly size: string;
  readonly weight: string;
  readonly lineHeight: string;
}

interface RawSpacingEntry {
  readonly value: string;
}

interface RawSurfaceResult {
  readonly colors: ReadonlyArray<RawColorEntry>;
  readonly fonts: ReadonlyArray<RawFontEntry>;
  readonly spacing: ReadonlyArray<RawSpacingEntry>;
  readonly borderRadius: ReadonlyArray<RawSpacingEntry>;
  readonly shadows: ReadonlyArray<RawSpacingEntry>;
}

function deduplicateAndRank<T extends { readonly value: string }>(
  items: ReadonlyArray<T>
): ReadonlyArray<{ readonly value: string; readonly count: number }> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (item.value && item.value !== "0px" && item.value !== "none") {
      counts.set(item.value, (counts.get(item.value) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateColors(raw: ReadonlyArray<RawColorEntry>): ReadonlyArray<ColorToken> {
  const grouped = new Map<string, { count: number; contexts: Set<string> }>();
  for (const entry of raw) {
    if (!entry.value || entry.value === "rgba(0, 0, 0, 0)") continue;
    const existing = grouped.get(entry.value);
    if (existing) {
      existing.count += 1;
      existing.contexts.add(entry.context);
    } else {
      grouped.set(entry.value, { count: 1, contexts: new Set([entry.context]) });
    }
  }
  return Array.from(grouped.entries())
    .map(([value, data]) => ({
      value,
      count: data.count,
      context: Array.from(data.contexts),
    }))
    .sort((a, b) => b.count - a.count);
}

function aggregateFonts(raw: ReadonlyArray<RawFontEntry>): ReadonlyArray<FontToken> {
  const grouped = new Map<
    string,
    { count: number; sizes: Set<string>; weights: Set<string>; lineHeights: Set<string> }
  >();
  for (const entry of raw) {
    const family = entry.family.split(",")[0].trim().replace(/['"]/g, "");
    if (!family) continue;
    const existing = grouped.get(family);
    if (existing) {
      existing.count += 1;
      existing.sizes.add(entry.size);
      existing.weights.add(entry.weight);
      existing.lineHeights.add(entry.lineHeight);
    } else {
      grouped.set(family, {
        count: 1,
        sizes: new Set([entry.size]),
        weights: new Set([entry.weight]),
        lineHeights: new Set([entry.lineHeight]),
      });
    }
  }
  return Array.from(grouped.entries())
    .map(([family, data]) => ({
      family,
      sizes: Array.from(data.sizes).sort(),
      weights: Array.from(data.weights).sort(),
      lineHeights: Array.from(data.lineHeights).sort(),
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function extractSurface(page: Page): Promise<SurfaceData> {
  const raw = await page.evaluate((): RawSurfaceResult => {
    const elements = document.querySelectorAll("*");
    const colors: RawColorEntry[] = [];
    const fonts: RawFontEntry[] = [];
    const spacing: RawSpacingEntry[] = [];
    const borderRadius: RawSpacingEntry[] = [];
    const shadows: RawSpacingEntry[] = [];

    elements.forEach((el) => {
      const style = window.getComputedStyle(el);

      // Colors
      colors.push({ value: style.backgroundColor, context: "background" });
      colors.push({ value: style.color, context: "text" });
      colors.push({ value: style.borderColor, context: "border" });

      // Fonts
      fonts.push({
        family: style.fontFamily,
        size: style.fontSize,
        weight: style.fontWeight,
        lineHeight: style.lineHeight,
      });

      // Spacing
      for (const prop of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
        "marginTop", "marginRight", "marginBottom", "marginLeft", "gap"] as const) {
        const val = style.getPropertyValue(
          prop.replace(/([A-Z])/g, "-$1").toLowerCase()
        );
        if (val) spacing.push({ value: val });
      }

      // Border radius
      const br = style.borderRadius;
      if (br) borderRadius.push({ value: br });

      // Shadows
      const bs = style.boxShadow;
      if (bs && bs !== "none") shadows.push({ value: bs });
    });

    return { colors, fonts, spacing, borderRadius, shadows };
  });

  return {
    colors: aggregateColors(raw.colors),
    fonts: aggregateFonts(raw.fonts),
    spacing: deduplicateAndRank(raw.spacing),
    borderRadius: deduplicateAndRank(raw.borderRadius),
    shadows: deduplicateAndRank(raw.shadows),
  };
}
