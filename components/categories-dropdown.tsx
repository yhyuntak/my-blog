"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, FolderTree } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface CategoriesDropdownProps {
  categories: Category[];
}

export function CategoriesDropdown({ categories }: CategoriesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Categories
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-lg border bg-background shadow-lg py-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-sm hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                <span>{category.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {category.postCount}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
