import type { ResolvedTokens, TargetComponent } from "../types.js";
import { getTemplate } from "./templates.js";

// ─── Tailwind Config Generation ────────────────────────────────────

function buildTailwindConfig(tokens: ResolvedTokens): Readonly<Record<string, unknown>> {
  return {
    theme: {
      extend: {
        colors: {
          bg: tokens.colors.background,
          surface: tokens.colors.surface,
          text: tokens.colors.text,
          primary: tokens.colors.primary,
          secondary: tokens.colors.secondary,
          accent: tokens.colors.accent,
          border: tokens.colors.border,
          muted: tokens.colors.muted,
        },
        fontFamily: {
          data: [`'${tokens.typography.fontData}'`, "monospace"],
          ui: [`'${tokens.typography.fontUi}'`, "sans-serif"],
        },
        fontSize: {
          xs: tokens.typography.sizeXs,
          sm: tokens.typography.sizeSm,
          base: tokens.typography.sizeBase,
          lg: tokens.typography.sizeLg,
          xl: tokens.typography.sizeXl,
        },
        fontWeight: {
          normal: tokens.typography.weightNormal,
          medium: tokens.typography.weightMedium,
          bold: tokens.typography.weightBold,
        },
        spacing: {
          xs: tokens.spacing.xs,
          sm: tokens.spacing.sm,
          md: tokens.spacing.md,
          lg: tokens.spacing.lg,
          xl: tokens.spacing.xl,
          gap: tokens.spacing.gap,
          padding: tokens.spacing.padding,
        },
        borderRadius: {
          DEFAULT: tokens.spacing.borderRadius,
        },
        transitionDuration: {
          DEFAULT: tokens.behavior.transitionDuration,
        },
        transitionTimingFunction: {
          DEFAULT: tokens.behavior.transitionTiming,
        },
      },
    },
  };
}

// ─── Code Generation ───────────────────────────────────────────────

export interface CodegenResult {
  readonly code: string;
  readonly html: string;
  readonly tailwindConfig: Readonly<Record<string, unknown>>;
}

export function generateComponent(
  target: TargetComponent,
  tokens: ResolvedTokens,
): CodegenResult {
  const template = getTemplate(target);

  const code = template.generate(tokens);
  const html = template.generateHtml(tokens);
  const tailwindConfig = buildTailwindConfig(tokens);

  return { code, html, tailwindConfig };
}
