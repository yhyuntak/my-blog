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
      category: {
        select: {
          name: true,
          slug: true,
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

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
    || `post-${Date.now()}`;
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 2;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// POST /api/posts - Create new post (admin only)
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    let { title, slug, content, excerpt, coverImage, categoryId, tags, published } = body;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Auto-generate slug if empty
    if (!slug || slug.trim() === '') {
      slug = generateSlug(title);
    }

    // Ensure slug is unique
    slug = await ensureUniqueSlug(slug);

    // Create post with tag relationships
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        categoryId,
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
