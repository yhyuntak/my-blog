import { unstable_cache } from "next/cache";
import { getRecentPosts } from "@/lib/posts";
import { getAllCategories, getCategoriesWithRecentPosts } from "@/lib/categories";
import { getSiteSettings } from "@/lib/settings";
import { WebSiteSchema } from "@/components/structured-data";
import HomeClient from "./home-client";

// Cache homepage data for 60 seconds
const getCachedHomeData = unstable_cache(
  async () => {
    const [recentPostsData, categoryPosts, settings] = await Promise.all([
      getRecentPosts(7), // 1 featured + 6 recent (published only)
      getCategoriesWithRecentPosts(3), // 3 posts per category in single query
      getSiteSettings(),
    ]);

    return {
      featuredPost: recentPostsData[0] || null,
      recentPosts: recentPostsData.slice(1, 7),
      categoryPosts,
      settings,
    };
  },
  ["homepage-data"],
  { revalidate: 60 }
);

export default async function Home() {
  const { featuredPost, recentPosts, categoryPosts, settings } = await getCachedHomeData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <WebSiteSchema url={baseUrl} />
      <HomeClient
        featuredPost={featuredPost}
        recentPosts={recentPosts}
        categoryPosts={categoryPosts}
        homeHeroTitle={settings.homeHeroTitle}
        homeHeroSubtitle={settings.homeHeroSubtitle}
        isAdmin={false}
      />
    </>
  );
}
