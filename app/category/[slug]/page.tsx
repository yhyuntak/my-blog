import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getChildCategories } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { FolderTree, Folder, ChevronRight } from "lucide-react";

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
  const children = await getChildCategories(category.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          {/* Breadcrumb */}
          {category.parent && (
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href={`/category/${category.parent.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {category.parent.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{category.name}</span>
            </nav>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            {category.parent ? (
              <Folder className="h-4 w-4" />
            ) : (
              <FolderTree className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {category.parent ? "Subcategory" : "Category"}
            </span>
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

        {/* Subcategories */}
        {children.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Subcategories</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {child.postCount} posts
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No posts in this category yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {children.length > 0 && (
              <h2 className="text-xl font-semibold">Posts</h2>
            )}
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
