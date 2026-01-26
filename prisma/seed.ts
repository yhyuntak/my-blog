import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create default categories
  const categories = [
    {
      name: "Development",
      slug: "development",
      description: "Programming, coding, and software development",
    },
    {
      name: "Tutorial",
      slug: "tutorial",
      description: "Step-by-step guides and tutorials",
    },
    {
      name: "Review",
      slug: "review",
      description: "Product and technology reviews",
    },
    {
      name: "Life",
      slug: "life",
      description: "Personal stories and daily life",
    },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Category already exists: ${category.name}`);
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
