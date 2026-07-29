export type GuidePhase = "removal" | "install";

export type PhaseImages = {
  removal: string | null;
  install: string | null;
};

const IMAGE_MODEL = "gpt-image-1";

/**
 * Pure — the illustrative (not photo-accurate) prompt for a phase image.
 */
export function buildPhaseImagePrompt(query: string, phase: GuidePhase): string {
  const action = phase === "removal" ? "removing the old" : "installing the new";
  return (
    `Clean technical line-art illustration, no text or labels, plain ` +
    `background, showing a mechanic ${action} part on a car: ${query}.`
  );
}

/**
 * Pure — builds the OpenAI images API request body. Kept separate from
 * the actual fetch so it can be unit-verified without network access.
 */
export function buildImageRequestBody(prompt: string) {
  return {
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "low",
  };
}

/**
 * Pure — parses an OpenAI images API response into a usable image src
 * (a base64 data URI, or a URL if the API returns one instead). Throws on
 * malformed input rather than silently producing a broken image.
 */
export function parseImageFromResponse(imagesJson: unknown): string {
  const first = (
    imagesJson as { data?: { b64_json?: string; url?: string }[] }
  )?.data?.[0];

  if (!first) {
    throw new Error("OpenAI images response missing data");
  }
  if (first.b64_json) {
    return `data:image/png;base64,${first.b64_json}`;
  }
  if (first.url) {
    return first.url;
  }
  throw new Error("OpenAI images response missing b64_json/url");
}

/**
 * The only network-touching piece for a single image.
 */
async function generatePhaseImage(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server");
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildImageRequestBody(prompt)),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `OpenAI images request failed (${response.status}): ${errorText}`
    );
  }

  const json = await response.json();
  return parseImageFromResponse(json);
}

/**
 * Generates one illustration for the removal phase and one for the
 * install phase, in parallel. A failure on either image degrades to
 * `null` for that phase rather than failing the whole guide — the text
 * steps are the important part, images are a bonus.
 */
export async function generatePhaseImages(query: string): Promise<PhaseImages> {
  const [removal, install] = await Promise.allSettled([
    generatePhaseImage(buildPhaseImagePrompt(query, "removal")),
    generatePhaseImage(buildPhaseImagePrompt(query, "install")),
  ]);

  return {
    removal: removal.status === "fulfilled" ? removal.value : null,
    install: install.status === "fulfilled" ? install.value : null,
  };
}
