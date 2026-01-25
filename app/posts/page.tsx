import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Tag } from "lucide-react";

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">All Posts</h1>
          <p className="text-xl text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} published
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="p-6 rounded-lg border hover:bg-secondary/50 transition-colors"
            >
              <Link href={`/posts/${post.slug}`} className="block space-y-3">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold hover:text-primary transition-colors">
                    {post.title}
                  </h2>
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
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>{post.category}</span>
                    </div>
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
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
