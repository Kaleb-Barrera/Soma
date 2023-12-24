-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "groupId" TEXT NOT NULL PRIMARY KEY,
    "groupName" TEXT NOT NULL,
    "groupDescription" TEXT,
    "groupImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Group" ("createdAt", "groupDescription", "groupId", "groupImage", "groupName") SELECT "createdAt", "groupDescription", "groupId", "groupImage", "groupName" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
