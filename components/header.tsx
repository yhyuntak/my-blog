import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ThemeToggle } from "./theme-toggle";
import { Search } from "./search";
import { AuthSection } from "./auth-section";
import { CategoriesDropdown } from "./categories-dropdown";
import { getCategoriesTree } from "@/lib/categories";
import { getSiteSettings } from "@/lib/settings";

const getCachedCategories = unstable_cache(
  async () => getCategoriesTree(),
  ["categories-tree"],
  { revalidate: 60 }
);

const getCachedSettings = unstable_cache(
  async () => getSiteSettings(),
  ["site-settings"],
  { revalidate: 60 }
);

export async function Header() {
  const [categories, settings] = await Promise.all([
    getCachedCategories(),
    getCachedSettings(),
  ]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-8xl mx-auto flex h-14 items-center px-4 lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <span className="font-bold text-xl">{settings.siteTitle}</span>
          </Link>

          <nav className="flex items-center space-x-4 text-sm font-medium">
            <CategoriesDropdown categories={categories} />
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
            >
              About
            </Link>
            <Search />
            <AuthSection />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
