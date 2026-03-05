import { Router, type Request, type Response } from "express";
import { createPage, navigateToUrl } from "../lib/browser.js";
import { captureAllBreakpoints, findScreenshot } from "../lib/screenshot.js";
import { saveExtraction } from "../lib/storage.js";
import { extractSurface } from "../extractors/surface.js";
import { extractStructure } from "../extractors/structure.js";
import { extractBehavior } from "../extractors/behavior.js";
import { extractFeel } from "../extractors/feel.js";
import type { ExtractRequest, ExtractionError, Viewport } from "../types.js";

const router = Router();

function isValidUrl(input: string): boolean {
  try {
    const parsed = new URL(input);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Partial<ExtractRequest>;

  // ── Validate input ──────────────────────────────────────────────
  if (!body.url || typeof body.url !== "string") {
    const error: ExtractionError = {
      error: "Missing or invalid 'url' field. Provide a valid HTTP/HTTPS URL.",
      url: String(body.url ?? ""),
      stage: "validation",
    };
    res.status(400).json(error);
    return;
  }

  const url = body.url.trim();
  if (!isValidUrl(url)) {
    const error: ExtractionError = {
      error: `Invalid URL: "${url}". Must be a valid HTTP or HTTPS URL.`,
      url,
      stage: "validation",
    };
    res.status(400).json(error);
    return;
  }

  const requestedViewport: Viewport = body.viewport ?? "desktop";

  console.log(
    `[extract] Starting extraction for ${url} (viewport: ${requestedViewport})`,
  );

  try {
    // ── Step 1 & 2: Screenshots at all breakpoints ────────────────
    console.log("[extract] Capturing screenshots...");
    const screenshots = await captureAllBreakpoints(url);
    console.log(`[extract] Captured ${screenshots.length} screenshots`);

    // ── Step 3: Surface extraction ────────────────────────────────
    console.log("[extract] Extracting surface tokens...");
    const surfacePage = await createPage(1440, 900);
    await navigateToUrl(surfacePage, url);
    const surface = await extractSurface(surfacePage);
    console.log(
      `[extract] Surface: ${surface.colors.length} colors, ${surface.fonts.length} fonts`,
    );

    // ── Step 4: Structure extraction ──────────────────────────────
    console.log("[extract] Extracting structure...");
    const structure = await extractStructure(surfacePage);
    console.log(
      `[extract] Structure: ${structure.totalElements} elements, depth ${structure.maxDepth}`,
    );

    // ── Step 5: Behavior extraction ───────────────────────────────
    console.log("[extract] Extracting behavior...");
    const behavior = await extractBehavior(surfacePage);
    console.log(
      `[extract] Behavior: ${behavior.totalAnimated} animated properties`,
    );

    await surfacePage.close();

    // ── Step 6: Feel analysis via Claude vision ───────────────────
    console.log("[extract] Analyzing feel via Claude vision...");
    const desktopScreenshot = findScreenshot(screenshots, "desktop");
    let feel;
    if (desktopScreenshot) {
      feel = await extractFeel(desktopScreenshot.buffer);
    } else {
      feel = {
        density: "unavailable",
        rhythm: "unavailable",
        hierarchy: "unavailable",
        whitespace: "unavailable",
        aestheticCharacter: "unavailable",
        rawAnalysis: "No desktop screenshot available for analysis",
      };
    }
    console.log(`[extract] Feel: ${feel.aestheticCharacter}`);

    // ── Step 7: Store results ─────────────────────────────────────
    console.log("[extract] Saving extraction results...");
    const storage = await saveExtraction(
      url,
      surface,
      structure,
      behavior,
      feel,
      screenshots,
    );
    console.log(`[extract] Saved to ${storage.outputDir}`);

    // ── Step 8: Return full result ────────────────────────────────
    const screenshotPaths: Record<string, string> = {};
    for (const s of screenshots) {
      screenshotPaths[s.viewport] = `screenshot-${s.viewport}.png`;
    }

    res.json({
      url,
      domain: storage.domain,
      extractedAt: new Date().toISOString(),
      outputDir: storage.outputDir,
      surface,
      structure,
      behavior,
      feel,
      screenshots: screenshotPaths,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown extraction error";
    console.error(`[extract] Failed: ${message}`);
    const error: ExtractionError = {
      error: `Extraction failed: ${message}`,
      url,
      stage: "extraction",
    };
    res.status(500).json(error);
  }
});

export default router;
