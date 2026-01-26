import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/posts/[slug] - Get single post
export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  const post = await prisma.post.findUnique({
    where: { slug },
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

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Non-admin users can only see published posts
  if (!isAdmin && !post.published) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

// PUT /api/posts/[slug] - Update post (admin only)
export async function PUT(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, excerpt, coverImage, categoryId, tags, published } = body;

    // Get post to access its ID
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete existing tag relationships
    await prisma.postTag.deleteMany({
      where: { postId: existingPost.id },
    });

    // Create new tag relationships
    const tagData = await Promise.all(
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
    );

    const post = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        categoryId: categoryId || undefined,
        published: published ?? true,
        tags: {
          create: tagData,
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

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - Delete post (admin only)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.post.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
