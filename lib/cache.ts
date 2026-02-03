import { unstable_cache } from "next/cache";
import { cache } from "react";

/**
 * Cache configuration for different data types
 */
export const CACHE_TAGS = {
  categories: "categories",
  settings: "settings",
  posts: "posts",
} as const;

export const CACHE_REVALIDATE = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
} as const;

/**
 * Create a cached function with both React cache and Next.js unstable_cache
 * - React cache: deduplicates requests within a single render
 * - unstable_cache: persists across requests with revalidation
 */
export function createCachedQuery<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  keyParts: string[],
  options: {
    tags?: string[];
    revalidate?: number;
  } = {}
) {
  const { tags = [], revalidate = CACHE_REVALIDATE.short } = options;

  // Wrap with unstable_cache for cross-request caching
  const unstableCached = unstable_cache(fn, keyParts, {
    tags,
    revalidate,
  });

  // Wrap with React cache for request deduplication
  return cache(unstableCached);
}
