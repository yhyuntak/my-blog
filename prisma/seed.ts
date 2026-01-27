import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create or get admin user
  const adminEmail = process.env.ADMIN_EMAILS?.split(",")[0] || "admin@example.com";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin User",
      role: "admin",
    },
  });

  console.log(`✅ Admin user: ${admin.email}`);

  // 2. Create parent category
  const devCategory = await prisma.category.upsert({
    where: { slug: "development" },
    update: {},
    create: {
      name: "Development",
      slug: "development",
      description: "Software development articles and tutorials",
    },
  });

  // 3. Create subcategories
  const frontendCategory = await prisma.category.upsert({
    where: { slug: "frontend" },
    update: {},
    create: {
      name: "Frontend",
      slug: "frontend",
      description: "Frontend development with React, Next.js, and more",
      parentId: devCategory.id,
    },
  });

  const backendCategory = await prisma.category.upsert({
    where: { slug: "backend" },
    update: {},
    create: {
      name: "Backend",
      slug: "backend",
      description: "Backend development, APIs, databases",
      parentId: devCategory.id,
    },
  });

  const devopsCategory = await prisma.category.upsert({
    where: { slug: "devops" },
    update: {},
    create: {
      name: "DevOps",
      slug: "devops",
      description: "DevOps, CI/CD, Docker, Kubernetes",
      parentId: devCategory.id,
    },
  });

  const tutorialCategory = await prisma.category.upsert({
    where: { slug: "tutorials" },
    update: {},
    create: {
      name: "Tutorials",
      slug: "tutorials",
      description: "Step-by-step tutorials and guides",
    },
  });

  console.log("✅ Categories created");

  // 4. Create tags
  const tagNames = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Prisma",
    "Tailwind CSS",
    "Docker",
    "PostgreSQL",
    "API",
    "Tutorial",
    "Guide",
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { slug: name.toLowerCase().replace(/\./g, "-").replace(/\s+/g, "-") },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\./g, "-").replace(/\s+/g, "-"),
        },
      })
    )
  );

  console.log("✅ Tags created");

  // 5. Create sample posts
  const posts = [
    {
      title: "Getting Started with Next.js 15",
      slug: "getting-started-nextjs-15",
      excerpt: "Learn how to build modern web applications with Next.js 15, the latest version of the React framework.",
      categoryId: frontendCategory.id,
      tags: ["Next.js", "React", "TypeScript", "Tutorial"],
      content: `# Getting Started with Next.js 15

Next.js 15 introduces several exciting features that make building React applications even better.

## What's New

- **App Router improvements**: Better performance and developer experience
- **Server Components**: Build faster applications with less client-side JavaScript
- **Improved routing**: More intuitive file-based routing

## Installation

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Features

Next.js 15 brings numerous improvements that enhance both developer experience and application performance.

Happy coding!`,
    },
    {
      title: "TypeScript Best Practices in 2026",
      slug: "typescript-best-practices-2026",
      excerpt: "Essential TypeScript patterns and practices for writing maintainable code in modern web applications.",
      categoryId: frontendCategory.id,
      tags: ["TypeScript", "JavaScript", "Guide"],
      content: `# TypeScript Best Practices in 2026

TypeScript has become the de facto standard for building scalable web applications.

## Type Safety First

Always prefer strict type checking:

\`\`\`typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
\`\`\`

## Use Utility Types

Leverage built-in utility types for cleaner code:

\`\`\`typescript
type ReadonlyUser = Readonly<User>;
type PartialConfig = Partial<Config>;
\`\`\`

## Conclusion

Following these practices will help you write more maintainable TypeScript code.`,
    },
    {
      title: "Building RESTful APIs with Node.js and Prisma",
      slug: "restful-apis-nodejs-prisma",
      excerpt: "A comprehensive guide to building scalable REST APIs using Node.js, Express, and Prisma ORM.",
      categoryId: backendCategory.id,
      tags: ["Node.js", "Prisma", "API", "Tutorial"],
      content: `# Building RESTful APIs with Node.js and Prisma

Learn how to build production-ready REST APIs with modern tools.

## Setup

First, initialize your project:

\`\`\`bash
npm init -y
npm install express prisma @prisma/client
npx prisma init
\`\`\`

## Database Schema

Define your data model in \`schema.prisma\`:

\`\`\`prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  posts Post[]
}
\`\`\`

## API Routes

Create your Express routes:

\`\`\`typescript
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
\`\`\`

Build amazing APIs!`,
    },
    {
      title: "Docker for Developers: A Complete Guide",
      slug: "docker-for-developers-guide",
      excerpt: "Master Docker fundamentals and learn how to containerize your applications for development and production.",
      categoryId: devopsCategory.id,
      tags: ["Docker", "DevOps", "Tutorial"],
      content: `# Docker for Developers: A Complete Guide

Docker has revolutionized how we build and deploy applications.

## Why Docker?

- **Consistency**: Same environment everywhere
- **Isolation**: Each service in its own container
- **Portability**: Run anywhere Docker runs

## Getting Started

Create a \`Dockerfile\`:

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
\`\`\`

## Docker Compose

Use \`docker-compose.yml\` for multi-container apps:

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
\`\`\`

Happy containerizing!`,
    },
    {
      title: "Tailwind CSS: Utility-First Styling",
      slug: "tailwind-css-utility-first",
      excerpt: "Learn how to build beautiful, responsive UIs faster with Tailwind CSS utility classes.",
      categoryId: frontendCategory.id,
      tags: ["Tailwind CSS", "Tutorial"],
      content: `# Tailwind CSS: Utility-First Styling

Tailwind CSS is a utility-first CSS framework that speeds up development.

## Why Tailwind?

- **No naming conventions**: No more struggling with class names
- **Responsive by default**: Mobile-first responsive design
- **Customizable**: Full control over your design system

## Example

\`\`\`jsx
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click me
</button>
\`\`\`

## Custom Configuration

Extend Tailwind in \`tailwind.config.js\`:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
      },
    },
  },
};
\`\`\`

Build beautiful UIs!`,
    },
    {
      title: "Understanding React Server Components",
      slug: "understanding-react-server-components",
      excerpt: "Deep dive into React Server Components and how they improve performance and developer experience.",
      categoryId: frontendCategory.id,
      tags: ["React", "Next.js", "Guide"],
      content: `# Understanding React Server Components

React Server Components (RSC) represent a paradigm shift in React development.

## What are Server Components?

Server Components render on the server and send HTML to the client:

- **Zero bundle size**: No JavaScript sent to client
- **Direct backend access**: Query databases directly
- **Better performance**: Less client-side processing

## Example

\`\`\`tsx
// app/page.tsx (Server Component by default)
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data.title}</div>;
}
\`\`\`

## When to Use

Use Server Components for:
- Data fetching
- Backend logic
- Static content

Use Client Components for:
- Interactivity
- Browser APIs
- State management

Happy coding!`,
    },
    {
      title: "PostgreSQL Performance Optimization",
      slug: "postgresql-performance-optimization",
      excerpt: "Essential techniques for optimizing PostgreSQL database performance and query efficiency.",
      categoryId: backendCategory.id,
      tags: ["PostgreSQL", "Guide"],
      content: `# PostgreSQL Performance Optimization

Learn how to make your PostgreSQL database blazingly fast.

## Indexing Strategies

Create the right indexes:

\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
\`\`\`

## Query Optimization

Use EXPLAIN to analyze queries:

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM posts WHERE published = true;
\`\`\`

## Connection Pooling

Use a connection pool like pgBouncer:

\`\`\`
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb
\`\`\`

## Conclusion

Proper optimization can dramatically improve your database performance.`,
    },
    {
      title: "CI/CD Best Practices with GitHub Actions",
      slug: "cicd-best-practices-github-actions",
      excerpt: "Build robust CI/CD pipelines using GitHub Actions for automated testing and deployment.",
      categoryId: devopsCategory.id,
      tags: ["DevOps", "Tutorial"],
      content: `# CI/CD Best Practices with GitHub Actions

Automate your development workflow with GitHub Actions.

## Basic Workflow

Create \`.github/workflows/ci.yml\`:

\`\`\`yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
\`\`\`

## Deployment

Deploy to production:

\`\`\`yaml
deploy:
  needs: test
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Deploy
      run: npm run deploy
\`\`\`

Automate everything!`,
    },
    {
      title: "Modern JavaScript Features You Should Know",
      slug: "modern-javascript-features",
      excerpt: "Explore the latest JavaScript features that make your code cleaner and more efficient.",
      categoryId: frontendCategory.id,
      tags: ["JavaScript", "Guide"],
      content: `# Modern JavaScript Features You Should Know

JavaScript continues to evolve with powerful new features.

## Optional Chaining

Safely access nested properties:

\`\`\`javascript
const name = user?.profile?.name ?? 'Guest';
\`\`\`

## Nullish Coalescing

Better default values:

\`\`\`javascript
const count = data.count ?? 0; // Only 0 for null/undefined
\`\`\`

## Array Methods

Powerful array operations:

\`\`\`javascript
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((a, b) => a + b, 0);
\`\`\`

## Async/Await

Clean asynchronous code:

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

Keep learning!`,
    },
    {
      title: "Building a Full-Stack App with the T3 Stack",
      slug: "building-fullstack-app-t3-stack",
      excerpt: "Learn how to build type-safe full-stack applications using the T3 stack: Next.js, tRPC, Tailwind, and Prisma.",
      categoryId: tutorialCategory.id,
      tags: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS", "Tutorial"],
      content: `# Building a Full-Stack App with the T3 Stack

The T3 Stack provides a powerful, type-safe development experience.

## What is T3?

- **Next.js**: React framework
- **TypeScript**: Type safety
- **Tailwind**: Styling
- **tRPC**: Type-safe API
- **Prisma**: Database ORM

## Setup

\`\`\`bash
npm create t3-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Define API Routes

Create type-safe procedures:

\`\`\`typescript
export const appRouter = router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.user.findUnique({
        where: { id: input.id },
      });
    }),
});
\`\`\`

## Use in Components

Fully type-safe client:

\`\`\`tsx
const { data } = api.getUser.useQuery({ id: '123' });
\`\`\`

Build amazing apps!`,
    },
  ];

  for (const postData of posts) {
    const { tags: tagNames, ...rest } = postData;

    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        ...rest,
        authorId: admin.id,
        published: true,
      },
    });

    // Connect tags
    for (const tagName of tagNames) {
      const tag = tags.find((t) => t.name === tagName);
      if (tag) {
        await prisma.postTag.upsert({
          where: {
            postId_tagId: {
              postId: post.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }

    console.log(`✅ Post: ${post.title}`);
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
