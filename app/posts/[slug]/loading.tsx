export default function PostLoading() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-16 lg:px-8">
      {/* Post Header Skeleton */}
      <header className="mb-8">
        {/* Category */}
        <div className="h-5 w-24 bg-muted rounded animate-pulse mb-4" />

        {/* Title */}
        <div className="h-10 w-full bg-muted rounded animate-pulse mb-2" />
        <div className="h-10 w-3/4 bg-muted rounded animate-pulse mb-6" />

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-14 bg-muted rounded-full animate-pulse" />
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
        <div className="h-32 w-full bg-muted rounded animate-pulse my-8" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
      </div>
    </article>
  );
}
