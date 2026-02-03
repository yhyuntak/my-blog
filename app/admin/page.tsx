import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MessageSquare, Users, FileText, Plus, FolderTree, Edit, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { AdminRecentComments } from "@/components/admin-recent-comments";
import { formatDate } from "@/lib/utils";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  // Get stats and recent posts (including drafts)
  const [totalUsers, totalComments, recentComments, recentPosts, postStats] = await Promise.all([
    prisma.user.count(),
    prisma.comment.count(),
    prisma.comment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        postSlug: true,
        authorName: true,
        authorImage: true,
        createdAt: true,
      },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // Limit for performance
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
    // Separate count queries for stats
    Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
    ]),
  ]);

  const [totalPosts, publishedCount, draftCount] = postStats;

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
                <p className="text-xs text-muted-foreground mt-1">
                  {publishedCount} published · {draftCount} draft
                </p>
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
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/posts/new"
            className="p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 break-words">New Post</h3>
                <p className="text-sm text-muted-foreground break-words">
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
                <h3 className="font-semibold mb-1 break-words">Manage Categories</h3>
                <p className="text-sm text-muted-foreground break-words">
                  Create and organize blog categories
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* All Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Posts</h2>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer text-sm"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </div>
          <div className="rounded-lg border divide-y">
            {recentPosts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No posts yet. Create your first post!
              </div>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                          <Eye className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{post.category.name}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt.toISOString())}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.published && (
                      <Link
                        href={`/posts/${post.slug}`}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                        title="View post"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                      title="Edit post"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Comments</h2>
          <div className="rounded-lg border">
            <AdminRecentComments initialComments={recentComments} />
          </div>
        </div>
      </div>
    </div>
  );
}
