import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCategory, getAllCategories, getRootCategories } from "@/lib/categories";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rootOnly = searchParams.get("rootOnly") === "true";

    const categories = rootOnly
      ? await getRootCategories()
      : await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, parentId } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const category = await createCategory({
      name,
      slug,
      description,
      parentId,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
