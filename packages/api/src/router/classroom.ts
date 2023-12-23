import { TRPCError } from "@trpc/server";
import type { OauthAccessTokenJSON } from "@clerk/clerk-sdk-node"

import { TRPCrouter, protectedProcedure } from "../trpc";

import type { CourseInfo } from "../types/CourseInfo"

export const classroomRouter = TRPCrouter({
    userLoggedInGroupCheck: protectedProcedure.query(async ({ ctx }) => {
        const clerkId = ctx.auth.userId

        const user = (await 
            (await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY!}`
                }
        }))
        .json())
        .external_accounts[0]!        
        
        const userId = user.google_id!

        await ctx.prisma.user.upsert({
            create: {
                userId: userId,
                profileImg: user.picture,
                firstName: user.given_name,
                lastName: user.family_name,
                email: user.email_address          
            },
            update: {
                profileImg: user.picture,
                firstName: user.given_name,
                lastName: user.family_name,
                email: user.email_address
            },
            where: {
                userId: userId
            }
        })

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
                try {
                    await ctx.prisma.group.upsert({
                        create: {
                            groupId: groupId,
                            groupName: course.name!,
                            groupDescription: course.description,
                            subgroups: {
                                create: {
                                    subgroupId: "general",
                                }
                            },
                        },
                        update: {
                            groupName: course.name!,
                            groupDescription: course.description!,
                        },
                        where: {
                            groupId: groupId
                        }
                    })
                } catch (error) {
                    console.error(`Failed at is_teacher group upsert: ${error}`);
                    
                }
            }
            else {
                try {
                    await ctx.prisma.group.upsert({
                        create: {
                            groupId: groupId,
                            groupName: course.name!,
                            groupDescription: course.description,
                            subgroups: {
                                create: {
                                    subgroupId: "general",
                                    students: {
                                        create: {
                                            user: {
                                                connect: {
                                                    userId: userId
                                                }
                                            }
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
                                                    user: {
                                                        connect:{
                                                            userId: userId
                                                        }
                                                    }
                                                },
                                                update: {}
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        where: {
                            groupId: groupId
                        }
                    })
                } catch (error) {
                    console.error(`Failed at is_student group upsert: ${error}`);
                }   
            }

            all_teachers.forEach(async (teacher) => {
                try {
                    await ctx.prisma.group.update({
                        where: {
                            groupId: groupId
                        },
                        data: {
                            teachers: {
                                upsert: {
                                    where: {
                                        userId_groupId: {
                                            userId: teacher.userId!,
                                            groupId: groupId
                                        }
                                    },
                                    create: {
                                        user: {
                                            connectOrCreate: {
                                                where: {
                                                    userId: teacher.userId!
                                                },
                                                create: {
                                                    userId: teacher.userId!,
                                                    firstName: teacher.profile?.name?.givenName!,
                                                    lastName: teacher.profile?.name?.familyName!,
                                                    lastLoggedIn: null
                                                }
                                            }
                                        }
                                    },
                                    update: {}
                                }
                            },
                            subgroups: {
                                update: {
                                    where: {
                                        groupId_subgroupId: {
                                            groupId: groupId,
                                            subgroupId: "general"
                                        }
                                    },
                                    data: {
                                        owners: {
                                            upsert: {
                                                where: {
                                                    userId_groupId_subgroupId: {
                                                        userId: teacher.userId!,
                                                        groupId: groupId,
                                                        subgroupId: "general"
                                                    }
                                                },
                                                create: {
                                                    user: {
                                                        connectOrCreate: {
                                                            where: {
                                                                userId: teacher.userId!
                                                            },
                                                            create: {
                                                                userId: teacher.userId!,
                                                                firstName: teacher.profile?.name?.givenName!,
                                                                lastName: teacher.profile?.name?.familyName,
                                                                lastLoggedIn: null
                                                            }
                                                        }
                                                    }
                                                },
                                                update: {}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                } catch (error) {
                    console.error(`Failed at all teachers group update: ${error}`);
                }
            })            
            
        }
        return response_data
    }),
})
