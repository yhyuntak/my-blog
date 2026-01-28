import { prisma } from "@/lib/prisma";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import readingTime from "reading-time";

export interface PostMatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: Array<{name: string; slug: string}>;
  category: {name: string; slug: string};
  author?: string;
  coverImage?: string;
}

export interface Post extends PostMatter {
  slug: string;
  content: string;
  readingTime: string;
  published: boolean;
}

export interface PostPreview extends PostMatter {
  slug: string;
  readingTime: string;
  published: boolean;
}

export async function getPostBySlug(slug: string, includeDraft: boolean = false): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { slug, ...(includeDraft ? {} : { published: true }) },
    include: {
      author: {
        select: {
          name: true,
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
          tag: {
            select: { name: true, slug: true }
          }
        }
      }
    },
  });

  if (!post) {
    return null;
  }

  const stats = readingTime(post.content);
  const tags = post.tags.map(pt => ({name: pt.tag.name, slug: pt.tag.slug}));

  return {
    slug: post.slug,
    title: post.title,
    date: post.createdAt.toISOString(),
    excerpt: post.excerpt || "",
    tags,
    category: { name: post.category.name, slug: post.category.slug },
    author: post.author.name || undefined,
    coverImage: post.coverImage || undefined,
    content: post.content,
    readingTime: stats.text,
    published: post.published,
  };
}

export async function getPostContent(slug: string, includeDraft: boolean = false): Promise<string | null> {
  const post = await getPostBySlug(slug, includeDraft);
  if (!post) {
    return null;
  }

  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(post.content);

  return processedContent.toString();
}

export async function getAllPosts(includeDraft: boolean = false): Promise<PostPreview[]> {
  const posts = await prisma.post.findMany({
    where: includeDraft ? {} : { published: true },
    include: {
      author: {
        select: {
          name: true,
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
          tag: {
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => {
    const stats = readingTime(post.content);
    const tags = post.tags.map(pt => ({name: pt.tag.name, slug: pt.tag.slug}));

    return {
      slug: post.slug,
      title: post.title,
      date: post.createdAt.toISOString(),
      excerpt: post.excerpt || "",
      tags,
      category: { name: post.category.name, slug: post.category.slug },
      author: post.author.name || undefined,
      coverImage: post.coverImage || undefined,
      readingTime: stats.text,
      published: post.published,
    };
  });
}

export async function getPostsByTag(tag: string, includeDraft: boolean = false): Promise<PostPreview[]> {
  const posts = await prisma.post.findMany({
    where: {
      ...(includeDraft ? {} : { published: true }),
      tags: {
        some: {
          tag: {
            slug: tag
          }
        }
      }
    },
    include: {
      author: {
        select: {
          name: true,
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
          tag: {
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => {
    const stats = readingTime(post.content);
    const tags = post.tags.map(pt => ({name: pt.tag.name, slug: pt.tag.slug}));

    return {
      slug: post.slug,
      title: post.title,
      date: post.createdAt.toISOString(),
      excerpt: post.excerpt || "",
      tags,
      category: { name: post.category.name, slug: post.category.slug },
      author: post.author.name || undefined,
      coverImage: post.coverImage || undefined,
      readingTime: stats.text,
      published: post.published,
    };
  });
}

export async function getPostsByCategory(categorySlug: string, includeDraft: boolean = false): Promise<PostPreview[]> {
  const posts = await prisma.post.findMany({
    where: {
      ...(includeDraft ? {} : { published: true }),
      category: {
        slug: categorySlug
      }
    },
    include: {
      author: {
        select: {
          name: true,
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
          tag: {
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => {
    const stats = readingTime(post.content);
    const tags = post.tags.map(pt => ({name: pt.tag.name, slug: pt.tag.slug}));

    return {
      slug: post.slug,
      title: post.title,
      date: post.createdAt.toISOString(),
      excerpt: post.excerpt || "",
      tags,
      category: { name: post.category.name, slug: post.category.slug },
      author: post.author.name || undefined,
      coverImage: post.coverImage || undefined,
      readingTime: stats.text,
      published: post.published,
    };
  });
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getPostsByCategoryPaginated(
  categorySlug: string,
  page: number = 1,
  perPage: number = 6,
  includeDraft: boolean = false
): Promise<PaginatedResult<PostPreview>> {
  const skip = (page - 1) * perPage;

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: {
        ...(includeDraft ? {} : { published: true }),
        category: {
          slug: categorySlug
        }
      },
      include: {
        author: {
          select: {
            name: true,
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
            tag: {
              select: { name: true, slug: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: perPage,
    }),
    prisma.post.count({
      where: {
        ...(includeDraft ? {} : { published: true }),
        category: {
          slug: categorySlug
        }
      }
    })
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  const items = posts.map((post) => {
    const stats = readingTime(post.content);
    const tags = post.tags.map(pt => ({name: pt.tag.name, slug: pt.tag.slug}));

    return {
      slug: post.slug,
      title: post.title,
      date: post.createdAt.toISOString(),
      excerpt: post.excerpt || "",
      tags,
      category: { name: post.category.name, slug: post.category.slug },
      author: post.author.name || undefined,
      coverImage: post.coverImage || undefined,
      readingTime: stats.text,
      published: post.published,
    };
  });

  return {
    items,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function getAllTags(): Promise<{ name: string; slug: string; count: number }[]> {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    }
  });

  return tags
    .map(t => ({
      name: t.name,
      slug: t.slug,
      count: t._count.posts
    }))
    .filter(t => t.count > 0)
    .sort((a, b) => b.count - a.count);
}

// Synchronous versions for server components that need them
export function getAllPostsSync(): PostPreview[] {
  throw new Error("Use getAllPosts() instead - this is now async");
}

export function getPostBySlugSync(slug: string): Post {
  throw new Error("Use getPostBySlug() instead - this is now async");
}
