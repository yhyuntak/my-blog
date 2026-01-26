"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/categories";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
  };
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [description, setDescription] = useState(category?.description || "");
  const [parentId, setParentId] = useState<string>(category?.parentId || "");
  const [autoSlug, setAutoSlug] = useState(!category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch root categories for parent selection
    fetch("/api/categories?rootOnly=true")
      .then((res) => res.json())
      .then((data) => {
        // Filter out current category if editing (can't be parent of itself)
        const filtered = category
          ? data.filter((c: Category) => c.id !== category.id)
          : data;
        setCategories(filtered);
      })
      .catch(console.error);
  }, [category]);

  useEffect(() => {
    if (autoSlug && name) {
      setSlug(slugify(name));
    }
  }, [name, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = category
        ? `/api/categories/${category.id}`
        : "/api/categories";
      const method = category ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description: description || null,
          parentId: parentId || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save category");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="parentId" className="block text-sm font-medium mb-2">
            Parent Category
          </label>
          <select
            id="parentId"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">None (Root Category)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground mt-1">
            Leave empty to create a root category
          </p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Development"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-2">
            Slug *
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              required
              pattern="[a-z0-9-]+"
              className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="development"
            />
            {!category && (
              <button
                type="button"
                onClick={() => setAutoSlug(true)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-secondary"
              >
                Auto
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            URL-friendly version (lowercase, hyphens only)
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="A brief description of this category"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : category
              ? "Update Category"
              : "Create Category"}
          </button>
          <Link
            href="/admin/categories"
            className="px-6 py-2 border rounded-lg hover:bg-secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
