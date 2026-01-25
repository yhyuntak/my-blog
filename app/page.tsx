import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { WebSiteSchema } from "@/components/structured-data";

export default async function Home() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <WebSiteSchema url={baseUrl} />
      <div className="max-w-3xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to My Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern blog about technology, development, and everything in between.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/posts"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors"
          >
            About Me
          </Link>
        </div>

        <div className="pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="block p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <span className="text-primary hover:underline">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
