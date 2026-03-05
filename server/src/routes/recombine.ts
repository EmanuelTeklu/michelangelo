import { Router, type Request, type Response } from "express";
import type { RecombineRequest, TargetComponent } from "../types.js";
import { recombine } from "../recombiner/index.js";

const router = Router();

// ─── Validation ────────────────────────────────────────────────────

const VALID_TARGETS: ReadonlySet<TargetComponent> = new Set([
  "sidebar",
  "card-grid",
  "data-table",
  "stat-bar",
  "hero-section",
  "nav-bar",
]);

interface ValidationError {
  readonly error: string;
  readonly field: string;
}

function validateRequest(body: unknown): ValidationError | null {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be a JSON object", field: "body" };
  }

  const data = body as Record<string, unknown>;

  if (!data.target || typeof data.target !== "string") {
    return { error: "Missing or invalid 'target' field", field: "target" };
  }

  if (!VALID_TARGETS.has(data.target as TargetComponent)) {
    return {
      error: `Invalid target '${data.target}'. Valid targets: ${[...VALID_TARGETS].join(", ")}`,
      field: "target",
    };
  }

  if (!data.parts || typeof data.parts !== "object") {
    return { error: "Missing or invalid 'parts' field. Must be an object with extraction IDs.", field: "parts" };
  }

  const parts = data.parts as Record<string, unknown>;
  const validPartKeys = new Set(["surface", "structure", "behavior", "feel"]);
  for (const key of Object.keys(parts)) {
    if (!validPartKeys.has(key)) {
      return { error: `Unknown part key '${key}'. Valid keys: surface, structure, behavior, feel`, field: `parts.${key}` };
    }
    if (typeof parts[key] !== "string") {
      return { error: `Part '${key}' must be a string (extraction ID)`, field: `parts.${key}` };
    }
  }

  return null;
}

// ─── Route Handler ─────────────────────────────────────────────────

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const validationError = validateRequest(req.body);
  if (validationError !== null) {
    res.status(400).json(validationError);
    return;
  }

  const request = req.body as RecombineRequest;

  console.log(`[api/recombine] Received request for target: ${request.target}`);
  console.log(`[api/recombine] Parts:`, JSON.stringify(request.parts));

  try {
    const result = await recombine(request);

    console.log(
      `[api/recombine] Recombination complete. ` +
      `${result.conflicts.length} conflict(s), ` +
      `${result.code.length} chars of code generated`,
    );

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown recombination error";
    console.error(`[api/recombine] Failed: ${message}`);
    res.status(500).json({
      error: `Recombination failed: ${message}`,
      target: request.target,
    });
  }
});

export default router;
