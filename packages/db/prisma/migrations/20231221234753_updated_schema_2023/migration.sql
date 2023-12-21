-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "profileImg" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lastLoggedIn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Group" (
    "groupId" TEXT NOT NULL PRIMARY KEY,
    "groupName" TEXT NOT NULL,
    "groupImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Subgroup" (
    "subgroupId" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "isTeacherAt" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "groupId")
);

-- CreateTable
CREATE TABLE "isStudentAt" (
    "userId" TEXT NOT NULL,
    "subgroupId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "subgroupId")
);

-- CreateTable
CREATE TABLE "Message" (
    "messageId" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateIndex
CREATE INDEX "Subgroup_groupId_idx" ON "Subgroup"("groupId");

-- CreateIndex
CREATE INDEX "isTeacherAt_userId_idx" ON "isTeacherAt"("userId");

-- CreateIndex
CREATE INDEX "isTeacherAt_groupId_idx" ON "isTeacherAt"("groupId");

-- CreateIndex
CREATE INDEX "isStudentAt_userId_idx" ON "isStudentAt"("userId");

-- CreateIndex
CREATE INDEX "isStudentAt_subgroupId_idx" ON "isStudentAt"("subgroupId");

-- CreateIndex
CREATE INDEX "Message_authorId_idx" ON "Message"("authorId");
