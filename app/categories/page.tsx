import Link from "next/link";
import { getAllCategories } from "@/lib/categories";
import { FolderTree, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Categories - Blog",
  description: "Browse posts by category",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Browse posts by category
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No categories available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderTree className="h-5 w-5 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-lg truncate">
                        {category.name}
                      </h3>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {category.postCount}{" "}
                        {category.postCount === 1 ? "post" : "posts"}
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
