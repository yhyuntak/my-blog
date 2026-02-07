import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/post-form";

export default async function NewPostPage() {
  // DEV: 개발 환경에서 인증 우회 (테스트용)
  const bypassAuth = process.env.NODE_ENV === "development" && process.env.DEV_BYPASS_AUTH === "true";

  if (!bypassAuth) {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      redirect("/");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-muted-foreground mt-2">
            Write and publish a new blog post
          </p>
        </div>

        <PostForm />
      </div>
    </div>
  );
}
