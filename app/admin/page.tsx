import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Users, FileText, Plus, Settings, FolderTree } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  // Get stats
  const [totalUsers, totalComments, recentComments] = await Promise.all([
    prisma.user.count(),
    prisma.comment.count(),
    prisma.comment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    }),
  ]);

  const posts = await getAllPosts();
  const totalPosts = posts.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blog and monitor activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </p>
                <p className="text-3xl font-bold mt-2">{totalPosts}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-3xl font-bold mt-2">{totalUsers}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Comments
                </p>
                <p className="text-3xl font-bold mt-2">{totalComments}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/posts"
            className="p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Manage Posts</h3>
                <p className="text-sm text-muted-foreground">
                  Edit, delete, or create new blog posts
                </p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/posts/new"
            className="p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">New Post</h3>
                <p className="text-sm text-muted-foreground">
                  Create a new blog post
                </p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/categories"
            className="p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderTree className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Manage Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Create and organize blog categories
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Comments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Comments</h2>
          <div className="rounded-lg border">
            {recentComments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No comments yet
              </div>
            ) : (
              <div className="divide-y">
                {recentComments.map((comment) => (
                  <div key={comment.id} className="p-4 hover:bg-secondary/50">
                    <div className="flex gap-3">
                      {comment.user.image && (
                        <img
                          src={comment.user.image}
                          alt={comment.user.name || "User"}
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {comment.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          on{" "}
                          <span className="text-foreground">
                            {comment.postSlug}
                          </span>
                        </p>
                        <p className="text-sm line-clamp-2">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
