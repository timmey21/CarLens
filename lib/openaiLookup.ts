import type { CarProfile, PartCategory } from "./cars";

const CATEGORIES = [
  "Engine",
  "Brakes & Suspension",
  "Exterior",
  "Interior & Wheels",
] as const;

const MODEL = "gpt-4o-mini";

const RESPONSE_SCHEMA = {
  name: "car_profile",
  strict: true,
  schema: {
    type: "object",
    properties: {
      make: { type: "string" },
      model: { type: "string" },
      year: { type: "string" },
      parts: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: {
          type: "object",
          properties: {
            category: { type: "string", enum: [...CATEGORIES] },
            items: {
              type: "array",
              minItems: 2,
              maxItems: 3,
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  estPriceRange: { type: "string" },
                  sourcing: { type: "string" },
                },
                required: ["name", "estPriceRange", "sourcing"],
                additionalProperties: false,
              },
            },
          },
          required: ["category", "items"],
          additionalProperties: false,
        },
      },
      commonFaults: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: { type: "string" },
      },
    },
    required: ["make", "model", "year", "parts", "commonFaults"],
    additionalProperties: false,
  },
} as const;

/**
 * Pure — builds the OpenAI chat-completions request body. Kept separate
 * from the actual fetch so it can be unit-verified without network access.
 */
export function buildRequestBody(query: string, label: string) {
  return {
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a car parts and pricing reference for an enthusiast app. " +
          "Given a car, produce a plausible parts breakdown with realistic " +
          "estimated USD price ranges and generic sourcing (e.g. 'OEM " +
          "dealer', 'aftermarket'), plus common known faults for that model. " +
          "Use exactly these 4 categories, once each, in this order: " +
          CATEGORIES.join(", ") +
          ". This is an estimate for a demo app, not verified pricing data.",
      },
      {
        role: "user",
        content: `Car: ${label}${query && query !== label ? ` (searched as "${query}")` : ""}`,
      },
    ],
    response_format: { type: "json_schema", json_schema: RESPONSE_SCHEMA },
    max_tokens: 900,
  };
}

/**
 * Pure — parses an OpenAI chat-completions response into a CarProfile.
 * Throws on malformed input rather than silently producing bad data.
 */
export function parseCarProfileFromResponse(openaiJson: unknown): CarProfile {
  const content = (
    openaiJson as {
      choices?: { message?: { content?: string } }[];
    }
  )?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("OpenAI response missing message content");
  }

  const parsed = JSON.parse(content) as {
    make: string;
    model: string;
    year: string;
    parts: PartCategory[];
    commonFaults: string[];
  };

  if (!parsed.make || !parsed.model || !Array.isArray(parsed.parts)) {
    throw new Error("OpenAI response JSON missing required fields");
  }

  return {
    make: parsed.make,
    model: parsed.model,
    year: parsed.year ?? "",
    aliases: [],
    parts: parsed.parts,
    commonFaults: parsed.commonFaults ?? [],
  };
}

/**
 * The only network-touching piece. Everything else in this file is pure
 * and can be exercised without hitting OpenAI.
 */
export async function generateCarProfile(
  query: string,
  label: string
): Promise<CarProfile> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildRequestBody(query, label)),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  return parseCarProfileFromResponse(json);
}
