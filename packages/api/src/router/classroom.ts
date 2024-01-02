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

interface CourseInfo {
    course: Course;
    teachers: Teacher[];
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

        const user = await ctx.prisma.user.upsert({
            where: {
                email: google_user.email_address,
            },
            create: {
                profileImg: google_user.picture,
                firstName: google_user.given_name,
                lastName: google_user.family_name,
                email: google_user.email_address,
                events: {
                    create: {
                        typeId: 1,
                    },
                },
            },
            update: {
                firstName: google_user.given_name,
                lastName: google_user.family_name,
                lastLoggedIn: new Date(Date.now()),
            },
        });

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

        const response_data: CourseInfo[] = [];

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

            response_data.push({ course, teachers: teachers });

            const is_teacher = !!teachers.find((teacher) => {
                return teacher.userId === googleId;
            });

            if (is_teacher) {
                await ctx.prisma.group.upsert({
                    where: {
                        groupId: groupId,
                    },
                    create: {
                        groupId: groupId,
                        groupName: (course.name ?? groupId) as string,
                        groupDescription: (course.description ?? '') as string,
                        teachers: {
                            create: {
                                userId: userId,
                                events: {
                                    create: {
                                        typeId: 7,
                                    },
                                },
                            },
                        },
                        subgroups: {
                            create: {
                                subgroupId: 'general',
                                owners: {
                                    create: {
                                        userId: userId,
                                    },
                                },
                            },
                        },
                        events: {
                            create: {
                                typeId: 5,
                            },
                        },
                    },
                    update: {
                        groupName: (course.name ?? groupId) as string,
                        groupDescription: (course.description ?? '') as string,
                        teachers: {
                            upsert: {
                                where: {
                                    userId_groupId: {
                                        userId: userId,
                                        groupId: groupId,
                                    },
                                },
                                create: {
                                    userId: userId,
                                    events: {
                                        create: {
                                            typeId: 7,
                                        },
                                    },
                                },
                                update: {},
                            },
                        },
                        subgroups: {
                            update: {
                                where: {
                                    groupId_subgroupId: {
                                        groupId: groupId,
                                        subgroupId: 'general',
                                    },
                                },
                                data: {
                                    owners: {
                                        upsert: {
                                            where: {
                                                userId_groupId_subgroupId: {
                                                    userId: userId,
                                                    groupId: groupId,
                                                    subgroupId: 'general',
                                                },
                                            },
                                            create: {
                                                userId: userId,
                                            },
                                            update: {},
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            } else {
                await ctx.prisma.group.upsert({
                    where: {
                        groupId: groupId,
                    },
                    create: {
                        groupId: groupId,
                        groupName: (course.name ?? groupId) as string,
                        groupDescription: (course.description ?? '') as string,
                        subgroups: {
                            create: {
                                subgroupId: 'general',
                                students: {
                                    create: {
                                        userId: userId,
                                        events: {
                                            create: {
                                                typeId: 8,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        events: {
                            create: {
                                typeId: 5,
                            },
                        },
                    },
                    update: {
                        groupName: (course.name ?? groupId) as string,
                        groupDescription: (course.description ?? '') as string,
                        subgroups: {
                            update: {
                                where: {
                                    groupId_subgroupId: {
                                        groupId: groupId,
                                        subgroupId: 'general',
                                    },
                                },
                                data: {
                                    students: {
                                        upsert: {
                                            where: {
                                                userId_groupId_subgroupId: {
                                                    userId: userId,
                                                    groupId: groupId,
                                                    subgroupId: 'general',
                                                },
                                            },
                                            create: {
                                                userId: userId,
                                                events: {
                                                    create: {
                                                        typeId: 8,
                                                    },
                                                },
                                            },
                                            update: {},
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }

        return user;
    }),
});
