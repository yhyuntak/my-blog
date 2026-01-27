"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryDeleteButtonProps {
  categoryId: string;
  categoryName: string;
  postCount: number;
  childrenCount: number;
}

export function CategoryDeleteButton({
  categoryId,
  categoryName,
  postCount,
  childrenCount,
}: CategoryDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Build warning message
    let message = `"${categoryName}" 카테고리를 삭제하시겠습니까?`;

    if (postCount > 0 || childrenCount > 0) {
      const warnings: string[] = [];
      if (postCount > 0) {
        warnings.push(`${postCount}개의 글`);
      }
      if (childrenCount > 0) {
        warnings.push(`${childrenCount}개의 하위 카테고리`);
      }
      message = `⚠️ "${categoryName}" 카테고리에 ${warnings.join("과 ")}이(가) 있습니다.\n\n삭제하면 모든 글이 함께 삭제됩니다. 정말 삭제하시겠습니까?`;
    }

    if (!confirm(message)) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete category");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
      title="Delete category"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
