"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";
import { UserNav } from "./user-nav";

export function AuthSection() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (session?.user) {
    return <UserNav user={session.user} />;
  }

  return (
    <Link
      href="/auth/signin"
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border hover:bg-secondary transition-colors cursor-pointer"
    >
      <LogIn className="h-4 w-4" />
      Sign in
    </Link>
  );
}
