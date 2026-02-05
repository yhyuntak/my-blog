import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
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

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
    || `post-${Date.now()}`;
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(baseSlug: string, excludeSlug?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.slug === excludeSlug) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
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
    let { title, slug: newSlug, content, excerpt, coverImage, categoryId, tags, published } = body;

    // Get post to access its ID
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Handle slug changes (only allowed for drafts)
    let finalSlug = slug; // Keep original by default

    if (newSlug && newSlug !== slug) {
      // Published posts cannot change slug
      if (existingPost.published) {
        return NextResponse.json(
          { error: "Cannot change slug of published post" },
          { status: 400 }
        );
      }

      // Draft posts can change slug
      finalSlug = await ensureUniqueSlug(newSlug, slug);
    } else if (!existingPost.published && (!newSlug || newSlug.trim() === '')) {
      // Auto-generate slug if empty for drafts
      finalSlug = await ensureUniqueSlug(generateSlug(title), slug);
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
        slug: finalSlug,
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

    // 캐시 무효화
    revalidateTag("homepage-data", { expire: 0 });
    revalidatePath("/");

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

    // 캐시 무효화 - 홈페이지와 포스트 목록 갱신
    revalidateTag("homepage-data", { expire: 0 });
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
