export type InstallStep = {
  phase: "removal" | "install";
  instruction: string;
  detail: string;
};

const MODEL = "gpt-4o-mini";

const INSTALL_GUIDE_SCHEMA = {
  name: "install_guide",
  strict: true,
  schema: {
    type: "object",
    properties: {
      steps: {
        type: "array",
        minItems: 8,
        maxItems: 18,
        items: {
          type: "object",
          properties: {
            phase: { type: "string", enum: ["removal", "install"] },
            instruction: { type: "string" },
            detail: { type: "string" },
          },
          required: ["phase", "instruction", "detail"],
          additionalProperties: false,
        },
      },
    },
    required: ["steps"],
    additionalProperties: false,
  },
} as const;

/**
 * Pure — builds the OpenAI chat-completions request body. Kept separate
 * from the actual fetch so it can be unit-verified without network access.
 */
export function buildInstallGuideRequestBody(query: string) {
  return {
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a mechanic's assistant for a car parts app. Given a car " +
          "and part, produce a detailed, ordered step-by-step guide: first " +
          "the steps to remove the old/existing part (phase 'removal'), " +
          "then the steps to install the new one (phase 'install'). Break " +
          "the job into enough granular steps that a beginner could follow " +
          "along — separate steps for things like disconnecting the " +
          "battery, removing fasteners, disconnecting electrical " +
          "connectors, and torquing things back down, rather than " +
          "combining them. Each step has two parts: 'instruction' — one " +
          "short, clear action, since each step is its own page in a " +
          "flip-through booklet — and 'detail' — one extra sentence with " +
          "the specifics that matter (torque spec, which direction, what " +
          "to watch out for, what tool to use). This is general guidance " +
          "for an enthusiast app, not a certified repair manual.",
      },
      {
        role: "user",
        content: `Part: ${query}`,
      },
    ],
    response_format: { type: "json_schema", json_schema: INSTALL_GUIDE_SCHEMA },
    max_tokens: 900,
  };
}

/**
 * Pure — parses an OpenAI chat-completions response into InstallSteps.
 * Throws on malformed input rather than silently producing bad data.
 */
export function parseInstallGuideFromResponse(
  openaiJson: unknown
): InstallStep[] {
  const content = (
    openaiJson as {
      choices?: { message?: { content?: string } }[];
    }
  )?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("OpenAI response missing message content");
  }

  const parsed = JSON.parse(content) as { steps?: InstallStep[] };
  if (!Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    throw new Error("OpenAI response JSON missing steps array");
  }

  for (const step of parsed.steps) {
    if (
      !step.instruction ||
      !step.detail ||
      (step.phase !== "removal" && step.phase !== "install")
    ) {
      throw new Error("OpenAI response step missing required fields");
    }
  }

  return parsed.steps;
}

/**
 * The only network-touching piece. Everything else in this file is pure
 * and can be exercised without hitting OpenAI.
 */
export async function generateInstallGuide(query: string): Promise<InstallStep[]> {
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
    body: JSON.stringify(buildInstallGuideRequestBody(query)),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  return parseInstallGuideFromResponse(json);
}
