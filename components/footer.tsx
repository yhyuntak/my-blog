import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-8xl mx-auto px-4 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with{" "}
              <Link
                href="https://nextjs.org"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Next.js
              </Link>{" "}
              and{" "}
              <Link
                href="https://tailwindcss.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Tailwind CSS
              </Link>
              .
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/archive"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Archive
              </Link>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-3">
            <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="mailto:your@email.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
