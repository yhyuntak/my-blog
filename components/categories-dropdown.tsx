"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, FolderTree, Folder } from "lucide-react";
import Link from "next/link";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface CategoryWithChildren extends CategoryWithCount {
  children: CategoryWithCount[];
}

interface CategoriesDropdownProps {
  categories: CategoryWithChildren[];
}

export function CategoriesDropdown({ categories }: CategoriesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
      >
        Categories
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-lg border bg-background shadow-lg py-1 max-h-96 overflow-y-auto">
          {categories.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              No categories yet
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center">
                  {category.children.length > 0 ? (
                    <button
                      onClick={(e) => toggleExpand(category.id, e)}
                      className="p-2 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                  ) : (
                    <div className="w-7" />
                  )}
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center gap-2 pr-4 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <FolderTree className="h-4 w-4" />
                    <span className="font-medium">{category.name}</span>
                  </Link>
                </div>

                {/* Children */}
                {expandedCategories.has(category.id) && category.children.length > 0 && (
                  <div className="ml-4 border-l">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/category/${category.slug}?sub=${child.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 pl-6 pr-4 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer"
                      >
                        <Folder className="h-3 w-3" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
