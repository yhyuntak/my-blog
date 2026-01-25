import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/posts - Get all posts (admin can see unpublished)
export async function GET(request: NextRequest) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  const posts = await prisma.post.findMany({
    where: isAdmin ? {} : { published: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ posts });
}

// POST /api/posts - Create new post (admin only)
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, tags, published } = body;

    // Check if slug already exists
    const existing = await prisma.post.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    // Create post with tag relationships
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        published: published ?? true,
        authorId: session.user.id,
        tags: {
          create: await Promise.all(
            (tags || []).map(async (tagName: string) => {
              const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");

              // Find or create tag
              const tag = await prisma.tag.upsert({
                where: { slug: tagSlug },
                update: {},
                create: {
                  name: tagName,
                  slug: tagSlug,
                },
              });

              return {
                tag: {
                  connect: { id: tag.id },
                },
              };
            })
          ),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
