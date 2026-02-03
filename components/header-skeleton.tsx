export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-8xl mx-auto flex h-14 items-center px-4 lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <nav className="flex items-center space-x-4">
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            <div className="h-5 w-14 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
          </nav>
        </div>
      </div>
    </header>
  );
}
