import Anthropic from "@anthropic-ai/sdk";
import type { FeelData } from "../types.js";

const FEEL_PROMPT = `Analyze this UI screenshot. Describe:
(1) information density — sparse or dense
(2) visual rhythm — how elements are spaced and grouped
(3) hierarchy — how importance is communicated
(4) whitespace usage
(5) overall aesthetic character in 2-3 words

Return as JSON with these exact keys:
{
  "density": "...",
  "rhythm": "...",
  "hierarchy": "...",
  "whitespace": "...",
  "aestheticCharacter": "..."
}

Return ONLY valid JSON, no markdown fences or extra text.`;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is required. " +
        "Copy .env.example to .env and add your key."
    );
  }
  return new Anthropic({ apiKey });
}

export async function analyzeScreenshot(
  screenshotBase64: string
): Promise<FeelData> {
  const client = getClient();

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: screenshotBase64,
            },
          },
          {
            type: "text",
            text: FEEL_PROMPT,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude vision analysis");
  }

  const rawText = textBlock.text.trim();

  try {
    const parsed = JSON.parse(rawText) as Record<string, string>;
    return {
      density: parsed.density ?? "unknown",
      rhythm: parsed.rhythm ?? "unknown",
      hierarchy: parsed.hierarchy ?? "unknown",
      whitespace: parsed.whitespace ?? "unknown",
      aestheticCharacter: parsed.aestheticCharacter ?? "unknown",
      rawAnalysis: rawText,
    };
  } catch {
    // If Claude returns non-JSON, wrap the raw text
    return {
      density: "unparseable",
      rhythm: "unparseable",
      hierarchy: "unparseable",
      whitespace: "unparseable",
      aestheticCharacter: "unparseable",
      rawAnalysis: rawText,
    };
  }
}
