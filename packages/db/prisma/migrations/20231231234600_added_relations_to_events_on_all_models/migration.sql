/*
  Warnings:

  - You are about to drop the column `values` on the `Event` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeId" INTEGER NOT NULL,
    "userId" TEXT,
    "groupId" TEXT,
    "subgroupId" TEXT,
    "messageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Event" ("createdAt", "groupId", "id", "subgroupId", "typeId", "userId") SELECT "createdAt", "groupId", "id", "subgroupId", "typeId", "userId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE INDEX "Event_typeId_idx" ON "Event"("typeId");
CREATE INDEX "Event_userId_idx" ON "Event"("userId");
CREATE INDEX "Event_groupId_idx" ON "Event"("groupId");
CREATE INDEX "Event_messageId_idx" ON "Event"("messageId");
CREATE INDEX "Event_userId_groupId_idx" ON "Event"("userId", "groupId");
CREATE INDEX "Event_subgroupId_groupId_idx" ON "Event"("subgroupId", "groupId");
CREATE INDEX "Event_userId_groupId_subgroupId_idx" ON "Event"("userId", "groupId", "subgroupId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
