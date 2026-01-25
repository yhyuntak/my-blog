import { getPostBySlug, getPostContent, getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Comments } from "@/components/comments";
import { BlogPostingSchema } from "@/components/structured-data";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags?.map(t => t.name),
      authors: post.author ? [{ name: post.author }] : undefined,
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt,
        url: `/posts/${slug}`,
        publishedTime: post.date,
        authors: post.author ? [post.author] : undefined,
        tags: post.tags?.map(t => t.name),
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
      },
      alternates: {
        canonical: `${baseUrl}/posts/${slug}`,
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await getPostContent(slug);

  if (!content) {
    notFound();
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <BlogPostingSchema
        title={post.title}
        description={post.excerpt}
        datePublished={post.date}
        author={post.author}
        url={`${baseUrl}/posts/${slug}`}
      />
      <article className="max-w-4xl mx-auto px-4 py-16 lg:px-8">
      <Link
        href="/posts"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to posts
      </Link>

      <header className="space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {post.title}
        </h1>

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
                className="px-3 py-1 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Comments postSlug={slug} />
    </article>
    </>
  );
}
