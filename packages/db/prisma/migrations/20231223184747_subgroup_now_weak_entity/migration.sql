/*
  Warnings:

  - The primary key for the `Subgroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `isOwnerOf` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `isStudentAt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `groupId` to the `isOwnerOf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `isStudentAt` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Message_subgroupId_idx";

-- DropIndex
DROP INDEX "Message_groupId_idx";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subgroup" (
    "subgroupId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("groupId", "subgroupId")
);
INSERT INTO "new_Subgroup" ("createdAt", "groupId", "subgroupId") SELECT "createdAt", "groupId", "subgroupId" FROM "Subgroup";
DROP TABLE "Subgroup";
ALTER TABLE "new_Subgroup" RENAME TO "Subgroup";
CREATE INDEX "Subgroup_groupId_idx" ON "Subgroup"("groupId");
CREATE TABLE "new_isOwnerOf" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "subgroupId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "groupId", "subgroupId")
);
INSERT INTO "new_isOwnerOf" ("subgroupId", "userId") SELECT "subgroupId", "userId" FROM "isOwnerOf";
DROP TABLE "isOwnerOf";
ALTER TABLE "new_isOwnerOf" RENAME TO "isOwnerOf";
CREATE INDEX "isOwnerOf_userId_idx" ON "isOwnerOf"("userId");
CREATE INDEX "isOwnerOf_groupId_subgroupId_idx" ON "isOwnerOf"("groupId", "subgroupId");
CREATE TABLE "new_isStudentAt" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "subgroupId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "groupId", "subgroupId")
);
INSERT INTO "new_isStudentAt" ("subgroupId", "userId") SELECT "subgroupId", "userId" FROM "isStudentAt";
DROP TABLE "isStudentAt";
ALTER TABLE "new_isStudentAt" RENAME TO "isStudentAt";
CREATE INDEX "isStudentAt_userId_idx" ON "isStudentAt"("userId");
CREATE INDEX "isStudentAt_groupId_subgroupId_idx" ON "isStudentAt"("groupId", "subgroupId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "Message_groupId_subgroupId_idx" ON "Message"("groupId", "subgroupId");
