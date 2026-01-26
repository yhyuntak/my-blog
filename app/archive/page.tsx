import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const metadata = {
  title: "Archive - Blog",
  description: "Complete archive of all blog posts",
};

export default async function ArchivePage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Archive</h1>
          <p className="text-xl text-muted-foreground">
            Complete archive of all {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
