# My Blog

A modern, feature-rich blog built with Next.js 15, Tailwind CSS, and TypeScript. Inspired by the clean design of agentskills.io.

## ✨ Features

- 🎨 **Clean, Modern Design** - Inspired by professional documentation sites
- 🌓 **Dark Mode** - Automatic theme switching with manual toggle
- 📝 **Markdown Support** - Write posts in Markdown with frontmatter
- 🏷️ **Tags & Categories** - Organize and filter posts
- 🔍 **Full-text Search** - Fast client-side search with keyboard shortcuts (⌘K)
- 💬 **Comments** - GitHub Discussions integration via Giscus
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Static generation with Next.js 15
- 🎯 **SEO Optimized** - Meta tags, OpenGraph, and semantic HTML

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Writing Posts

Posts are written in Markdown and stored in the `posts/` directory.

### Creating a New Post

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter at the top of the file:

```markdown
---
title: "Your Post Title"
date: "2026-01-24"
excerpt: "A brief description of your post"
tags: ["Tag1", "Tag2", "Tag3"]
category: "Category Name"
author: "Your Name"
---

# Your Post Content

Write your post content here using Markdown...
```

### Frontmatter Fields

- `title` (required): Post title
- `date` (required): Publication date (YYYY-MM-DD format)
- `excerpt` (required): Brief description shown in post listings
- `tags` (optional): Array of tags
- `category` (optional): Post category
- `author` (optional): Post author

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to customize the color scheme.

### Site Information

Update site metadata in `app/layout.tsx`.

### Social Links

Update social media links in `components/footer.tsx`.

## 💬 Enabling Comments

To enable Giscus comments:

1. Create a GitHub repository
2. Enable GitHub Discussions in your repository settings
3. Visit [giscus.app](https://giscus.app) and follow the setup
4. Update `components/comments.tsx` with your configuration

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Markdown**: [remark](https://github.com/remarkjs/remark) + [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Search**: [Fuse.js](https://fusejs.io/)
- **Comments**: [Giscus](https://giscus.app/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
blog-app/
├── app/                    # Next.js app directory
│   ├── posts/             # Post listing and detail pages
│   ├── tags/              # Tag pages
│   ├── about/             # About page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── header.tsx         # Site header
│   ├── footer.tsx         # Site footer
│   ├── theme-toggle.tsx   # Dark mode toggle
│   ├── search.tsx         # Search component
│   └── comments.tsx       # Giscus comments
├── lib/                   # Utility functions
│   ├── posts.ts           # Post parsing and management
│   └── utils.ts           # Helper functions
├── posts/                 # Markdown blog posts
└── public/                # Static assets
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js.

## 📄 License

MIT

## 🙏 Acknowledgments

- Design inspired by [agentskills.io](https://agentskills.io)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
