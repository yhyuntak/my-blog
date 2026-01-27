"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

interface FooterClientProps {
  githubUrl: string;
  linkedinUrl: string;
  emailAddress: string;
  footerText: string;
}

export function FooterClient({
  githubUrl,
  linkedinUrl,
  emailAddress,
  footerText,
}: FooterClientProps) {
  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-8xl mx-auto px-4 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              {footerText}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                About
              </Link>
              <Link
                href="/archive"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Archive
              </Link>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-3">
              <Link
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href={`mailto:${emailAddress}`}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
