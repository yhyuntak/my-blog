"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  postSlug: string;
  authorName: string;
  authorImage: string | null;
  createdAt: Date;
}

interface AdminRecentCommentsProps {
  initialComments: Comment[];
}

export function AdminRecentComments({ initialComments }: AdminRecentCommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, authorName: string) => {
    if (!confirm(`Delete comment from ${authorName}?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No comments yet
      </div>
    );
  }

  return (
    <div className="divide-y">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 hover:bg-secondary/50 transition-colors">
          <div className="flex gap-3">
            {comment.authorImage && (
              <Image
                src={comment.authorImage}
                alt={comment.authorName}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.authorName}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                on{" "}
                <Link
                  href={`/posts/${comment.postSlug}`}
                  className="text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {comment.postSlug}
                </Link>
              </p>
              <p className="text-sm line-clamp-2 break-words">{comment.content}</p>
            </div>
            <button
              onClick={() => handleDelete(comment.id, comment.authorName)}
              disabled={deletingId === comment.id}
              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive disabled:opacity-50 transition-colors cursor-pointer self-start"
              title="Delete comment"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
