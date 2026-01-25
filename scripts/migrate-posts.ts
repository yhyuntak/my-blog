import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const prisma = new PrismaClient();

async function main() {
  // Get admin user (first user with admin role)
  const adminUser = await prisma.user.findFirst({
    where: { role: "admin" },
  });

  if (!adminUser) {
    console.error("No admin user found. Please login first to create admin user.");
    process.exit(1);
  }

  console.log(`Found admin user: ${adminUser.email}`);

  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  for (const filename of filenames) {
    if (!filename.endsWith(".md")) continue;

    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const slug = filename.replace(/\.md$/, "");

    // Check if post already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      console.log(`Post "${slug}" already exists, skipping...`);
      continue;
    }

    // Process tags
    const tagNames = Array.isArray(data.tags) ? data.tags : [];
    const tagConnections = [];

    for (const tagName of tagNames) {
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');

      // Find or create tag
      let tag = await prisma.tag.findUnique({
        where: { slug: tagSlug }
      });

      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            name: tagName,
            slug: tagSlug
          }
        });
      }

      tagConnections.push({ tagId: tag.id });
    }

    // Create post with tag connections
    await prisma.post.create({
      data: {
        title: data.title,
        slug,
        content,
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || null,
        published: true,
        authorId: adminUser.id,
        createdAt: data.date ? new Date(data.date) : new Date(),
        tags: {
          create: tagConnections
        }
      },
    });

    console.log(`✓ Migrated: ${data.title}`);
  }

  console.log("\nMigration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
