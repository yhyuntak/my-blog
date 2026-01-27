import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCategoriesTree } from "@/lib/categories";
import { Pencil, Trash2, Plus, FolderTree, Folder } from "lucide-react";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const categories = await getCategoriesTree();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground mt-2">
              Manage blog categories
            </p>
          </div>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Category
          </Link>
        </div>

        <div className="rounded-lg border">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No categories yet. Create your first category to get started.
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <div key={category.id}>
                  {/* Parent Category */}
                  <div className="p-4 hover:bg-secondary/50 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <FolderTree className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{category.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          /{category.slug}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-secondary rounded-full">
                          {category.postCount} posts
                        </span>
                        {category.children.length > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                            {category.children.length} subcategories
                          </span>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1 ml-7">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={`/api/categories/${category.id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <button
                          type="submit"
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50"
                          disabled={category.postCount > 0 || category.children.length > 0}
                          title={
                            category.postCount > 0
                              ? "Cannot delete category with posts"
                              : category.children.length > 0
                              ? "Cannot delete category with subcategories"
                              : "Delete category"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Children */}
                  {category.children.map((child) => (
                    <div
                      key={child.id}
                      className="p-4 pl-12 hover:bg-secondary/50 flex items-center justify-between border-l-2 border-primary/20 ml-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-medium">{child.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            /{child.slug}
                          </span>
                          <span className="px-2 py-0.5 text-xs bg-secondary rounded-full">
                            {child.postCount} posts
                          </span>
                        </div>
                        {child.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1 ml-7">
                            {child.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/categories/${child.id}/edit`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={`/api/categories/${child.id}`} method="POST">
                          <input type="hidden" name="_method" value="DELETE" />
                          <button
                            type="submit"
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50"
                            disabled={child.postCount > 0}
                            title={
                              child.postCount > 0
                                ? "Cannot delete category with posts"
                                : "Delete category"
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
