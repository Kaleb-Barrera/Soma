/*
  Warnings:

  - Added the required column `groupDescription` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "groupId" TEXT NOT NULL PRIMARY KEY,
    "groupName" TEXT NOT NULL,
    "groupDescription" TEXT NOT NULL,
    "groupImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Group" ("createdAt", "groupId", "groupImage", "groupName") SELECT "createdAt", "groupId", "groupImage", "groupName" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
