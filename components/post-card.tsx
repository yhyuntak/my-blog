"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Tag, FolderTree } from "lucide-react";
import type { PostPreview } from "@/lib/posts";

interface PostCardProps {
  post: PostPreview;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="p-6 rounded-lg border hover:bg-secondary/50 transition-colors">
      <div className="space-y-3">
        <div className="space-y-2">
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-2xl font-semibold hover:text-primary transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted-foreground">{post.excerpt}</p>
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
            <Link
              href={`/category/${post.category.slug}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <FolderTree className="h-4 w-4" />
              <span>{post.category.name}</span>
            </Link>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
