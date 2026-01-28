"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, FolderTree, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PostPreview } from "@/lib/posts";
import type { CategoryWithCount } from "@/lib/categories";

interface HomeClientProps {
  featuredPost: PostPreview | null;
  recentPosts: PostPreview[];
  categoryPosts: Array<CategoryWithCount & { posts: PostPreview[] }>;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  isAdmin: boolean;
}

export default function HomeClient({
  featuredPost,
  recentPosts,
  categoryPosts,
  homeHeroTitle,
  homeHeroSubtitle,
  isAdmin,
}: HomeClientProps) {
  const router = useRouter();

  const handlePostClick = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  const handleCategoryClick = (e: React.MouseEvent, categorySlug: string) => {
    e.stopPropagation();
    router.push(`/category/${categorySlug}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {homeHeroTitle}
          </h1>
          <p className="text-xl text-muted-foreground">
            {homeHeroSubtitle}
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Featured Post
            </div>
            <article
              onClick={() => handlePostClick(featuredPost.slug)}
              className="p-8 rounded-xl border hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <button
                    onClick={(e) =>
                      handleCategoryClick(e, featuredPost.category.slug)
                    }
                    className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
                  >
                    <FolderTree className="h-3 w-3" />
                    {featuredPost.category.name}
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <time
                    dateTime={featuredPost.date}
                    className="text-muted-foreground"
                  >
                    {formatDate(featuredPost.date)}
                  </time>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featuredPost.readingTime}
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors break-words">
                  {featuredPost.title}
                  {!featuredPost.published && isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ml-2">
                      <EyeOff className="h-3 w-3" />
                      Draft
                    </span>
                  )}
                </h2>
                <p className="text-lg text-muted-foreground break-words">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  Read article
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Recent Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <article
                  key={post.slug}
                  onClick={() => handlePostClick(post.slug)}
                  className="p-6 rounded-lg border hover:bg-secondary/50 transition-colors h-full flex flex-col cursor-pointer group"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 text-primary">
                        <FolderTree className="h-3 w-3" />
                        {post.category.name}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <time
                        dateTime={post.date}
                        className="text-muted-foreground"
                      >
                        {formatDate(post.date)}
                      </time>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2 break-words">
                      {post.title}
                      {!post.published && isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ml-2">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readingTime}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Category Sections */}
        {categoryPosts.map(
          (category) =>
            category.posts.length > 0 && (
              <div key={category.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <FolderTree className="h-6 w-6 text-primary" />
                    {category.name}
                  </h2>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View all {category.postCount}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {category.description && (
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                )}
                <div className="grid gap-6 md:grid-cols-3">
                  {category.posts.map((post) => (
                    <article
                      key={post.slug}
                      onClick={() => handlePostClick(post.slug)}
                      className="p-5 rounded-lg border hover:bg-secondary/50 transition-colors h-full flex flex-col cursor-pointer group"
                    >
                      <div className="space-y-3 flex-1">
                        <time
                          dateTime={post.date}
                          className="text-xs text-muted-foreground"
                        >
                          {formatDate(post.date)}
                        </time>
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 break-words">
                          {post.title}
                          {!post.published && isAdmin && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ml-2">
                              <EyeOff className="h-3 w-3" />
                              Draft
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readingTime}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
