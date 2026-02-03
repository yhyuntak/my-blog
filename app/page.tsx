import { getRecentPosts } from "@/lib/posts";
import { getPostsByCategory } from "@/lib/posts";
import { getAllCategories } from "@/lib/categories";
import { getSiteSettings } from "@/lib/settings";
import { WebSiteSchema } from "@/components/structured-data";
import { auth } from "@/auth";
import HomeClient from "./home-client";

// 60초마다 재검증 (ISR) - 새 포스트가 바로 반영됨
export const revalidate = 60;

export default async function Home() {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  // Parallel fetch for better performance
  const [recentPostsData, categories, settings] = await Promise.all([
    getRecentPosts(7, isAdmin), // 1 featured + 6 recent
    getAllCategories(),
    getSiteSettings(),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Featured post (most recent)
  const featuredPost = recentPostsData[0] || null;

  // Recent posts (next 6 posts after featured)
  const recentPosts = recentPostsData.slice(1, 7);

  // Get posts by category (3 per category) - parallel fetch
  const categoryPostsPromises = categories.map(async (category) => {
    const posts = await getPostsByCategory(category.slug, isAdmin);
    return {
      ...category,
      posts: posts.slice(0, 3),
    };
  });
  const categoryPosts = await Promise.all(categoryPostsPromises);

  return (
    <>
      <WebSiteSchema url={baseUrl} />
      <HomeClient
        featuredPost={featuredPost}
        recentPosts={recentPosts}
        categoryPosts={categoryPosts}
        homeHeroTitle={settings.homeHeroTitle}
        homeHeroSubtitle={settings.homeHeroSubtitle}
        isAdmin={isAdmin}
      />
    </>
  );
}
