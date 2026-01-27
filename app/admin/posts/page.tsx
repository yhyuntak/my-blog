import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeletePostButton } from "@/components/delete-post-button";

export default async function AdminPostsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: { name: true, slug: true }
          }
        }
      }
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Posts</h1>
            <p className="text-muted-foreground mt-2">
              Create, edit, and delete blog posts
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </div>

        <div className="rounded-lg border">
          {posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No posts yet. Create your first post!
            </div>
          ) : (
            <div className="divide-y">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {post.title}
                        </h3>
                        {!post.published && (
                          <span className="px-2 py-0.5 text-xs rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDate(post.createdAt.toISOString())}</span>
                        <span>•</span>
                        <span>by {post.author.name}</span>
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{post.tags.map(pt => pt.tag.name).join(", ")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                        title="Edit post"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeletePostButton slug={post.slug} title={post.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
