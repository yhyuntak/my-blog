import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Authentication Error
          </h1>
          <p className="mt-2 text-muted-foreground">
            There was a problem signing you in. Please try again.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </Link>
          <div>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
