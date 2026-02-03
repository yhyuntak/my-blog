"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import type { SearchPost } from "@/app/api/posts/search/route";
import type FuseType from "fuse.js";

// Dynamic import for Fuse.js to reduce initial bundle
let Fuse: typeof FuseType | null = null;

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fuseRef = useRef<FuseType<SearchPost> | null>(null);

  // Load Fuse.js and posts when search opens
  useEffect(() => {
    if (isOpen && posts.length === 0) {
      setIsLoading(true);

      // Load Fuse.js dynamically
      const loadFuseAndPosts = async () => {
        try {
          // Parallel load Fuse.js and posts
          const [fuseModule, response] = await Promise.all([
            import("fuse.js"),
            fetch("/api/posts/search"),
          ]);

          Fuse = fuseModule.default;
          const data = await response.json();
          setPosts(data.posts);
        } catch (err) {
          console.error("Failed to load search:", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadFuseAndPosts();
    }
  }, [isOpen, posts.length]);

  // Create Fuse instance when posts are loaded
  useEffect(() => {
    if (posts.length > 0 && Fuse) {
      fuseRef.current = new Fuse(posts, {
        keys: ["title", "excerpt", "tags", "categoryName"],
        threshold: 0.3,
      });
    }
  }, [posts]);

  const results = useMemo((): SearchPost[] => {
    if (query.length > 0 && fuseRef.current) {
      const searchResults = fuseRef.current.search(query);
      return searchResults.map((result) => result.item);
    }
    return [];
  }, [query, posts]); // posts dependency ensures results update after posts load

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    document.body.style.overflow = "unset";
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

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
