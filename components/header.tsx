import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Search } from "./search";
import { UserNav } from "./user-nav";
import { CategoriesDropdown } from "./categories-dropdown";
import { getAllPosts } from "@/lib/posts";
import { getCategoriesTree } from "@/lib/categories";
import { auth } from "@/auth";
import { LogIn } from "lucide-react";

export async function Header() {
  const posts = await getAllPosts();
  const categories = await getCategoriesTree();
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-8xl mx-auto flex h-14 items-center px-4 lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">My Blog</span>
          </Link>

          <nav className="flex items-center space-x-4 text-sm font-medium">
            <CategoriesDropdown categories={categories} />
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
            <Search posts={posts} />
            {session?.user ? (
              <UserNav user={session.user} />
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border hover:bg-secondary transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
