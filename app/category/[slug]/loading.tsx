export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 lg:px-8">
      {/* Category Header Skeleton */}
      <header className="mb-12">
        <div className="h-10 w-48 bg-muted rounded animate-pulse mb-4" />
        <div className="h-5 w-96 max-w-full bg-muted rounded animate-pulse" />
      </header>

      {/* Posts Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg border">
            <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse mb-4" />
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center gap-2 mt-12">
        <div className="h-10 w-10 bg-muted rounded animate-pulse" />
        <div className="h-10 w-10 bg-muted rounded animate-pulse" />
        <div className="h-10 w-10 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
