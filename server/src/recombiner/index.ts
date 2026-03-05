import { readFile } from "fs/promises";
import path from "path";
import type {
  RecombineRequest,
  RecombineResult,
  PartsManifest,
  ExtractionData,
  SurfaceData,
  StructureData,
  BehaviorData,
  FeelData,
  TasteProfile,
} from "../types.js";
import { loadTasteProfile } from "./taste-loader.js";
import { resolveTokens } from "./resolver.js";
import { generateComponent } from "./codegen.js";

// ─── Extraction Loader ─────────────────────────────────────────────

async function loadJsonFile<T>(filePath: string): Promise<T> {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load extraction file '${filePath}': ${message}`);
  }
}

async function loadExtraction(extractionId: string): Promise<ExtractionData> {
  const baseDir = path.resolve("extractions", extractionId);

  const [surface, structure, behavior, feel] = await Promise.all([
    loadJsonFile<SurfaceData>(path.join(baseDir, "tokens.json")),
    loadJsonFile<StructureData>(path.join(baseDir, "structure.json")),
    loadJsonFile<BehaviorData>(path.join(baseDir, "behavior.json")),
    loadJsonFile<FeelData>(path.join(baseDir, "feel.json")),
  ]);

  return { id: extractionId, surface, structure, behavior, feel };
}

// ─── Source Loading ─────────────────────────────────────────────────

interface LoadedSources {
  readonly surface: ExtractionData | null;
  readonly structure: ExtractionData | null;
  readonly behavior: ExtractionData | null;
  readonly feel: ExtractionData | null;
}

async function loadSources(
  parts: RecombineRequest["parts"],
): Promise<LoadedSources> {
  const uniqueIds = new Set<string>();
  if (parts.surface) uniqueIds.add(parts.surface);
  if (parts.structure) uniqueIds.add(parts.structure);
  if (parts.behavior) uniqueIds.add(parts.behavior);
  if (parts.feel) uniqueIds.add(parts.feel);

  // Load each unique extraction once
  const cache = new Map<string, ExtractionData>();
  const loadPromises = [...uniqueIds].map(async (id) => {
    const data = await loadExtraction(id);
    cache.set(id, data);
  });
  await Promise.all(loadPromises);

  return {
    surface: parts.surface ? (cache.get(parts.surface) ?? null) : null,
    structure: parts.structure ? (cache.get(parts.structure) ?? null) : null,
    behavior: parts.behavior ? (cache.get(parts.behavior) ?? null) : null,
    feel: parts.feel ? (cache.get(parts.feel) ?? null) : null,
  };
}

// ─── Manifest Building ─────────────────────────────────────────────

function buildManifest(sources: LoadedSources): PartsManifest {
  return {
    surface: {
      sourceId: sources.surface?.id ?? "taste-profile-defaults",
      tokensUsed: sources.surface
        ? ["colors", "fonts", "spacing", "borderRadius", "shadows"]
        : ["defaults"],
    },
    structure: {
      sourceId: sources.structure?.id ?? "template-defaults",
      patternsUsed: sources.structure
        ? ["tree", "repeatingPatterns", "gridAnalysis"]
        : ["defaults"],
    },
    behavior: {
      sourceId: sources.behavior?.id ?? "taste-profile-defaults",
      animationsUsed: sources.behavior
        ? ["transitions", "animations", "transforms"]
        : ["defaults"],
    },
    feel: {
      sourceId: sources.feel?.id ?? "taste-profile-defaults",
      guidanceApplied: sources.feel
        ? ["density", "rhythm", "hierarchy", "whitespace"]
        : ["defaults"],
    },
  };
}

// ─── Public API ─────────────────────────────────────────────────────

export async function recombine(request: RecombineRequest): Promise<RecombineResult> {
  console.log(`[recombine] Starting recombination for target: ${request.target}`);

  // 1. Load taste profile
  const profile: TasteProfile = request.tasteProfile ?? await loadTasteProfile();
  console.log(`[recombine] Taste profile loaded: ${profile.principles.identity.description}`);

  // 2. Load extraction sources
  const sources = await loadSources(request.parts);
  console.log(
    `[recombine] Sources loaded — ` +
    `surface: ${sources.surface?.id ?? "none"}, ` +
    `structure: ${sources.structure?.id ?? "none"}, ` +
    `behavior: ${sources.behavior?.id ?? "none"}, ` +
    `feel: ${sources.feel?.id ?? "none"}`,
  );

  // 3. Resolve conflicts and merge tokens
  const { tokens, conflicts } = resolveTokens(profile, sources);
  console.log(`[recombine] Token resolution complete. ${conflicts.length} conflict(s) resolved.`);

  // 4. Generate component code
  const { code, html, tailwindConfig } = generateComponent(request.target, tokens);
  console.log(`[recombine] Code generation complete for '${request.target}'`);

  // 5. Build manifest
  const manifest = buildManifest(sources);

  return { code, html, manifest, conflicts, tailwindConfig };
}
