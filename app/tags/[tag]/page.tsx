import Link from "next/link";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ slug }) => ({
    tag: slug,
  }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  const tagName = posts.length > 0 && posts[0].tags?.find(t => t.slug === tag)?.name || tag;
  return {
    title: `Posts tagged with "${tagName}" | My Blog`,
    description: `All posts tagged with ${tagName}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const tagName = posts[0].tags?.find(t => t.slug === tag)?.name || tag;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:px-8">
      <Link
        href="/tags"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all tags
      </Link>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Posts tagged with &quot;{tagName}&quot;
          </h1>
          <p className="text-xl text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} found
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
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/tags/${t.slug}`}
                        className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                      >
                        {t.name}
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
