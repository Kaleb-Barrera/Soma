import { TRPCError } from "@trpc/server";

import { TRPCrouter, protectedProcedure } from "../trpc";

import { type CourseInfo, type CourseList, type TeacherList } from "../types/Classroom"
import { isGoogleAccount } from "../types/ClerkUser";
import { isOauthAccessToken } from "../types/ClerkToken";

import {clerkClient} from "@clerk/clerk-sdk-node";

export const classroomRouter = TRPCrouter({
    initialSetup: protectedProcedure.query(async ({ ctx }) => {
        const clerkId = ctx.auth.userId

        const clerkUser = await clerkClient.users.getUser(clerkId)
        
        //Since our users can only log in with their Google Account,
        //the code only checks their first external account.
        //This behaviour will change when we include more options for log in

        if(!isGoogleAccount(clerkUser.externalAccounts[0]))
            throw new TRPCError({code: "NOT_FOUND", message:"Clerk returned an object with an account that's not a Google one"})
            
        const google_user = clerkUser.externalAccounts[0]
            
        const user = (await ctx.prisma.user.upsert({
            where: {
                email: google_user.email_address
            },
            create: {
                profileImg: google_user.picture,
                firstName: google_user.given_name,
                lastName: google_user.family_name,
                email: google_user.email_address          
            },
            update: {
                firstName: google_user.given_name,
                lastName: google_user.family_name,
                lastLoggedIn: new Date(Date.now())
            },
        }))
        
        const { userId } = user

        const tokens = await clerkClient.users.getUserOauthAccessToken(userId, "oauth_google")

        if(!isOauthAccessToken(tokens[0])){
            throw new TRPCError({code: "NOT_FOUND", message: "Clerk responded with 0 Oauth tokens"})
        }

        const { token } = tokens[0]

        const courses_request = await fetch("https://classroom.googleapis.com/v1/courses", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const courses_response = await courses_request.json() as CourseList

        const courses = courses_response.courses

        const response_data: CourseInfo[] = []

        for(const course of courses) {
            const groupId = course.id

            const teacherList = await (
                await fetch(`https://classroom.googleapis.com/v1/courses/${groupId}/teachers`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }  
                }))
            .json() as TeacherList
            
            const teachers = teacherList.teachers

            response_data.push({course, teachers: teachers})

            const is_teacher = !!teachers.find((teacher) => {
                return teacher.userId === userId
            })
            
            if(is_teacher){
                await ctx.prisma.group.upsert({
                    where: {
                        groupId: groupId
                    },
                    create: {
                        groupId: groupId,
                        groupName: (course.name ?? groupId) as string,
                        groupDescription: (course.description ?? "") as string,
                        teachers: {
                            create: {
                                userId: userId
                            }
                        },
                        subgroups: {
                            create: {
                                subgroupId: "general",
                                owners: {
                                    create: {
                                        userId: userId
                                    }
                                }
                            }
                        },
                    },
                    update: {
                        groupName: (course.name ?? groupId) as string,
                        groupDescription: (course.description ?? "") as string,
                        teachers: {
                            upsert: {
                                where: {
                                    userId_groupId: {
                                        userId: userId,
                                        groupId: groupId
                                    }
                                },
                                create: {
                                    userId: userId
                                },
                                update: {}
                            }
                        },
                        subgroups: {
                            update: {
                                where: {
                                    groupId_subgroupId:{
                                        groupId: groupId,
                                        subgroupId: "general"
                                    }
                                },
                                data: {
                                    owners:{
                                        upsert: {
                                            where: {
                                                userId_groupId_subgroupId:{
                                                    userId: userId,
                                                    groupId: groupId,
                                                    subgroupId: "general"
                                                }
                                            },
                                            create: {
                                                userId: userId
                                            },
                                            update: {}
                                        }
                                    }
                                }
                            }
                        }
                    },
                })

            }
            else {
                await ctx.prisma.group.upsert({
                    where: {
                        groupId: groupId
                    },
                    create: {
                        groupId: groupId,
                        groupName: (course.name ?? groupId) as string,
                        groupDescription: (course.description ?? "") as string,
                        subgroups: {
                            create: {
                                subgroupId: "general",
                                students: {
                                    create: {
                                        userId: userId
                                    }
                                }
                            }
                        }
                    },
                    update: {
                        groupName: (course.name ?? groupId) as string,
                        groupDescription: (course.description ?? "") as string,
                        subgroups: {
                            update: {
                                where: {
                                    groupId_subgroupId: {
                                        groupId: groupId,
                                        subgroupId: "general"
                                    }
                                },
                                data: {
                                    students: {
                                        upsert: {
                                            where: {
                                                userId_groupId_subgroupId: {
                                                    userId: userId,
                                                    groupId: groupId,
                                                    subgroupId: "general"
                                                }
                                            },
                                            create: {
                                                userId: userId
                                            },
                                            update: {}
                                        }
                                    }
                                }
                            }
                        }
                    },
                })
            }    
        }
                
        return user
    }),
})
