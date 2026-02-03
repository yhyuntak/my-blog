import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Search-optimized endpoint - returns only fields needed for search
// Payload is significantly smaller than the full posts API

export const revalidate = 60;

export interface SearchPost {
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const searchPosts: SearchPost[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    categoryName: post.category.name,
    categorySlug: post.category.slug,
    tags: post.tags.map((t) => t.tag.name),
  }));

  return NextResponse.json({ posts: searchPosts });
}
