import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    return page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const showPages = 5; // Max pages to show

    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="p-2 text-muted-foreground/50 cursor-not-allowed">
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "hover:bg-secondary"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span className="p-2 text-muted-foreground/50 cursor-not-allowed">
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </nav>
  );
}
