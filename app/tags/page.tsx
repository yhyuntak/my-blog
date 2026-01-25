import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import { Tag } from "lucide-react";

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">All Tags</h1>
          <p className="text-xl text-muted-foreground">
            Browse posts by topic
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {tags.map(({ name, slug, count }) => (
            <Link
              key={slug}
              href={`/tags/${slug}`}
              className="group flex items-center gap-2 px-4 py-3 rounded-lg border hover:bg-secondary transition-colors"
            >
              <Tag className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              <span className="font-medium">{name}</span>
              <span className="text-sm text-muted-foreground">({count})</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
