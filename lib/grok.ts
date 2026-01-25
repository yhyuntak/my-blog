interface GrokResponse {
  excerpt: string;
  slug: string;
  tags: string[];
}

export async function generateMetadata(
  content: string,
  existingTags: string[]
): Promise<GrokResponse> {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    throw new Error("GROK_API_KEY is not configured");
  }

  const prompt = `You are a technical blog metadata generator. Analyze the following blog post content and generate:
1. A concise excerpt (100-160 characters) that summarizes the main point
2. An SEO-friendly URL slug (English only, lowercase, hyphen-separated)
3. 3-5 broad category tags (prefer general topics over specific versions or features)

Excerpt Guidelines:
- Write a COMPLETE sentence or phrase (do NOT truncate with "...")
- Length: 100-160 characters
- If the natural sentence is longer, rephrase to fit within the limit
- DO NOT add ellipsis (...) - system will handle truncation if needed
- Example: "Learn how Next.js App Router improves performance with Server Components and streaming" (good)
- Example: "Learn how Next.js App Router improves performance with Server Compone..." (bad - do NOT do this)

Slug Guidelines:
- Use ONLY English words (no Korean, no romanization)
- Use lowercase with hyphens (e.g., "nextjs-performance-optimization")
- Keep it short (3-6 words maximum)
- Focus on main keywords from the title/content
- Examples: "react-hooks-guide", "nextjs-server-components", "typescript-best-practices"

Tag Guidelines:
- Use BROAD categories (e.g., "React" instead of "React Hooks" or "React 18")
- Avoid version numbers (e.g., "Next.js" instead of "Next.js 15")
- Prefer general frameworks/languages over specific features (e.g., "JavaScript" instead of "ES6 Modules")
- Limit to 3-5 tags maximum
- Reuse existing tags when possible

Existing tags: ${existingTags.length > 0 ? existingTags.join(", ") : "none"}

Blog post content:
${content}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{"excerpt":"your excerpt here","slug":"your-slug-here","tags":["tag1","tag2","tag3"]}`;

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates blog metadata in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "grok-4-1-fast-reasoning",
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Grok API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    const generatedText =
      data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Grok response");
    }

    const result: GrokResponse = JSON.parse(jsonMatch[0]);

    // Validate response
    if (!result.excerpt || !Array.isArray(result.tags)) {
      throw new Error("Invalid response format from Grok");
    }

    // Limit excerpt to 160 characters
    if (result.excerpt.length > 160) {
      result.excerpt = result.excerpt.substring(0, 157) + "...";
    }

    return result;
  } catch (error) {
    console.error("Error calling Grok API:", error);
    throw error;
  }
}
