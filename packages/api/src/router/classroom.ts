import { TRPCError } from '@trpc/server';

import { TRPCrouter, protectedProcedure } from '../trpc';

import { clerkClient } from '@clerk/clerk-sdk-node';

import type {
    ExternalAccount,
    User,
    Verification,
} from '@clerk/clerk-sdk-node';
import type { classroom_v1 } from 'googleapis/build/src/apis/classroom/v1.d.ts';
import env from '../env';

interface Course extends classroom_v1.Schema$Course {
    id: string;
}

interface Teacher extends classroom_v1.Schema$Teacher {
    userId: string;
}

interface CourseList {
    courses: Course[];
    nextPageToken: string | null;
}

interface TeacherList {
    teachers: Teacher[];
    nextPageToken: string | null;
}

interface GoogleAccount {
    object: 'google_account';
    id: string;
    google_id: string;
    approved_scopes: string;
    email_address: string;
    given_name: string;
    family_name: string;
    picture: string;
    username: string | null;
    public_metadata: Record<string, unknown> | null;
    label: string | null;
    verification: Verification | null;
}
type UnknownExternalAccount = ExternalAccount | GoogleAccount;

interface ClerkUser extends User {
    external_accounts: UnknownExternalAccount[];
}

const isGoogleAccount = (x: UnknownExternalAccount): x is GoogleAccount =>
    'object' in x;

export const classroomRouter = TRPCrouter({
    initialSetup: protectedProcedure.query(async ({ ctx }) => {
        const clerkId = ctx.auth.userId;

        const clerkUser = (await (
            await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
                },
            })
        ).json()) as ClerkUser;

        //Since our users can only log in with their Google Account,
        //the code only checks their first external account.
        //This behaviour will change when we include more options for log in

        if (!clerkUser.external_accounts[0]) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Clerk returned an object with no external accounts',
            });
        }

        if (!isGoogleAccount(clerkUser.external_accounts[0]))
            throw new TRPCError({
                code: 'NOT_FOUND',
                message:
                    "Clerk returned an object with an account that's not a Google one",
            });

        const google_user = clerkUser.external_accounts[0];

        let user = await ctx.prisma.user.findUnique({
            where: {
                email: google_user.email_address
            }
        })

        if(user){
            user = await ctx.prisma.user.update({
                where: {
                    userId: user.userId
                },
                data: {
                    profileImg: google_user.picture,
                    firstName: google_user.given_name,
                    lastName: google_user.family_name,
                }
            })

        }else{
            user = await ctx.prisma.user.create({
                data: {
                    profileImg: google_user.picture,
                    firstName: google_user.given_name,
                    lastName: google_user.family_name,
                    email: google_user.email_address
                }
            });
    
            await ctx.prisma.event.create({
                data: {
                    action: 1,
                    values: {
                        userId: user.userId
                    }
                }
            })
        }


        const googleId = google_user.google_id;

        const { userId } = user;

        const tokens = await clerkClient.users.getUserOauthAccessToken(
            clerkId,
            'oauth_google',
        );

        if (!tokens[0]) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Clerk responded with 0 Oauth tokens',
            });
        }

        const { token } = tokens[0];

        const courses_request = await fetch(
            'https://classroom.googleapis.com/v1/courses',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const courses_response = (await courses_request.json()) as CourseList;

        const courses = courses_response.courses;

        for (const course of courses) {
            const groupId = course.id;

            const teacherList = (await (
                await fetch(
                    `https://classroom.googleapis.com/v1/courses/${groupId}/teachers`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
            ).json()) as TeacherList;

            const teachers = teacherList.teachers;

            const is_teacher = !!teachers.find((teacher) => {
                return teacher.userId === googleId;
            });

            let is_registered = false

            if(is_teacher){
                is_registered = !!(await ctx.prisma.isTeacherAt.findUnique({
                    where: {
                        userId_groupId: {
                            userId: userId,
                            groupId: groupId
                        }
                    }
                }))
            } else {
                is_registered = !!(await ctx.prisma.isStudentAt.findUnique({
                    where: {
                        userId_groupId_subgroupId: {
                            userId: userId,
                            groupId: groupId,
                            subgroupId: "general"
                        }
                    }
                }))
            }

            const group_exists = !!(await ctx.prisma.group.findUnique({
                where: {
                    groupId: groupId
                }
            }))

            const groupName = (course.name ?? groupId) as string
            const groupDescription = (course.description ?? "") as string

            /**
             * 0: Group doesnt exist, user is teacher and they aren't registered in the group
             * 1: Group doesnt exist, user is teacher and they are already part of the group --CANT EXIST--
             * 2: Group doesn't exist, user is student and they aren't registered in the group
             * 3: Group doesn't exist, user is student and they are already part of the group --CANT EXIST--
             * 4: Group exists, user is teacher and they aren't registered in the group
             * 5: Group exists, user is teacher and they are already part of the group --SAME AS 7--
             * 6: Group exists, user is student and they aren't registered in the group
             * 7: Group exists, user is student and they are already part of the group --SAME AS 5--
             */
            const switch_states = 4*(group_exists ? 1 : 0) + 2*(is_teacher ? 0 : 1) + (is_registered ? 1 : 0)
            const new_group_event = [
                {
                    action: 6,
                    values: {
                        groupId: groupId
                    }
                },
                {
                    action: 3,
                    values: {
                        groupId: groupId,
                        subgroupId: "general"
                    }
                }
            ]
            const new_teacher_event = {
                action: 8,
                values: {
                    userId,
                    groupId
                }
            }
            const new_student_event = {
                action: 9,
                values: {
                    userId,
                    groupId
                }
            }

            switch (switch_states) {
                case 0:
                    await ctx.prisma.group.create({
                        data: {
                            groupId: groupId,
                            groupName: groupName,
                            groupDescription: groupDescription,
                            type: 'classroom',
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
                            }
                        }
                    })
                    await ctx.prisma.event.createMany({
                        data: [...new_group_event, new_teacher_event]
                    })

                    break;
                
                case 2:
                    await ctx.prisma.group.create({
                        data: {
                            groupId,
                            groupName,
                            groupDescription,
                            type: 'classroom',
                            subgroups: {
                                create: {
                                    subgroupId: "general",
                                    students: {
                                        create: {
                                            userId
                                        }
                                    }
                                }
                            }
                        }
                    })
                    await ctx.prisma.event.createMany({
                        data: [...new_group_event, new_student_event]
                    })

                    break;

                case 4: 
                    await ctx.prisma.group.update({
                        where: {
                            groupId
                        },
                        data: {
                            groupName,
                            groupDescription,
                            teachers: {
                                create: {
                                    userId
                                }
                            },
                            subgroups:{
                                update: {
                                    where: {
                                        groupId_subgroupId: {
                                            groupId,
                                            subgroupId: "general"
                                        }
                                    },
                                    data: {
                                        owners: {
                                            create: {
                                                userId
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    await ctx.prisma.event.create({
                        data: new_teacher_event
                    })

                    break;
                
                case 6: 
                    await ctx.prisma.group.update({
                        where: {
                            groupId
                        },
                        data: {
                            groupName,
                            groupDescription,
                            subgroups: {
                                update: {
                                    where: {
                                        groupId_subgroupId: {
                                            groupId,
                                            subgroupId: "general"
                                        }
                                    },
                                    data: {
                                        students: {
                                            create: {
                                                userId
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    await ctx.prisma.event.create({
                        data: new_student_event
                    })

                    break;

                default:
                    await ctx.prisma.group.update({
                        where: {
                            groupId
                        },
                        data: {
                            groupName,
                            groupDescription
                        }
                    })
                    break;
            }
        }

        return user;
    }),
});
