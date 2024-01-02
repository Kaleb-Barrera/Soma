/*
  Warnings:

  - Added the required column `values` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeId" INTEGER NOT NULL,
    "userId" TEXT,
    "groupId" TEXT,
    "subgroupId" TEXT,
    "values" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Event" ("id", "typeId") SELECT "id", "typeId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE INDEX "Event_typeId_idx" ON "Event"("typeId");
CREATE INDEX "Event_subgroupId_groupId_idx" ON "Event"("subgroupId", "groupId");
CREATE INDEX "Event_groupId_idx" ON "Event"("groupId");
CREATE INDEX "Event_userId_idx" ON "Event"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
