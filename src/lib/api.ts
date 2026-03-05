import type { ExtractionResult } from "./types";

const BASE_URL = "http://localhost:3001";

export class ExtractionError extends Error {
  readonly statusCode: number | null;

  constructor(message: string, statusCode: number | null = null) {
    super(message);
    this.name = "ExtractionError";
    this.statusCode = statusCode;
  }
}

interface ExtractRequest {
  readonly url: string;
  readonly viewport?: { readonly width: number; readonly height: number };
}

interface ExtractResponse {
  readonly success: boolean;
  readonly data?: ExtractionResult;
  readonly error?: string;
}

export async function extractAesthetics(
  request: ExtractRequest,
): Promise<ExtractionResult> {
  const payload = {
    url: request.url,
    viewport: request.viewport ?? { width: 1440, height: 900 },
  };

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}/api/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ExtractionError(
      "Extraction engine not running. Start with: cd server && npm run dev",
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new ExtractionError(
      `Extraction failed: ${text}`,
      response.status,
    );
  }

  const json = (await response.json()) as ExtractResponse;

  if (!json.success || json.data === undefined) {
    throw new ExtractionError(json.error ?? "Extraction returned no data");
  }

  return json.data;
}

export async function checkEngineHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
