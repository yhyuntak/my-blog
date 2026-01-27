import { prisma } from "./prisma";

export async function getSiteSettings() {
  // Use upsert to handle both cases
  const settings = await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  return settings;
}
