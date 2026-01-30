import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithCount extends Category {
  postCount: number;
}

export interface CategoryWithChildren extends CategoryWithCount {
  children: CategoryWithCount[];
}

export interface CategoryWithParent extends CategoryWithCount {
  parent: { id: string; name: string; slug: string } | null;
}

// Get all categories as a flat list with counts
export const getAllCategories = cache(async (): Promise<CategoryWithCount[]> => {
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
    parentId: cat.parentId,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    postCount: cat._count.posts
  }));
});

// Get categories as a hierarchical tree (only root categories with their children)
export const getCategoriesTree = cache(async (): Promise<CategoryWithChildren[]> => {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: {
        select: { posts: true }
      },
      children: {
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: { name: "asc" }
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
    parentId: cat.parentId,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    postCount: cat._count.posts,
    children: cat.children.map(child => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      description: child.description,
      parentId: child.parentId,
      createdAt: child.createdAt,
      updatedAt: child.updatedAt,
      postCount: child._count.posts
    }))
  }));
});

// Get root categories only (no parent)
export const getRootCategories = cache(async (): Promise<CategoryWithCount[]> => {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
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
    parentId: cat.parentId,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    postCount: cat._count.posts
  }));
});

export const getCategoryBySlug = cache(async (slug: string): Promise<CategoryWithParent | null> => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { posts: true }
      },
      parent: {
        select: { id: true, name: true, slug: true }
      }
    }
  });

  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    postCount: category._count.posts,
    parent: category.parent
  };
});

export async function getCategoryById(id: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  return category;
}

// Get children of a category
export async function getChildCategories(parentId: string): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    where: { parentId },
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
    parentId: cat.parentId,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    postCount: cat._count.posts
  }));
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
}): Promise<Category> {
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      parentId: data.parentId || null
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
    parentId?: string | null;
  }
): Promise<Category> {
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId
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
