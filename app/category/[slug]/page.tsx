import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getChildCategories } from "@/lib/categories";
import { getPostsByCategoryPaginated } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { CategorySidebar } from "@/components/category-sidebar";
import { FolderTree, Folder, ChevronRight } from "lucide-react";
import { auth } from "@/auth";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sub?: string;
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page, sub } = await searchParams;
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const currentPage = page ? parseInt(page, 10) : 1;
  const children = await getChildCategories(category.id);

  // Determine which posts to show based on ?sub parameter
  const targetSlug = sub || slug;
  const postsResult = await getPostsByCategoryPaginated(targetSlug, currentPage, 6, isAdmin);

  // Find selected subcategory info if sub is present
  const selectedSubcategory = sub ? children.find(c => c.slug === sub) : null;

  const hasSubcategories = children.length > 0;
  const isShowingSubcategory = !!selectedSubcategory;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          {/* Breadcrumb */}
          {category.parent && (
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href={`/category/${category.parent.slug}`}
                className="hover:text-foreground transition-colors cursor-pointer"
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
            {isShowingSubcategory ? (
              <>
                {category.name} <span className="text-muted-foreground">/</span> {selectedSubcategory.name}
              </>
            ) : (
              category.name
            )}
          </h1>

          {isShowingSubcategory && selectedSubcategory.description ? (
            <p className="text-lg text-muted-foreground">
              {selectedSubcategory.description}
            </p>
          ) : category.description && !isShowingSubcategory ? (
            <p className="text-lg text-muted-foreground">
              {category.description}
            </p>
          ) : null}

          <p className="text-sm text-muted-foreground">
            {postsResult.totalCount} {postsResult.totalCount === 1 ? "post" : "posts"}
          </p>
        </div>

        {/* Main Content */}
        {hasSubcategories ? (
          /* Sidebar Layout for categories with subcategories */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Subcategories */}
            <CategorySidebar
              categoryName={category.name}
              categorySlug={category.slug}
              categoryPostCount={category.postCount}
              subcategories={children}
            />

            {/* Posts */}
            <div className="flex-1 min-w-0">
              {postsResult.items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    No posts in this category yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    {postsResult.items.map((post) => (
                      <PostCard key={post.slug} post={post} isAdmin={isAdmin} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={postsResult.currentPage}
                    totalPages={postsResult.totalPages}
                    baseUrl={`/category/${slug}${sub ? `?sub=${sub}` : ""}`}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Simple Layout for categories without subcategories */
          <>
            {postsResult.items.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No posts in this category yet.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  {postsResult.items.map((post) => (
                    <PostCard key={post.slug} post={post} isAdmin={isAdmin} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={postsResult.currentPage}
                  totalPages={postsResult.totalPages}
                  baseUrl={`/category/${slug}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
