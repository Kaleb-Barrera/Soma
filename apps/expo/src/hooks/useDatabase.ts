import * as SQLite from 'expo-sqlite'
import { type ColumnMapping, columnTypes, type IStatement, Migrations, Repository, sql } from 'expo-sqlite-orm'
import { useMemo, useState, useEffect } from 'react'

/*
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'
*/

import type Database from '../types/database'
import type { User, Group, Subgroup, isTeacherAt, isStudentAt, isOwnerOf, Message } from "@soma/db"

const userColumMapping: ColumnMapping<User> = {
  userId: { type: columnTypes.TEXT },
  profileImg: { type: columnTypes.TEXT, default: null },
  firstName: { type: columnTypes.TEXT },
  lastName: { type: columnTypes.TEXT, default: null },
  gender: { type: columnTypes.TEXT, default: null },
  email: { type: columnTypes.TEXT, default: null,  },
  lastLoggedIn: { type: columnTypes.INTEGER, default: () => Date.now() },
}

const groupColumnMapping: ColumnMapping<Group> = {
    groupId: { type: columnTypes.TEXT },
    groupName: { type: columnTypes.TEXT },
    groupDescription: { type: columnTypes.TEXT, default: null },
    groupImage: { type: columnTypes.TEXT, default: null },
    createdAt: {type: columnTypes.INTEGER, default: () => Date.now() }
}

const subgroupColumnMapping: ColumnMapping<Subgroup> = {
    groupId: { type: columnTypes.TEXT },
    subgroupId: { type: columnTypes.TEXT },
    createdAt: {type: columnTypes.INTEGER, default: () => Date.now() }
}

const isTeacherAtColumnMapping: ColumnMapping<isTeacherAt> = {
    groupId: { type: columnTypes.TEXT },
    userId: { type: columnTypes.TEXT },
}

const isStudentAtColumnMapping: ColumnMapping<isStudentAt> = {
    groupId: { type: columnTypes.TEXT },
    subgroupId: { type: columnTypes.TEXT },
    userId: { type: columnTypes.TEXT },
}

const isOwnerOfColumnMapping: ColumnMapping<isOwnerOf> = {
    groupId: { type: columnTypes.TEXT },
    subgroupId: { type: columnTypes.TEXT },
    userId: { type: columnTypes.TEXT },
}

const messageColumnMapping: ColumnMapping<Message> = {
    messageId: { type: columnTypes.TEXT },
    authorId: { type: columnTypes.TEXT },
    groupId: { type: columnTypes.TEXT },
    subgroupId: { type: columnTypes.TEXT },
    content: { type: columnTypes.TEXT },
    createdAt: { type: columnTypes.INTEGER, default: () => Date.now() },
    updatedAt: { type: columnTypes.INTEGER, default: null },
}

const statements: IStatement = {
    '0001_create_user': sql`
        CREATE TABLE "User" (
            "userId" TEXT NOT NULL PRIMARY KEY,
            "profileImg" TEXT,
            "firstName" TEXT NOT NULL,
            "lastName" TEXT,
            "gender" TEXT,
            "email" TEXT,
            "lastLoggedIn" DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
    '0002_create_group': sql`
        CREATE TABLE "Group" (
            "groupId" TEXT NOT NULL PRIMARY KEY,
            "groupName" TEXT NOT NULL,
            "groupDescription" TEXT,
            "groupImage" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`,
    '0003_create_subgroup': sql`
        CREATE TABLE "Subgroup" (
            "subgroupId" TEXT NOT NULL,
            "groupId" TEXT NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
            PRIMARY KEY ("groupId", "subgroupId")
        );`,
    '0004_create_isTeacherAt': sql`
        CREATE TABLE "isTeacherAt" (
            "userId" TEXT NOT NULL,
            "groupId" TEXT NOT NULL,
        
            PRIMARY KEY ("userId", "groupId")
        );`,
    '0005_create_isStudentAt': sql`
        CREATE TABLE "isStudentAt" (
            "userId" TEXT NOT NULL,
            "groupId" TEXT NOT NULL,
            "subgroupId" TEXT NOT NULL,
        
            PRIMARY KEY ("userId", "groupId", "subgroupId")
        );`,
    '0006_create_isOwnerOf': sql`
        CREATE TABLE "isOwnerOf" (
            "userId" TEXT NOT NULL,
            "groupId" TEXT NOT NULL,
            "subgroupId" TEXT NOT NULL,
        
            PRIMARY KEY ("userId", "groupId", "subgroupId")
        );`,
    '0007_create_messages': sql`
        CREATE TABLE "Message" (
            "messageId" TEXT NOT NULL PRIMARY KEY,
            "authorId" TEXT NOT NULL,
            "groupId" TEXT NOT NULL,
            "subgroupId" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME
        );`,
    '0008_create_indexes': sql`
        CREATE INDEX "isTeacherAt_userId_idx" ON "isTeacherAt"("userId");
        CREATE INDEX "isTeacherAt_groupId_idx" ON "isTeacherAt"("groupId");
        CREATE INDEX "Message_authorId_idx" ON "Message"("authorId");
        CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
        CREATE INDEX "Subgroup_groupId_idx" ON "Subgroup"("groupId");
        CREATE INDEX "isOwnerOf_userId_idx" ON "isOwnerOf"("userId");
        CREATE INDEX "isOwnerOf_groupId_subgroupId_idx" ON "isOwnerOf"("groupId", "subgroupId");
        CREATE INDEX "isStudentAt_userId_idx" ON "isStudentAt"("userId");
        CREATE INDEX "isStudentAt_groupId_subgroupId_idx" ON "isStudentAt"("groupId", "subgroupId");
        CREATE INDEX "Message_groupId_subgroupId_idx" ON "Message"("groupId", "subgroupId")
        ;`
}

const databaseName = 'soma'

interface Data {
    isMigrating: boolean,
    isAvailable: boolean,
    database: Database
}

export function useDatabase() {
    const migrations = useMemo(() => new Migrations(databaseName, statements), [])

    const userRepo = useMemo(() => {
        return new Repository(databaseName, 'User', userColumMapping)
    }, [])

    const groupRepo = useMemo(() => {
        return new Repository(databaseName, 'Group', groupColumnMapping)
    }, [])

    const subgroupRepo = useMemo(() => {
        return new Repository(databaseName, 'Subgroup', subgroupColumnMapping)
    }, [])

    const isTeacherAtRepo = useMemo(() => {
        return new Repository(databaseName, 'isTeacherAt', isTeacherAtColumnMapping)
    }, [])

    const isStudentAtRepo = useMemo(() => {
        return new Repository(databaseName, 'isStudentAt', isStudentAtColumnMapping)
    }, [])

    const isOwnerOfRepo = useMemo(() => {
        return new Repository(databaseName, 'isOwnerOf', isOwnerOfColumnMapping)
    }, [])

    const messageRepo = useMemo(() => {
        return new Repository(databaseName, 'Message', messageColumnMapping)
    }, [])

    const [data, setData] = useState<Data>({
        isMigrating: true, 
        isAvailable: false, 
        database: {
            databaseLayer: null,
            user: null, 
            group: null, 
            subgroup: null, 
            message: null, 
            isTeacherAt: null, 
            isStudentAt: null, 
            isOwnerOf: null
        }
    })

    useEffect(() => {
        async function setupDatabase() {
            /* This is for resetting the database file
            FileSystem.deleteAsync(FileSystem.documentDirectory + 'SQLite/soma')
            */
            await migrations.migrate()
            /* Uncomment this if you need access to the database
            await Sharing.shareAsync(
                FileSystem.documentDirectory + 'SQLite/soma', 
                {dialogTitle: 'share or copy your DB via'}
             ).catch(error =>{
                console.log(error);
             })
             */
            setData({
                isMigrating: false,
                isAvailable: true,
                database: {
                    databaseLayer: {
                        rawAccess: SQLite.openDatabase(databaseName),
                        executeSql: executeSql
                    },
                    user: userRepo,
                    group: groupRepo,
                    subgroup: subgroupRepo,
                    message: messageRepo,
                    isTeacherAt: isTeacherAtRepo,
                    isStudentAt: isStudentAtRepo,
                    isOwnerOf: isOwnerOfRepo
                }
            })
        }

        void setupDatabase()
    }, [groupRepo, isOwnerOfRepo, isStudentAtRepo, isTeacherAtRepo, messageRepo, migrations, subgroupRepo, userRepo])

  return data
}

function executeSql(sql: string, params: (string|number)[] = [], db = SQLite.openDatabase(databaseName)): unknown[] {
    let result = []
    db.transaction(tx => 
        tx.executeSql(sql, params, (_txObj, {rows}) => result = rows._array as unknown[]),
        (error) => {
            throw new Error(error.message)
        }
    )
    return result
}