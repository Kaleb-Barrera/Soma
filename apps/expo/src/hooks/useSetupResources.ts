import { useState, useEffect } from 'react'

import { trpc } from '../utils/trpc'
import { useAppContext } from '../utils/AppContext'

import type Database from '../types/database'
import type { Group, Subgroup, User, isOwnerOf, isStudentAt, isTeacherAt } from '@soma/db'


export const useSetupResources = () => {
    const {database, setUser, user} = useAppContext()
    const [newUsersIdList, setNewUsersIdList] = useState<User['userId'][]>(null)
    const [status, setStatus] = useState({
        userObjectAvailable: false,
        groupsAndRolesUpdated: false,
        newUsersSaved: false
    })
    const setup = trpc.classroom.initialSetup.useQuery();
    const allGroups = trpc.userConnections.getAllGroups.useQuery((setup.data ? setup.data.userId : ""), {
        enabled: false
    })
    const allUsers = trpc.userConnections.getUserBulk.useQuery(newUsersIdList, {
        enabled: false
    })
    
    useEffect(() => {
        const {userObjectAvailable: stepOne, groupsAndRolesUpdated: stepTwo, newUsersSaved: stepThree} = status

        if(stepOne && !stepTwo && !stepThree){
            allGroups.refetch()
        }
        else if(stepOne && stepTwo && !stepThree){
            allUsers.refetch()
        }
    }, [status])

    useEffect(() => {
        function resolveStepOne(){
            if(user){
                setStatus({
                    userObjectAvailable: true,
                    groupsAndRolesUpdated: false,
                    newUsersSaved: false
                })
            }
        }

        resolveStepOne()
    }, [user])

    useEffect(() => {
        function resolveStepTwo(){
            if(newUsersIdList){
                setStatus({
                    userObjectAvailable: true,
                    groupsAndRolesUpdated: true,
                    newUsersSaved: false
                })
            }
        }

        resolveStepTwo()
    }, [newUsersIdList])

    useEffect(() => {
        async function manageUpdates(){
            if(setup.isSuccess && !allGroups.isSuccess && !allUsers.isSuccess && setup.fetchStatus === 'idle' && allGroups.fetchStatus === 'idle' && allUsers.fetchStatus === 'idle'){
                const {userId, profileImg, firstName, lastName, gender, email} = setup.data
                console.log("------------Updating user object------------");
                try {
                    await database.user.databaseLayer.executeSql("INSERT OR IGNORE INTO User(userId, profileImg, firstName, lastName, gender, email) VALUES(?,?,?,?,?,?)", [userId, profileImg, firstName, lastName, gender, email])
                    console.log("------------User saved------------");
                } catch (error) {
                    console.error({error});
                } finally {
                    setUser(setup.data)
                }
                
            }
            else if(setup.isSuccess && allGroups.isSuccess && !allUsers.isSuccess && setup.fetchStatus === 'idle' && allGroups.fetchStatus === 'idle' && allUsers.fetchStatus === 'idle'){
                console.log("------------Updating groups and roles...------------");
                
                const list = await setupGroupsAndRoles(allGroups.data, database)
                console.log("------------Groups and roles updated------------");
                
                setNewUsersIdList(list)
            }
            else if(setup.isSuccess && allGroups.isSuccess && allUsers.isSuccess  && setup.fetchStatus === 'idle' && allGroups.fetchStatus === 'idle' && allUsers.fetchStatus === 'idle'){
                await saveNewUsers(allUsers.data, database)
                setStatus({
                    userObjectAvailable: true,
                    groupsAndRolesUpdated: true,
                    newUsersSaved: true
                })
            }
        }

        manageUpdates()
    }, [setup.isSuccess, allGroups.isSuccess, allUsers.isSuccess, setup.fetchStatus, allGroups.fetchStatus, allUsers.fetchStatus, setup.data, allGroups.data, allUsers.data, database])

    console.log("status: ", status)
    console.log(setup.status, allGroups.status, allUsers.status);
    console.log(setup.fetchStatus, allGroups.fetchStatus, allUsers.fetchStatus);
    
    return status
}

async function saveNewUsers(newUserList, database: Database){
    await database.user.databaseLayer.bulkInsertOrReplace(newUserList)
    console.log("New users saved");
}

async function setupGroupsAndRoles(data, database: Database){
    const allRegisteredIds: User['userId'][] = (await database.user.databaseLayer.executeSql('SELECT userId FROM User')).rows
    console.log(allRegisteredIds)
    const group_list: Group[] = []
    const subgroup_list: Subgroup[] = []

    const isTeacherAt: isTeacherAt[] = []
    const isStudentAt: isStudentAt[] = []
    const isOwnerOf: isOwnerOf[] = []

    const newUsersId: User['userId'][] = []

    for(const teachesAt of data.teachesAt){
        const {userId, groupId, group} = teachesAt
        const {groupName, groupImage, groupDescription, createdAt, subgroups} = group
        
        for (const subgroup of subgroups){
            const {owners, students, subgroupId, createdAt} = subgroup

            for(const owner of owners){
                const {userId} = owner
                if(!allRegisteredIds.includes(userId)){
                    newUsersId.push(userId)
                }
                isOwnerOf.push({userId, groupId, subgroupId})
            }

            for(const student of students){
                const {userId} = student
                if(!allRegisteredIds.includes(userId)){
                    newUsersId.push(userId)
                }
                isStudentAt.push({userId, groupId, subgroupId})
            }

            subgroup_list.push({subgroupId, groupId, createdAt})
        }

        group_list.push({groupId, groupName, groupImage, groupDescription, createdAt})
        isTeacherAt.push({userId, groupId})
    }
    
    
    for(const studiesAt of data.isStudentAt){
        const {userId, groupId, subgroupId, subgroup} = studiesAt
        const {group, owners, students, createdAt} = subgroup
        const {teachers, createdAt: groupCreatedAt, groupName, groupImage, groupDescription} = group

        for(const teacher of teachers){
            const {userId} = teacher
            if(!allRegisteredIds.includes(userId)){
                newUsersId.push(userId)
            }
            isTeacherAt.push({userId, groupId})
        }

        for(const owner of owners){
            const {userId} = owner
            if(!allRegisteredIds.includes(userId)){
                newUsersId.push(userId)
            }
            isOwnerOf.push({userId, groupId, subgroupId})
        }

        for(const student of students){
            const {userId} = student
            if(!allRegisteredIds.includes(userId)){
                newUsersId.push(userId)
            }
            isStudentAt.push({userId, groupId, subgroupId})
        }
        
        if(subgroupId === 'general'){
            group_list.push({groupId, groupName, groupImage, groupDescription, createdAt: groupCreatedAt})
        }
        subgroup_list.push({subgroupId, groupId, createdAt})
        isStudentAt.push({userId, groupId, subgroupId})
    }
    
    
    for(const ownerOf of data.ownsSubgroups){
        const {userId, groupId, subgroupId, subgroup} = ownerOf
        const {group, owners, students, createdAt} = subgroup
        const {teachers, createdAt: groupCreatedAt, groupName, groupImage, groupDescription} = group

        for(const teacher of teachers){
            const {userId} = teacher
            if(!allRegisteredIds.includes(userId)){
                newUsersId.push(userId)
            }
            isTeacherAt.push({userId, groupId})
        }

        for(const owner of owners){
            const {userId} = owner
            if(!allRegisteredIds.includes(userId)){
                newUsersId.push(userId)
            }
            isOwnerOf.push({userId, groupId, subgroupId})
        }

        for(const student of students){
            const {userId} = student
            if(!allRegisteredIds.includes(userId)){
                newUsersId.push(userId)
            }
            isStudentAt.push({userId, groupId, subgroupId})
        }
        
        if(subgroupId === 'general'){
            group_list.push({groupId, groupName, groupImage, groupDescription, createdAt: groupCreatedAt})
        }
        subgroup_list.push({subgroupId, groupId, createdAt})
        isOwnerOf.push({userId, groupId, subgroupId})
    }

    console.log(group_list)

    for(const group of group_list){
        const {groupId, groupName, groupDescription, groupImage, createdAt} = group
        try {
            await database.group.databaseLayer.executeSql("UPDATE OR IGNORE Group SET groupName=?, groupDescription=?, groupImage=? WHERE groupId=?", [groupName, groupDescription, groupImage, groupId])
            await database.group.databaseLayer.executeSql("INSERT OR IGNORE INTO Group (groupId, groupName, groupDescription, groupImage, createdAt) VALUES(?,?,?,?,?)", [groupId, groupName, groupDescription, groupImage, createdAt.getTime()])
        } catch (error) {
            console.error(error);            
        }
    }

    for(const subgroup of subgroup_list){
        const {groupId, subgroupId, createdAt} = subgroup
        try {
            await database.group.databaseLayer.executeSql("INSERT OR REPLACE INTO Subgroup(groupId, subgroupId, createdAt) VALUES(?,?,?)", [groupId, subgroupId, createdAt])
        } catch (error) {
            console.error(error);
        }
    }

    for(const student of isStudentAt){
        const {groupId, subgroupId, userId} = student
        await database.group.databaseLayer.executeSql("INSERT OR REPLACE INTO isStudentAt(groupId, subgroupId, userId) VALUES(?,?,?)", [groupId, subgroupId, userId])
    }

    for(const teacher of isTeacherAt){
        const {groupId, userId} = teacher
        await database.group.databaseLayer.executeSql("INSERT OR REPLACE INTO isTeacherAt(groupId, userId) VALUES(?,?)", [groupId, userId])
    }

    for(const owner of isOwnerOf){
        const {groupId, subgroupId, userId} = owner
        await database.group.databaseLayer.executeSql("INSERT OR REPLACE INTO isOwnerOf(groupId, subgroupId, userId) VALUES(?,?,?)", [groupId, subgroupId, userId])
       }

    console.log("------------Groups and roles updated------------")
    return newUsersId
    
}