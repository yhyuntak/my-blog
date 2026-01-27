"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

interface AboutClientProps {
  aboutTitle: string;
  aboutSubtitle: string;
  aboutContent: string;
  githubUrl: string;
  linkedinUrl: string;
  emailAddress: string;
}

export default function AboutClient({
  aboutTitle,
  aboutSubtitle,
  aboutContent,
  githubUrl,
  linkedinUrl,
  emailAddress,
}: AboutClientProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{aboutTitle}</h1>
          <p className="text-xl text-muted-foreground">{aboutSubtitle}</p>
        </div>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: aboutContent }}
        />

        <div className="flex items-center space-x-4 pt-4">
          <Link
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-secondary transition-colors cursor-pointer"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-secondary transition-colors cursor-pointer"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href={`mailto:${emailAddress}`}
            className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-secondary transition-colors cursor-pointer"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
