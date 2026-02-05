"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Edit } from "lucide-react";

interface PostAdminActionsProps {
  slug: string;
}

export function PostAdminActions({ slug }: PostAdminActionsProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) return null;

  return (
    <Link
      href={`/admin/posts/${slug}/edit`}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-secondary transition-colors cursor-pointer text-sm"
    >
      <Edit className="h-4 w-4" />
      Edit Post
    </Link>
  );
}
