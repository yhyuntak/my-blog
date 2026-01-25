import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting tag migration...");

  // Get all posts with their tag strings
  const posts = await prisma.$queryRaw<
    Array<{ id: string; slug: string; tags: string }>
  >`SELECT id, slug, tags FROM Post WHERE tags IS NOT NULL AND tags != ''`;

  console.log(`Found ${posts.length} posts with tags`);

  const tagMap = new Map<string, string>(); // name -> tagId

  for (const post of posts) {
    if (!post.tags) continue;

    const tagNames = post.tags.split(",").map((t) => t.trim());

    for (const tagName of tagNames) {
      if (!tagName) continue;

      // Check if tag already exists in our map
      if (!tagMap.has(tagName)) {
        // Create tag
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        // Check if tag exists in DB
        const existing = await prisma.tag.findUnique({
          where: { name: tagName },
        });

        if (existing) {
          tagMap.set(tagName, existing.id);
          console.log(`  ✓ Using existing tag: ${tagName}`);
        } else {
          const newTag = await prisma.tag.create({
            data: {
              name: tagName,
              slug,
            },
          });
          tagMap.set(tagName, newTag.id);
          console.log(`  + Created tag: ${tagName}`);
        }
      }

      // Create PostTag relationship
      const tagId = tagMap.get(tagName)!;

      await prisma.postTag.upsert({
        where: {
          postId_tagId: {
            postId: post.id,
            tagId,
          },
        },
        create: {
          postId: post.id,
          tagId,
        },
        update: {},
      });
    }

    console.log(`✓ Migrated tags for post: ${post.slug}`);
  }

  console.log("\nTag migration complete!");
  console.log(`Total unique tags: ${tagMap.size}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
