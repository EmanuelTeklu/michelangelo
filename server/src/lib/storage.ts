import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type {
  SurfaceData,
  StructureData,
  BehaviorData,
  FeelData,
} from "../types.js";
import type { ScreenshotResult } from "./screenshot.js";

function buildOutputDir(domain: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeDomain = domain.replace(/[^a-zA-Z0-9.-]/g, "_");
  return path.resolve("extractions", `${safeDomain}-${timestamp}`);
}

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "unknown";
  }
}

export interface StorageResult {
  readonly outputDir: string;
  readonly domain: string;
  readonly files: ReadonlyArray<string>;
}

export async function saveExtraction(
  url: string,
  surface: SurfaceData,
  structure: StructureData,
  behavior: BehaviorData,
  feel: FeelData,
  screenshots: ReadonlyArray<ScreenshotResult>
): Promise<StorageResult> {
  const domain = domainFromUrl(url);
  const outputDir = buildOutputDir(domain);

  await mkdir(outputDir, { recursive: true });

  const savedFiles: string[] = [];

  // Save JSON layers
  const layers: ReadonlyArray<readonly [string, unknown]> = [
    ["tokens.json", surface],
    ["structure.json", structure],
    ["behavior.json", behavior],
    ["feel.json", feel],
  ];

  for (const [filename, data] of layers) {
    const filePath = path.join(outputDir, filename);
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    savedFiles.push(filePath);
  }

  // Save screenshots
  for (const screenshot of screenshots) {
    const filePath = path.join(outputDir, `screenshot-${screenshot.viewport}.png`);
    await writeFile(filePath, screenshot.buffer);
    savedFiles.push(filePath);
  }

  return {
    outputDir,
    domain,
    files: savedFiles,
  };
}
