import { Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About | My Blog",
  description: "Learn more about me and this blog",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to my corner of the internet
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Hi! I&apos;m a developer passionate about building modern web
            applications and sharing knowledge with the community.
          </p>

          <h2>What I Write About</h2>
          <p>
            On this blog, you&apos;ll find articles about:
          </p>
          <ul>
            <li>Web Development (React, Next.js, TypeScript)</li>
            <li>UI/UX Design and Best Practices</li>
            <li>Software Engineering Principles</li>
            <li>Tech Trends and Tools</li>
          </ul>

          <h2>About This Blog</h2>
          <p>
            This blog is built with Next.js 15, Tailwind CSS, and deployed on
            Vercel. It features a clean, minimal design inspired by modern
            documentation sites, with support for dark mode, tags, and search.
          </p>

          <h2>Get in Touch</h2>
          <p>
            Feel free to reach out if you have questions or just want to
            connect!
          </p>
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-secondary transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-secondary transition-colors"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="mailto:your@email.com"
            className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-secondary transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
