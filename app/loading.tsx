export default function HomeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 lg:px-8">
      {/* Hero Section Skeleton */}
      <section className="text-center mb-16">
        <div className="h-12 w-96 max-w-full bg-muted rounded animate-pulse mx-auto mb-4" />
        <div className="h-6 w-[500px] max-w-full bg-muted rounded animate-pulse mx-auto" />
      </section>

      {/* Featured Post Skeleton */}
      <section className="mb-16">
        <div className="h-8 w-40 bg-muted rounded animate-pulse mb-6" />
        <div className="p-8 rounded-lg border">
          <div className="h-8 w-3/4 bg-muted rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse mb-4" />
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Recent Posts Skeleton */}
      <section className="mb-16">
        <div className="h-8 w-32 bg-muted rounded animate-pulse mb-6" />
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
      </section>
    </div>
  );
}
