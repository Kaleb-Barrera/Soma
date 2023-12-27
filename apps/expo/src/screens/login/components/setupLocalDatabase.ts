import * as SQLite from 'expo-sqlite'

export const setupLocalDatabase = () => {
    const db = SQLite.openDatabase('soma')

    db.transaction(tx => {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS "isTeacherAt" (
                "userId" TEXT NOT NULL,
                "groupId" TEXT NOT NULL,
            
                PRIMARY KEY ("userId", "groupId")
            );
            CREATE TABLE IF NOT EXISTS "Group" (
                "groupId" TEXT NOT NULL PRIMARY KEY,
                "groupName" TEXT NOT NULL,
                "groupDescription" TEXT,
                "groupImage" TEXT,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS "Message" (
                "messageId" TEXT NOT NULL PRIMARY KEY,
                "authorId" TEXT NOT NULL,
                "groupId" TEXT NOT NULL,
                "subgroupId" TEXT NOT NULL,
                "content" TEXT NOT NULL,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" DATETIME
            );
            CREATE TABLE IF NOT EXISTS "User" (
                "userId" TEXT NOT NULL PRIMARY KEY,
                "profileImg" TEXT,
                "firstName" TEXT NOT NULL,
                "lastName" TEXT,
                "gender" TEXT,
                "email" TEXT,
                "lastLoggedIn" DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS "Subgroup" (
                "subgroupId" TEXT NOT NULL,
                "groupId" TEXT NOT NULL,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            
                PRIMARY KEY ("groupId", "subgroupId")
            );
            CREATE TABLE IF NOT EXISTS "isOwnerOf" (
                "userId" TEXT NOT NULL,
                "groupId" TEXT NOT NULL,
                "subgroupId" TEXT NOT NULL,
            
                PRIMARY KEY ("userId", "groupId", "subgroupId")
            );
            CREATE TABLE IF NOT EXISTS "isStudentAt" (
                "userId" TEXT NOT NULL,
                "groupId" TEXT NOT NULL,
                "subgroupId" TEXT NOT NULL,
            
                PRIMARY KEY ("userId", "groupId", "subgroupId")
            );
            CREATE INDEX "isTeacherAt_userId_idx" ON "isTeacherAt"("userId");
            CREATE INDEX "isTeacherAt_groupId_idx" ON "isTeacherAt"("groupId");
            CREATE INDEX "Message_authorId_idx" ON "Message"("authorId");
            CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
            CREATE INDEX "Subgroup_groupId_idx" ON "Subgroup"("groupId");
            CREATE INDEX "isOwnerOf_userId_idx" ON "isOwnerOf"("userId");
            CREATE INDEX "isOwnerOf_groupId_subgroupId_idx" ON "isOwnerOf"("groupId", "subgroupId");
            CREATE INDEX "isStudentAt_userId_idx" ON "isStudentAt"("userId");
            CREATE INDEX "isStudentAt_groupId_subgroupId_idx" ON "isStudentAt"("groupId", "subgroupId");
            CREATE INDEX "Message_groupId_subgroupId_idx" ON "Message"("groupId", "subgroupId");
        `, null,
        (txObj, {rows}) => {console.log(txObj)}),
        (txObj, error) => {console.log(error)}
    })
}