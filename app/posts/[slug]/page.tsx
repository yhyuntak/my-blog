import { getPostBySlug, getPostContent, getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, FolderTree, ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Comments } from "@/components/comments";
import { BlogPostingSchema } from "@/components/structured-data";
import { auth } from "@/auth";

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
      keywords: post.category ? [post.category.name] : undefined,
      authors: post.author ? [{ name: post.author }] : undefined,
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt,
        url: `/posts/${slug}`,
        publishedTime: post.date,
        authors: post.author ? [post.author] : undefined,
        tags: post.category ? [post.category.name] : undefined,
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

  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
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
      <article className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={post.category ? `/category/${post.category.slug}` : "/posts"}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {post.category ? `Back to ${post.category.name}` : "Back to posts"}
        </Link>

        {isAdmin && (
          <Link
            href={`/admin/posts/${slug}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-secondary transition-colors cursor-pointer text-sm"
          >
            <Edit className="h-4 w-4" />
            Edit Post
          </Link>
        )}
      </div>

      <header className="space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl break-words">
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
            <Link
              href={`/category/${post.category.slug}`}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <FolderTree className="h-4 w-4" />
              <span>{post.category.name}</span>
            </Link>
          )}
        </div>
      </header>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none overflow-x-auto break-words"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Comments postSlug={slug} />
    </article>
    </>
  );
}
