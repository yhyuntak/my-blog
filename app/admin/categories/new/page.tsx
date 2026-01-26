import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CategoryForm from "@/components/category-form";

export default async function NewCategoryPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
          <p className="text-muted-foreground mt-2">
            Create a new blog category
          </p>
        </div>

        <CategoryForm />
      </div>
    </div>
  );
}
