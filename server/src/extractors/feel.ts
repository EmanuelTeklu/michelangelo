import type { FeelData } from "../types.js";
import { analyzeScreenshot } from "../lib/vision.js";

export async function extractFeel(
  desktopScreenshotBuffer: Buffer
): Promise<FeelData> {
  const base64 = desktopScreenshotBuffer.toString("base64");
  return analyzeScreenshot(base64);
}
