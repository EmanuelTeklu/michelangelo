import { createPage, navigateToUrl } from "./browser.js";
import {
  VIEWPORT_CONFIGS,
  type Viewport,
  type ViewportConfig,
} from "../types.js";

export interface ScreenshotResult {
  readonly viewport: Viewport;
  readonly buffer: Buffer;
  readonly width: number;
  readonly height: number;
}

async function captureAtViewport(
  url: string,
  config: ViewportConfig,
): Promise<ScreenshotResult> {
  const page = await createPage(config.width, config.height);
  try {
    await navigateToUrl(page, url);
    const buffer = await page.screenshot({
      fullPage: true,
      type: "png",
    });
    return {
      viewport: config.name,
      buffer: Buffer.from(buffer),
      width: config.width,
      height: config.height,
    };
  } finally {
    await page.close();
  }
}

export async function captureAllBreakpoints(
  url: string,
): Promise<ReadonlyArray<ScreenshotResult>> {
  const results = await Promise.all(
    VIEWPORT_CONFIGS.map((config) => captureAtViewport(url, config)),
  );
  return results;
}

export function findScreenshot(
  screenshots: ReadonlyArray<ScreenshotResult>,
  viewport: Viewport,
): ScreenshotResult | undefined {
  return screenshots.find((s) => s.viewport === viewport);
}
