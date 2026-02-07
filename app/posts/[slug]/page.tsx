import { unstable_cache } from "next/cache";
import { getPostBySlug, getPostContent, getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, FolderTree, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Comments } from "@/components/comments";
import { BlogPostingSchema } from "@/components/structured-data";
import { PostAdminActions } from "@/components/post-admin-actions";
import { auth } from "@/auth";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 동적 경로 허용 (새 포스트도 접근 가능)
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Cache post data (published only)
const getCachedPost = unstable_cache(
  async (slug: string) => {
    const post = await getPostBySlug(slug);
    if (!post) return null;
    const content = await getPostContent(slug);
    return { post, content };
  },
  ["post-detail"],
  { revalidate: 60 }
);

// Direct fetch for admin (includes drafts, no cache)
async function getPostData(slug: string, includeDraft: boolean) {
  const post = await getPostBySlug(slug, includeDraft);
  if (!post) return null;
  const content = await getPostContent(slug, includeDraft);
  return { post, content };
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  const data = isAdmin
    ? await getPostData(slug, true)
    : await getCachedPost(slug);

  if (!data?.post) {
    return { title: "Post Not Found" };
  }

  const { post } = data;
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
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  const data = isAdmin
    ? await getPostData(slug, true)
    : await getCachedPost(slug);

  if (!data?.post || !data?.content) {
    notFound();
  }

  const { post, content } = data;
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
          <PostAdminActions slug={slug} title={post.title} />
        </div>

        <header className="space-y-6 mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl break-words">
            {!post.published && <span className="text-yellow-600 dark:text-yellow-400">[Draft] </span>}
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
