"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeletePostButtonProps {
  slug: string;
  title: string;
}

export function DeletePostButton({ slug, title }: DeletePostButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50 cursor-pointer"
      title="Delete post"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
