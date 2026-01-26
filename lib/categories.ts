import { prisma } from "@/lib/prisma";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithCount extends Category {
  postCount: number;
}

export async function getAllCategories(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    postCount: cat._count.posts
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  return category;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  return category;
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
}): Promise<Category> {
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null
    }
  });

  return category;
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
  }
): Promise<Category> {
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description
    }
  });

  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  await prisma.category.delete({
    where: { id }
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
