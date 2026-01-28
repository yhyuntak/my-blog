import { getAllPosts } from "@/lib/posts";
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

  const allPosts = await getAllPosts(isAdmin);
  const categories = await getAllCategories();
  const settings = await getSiteSettings();
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
        homeHeroTitle={settings.homeHeroTitle}
        homeHeroSubtitle={settings.homeHeroSubtitle}
        isAdmin={isAdmin}
      />
    </>
  );
}
