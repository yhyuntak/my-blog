import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { FolderTree } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} - Blog`,
    description: category.description || `Posts in ${category.name} category`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <FolderTree className="h-4 w-4" />
            <span className="text-sm font-medium">Category</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground">
              {category.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No posts in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
