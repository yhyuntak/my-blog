"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, FolderTree } from "lucide-react";
import type { PostPreview } from "@/lib/posts";

interface PostCardProps {
  post: PostPreview;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/posts/${post.slug}`);
  };

  const handleCategoryClick = (e: React.MouseEvent, categorySlug: string) => {
    e.stopPropagation();
    router.push(`/category/${categorySlug}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="p-6 rounded-lg border hover:bg-secondary/50 transition-colors h-full cursor-pointer group"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors break-words">
            {post.title}
          </h2>
          <p className="text-muted-foreground break-words">{post.excerpt}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime}</span>
          </div>
          {post.category && (
            <button
              onClick={(e) => handleCategoryClick(e, post.category.slug)}
              className="flex items-center gap-1 hover:text-primary transition-colors z-10 relative cursor-pointer"
            >
              <FolderTree className="h-4 w-4" />
              <span>{post.category.name}</span>
            </button>
          )}
        </div>

      </div>
    </article>
  );
}
