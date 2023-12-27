import { TRPCError } from "@trpc/server";
import type { OauthAccessTokenJSON } from "@clerk/clerk-sdk-node"

import { TRPCrouter, protectedProcedure } from "../trpc";

import type { CourseInfo } from "../types/CourseInfo"

export const classroomRouter = TRPCrouter({
    initialSetup: protectedProcedure.query(async ({ ctx }) => {
        const clerkId = ctx.auth.userId
        
        const google_user = (await 
            (await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY!}`
                }
            }))
            .json())
            .external_accounts[0]
            
            
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

        const token_request = await fetch(`https://api.clerk.com/v1/users/${clerkId}/oauth_access_tokens/oauth_google`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY!}`
            }
        })

        const token_response = await token_request.json()

        if (token_response.errors) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Clerk server responded with error: " + token_response })
        }

        const { token } = token_response[0] as OauthAccessTokenJSON

        const courses_request = await fetch("https://classroom.googleapis.com/v1/courses", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const courses_response = await courses_request.json()

        const courses: CourseInfo["course"][] = courses_response.courses

        const response_data: CourseInfo[] = []

        for(const course of courses) {
            const groupId = course.id! 
            
            const all_teachers: CourseInfo["teachers"] = (
                await (
                    await fetch(`https://classroom.googleapis.com/v1/courses/${groupId}/teachers`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }  
                    }))
                .json())
                .teachers

            response_data.push({course, teachers: all_teachers})

            const is_teacher = all_teachers.find((teacher) => teacher.userId === userId)
            
            if(is_teacher){
                await ctx.prisma.group.upsert({
                    where: {
                        groupId: groupId
                    },
                    create: {
                        groupId: groupId,
                        groupName: course.name!,
                        groupDescription: course.description,
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
                        groupName: course.name!,
                        groupDescription: course.description!,
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
                        groupName: course.name!,
                        groupDescription: course.description,
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
                        groupName: course.name!,
                        groupDescription: course.description!,
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
