-- CreateTable: Recreate Comment table with author snapshot fields
PRAGMA foreign_keys=OFF;

-- Drop existing Comment table
DROP TABLE "Comment";

-- Create new Comment table with snapshot fields
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "postSlug" TEXT NOT NULL,
    "userId" TEXT,
    "authorName" TEXT NOT NULL,
    "authorImage" TEXT,
    "authorRole" TEXT NOT NULL DEFAULT 'user',
    "authorGithubUsername" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Comment_postSlug_idx" ON "Comment"("postSlug");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
