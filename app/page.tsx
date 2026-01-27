import { getAllPosts } from "@/lib/posts";
import { getAllCategories } from "@/lib/categories";
import { WebSiteSchema } from "@/components/structured-data";
import HomeClient from "./home-client";

export default async function Home() {
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Featured post (most recent)
  const featuredPost = allPosts[0] || null;

  // Recent posts (next 6 posts after featured)
  const recentPosts = allPosts.slice(1, 7);

  // Get posts by category (3 per category)
  const categoryPosts = categories.map((category) => ({
    ...category,
    posts: allPosts
      .filter((post) => post.category.slug === category.slug)
      .slice(0, 3),
  }));

  return (
    <>
      <WebSiteSchema url={baseUrl} />
      <HomeClient
        featuredPost={featuredPost}
        recentPosts={recentPosts}
        categoryPosts={categoryPosts}
      />
    </>
  );
}
