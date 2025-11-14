// Common types will be defined here
export interface User {
  id: string;
  username: string | null;
  githubUsername: string | null;
  role: 'admin' | 'user';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  depth: number;
  isSystem: boolean;
  order: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  isPublic: boolean;
  categoryId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
