import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/post-form";

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true, slug: true }
      },
      tags: {
        include: {
          tag: {
            select: { name: true, slug: true }
          }
        }
      }
    }
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground mt-2">
            Update your blog post
          </p>
        </div>

        <PostForm
          initialData={{
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || "",
            coverImage: post.coverImage || "",
            categoryId: post.categoryId,
            tags: post.tags.map(pt => pt.tag.name).join(","),
            published: post.published,
          }}
          isEdit
        />
      </div>
    </div>
  );
}
