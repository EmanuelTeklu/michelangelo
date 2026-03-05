import { readFile } from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import type {
  TasteProfile,
  TastePrinciples,
  TastePalette,
  TasteTypography,
  TasteSpacing,
  TasteAntiPatterns,
} from "../types.js";

// ─── Constants ─────────────────────────────────────────────────────

const TASTE_PROFILE_DIR = path.resolve("taste-profile");

const YAML_FILES = {
  principles: "principles.yaml",
  palette: "palette.yaml",
  typography: "typography.yaml",
  spacing: "spacing.yaml",
  antiPatterns: "anti-patterns.yaml",
} as const;

// ─── YAML Loading ──────────────────────────────────────────────────

async function loadYamlFile<T>(filename: string): Promise<T> {
  const filePath = path.join(TASTE_PROFILE_DIR, filename);
  try {
    const content = await readFile(filePath, "utf-8");
    const parsed = yaml.load(content);
    if (parsed === null || parsed === undefined) {
      throw new Error(`YAML file ${filename} is empty or invalid`);
    }
    return parsed as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load taste profile file '${filename}': ${message}`);
  }
}

// ─── Validation ────────────────────────────────────────────────────

function validatePrinciples(raw: unknown): TastePrinciples {
  const data = raw as Record<string, unknown>;
  if (!data.identity || !data.themes || !data.values) {
    throw new Error("principles.yaml must contain identity, themes, and values");
  }
  return {
    identity: data.identity as { readonly description: string },
    themes: data.themes as ReadonlyArray<string>,
    values: data.values as ReadonlyArray<string>,
  };
}

function validatePalette(raw: unknown): TastePalette {
  const data = raw as Record<string, unknown>;
  if (!data.base || !data.accents || !data.rules) {
    throw new Error("palette.yaml must contain base, accents, and rules");
  }
  const base = data.base as Record<string, string>;
  return {
    base: {
      background: base.background ?? "dark",
      surface: base.surface ?? "muted-dark",
      text: base.text ?? "high-contrast-white",
    },
    accents: data.accents as Readonly<Record<string, string>>,
    rules: data.rules as ReadonlyArray<string>,
  };
}

function validateTypography(raw: unknown): TasteTypography {
  const data = raw as Record<string, unknown>;
  if (!data.fonts || !data.rules) {
    throw new Error("typography.yaml must contain fonts and rules");
  }
  return {
    fonts: data.fonts as Readonly<Record<string, string>>,
    rules: data.rules as ReadonlyArray<string>,
  };
}

function validateSpacing(raw: unknown): TasteSpacing {
  const data = raw as Record<string, unknown>;
  if (!data.density || !data.rules) {
    throw new Error("spacing.yaml must contain density and rules");
  }
  return {
    density: data.density as string,
    "border-radius": (data["border-radius"] as string) ?? "0.5rem",
    rules: data.rules as ReadonlyArray<string>,
  };
}

function validateAntiPatterns(raw: unknown): TasteAntiPatterns {
  const data = raw as Record<string, unknown>;
  if (!data.reject) {
    throw new Error("anti-patterns.yaml must contain reject list");
  }
  return {
    reject: data.reject as ReadonlyArray<string>,
  };
}

// ─── Public API ────────────────────────────────────────────────────

export async function loadTasteProfile(): Promise<TasteProfile> {
  const [rawPrinciples, rawPalette, rawTypography, rawSpacing, rawAntiPatterns] =
    await Promise.all([
      loadYamlFile(YAML_FILES.principles),
      loadYamlFile(YAML_FILES.palette),
      loadYamlFile(YAML_FILES.typography),
      loadYamlFile(YAML_FILES.spacing),
      loadYamlFile(YAML_FILES.antiPatterns),
    ]);

  return {
    principles: validatePrinciples(rawPrinciples),
    palette: validatePalette(rawPalette),
    typography: validateTypography(rawTypography),
    spacing: validateSpacing(rawSpacing),
    antiPatterns: validateAntiPatterns(rawAntiPatterns),
  };
}

export async function loadTasteProfileFromDir(dir: string): Promise<TasteProfile> {
  const loadFromDir = async <T>(filename: string): Promise<T> => {
    const filePath = path.join(dir, filename);
    const content = await readFile(filePath, "utf-8");
    const parsed = yaml.load(content);
    if (parsed === null || parsed === undefined) {
      throw new Error(`YAML file ${filename} in ${dir} is empty or invalid`);
    }
    return parsed as T;
  };

  const [rawPrinciples, rawPalette, rawTypography, rawSpacing, rawAntiPatterns] =
    await Promise.all([
      loadFromDir(YAML_FILES.principles),
      loadFromDir(YAML_FILES.palette),
      loadFromDir(YAML_FILES.typography),
      loadFromDir(YAML_FILES.spacing),
      loadFromDir(YAML_FILES.antiPatterns),
    ]);

  return {
    principles: validatePrinciples(rawPrinciples),
    palette: validatePalette(rawPalette),
    typography: validateTypography(rawTypography),
    spacing: validateSpacing(rawSpacing),
    antiPatterns: validateAntiPatterns(rawAntiPatterns),
  };
}
