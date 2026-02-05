"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

interface PostAdminActionsProps {
  slug: string;
  title: string;
}

export function PostAdminActions({ slug, title }: PostAdminActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setIsDeleting(true);
    setIsOpen(false);

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDeleting}
        className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50"
        title="Post actions"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-background shadow-lg py-1 z-50">
          <Link
            href={`/admin/posts/${slug}/edit`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer"
          >
            <Edit className="h-4 w-4" />
            Edit Post
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
