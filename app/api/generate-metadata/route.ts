import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateMetadata } from "@/lib/grok";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Get all existing tags
    const existingTags = await prisma.tag.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });

    const tagNames = existingTags.map((t) => t.name);

    // Call Grok API
    const result = await generateMetadata(content, tagNames);

    return NextResponse.json({
      excerpt: result.excerpt,
      slug: result.slug,
      tags: result.tags,
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate metadata",
      },
      { status: 500 }
    );
  }
}
