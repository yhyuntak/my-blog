import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS, CACHE_REVALIDATE } from "./cache";

const getSiteSettingsBase = async () => {
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
};

// Using unstable_cache for cross-request caching + React cache for request deduplication
export const getSiteSettings = cache(
  unstable_cache(getSiteSettingsBase, ["site-settings"], {
    tags: [CACHE_TAGS.settings],
    revalidate: CACHE_REVALIDATE.short,
  })
);
