import { prisma } from "./prisma";

export async function getSiteSettings() {
  // First try to find existing settings
  let settings = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  // If not found, create with defaults (handle race condition)
  if (!settings) {
    try {
      settings = await prisma.siteSetting.create({
        data: { id: "default" },
      });
    } catch (error: unknown) {
      // If creation failed due to race condition, fetch the existing record
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        settings = await prisma.siteSetting.findUnique({
          where: { id: "default" },
        });
      } else {
        throw error;
      }
    }
  }

  // Should never be null at this point, but TypeScript needs this
  if (!settings) {
    throw new Error("Failed to get or create site settings");
  }

  return settings;
}
