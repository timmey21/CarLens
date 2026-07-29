export type PriceResult = {
  retailer: string;
  price: string;
  url: string;
};

const MODEL = "gpt-4o-mini";

const PRICE_RESPONSE_SCHEMA = {
  name: "price_results",
  strict: true,
  schema: {
    type: "object",
    properties: {
      results: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            retailer: { type: "string" },
            price: { type: "string" },
            url: { type: "string" },
          },
          required: ["retailer", "price", "url"],
          additionalProperties: false,
        },
      },
    },
    required: ["results"],
    additionalProperties: false,
  },
} as const;

/**
 * Pure — builds the OpenAI Responses API request body. Kept separate from
 * the actual fetch so it can be unit-verified without network access.
 */
export function buildPriceSearchRequestBody(query: string) {
  return {
    model: MODEL,
    input: [
      {
        role: "system",
        content:
          "You are a shopping assistant for a car parts app. Use web search " +
          "to find 3 real, currently-available listings for the requested " +
          "part, from different retailers where possible. Only report a " +
          "listing you actually found via search — never invent a URL, " +
          "retailer name, or price. Copy the listing URL exactly as found.",
      },
      {
        role: "user",
        content: `Find the 3 best current prices for: ${query}`,
      },
    ],
    tools: [{ type: "web_search" }],
    tool_choice: "auto",
    text: {
      format: {
        type: "json_schema",
        name: PRICE_RESPONSE_SCHEMA.name,
        schema: PRICE_RESPONSE_SCHEMA.schema,
        strict: true,
      },
    },
  };
}

/**
 * Pure — parses an OpenAI Responses API response into PriceResults. Walks
 * the output array defensively rather than assuming a fixed item order,
 * since `output` can also contain web_search_call items alongside the
 * final message. Throws on malformed input rather than silently returning
 * bad data.
 */
export function parsePriceResultsFromResponse(
  responsesJson: unknown
): PriceResult[] {
  const output = (responsesJson as { output?: unknown[] })?.output;
  if (!Array.isArray(output)) {
    throw new Error("OpenAI response missing output array");
  }

  const messageItem = output.find(
    (item): item is { type: string; content?: unknown[] } =>
      typeof item === "object" &&
      item !== null &&
      (item as { type?: string }).type === "message"
  );
  if (!messageItem || !Array.isArray(messageItem.content)) {
    throw new Error("OpenAI response missing message content");
  }

  const textItem = messageItem.content.find(
    (part): part is { type: string; text?: string } =>
      typeof part === "object" &&
      part !== null &&
      (part as { type?: string }).type === "output_text"
  );
  if (!textItem || typeof textItem.text !== "string") {
    throw new Error("OpenAI response missing output_text content");
  }

  const parsed = JSON.parse(textItem.text) as { results?: PriceResult[] };
  if (!Array.isArray(parsed.results) || parsed.results.length === 0) {
    throw new Error("OpenAI response JSON missing results array");
  }

  for (const result of parsed.results) {
    if (!result.retailer || !result.price || !result.url) {
      throw new Error("OpenAI response result missing required fields");
    }
  }

  return parsed.results;
}

/**
 * The only network-touching piece. Everything else in this file is pure
 * and can be exercised without hitting OpenAI.
 */
export async function searchPartPrices(query: string): Promise<PriceResult[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildPriceSearchRequestBody(query)),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  return parsePriceResultsFromResponse(json);
}
