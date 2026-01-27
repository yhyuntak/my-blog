"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FolderTree, Folder } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface CategorySidebarProps {
  categoryName: string;
  categorySlug: string;
  categoryPostCount: number;
  subcategories: Subcategory[];
}

export function CategorySidebar({ categoryName, categorySlug, categoryPostCount, subcategories }: CategorySidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSub = searchParams.get("sub");

  const handleSubClick = (subSlug: string) => {
    // Update URL without page reload
    const params = new URLSearchParams(searchParams);
    params.set("sub", subSlug);
    params.delete("page"); // Reset to page 1
    router.push(`/category/${categorySlug}?${params.toString()}`, { scroll: false });
  };

  const handleAllClick = () => {
    // Show all posts (remove sub filter)
    const params = new URLSearchParams(searchParams);
    params.delete("sub");
    params.delete("page");
    router.push(`/category/${categorySlug}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="lg:sticky lg:top-24">
        <nav className="space-y-2">
          {/* Root category - direct posts */}
          <button
            onClick={handleAllClick}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group text-left cursor-pointer ${
              !selectedSub
                ? "bg-secondary shadow-sm"
                : "hover:bg-secondary hover:shadow-sm hover:translate-x-1"
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderTree className={`h-5 w-5 transition-colors duration-200 ${!selectedSub ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
              <span className={`transition-colors duration-200 ${!selectedSub ? "text-foreground font-semibold" : "group-hover:text-foreground"}`}>
                {categoryName}
              </span>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
              {categoryPostCount}
            </span>
          </button>

          {/* Subcategories - indented */}
          <div className="pl-6 space-y-1 border-l-2 border-border">
            {subcategories.map((child) => {
              const isSelected = selectedSub === child.slug;
              return (
                <button
                  key={child.id}
                  onClick={() => handleSubClick(child.slug)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 group text-left cursor-pointer ${
                    isSelected
                      ? "bg-secondary shadow-sm"
                      : "hover:bg-secondary hover:shadow-sm hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={`h-4 w-4 transition-colors duration-200 ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                    <span className={`text-sm transition-colors duration-200 ${isSelected ? "text-foreground font-medium" : "group-hover:text-foreground"}`}>
                      {child.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                    {child.postCount}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
