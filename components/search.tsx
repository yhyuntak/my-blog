"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import Fuse from "fuse.js";
import type { PostPreview } from "@/lib/posts";
import readingTime from "reading-time";

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && posts.length === 0) {
      setIsLoading(true);
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => {
          const transformedPosts: PostPreview[] = data.posts.map((post: any) => {
            const stats = readingTime(post.content);
            const tags = post.tags.map((pt: any) => ({
              name: pt.tag.name,
              slug: pt.tag.slug
            }));

            return {
              slug: post.slug,
              title: post.title,
              date: post.createdAt,
              excerpt: post.excerpt || "",
              tags,
              category: { name: post.category.name, slug: post.category.slug },
              author: post.author?.name,
              coverImage: post.coverImage || undefined,
              readingTime: stats.text,
              published: post.published,
            };
          });
          setPosts(transformedPosts);
        })
        .catch(err => {
          console.error('Failed to fetch posts:', err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, posts.length]);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "excerpt", "tags.name", "category"],
        threshold: 0.3,
      }),
    [posts]
  );

  const results = useMemo(() => {
    if (query.length > 0) {
      const searchResults = fuse.search(query);
      return searchResults.map((result) => result.item);
    }
    return [];
  }, [query, fuse]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    document.body.style.overflow = "unset";
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsOpen(true);
    }
    if (e.key === "Escape") {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border hover:bg-secondary transition-colors cursor-pointer"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded bg-muted">
          <span>⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[20vh]">
        <div className="w-full max-w-2xl bg-background rounded-lg border shadow-lg">
          <div className="flex items-center border-b px-4">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent outline-none"
              autoFocus
            />
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Loading posts...
              </div>
            ) : query.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Start typing to search posts...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    onClick={handleClose}
                    className="block p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {post.excerpt}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No posts found for &quot;{query}&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
