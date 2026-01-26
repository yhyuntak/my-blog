import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getCategoryById } from "@/lib/categories";
import CategoryForm from "@/components/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground mt-2">
            Update category information
          </p>
        </div>

        <CategoryForm category={category} />
      </div>
    </div>
  );
}
