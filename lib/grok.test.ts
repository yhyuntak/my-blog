import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateMetadata } from "./grok";

// Mock fetch globally
global.fetch = vi.fn();

describe("grok.ts - generateMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up env variable
    process.env.GROK_API_KEY = "test-api-key";
  });

  it("should generate metadata successfully with valid response", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              excerpt: "This is a test excerpt about Next.js",
              slug: "nextjs-react-guide",
              tags: ["Next.js", "React", "TypeScript"],
            }),
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await generateMetadata(
      "This is a blog post about Next.js and React",
      ["JavaScript", "Web Development"]
    );

    expect(result).toEqual({
      excerpt: "This is a test excerpt about Next.js",
      slug: "nextjs-react-guide",
      tags: ["Next.js", "React", "TypeScript"],
    });

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.x.ai/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-api-key",
        },
        body: expect.stringContaining("grok-4-1-fast-reasoning"),
      })
    );
  });

  it("should truncate excerpt if longer than 160 characters", async () => {
    const longExcerpt =
      "This is a very long excerpt that exceeds the maximum character limit of 160 characters and should be truncated to fit within the specified limit for SEO purposes";

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              excerpt: longExcerpt,
              slug: "test-slug",
              tags: ["Test"],
            }),
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await generateMetadata("Test content", []);

    expect(result.excerpt.length).toBeLessThanOrEqual(160);
    expect(result.excerpt).toMatch(/\.\.\.$/);
  });

  it("should throw error if GROK_API_KEY is not set", async () => {
    delete process.env.GROK_API_KEY;

    await expect(
      generateMetadata("Test content", [])
    ).rejects.toThrow("GROK_API_KEY is not configured");
  });

  it("should throw error if API response is not ok", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    await expect(
      generateMetadata("Test content", [])
    ).rejects.toThrow("Grok API error (401): Unauthorized");
  });

  it("should throw error if response has no JSON", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: "This is not JSON",
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(
      generateMetadata("Test content", [])
    ).rejects.toThrow("No JSON found in Grok response");
  });

  it("should throw error if response has invalid format", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              excerpt: "Valid excerpt",
              slug: "test-slug",
              // Missing tags array
            }),
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(
      generateMetadata("Test content", [])
    ).rejects.toThrow("Invalid response format from Grok");
  });

  it("should include existing tags in the prompt", async () => {
    const existingTags = ["JavaScript", "React", "TypeScript"];

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              excerpt: "Test excerpt",
              slug: "test-slug",
              tags: ["JavaScript"],
            }),
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await generateMetadata("Test content", existingTags);

    const fetchCall = (global.fetch as any).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    const userMessage = requestBody.messages.find(
      (m: any) => m.role === "user"
    );

    expect(userMessage.content).toContain(existingTags.join(", "));
  });

  it("should use correct model name", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              excerpt: "Test",
              slug: "test-slug",
              tags: ["Test"],
            }),
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await generateMetadata("Test content", []);

    const fetchCall = (global.fetch as any).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);

    expect(requestBody.model).toBe("grok-4-1-fast-reasoning");
    expect(requestBody.temperature).toBe(0.7);
    expect(requestBody.stream).toBe(false);
  });
});
