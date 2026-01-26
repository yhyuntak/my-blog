"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { TagSelector } from "./tag-selector";

interface PostFormProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    categoryId?: string;
    tags: Array<{name: string; slug: string}> | string;
    published: boolean;
  };
  isEdit?: boolean;
}

export function PostForm({ initialData, isEdit = false }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{id: string; name: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    coverImage: initialData?.coverImage || "",
    categoryId: initialData?.categoryId || "",
    tags: initialData?.tags
      ? (typeof initialData.tags === 'string'
          ? initialData.tags.split(",").map(t => t.trim())
          : initialData.tags.map(t => t.name))
      : [],
    published: initialData?.published ?? true,
  });

  useEffect(() => {
    // Fetch available tags
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => {
        const tagSet = new Set<string>();
        data.posts?.forEach((post: any) => {
          post.tags?.forEach((pt: any) => {
            tagSet.add(pt.tag.name);
          });
        });
        setAvailableTags(Array.from(tagSet));
      });

    // Fetch categories
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        // Set first category as default if no category selected
        if (!formData.categoryId && data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      });
  }, []);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
    }));
  };

  const handleGenerateMetadata = async () => {
    if (!formData.content) {
      alert("Please write some content first");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content: formData.content})
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        excerpt: data.excerpt,
        slug: isEdit ? prev.slug : data.slug,
        tags: data.tags
      }));
    } catch (error) {
      alert("Failed to generate metadata");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEdit ? `/api/posts/${initialData?.slug}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save post");
      }

      const { post } = await response.json();
      router.push(`/admin/posts`);
      router.refresh();
    } catch (error) {
      console.error("Error saving post:", error);
      alert(error instanceof Error ? error.message : "Failed to save post");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter post title"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium mb-2"
          >
            Cover Image URL
          </label>
          <input
            type="url"
            id="coverImage"
            value={formData.coverImage}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium mb-2"
          >
            Category *
          </label>
          <select
            id="category"
            required
            value={formData.categoryId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium mb-2"
          >
            Content * (Markdown)
          </label>
          <textarea
            id="content"
            required
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={20}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
            placeholder="Write your post content in Markdown..."
          />
        </div>

        {/* AI Metadata Section */}
        <div className="space-y-4 p-6 rounded-lg border bg-secondary/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Metadata Generation</h3>
            <button
              type="button"
              onClick={handleGenerateMetadata}
              disabled={isGenerating || !formData.content}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">
              Slug * {isEdit && "(cannot be changed)"}
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              disabled={isEdit}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="post-slug"
            />
            <p className="text-xs text-muted-foreground mt-1">
              SEO-friendly URL (e.g., nextjs-performance-guide)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Brief summary of the post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <TagSelector
              selectedTags={Array.isArray(formData.tags) ? formData.tags : []}
              onChange={(tags) => setFormData(prev => ({...prev, tags}))}
              availableTags={availableTags}
            />
          </div>
        </div>

        {/* Published */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, published: e.target.checked }))
            }
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Publish immediately
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting
            ? "Saving..."
            : isEdit
            ? "Update Post"
            : "Create Post"}
        </button>
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>
      </div>
    </form>
  );
}
