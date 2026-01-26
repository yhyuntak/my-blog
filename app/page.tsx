import Link from "next/link";
import { ArrowRight, Calendar, Clock, FolderTree } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { getAllCategories } from "@/lib/categories";
import { formatDate } from "@/lib/utils";
import { WebSiteSchema } from "@/components/structured-data";

export default async function Home() {
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Featured post (most recent)
  const featuredPost = allPosts[0];

  // Recent posts (next 6 posts after featured)
  const recentPosts = allPosts.slice(1, 7);

  // Get posts by category (3 per category)
  const categoryPosts = categories.map((category) => ({
    ...category,
    posts: allPosts
      .filter((post) => post.category.slug === category.slug)
      .slice(0, 3),
  }));

  return (
    <>
      <WebSiteSchema url={baseUrl} />
      <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
        <div className="space-y-16">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome to My Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              A modern blog about technology, development, and everything in between.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Featured Post
              </div>
              <Link
                href={`/posts/${featuredPost.slug}`}
                className="block group"
              >
                <article className="p-8 rounded-xl border hover:bg-secondary/50 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Link
                        href={`/category/${featuredPost.category.slug}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <FolderTree className="h-3 w-3" />
                        {featuredPost.category.name}
                      </Link>
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
                    <h2 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      Read article
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Recent Posts</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="block group"
                  >
                    <article className="p-6 rounded-lg border hover:bg-secondary/50 transition-colors h-full flex flex-col">
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
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readingTime}
                      </div>
                    </article>
                  </Link>
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
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View all {category.postCount}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  {category.description && (
                    <p className="text-muted-foreground">{category.description}</p>
                  )}
                  <div className="grid gap-6 md:grid-cols-3">
                    {category.posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/posts/${post.slug}`}
                        className="block group"
                      >
                        <article className="p-5 rounded-lg border hover:bg-secondary/50 transition-colors h-full flex flex-col">
                          <div className="space-y-3 flex-1">
                            <time
                              dateTime={post.date}
                              className="text-xs text-muted-foreground"
                            >
                              {formatDate(post.date)}
                            </time>
                            <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {post.readingTime}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}
